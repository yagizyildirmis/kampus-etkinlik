# Kampüs Etkinlikleri API (backend)

Node.js + Express ile yazılmış REST API. Etkinlikleri JSON olarak verir. Veri şimdilik bellekte tutulur; sunucu yeniden başlayınca POST ile eklenenler kaybolur (Sprint 8'de MongoDB gelecek).

Öğrenci: Yağız Yıldırmış · 2416501007

## Çalıştırma

```bash
cd backend
npm install
cp .env.example .env   # Windows: copy .env.example .env
npm run dev            # node --watch: dosya değişince yeniden başlar
```

Sunucu `http://localhost:3000` adresinde açılır. Kontrol: `http://localhost:3000/health`

| Komut | Ne yapar |
|---|---|
| `npm run dev` | Geliştirme: `node --watch src/server.js` |
| `npm start` | `node src/server.js` |

## Ortam değişkenleri

| Değişken | Örnek | Açıklama |
|---|---|---|
| `PORT` | `3000` | Sunucunun dinlediği port. `.env` dosyasından okunur, `.env` GitHub'a gitmez; `.env.example` gider. |

## Klasör yapısı

```
backend/
  src/
    app.js                         Express uygulaması, middleware, route'ları bağlar
    server.js                      .env'i okur, portu dinler
    routes/event-routes.js         Hangi adres hangi fonksiyona gider
    controllers/event-controller.js  İsteği işler, yanıtı döndürür
    data/events.js                 Bellek içi etkinlik dizisi
  requests/kampus-api.json         Postman koleksiyonu (6 istek)
  .env.example
  package.json
```

## REST sözleşmesi

| Method | Endpoint | Amaç | Başarılı | Hata | Durum |
|---|---|---|---|---|---|
| GET | `/health` | Sunucu ayakta mı | 200 | — | Bu sprint |
| GET | `/events` | Listeyi getir (`?category=Atölye` isteğe bağlı) | 200 | — | Bu sprint |
| GET | `/events/:id` | Tek etkinlik | 200 | 404 | Bu sprint |
| POST | `/events` | Yeni etkinlik | 201 | 400 | Bu sprint |
| PATCH | `/events/:id` | Güncelle | 200 | 400, 404 | Sprint 9 |
| DELETE | `/events/:id` | Sil | 204 | 404 | Sprint 9 |

**Status code'lar:** 200 tamam · 201 oluşturuldu · 204 içerik yok · 400 eksik/yanlış veri · 404 bulunamadı

**Bütün hatalar aynı biçimde:**

```json
{ "error": { "message": "Event not found" } }
```

**POST /events** için `title`, `category` ve `date` zorunludur. Örnek gövde:

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

`requests/kampus-api.json` dosyasını Postman'de **Import** ile açın. Koleksiyondaki 6 istek ve beklenen sonuçları:

| # | İstek | Beklenen |
|---|---|---|
| 1 | GET /health | 200 · `status: "ok"`, `student: "2416501007"` |
| 2 | GET /events | 200 · 6 kayıt |
| 3 | GET /events/event-2 | 200 · event-2 |
| 4 | GET /events/yok | 404 · error |
| 5 | POST /events (tam body) | 201 · yeni id |
| 6 | POST /events (sadece title) | 400 · error |
