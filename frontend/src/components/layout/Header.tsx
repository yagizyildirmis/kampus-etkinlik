import { useEffect } from "react";
import { matchPath, useLocation } from "react-router-dom";
import { useEvents } from "../../context/EventsContext";
import { findEventById } from "../../utils/filter-events";

const SITE_ADI = "Kampüs Etkinlikleri";

// Sabit adresler -> başlık
const basliklar: Record<string, string> = {
  "/": SITE_ADI,
  "/events": "Tüm Etkinlikler",
  "/login": "Giriş Yap",
  "/register": "Kayıt Ol",
  "/forgot-password": "Şifremi Unuttum",
  "/admin": "Etkinlik Yönetimi",
  "/admin/new": "Etkinlik Ekle",
};

// Açık sayfanın başlığını adresten bulur
function useSayfaBasligi(): string {
  const { pathname } = useLocation();
  const { events } = useEvents();

  if (basliklar[pathname]) return basliklar[pathname];

  const duzenle = matchPath("/admin/:id/edit", pathname);
  if (duzenle) {
    return findEventById(events, duzenle.params.id ?? "") ? "Etkinlik Güncelle" : "Sayfa bulunamadı";
  }

  const detay = matchPath("/events/:id", pathname);
  if (detay) {
    return findEventById(events, detay.params.id ?? "")?.title ?? "Sayfa bulunamadı";
  }

  return "Sayfa bulunamadı";
}

function Header() {
  const title = useSayfaBasligi();

  // Tarayıcı sekmesinin adı da yapılan işlemi göstersin
  useEffect(() => {
    document.title = title === SITE_ADI ? SITE_ADI : `${title} | ${SITE_ADI}`;
  }, [title]);

  return (
    <header className="site-baslik">
      <h1>{title}</h1>
      <p>Fakültedeki seminer, atölye ve söyleşileri tek yerden takip edin.</p>
    </header>
  );
}

export default Header;
