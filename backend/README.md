# Kampüs Etkinlikleri API (backend)

Node.js + Express + Mongoose ile yazılmış REST API. Etkinlikler MongoDB'de (Atlas veya yerel) tutulur; POST ile eklenenler sunucu yeniden başlayınca kaybolmaz (Sprint 8). Sprint 9 ile tam CRUD (PATCH, DELETE), arama ve yaklaşan etkinlikler eklendi.

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
    utils/date.js                    "GG-AA-YYYY" ↔ Date dönüşümü, bugünün başı
    data/seed-events.js              Seed için 6 başlangıç etkinliği (2'si geçmiş tarihli)
    seed.js                          npm run seed
    routes/event-routes.js           Hangi adres hangi fonksiyona gider
    controllers/event-controller.js  Event.find / findById / create / findByIdAndUpdate / findByIdAndDelete
  requests/kampus-api.json           Postman koleksiyonu (18 istek)
  requests/run-results.json          Hocanın Sprint 9 koleksiyonunun çalıştırma sonucu
  .env.example
  package.json
```

## Event schema'sı

| Alan | Tür | Kural |
|---|---|---|
| `title` | String | zorunlu, trim, 3–100 karakter |
| `category` | String | zorunlu, `Seminer` · `Atölye` · `Söyleşi` · `Yarışma` |
| `capacity` | Number | en az 0, varsayılan 0 |
| `date` | Date | zorunlu; API'de `"GG-AA-YYYY"` (`"15-10-2026"`), veritabanında gerçek Date. Biçim yanlışsa ya da gün takvimde yoksa (`31-02-2026`) → 400 |
| `time` | String | varsayılan `""` |
| `location` | String | trim, varsayılan `""` |
| `description` | String | trim, en fazla 500 karakter, varsayılan `""` |

`timestamps: true` sayesinde her kayda `createdAt` ve `updatedAt` eklenir. Kimlik olarak MongoDB'nin `_id` alanı kullanılır.

Tarih neden metin değil? `"05-11-2026"` metin olarak `"15-10-2026"`dan küçüktür; Kasım Ekim'den önce sıralanırdı. Date olarak tutulunca sıralama ve `$gte` takvime göre çalışır; `toJSON: { getters: true }` sayesinde yanıtta yine `"15-10-2026"` görünür.

## REST sözleşmesi

| Method | Endpoint | Amaç | Başarılı | Hata | Durum |
|---|---|---|---|---|---|
| GET | `/health` | Sunucu ayakta mı | 200 | — | çalışıyor |
| GET | `/events` | Listeyi getir, tarihe göre sıralı. `?search=atölye` başlıkta arar (büyük/küçük harf fark etmez), `?category=Atölye` filtreler; ikisi birlikte de olur | 200 | — | çalışıyor |
| GET | `/events/upcoming` | Bugün ve sonrası, en yakın tarih önce | 200 | — | çalışıyor |
| GET | `/events/:id` | Tek etkinlik (`_id` ile) | 200 | 404 | çalışıyor |
| POST | `/events` | Yeni etkinlik | 201 | 400 | çalışıyor |
| PATCH | `/events/:id` | Sadece gönderilen alanları güncelle, güncel kaydı döndür | 200 | 400, 404 | çalışıyor |
| DELETE | `/events/:id` | Sil, gövde yok | 204 | 404 | çalışıyor |

**Status code'lar:** 200 tamam · 201 oluşturuldu · 204 içerik yok · 400 eksik/yanlış veri · 404 bulunamadı · 500 beklenmeyen sunucu hatası

- Biçimi geçersiz id (`/events/yok`, `/events/111111`) `isValidObjectId` ile yakalanır → **404** (500 değil).
- Schema kuralına uymayan POST/PATCH (`ValidationError`) ya da yanlış tür/tarih (`CastError`) → **400**. PATCH'te `runValidators: true` olduğu için kurallar güncellemede de çalışır.
- PATCH'te boş gövde → **400** `Body is empty`; `_id`, `createdAt`, `updatedAt`, `__v` değiştirilemez → **400**.
- `/upcoming` route'u `/:id`den önce tanımlıdır; yoksa "upcoming" bir id sanılıp 404 dönerdi.
- `?search=` içindeki `( * ?` gibi işaretler regex'e konmadan önce kaçırılır; arama 500 vermez.
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
  "date": "03-12-2026",
  "time": "14:00",
  "location": "Bilgisayar Laboratuvarı 2",
  "description": "Commit, branch ve pull request ile ilk adımlar."
}
```

## Postman ile test

`requests/kampus-api.json` dosyasını Postman'de **Import** ile açın, sonra `npm run seed` ve `npm run dev`. Koleksiyona sağ tık → **Run collection** → **Run** ile 18 istek sırayla çalışır. id'leri elle girmeye gerek yok: 2. istek listedeki ilk `_id`'yi `eventId`'ye, 5. istek yeni kaydın `_id`'sini `newId`'ye kaydeder. PATCH ve DELETE bu yeni kayıtla çalıştığı için seed verisi bozulmaz; koleksiyon istendiği kadar tekrar çalıştırılabilir.

| # | İstek | Beklenen |
|---|---|---|
| 1 | GET /health | 200 · `student: "2416501007"` |
| 2 | GET /events | 200 · tarihler `GG-AA-YYYY` |
| 3 | GET /events/{{eventId}} | 200 |
| 4 | GET /events/yok | 404 |
| 5 | POST /events (tam body) | 201 · `date: "03-12-2026"` |
| 6 | POST /events (sadece title) | 400 |
| 7 | POST /events (`date: "2026-12-03"`) | 400 · yanlış tarih biçimi |
| 8 | PATCH `{ "capacity": 45 }` | 200 · sadece capacity değişti |
| 9 | PATCH `{ "date": "05-12-2026" }` | 200 |
| 10 | PATCH `{}` | 400 · Body is empty |
| 11 | PATCH `{ "category": "Parti" }` | 400 |
| 12 | PATCH `{ "_id": "abc" }` | 400 · _id cannot be changed |
| 13 | PATCH /events/yok | 404 |
| 14 | GET /events?search=atölye | 200 · başlığında "atölye" geçenler |
| 15 | GET /events?search=atölye&category=Atölye | 200 · hepsi Atölye |
| 16 | GET /events/upcoming | 200 · geçmiş tarihli yok, en yakın önce |
| 17 | DELETE /events/{{newId}} | 204 · gövde yok |
| 18 | DELETE /events/{{newId}} (tekrar) | 404 |

Hocanın test koleksiyonu (18 istek, 45 test) backend açıkken terminalden de çalıştırılabilir:

```bash
npm i -g newman
newman run https://webdersi.vercel.app/test.json
```

Son çalıştırmanın sonucu `requests/run-results.json` dosyasındadır.

## Kalıcılık testi

1. `npm run seed`, sonra `npm run dev`
2. POST /events → 201
3. Terminalde Ctrl+C ile sunucuyu durdur, tekrar `npm run dev`
4. GET /events → 7 kayıt, yeni eklenen hâlâ listede
5. DELETE /events/<o kaydın _id'si> → 204; tekrar GET /events → yine 6 kayıt
