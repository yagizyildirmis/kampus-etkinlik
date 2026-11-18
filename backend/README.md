# Kampüs Etkinlikleri API (backend)

Node.js + Express + Mongoose ile yazılmış REST API. Etkinlikler MongoDB'de (Atlas veya yerel) tutulur; POST ile eklenenler sunucu yeniden başlayınca kaybolmaz (Sprint 8).

Öğrenci: Yağız Yıldırmış · 2416501007

## Çalıştırma

```bash
cd backend
npm install
cp .env.example .env   # Windows: copy .env.example .env  → MONGODB_URI'yi kendi adresinle doldur
npm run seed           # koleksiyonu boşaltıp 6 başlangıç etkinliğini yazar
npm run dev            # node --watch: dosya değişince yeniden başlar
```

Sunucu açılırken konsolda `MongoDB bağlandı (Atlas): ...mongodb.net/kampus` ya da `MongoDB bağlandı (yerel): 127.0.0.1/kampus` görünür. Bağlantı adresinin kendisi (şifre içerdiği için) hiçbir zaman yazdırılmaz.

Sunucu `http://localhost:3000` adresinde açılır. Kontrol: `http://localhost:3000/health`

| Komut | Ne yapar |
|---|---|
| `npm run dev` | Geliştirme: `node --watch src/server.js` |
| `npm start` | `node src/server.js` |
| `npm run seed` | `deleteMany` + `insertMany`: her çalıştırmada sonuç yine 6 kayıt |

## Ortam değişkenleri

| Değişken | Örnek | Açıklama |
|---|---|---|
| `PORT` | `3000` | Sunucunun dinlediği port |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/kampus` | Veritabanı adresi. Sonundaki `/kampus` veritabanı adıdır. |

`.env` GitHub'a gitmez; repoda sadece yer tutucu değerli `.env.example` bulunur. Gerçek Atlas adresi ve şifresi koda, README'ye veya Postman koleksiyonuna yazılmaz.

## Klasör yapısı

```
backend/
  src/
    app.js                           Express uygulaması, middleware, route'lar, hata yakalayıcı
    server.js                        .env'i okur, önce veritabanına bağlanır, sonra portu dinler
    config/database.js               mongoose.connect(process.env.MONGODB_URI)
    models/event-model.js            Event schema'sı ve modeli (koleksiyon: events)
    data/seed-events.js              Seed için 6 başlangıç etkinliği (id alanı yok)
    seed.js                          npm run seed
    routes/event-routes.js           Hangi adres hangi fonksiyona gider
    controllers/event-controller.js  Event.find / findById / create
  requests/kampus-api.json           Postman koleksiyonu (6 istek)
  .env.example
  package.json
```

## Event schema'sı

| Alan | Tür | Kural |
|---|---|---|
| `title` | String | zorunlu, trim, 3–100 karakter |
| `category` | String | zorunlu, `Seminer` · `Atölye` · `Söyleşi` · `Yarışma` |
| `capacity` | Number | en az 0, varsayılan 0 |
| `date` | String | zorunlu (`2026-12-03` biçiminde) |
| `time` | String | varsayılan `""` |
| `location` | String | trim, varsayılan `""` |
| `description` | String | trim, en fazla 500 karakter, varsayılan `""` |

`timestamps: true` sayesinde her kayda `createdAt` ve `updatedAt` eklenir. Kimlik olarak MongoDB'nin `_id` alanı kullanılır.

## REST sözleşmesi

| Method | Endpoint | Amaç | Başarılı | Hata | Durum |
|---|---|---|---|---|---|
| GET | `/health` | Sunucu ayakta mı | 200 | — | Sprint 7 |
| GET | `/events` | Listeyi getir, tarihe göre sıralı (`?category=Atölye` isteğe bağlı) | 200 | — | Sprint 8 |
| GET | `/events/:id` | Tek etkinlik (`_id` ile) | 200 | 404 | Sprint 8 |
| POST | `/events` | Yeni etkinlik | 201 | 400 | Sprint 8 |
| PATCH | `/events/:id` | Güncelle | 200 | 400, 404 | Sprint 9 |
| DELETE | `/events/:id` | Sil | 204 | 404 | Sprint 9 |

**Status code'lar:** 200 tamam · 201 oluşturuldu · 204 içerik yok · 400 eksik/yanlış veri · 404 bulunamadı · 500 beklenmeyen sunucu hatası

- Biçimi geçersiz id (`/events/yok`, `/events/111111`) `isValidObjectId` ile yakalanır → **404** (500 değil).
- Schema kuralına uymayan POST (`ValidationError`) → **400**.
- Beklenmeyen hatalar `app.js`'teki hata middleware'ine gider → **500** `Server error`; sunucu çökmez.

**Bütün hatalar aynı biçimde:**

```json
{ "error": { "message": "Event not found" } }
```

**POST /events** örnek gövde:

```json
{
  "title": "Git ve GitHub Atölyesi",
  "category": "Atölye",
  "capacity": 30,
  "date": "2026-12-03",
  "time": "14:00",
  "location": "Bilgisayar Laboratuvarı 2",
  "description": "Commit, branch ve pull request ile ilk adımlar."
}
```

## Postman ile test

`requests/kampus-api.json` dosyasını Postman'de **Import** ile açın. İstekleri sırayla çalıştırın: 2. istek listedeki ilk etkinliğin `_id`'sini `eventId` değişkenine kaydeder, 3. istek onu kullanır.

| # | İstek | Beklenen |
|---|---|---|
| 1 | GET /health | 200 · `status: "ok"`, `student: "2416501007"` |
| 2 | GET /events | 200 · 6 kayıt (seed sonrası), her kayıtta `_id`, `createdAt`, `updatedAt` |
| 3 | GET /events/{{eventId}} | 200 · tek etkinlik |
| 4 | GET /events/yok | 404 · error |
| 5 | POST /events (tam body) | 201 · yeni `_id` ve `createdAt` |
| 6 | POST /events (sadece title) | 400 · `category` ve `date` zorunlu |

## Kalıcılık testi

1. `npm run seed`, sonra `npm run dev`
2. POST /events → 201
3. Terminalde Ctrl+C ile sunucuyu durdur, tekrar `npm run dev`
4. GET /events → 7 kayıt, yeni eklenen hâlâ listede
