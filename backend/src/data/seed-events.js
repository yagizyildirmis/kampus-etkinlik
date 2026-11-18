// Başlangıç verisi: "npm run seed" bunu MongoDB'ye yazar.
// id alanı yok: her kayda MongoDB kendi _id'sini verir.
export const seedEvents = [
  {
    title: "Yazılım Kariyer Zirvesi 2026",
    category: "Seminer",
    capacity: 150,
    date: "2026-10-14",
    time: "13:30",
    location: "Mühendislik Fakültesi Konferans Salonu",
    description:
      "Sektörde çalışan mezunlarımız yazılım kariyerinde ilk adımları, staj ve iş başvurusu sürecini anlatıyor.",
  },
  {
    title: "Arduino ile Akıllı Ev Atölyesi",
    category: "Atölye",
    capacity: 24,
    date: "2026-10-22",
    time: "10:00",
    location: "Elektronik Laboratuvarı 3",
    description:
      "Sensörler ve röle modülüyle ışığı ve sıcaklığı kontrol eden küçük bir akıllı ev maketi kuruyoruz.",
  },
  {
    title: "Siber Güvenlikte Kariyer Söyleşisi",
    category: "Söyleşi",
    capacity: 60,
    date: "2026-10-29",
    time: "15:00",
    location: "B Blok Amfi 2",
    description:
      "Bir sızma testi uzmanıyla güvenlik alanında nasıl çalışılır, hangi sertifikalar işe yarar konuşuyoruz.",
  },
  {
    title: "Figma ile Arayüz Tasarımı Atölyesi",
    category: "Atölye",
    capacity: 30,
    date: "2026-11-05",
    time: "14:00",
    location: "Bilgisayar Laboratuvarı 4",
    description:
      "Bir mobil uygulamanın giriş ve liste ekranlarını Figma'da sıfırdan tasarlayıp prototipe dönüştürüyoruz.",
  },
  {
    title: "Kampüs Hackathon 2026",
    category: "Yarışma",
    capacity: 90,
    date: "2026-11-19",
    time: "09:00",
    location: "Merkez Kütüphane Etkinlik Alanı",
    description:
      "Üç kişilik takımlar 24 saat içinde kampüs yaşamını kolaylaştıran bir uygulama geliştiriyor.",
  },
  {
    title: "Bulut Bilişime Giriş Semineri",
    category: "Seminer",
    capacity: 120,
    date: "2026-11-26",
    time: "11:00",
    location: "A Blok Seminer Salonu",
    description:
      "Sunucu, depolama ve ölçeklenme kavramlarını örnek bir web uygulamasının yayına alınmasıyla anlatıyoruz.",
  },
];
