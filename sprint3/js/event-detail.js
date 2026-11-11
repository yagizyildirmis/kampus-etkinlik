import { events } from "./data.js";

function toIso(date) {
  const [gun, ay, yil] = date.split("-");
  return `${yil}-${ay}-${gun}`;
}

function formatDate(date) {
  return new Date(`${toIso(date)}T00:00:00`).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const container = document.querySelector("#detay");
const baslik = document.querySelector("#sayfa-baslik");

const id = new URLSearchParams(location.search).get("id");
const event = events.find((e) => e.id === id);

if (!event) {
  // Önce kontrol: bulunamazsa event.title okunmaz, konsol hatası çıkmaz
  baslik.textContent = "Etkinlik bulunamadı";
  document.title = "Etkinlik bulunamadı · Kampüs Etkinlikleri";
  const metin = id
    ? `"${id}" numaralı bir etkinlik yok. Listeden bir etkinlik seçin.`
    : "Adreste etkinlik numarası yok. Listeden bir etkinlik seçin.";
  container.innerHTML = `
    <p class="hata-kutusu" role="alert">${metin}</p>
    <p><a class="buton" href="etkinlikler.html">← Listeye dön</a></p>`;
} else {
  baslik.textContent = event.title;
  document.title = `${event.title} · Kampüs Etkinlikleri`;
  container.innerHTML = `
    <article class="detay">
      <figure>
        <img src="img/afis.svg" alt="${event.title} afişi">
        <figcaption>${event.title} afişi</figcaption>
      </figure>
      <div>
        <h2>Etkinlik Künyesi</h2>
        <dl class="kunye">
          <dt>Tarih</dt>
          <dd><time datetime="${toIso(event.date)}T${event.time}">${formatDate(event.date)}, ${event.time}</time></dd>
          <dt>Yer</dt>
          <dd>${event.location}</dd>
          <dt>Kategori</dt>
          <dd>${event.category}</dd>
          <dt>Kontenjan</dt>
          <dd>${event.capacity} kişi</dd>
        </dl>
        <h2>Açıklama</h2>
        <p>${event.description}</p>
        <div class="butonlar">
          <a class="buton" href="etkinlikler.html">← Listeye dön</a>
          <a class="buton" href="etkinlik-guncelle.html?id=${event.id}">Bu etkinliği güncelle</a>
        </div>
      </div>
    </article>`;
}
