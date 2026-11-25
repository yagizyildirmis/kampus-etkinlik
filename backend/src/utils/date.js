// API'de tarih "GG-AA-YYYY" ("15-10-2026") biçiminde gelir ve gider,
// veritabanında ise gerçek Date olarak tutulur. Böylece sıralama ve
// $gte gibi karşılaştırmalar takvime göre doğru çalışır.

// "15-10-2026" → Date (UTC gece yarısı)
export function parseDate(value) {
  if (typeof value !== "string") return value;
  const m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value);
  if (!m) return new Date(NaN); // biçim yanlış → Mongoose CastError → 400
  const [, gun, ay, yil] = m.map(Number);
  const tarih = new Date(Date.UTC(yil, ay - 1, gun));
  // 31-02-2026 gibi takvimde olmayan günler Date'te kayar; bunu yakala
  if (tarih.getUTCDate() !== gun || tarih.getUTCMonth() !== ay - 1) {
    return new Date(NaN);
  }
  return tarih;
}

// Date → "15-10-2026"
export function formatDate(tarih) {
  if (!(tarih instanceof Date)) return tarih;
  const gun = String(tarih.getUTCDate()).padStart(2, "0");
  const ay = String(tarih.getUTCMonth() + 1).padStart(2, "0");
  return `${gun}-${ay}-${tarih.getUTCFullYear()}`;
}

// Bugünün başı (UTC 00:00); /events/upcoming için
export function todayStart() {
  const s = new Date();
  return new Date(Date.UTC(s.getUTCFullYear(), s.getUTCMonth(), s.getUTCDate()));
}
