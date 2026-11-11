Canlı adres: https://yagizyildirmis-frontend.vercel.app

# Kampüs Etkinlikleri

Fakültedeki seminer, atölye, söyleşi ve yarışmaları tek yerden takip etmeye yarayan web uygulaması.

**Öğrenci:** Yağız Yıldırmış · 2416501007
**Renk / font:** 2416501007 mod 360 = **287** (ton) · son hane 7 → **"Palatino Linotype"**

## Klasörler

| Klasör | Sprint | İçerik |
|---|---|---|
| `sprint1/` | Sprint 1 | Sadece HTML: 5 sayfa, semantic etiketler, formlar |
| `sprint2/` | Sprint 2 | Aynı sayfalar + `css/2416501007.css`, responsive kartlar |
| `sprint3/` | Sprint 3 | JavaScript modülleri: `data.js`, arama + kategori, `?id=` ile detay, form doğrulama |
| `frontend/` | Sprint 4–6 + Vize | Vite + React + TypeScript, bileşenler, React Router, Context, yönetim paneli |
| `backend/` | Sprint 7 | Node + Express REST API (`/health`, `/events`) |

## Frontend (React) kurulum

```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
npm run build    # hatasız bitmeli
```

### Route listesi

| Adres | Sayfa |
|---|---|
| `/` | HomePage: yaklaşan 2 etkinlik |
| `/events` | EventsPage: arama + kategori filtresi |
| `/events/:id` | EventDetailPage |
| `/login` | LoginPage |
| `/register` | RegisterPage |
| `/forgot-password` | ForgotPasswordPage |
| `/admin` | AdminPage: tablo, Düzenle, Sil |
| `/admin/new` | AddEventPage |
| `/admin/:id/edit` | EditEventPage |
| `*` | NotFoundPage |

### Vite'ın oluşturduğu dosyalar

| Dosya | Görevi |
|---|---|
| `package.json` | Proje adı, komutlar (dev, build), paket listesi |
| `package-lock.json` | Yüklenen paketlerin tam sürümleri (`npm install` oluşturur) |
| `node_modules/` | İndirilen paketler; GitHub'a gitmez |
| `tsconfig*.json` | TypeScript ayarları |
| `vite.config.ts` | Vite ayarları, React eklentisi |
| `index.html` | Tek HTML; içinde boş `div#root` |
| `src/main.tsx` | React'i başlatır, App'i root'a çizer (BrowserRouter + EventsProvider) |
| `src/App.tsx` | Header, Navigation, Routes ve Footer |
| `src/App.css` | Sprint 3 CSS'i + tablo/menü eklemeleri |
| `src/index.css` | Bilerek boş |
| `public/` | Olduğu gibi kopyalanan dosyalar (`afis.svg`) |
| `vercel.json` | Vercel'de `/events/event-2` gibi adresler doğrudan açılınca 404 olmasın diye |

## Backend kurulum

```bash
cd backend
npm install
copy .env.example .env
npm run dev      # http://localhost:3000/health
```

REST sözleşmesi ve Postman koleksiyonu: [backend/README.md](backend/README.md)
