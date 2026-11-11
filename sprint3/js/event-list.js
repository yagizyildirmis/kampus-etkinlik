import { events } from "./data.js";

// "14-10-2026" -> "2026-10-14" (sıralama ve Date için)
function toIso(date) {
  const [gun, ay, yil] = date.split("-");
  return `${yil}-${ay}-${gun}`;
}

// "14-10-2026" -> "14 Ekim 2026"
function formatDate(date) {
  return new Date(`${toIso(date)}T00:00:00`).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function createCard(event) {
  return `<article class="kart">
    <h2>${event.title}</h2>
    <p><span class="etiket">${event.category}</span></p>
    <p>Tarih: <time datetime="${toIso(event.date)}T${event.time}">${formatDate(event.date)}, ${event.time}</time></p>
    <p>Yer: ${event.location}</p>
    <p>Kontenjan: ${event.capacity} kişi</p>
    <p>${event.description}</p>
    <p><a href="etkinlik-detay.html?id=${event.id}">Detayları gör</a></p>
  </article>`;
}

const list = document.querySelector("#etkinlik-listesi");

function render(dizi) {
  list.innerHTML = dizi.map(createCard).join("");
}

if (list.dataset.limit) {
  // Ana sayfa: tarihi en yakın N etkinlik
  const yaklasan = [...events]
    .sort((a, b) => toIso(a.date).localeCompare(toIso(b.date)))
    .slice(0, Number(list.dataset.limit));
  render(yaklasan);
} else {
  render(events);
}

// ---------- Etkinlikler sayfası: arama + kategori ----------
const filtreFormu = document.querySelector("#filtre-formu");

if (filtreFormu) {
  const arama = document.querySelector("#arama");
  const kategoriSecimi = document.querySelector("#kategori-filtre");
  const sonucSatiri = document.querySelector("#sonuc");

  // Kategori seçenekleri veriden, her biri bir kez
  const kategoriler = [...new Set(events.map((e) => e.category))];
  kategoriSecimi.innerHTML += kategoriler
    .map((k) => `<option value="${k}">${k}</option>`)
    .join("");

  function filtrele() {
    const aranan = arama.value.trim().toLocaleLowerCase("tr-TR");
    const kategori = kategoriSecimi.value;

    const sonuc = events.filter((e) => {
      const metinUyuyor =
        e.title.toLocaleLowerCase("tr-TR").includes(aranan) ||
        e.description.toLocaleLowerCase("tr-TR").includes(aranan);
      const kategoriUyuyor = kategori === "" || e.category === kategori;
      return metinUyuyor && kategoriUyuyor;
    });

    render(sonuc);
    sonucSatiri.textContent =
      sonuc.length === 0
        ? "Aramanıza uygun etkinlik bulunamadı."
        : `${sonuc.length} etkinlik listeleniyor.`;
  }

  arama.addEventListener("input", filtrele);
  kategoriSecimi.addEventListener("change", filtrele);
  filtreFormu.addEventListener("submit", (e) => e.preventDefault());
  filtrele();
}
