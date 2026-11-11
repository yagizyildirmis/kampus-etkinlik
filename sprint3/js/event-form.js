import { events } from "./data.js";

const form = document.querySelector("#etkinlik-formu");
const mesaj = document.querySelector("#form-mesaj");
const guncelleModu = form.dataset.mode === "guncelle";

// Form alanı adı (Türkçe) -> hata span'ı
const alanlar = ["ad", "kategori", "tarih", "saat", "yer", "kontenjan", "aciklama"];

// "14-10-2026" -> "2026-10-14" (input type="date" bu biçimi ister)
function toIso(date) {
  const [gun, ay, yil] = date.split("-");
  return `${yil}-${ay}-${gun}`;
}

let duzenlenen = null;

if (guncelleModu) {
  const id = new URLSearchParams(location.search).get("id");
  duzenlenen = events.find((e) => e.id === id);

  if (!duzenlenen) {
    // id'siz ya da yanlış id: boş form yerine uyarı
    form.outerHTML = `
      <p class="hata-kutusu" role="alert">Güncellenecek etkinlik seçilmedi. Önce listeden bir etkinlik seçin, detay sayfasındaki "Bu etkinliği güncelle" butonunu kullanın.</p>
      <p><a class="buton" href="etkinlikler.html">Etkinliklere git</a></p>`;
  } else {
    form.elements.ad.value = duzenlenen.title;
    form.elements.kategori.value = duzenlenen.category;
    form.elements.tarih.value = toIso(duzenlenen.date);
    form.elements.saat.value = duzenlenen.time;
    form.elements.yer.value = duzenlenen.location;
    form.elements.kontenjan.value = duzenlenen.capacity;
    form.elements.aciklama.value = duzenlenen.description;
  }
}

function hataYaz(alan, metin) {
  const input = form.elements[alan];
  const span = document.querySelector(`#${alan}-hata`);
  span.textContent = metin;
  if (metin) {
    input.setAttribute("aria-invalid", "true");
  } else {
    input.removeAttribute("aria-invalid");
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const fd = new FormData(form);
  const kontenjanMetni = String(fd.get("kontenjan") ?? "").trim();

  const data = {
    id: guncelleModu ? duzenlenen.id : `event-${events.length + 1}`,
    title: String(fd.get("ad") ?? "").trim(),
    category: String(fd.get("kategori") ?? ""),
    date: String(fd.get("tarih") ?? ""),
    time: String(fd.get("saat") ?? ""),
    location: String(fd.get("yer") ?? "").trim(),
    capacity: kontenjanMetni === "" ? null : Number(kontenjanMetni),
    description: String(fd.get("aciklama") ?? "").trim(),
  };

  const errors = {};
  if (data.title.length < 3) errors.ad = "Etkinlik adı en az 3 karakter olmalı.";
  if (data.category === "") errors.kategori = "Bir kategori seçin.";
  if (data.date === "") errors.tarih = "Tarih seçin.";
  if (data.time === "") errors.saat = "Saat seçin.";
  if (data.location === "") errors.yer = "Yer bilgisini yazın.";
  if (
    data.capacity !== null &&
    (!Number.isInteger(data.capacity) || data.capacity < 1 || data.capacity > 1000)
  ) {
    errors.kontenjan = "Kontenjan 1 ile 1000 arasında bir tam sayı olmalı.";
  }

  // Her alanın hatasını yaz; düzeltilen alanın eski hatası silinir
  alanlar.forEach((alan) => hataYaz(alan, errors[alan] ?? ""));

  if (Object.keys(errors).length > 0) {
    mesaj.className = "mesaj mesaj-hata";
    mesaj.textContent = "Formda hatalı alanlar var. Kırmızı alanları düzeltin.";
    return;
  }

  console.log(data);
  const baslik = guncelleModu
    ? "Etkinlik güncellendi (bu sprintte kaydedilmez):"
    : "Etkinlik oluşturuldu (bu sprintte kaydedilmez):";
  mesaj.className = "mesaj mesaj-basari";
  mesaj.innerHTML = `<p>${baslik}</p><pre>${JSON.stringify(data, null, 2)}</pre>`;
});
