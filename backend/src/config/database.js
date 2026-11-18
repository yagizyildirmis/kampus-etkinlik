import mongoose from "mongoose";

// Bağlantı adresi koda yazılmaz; her zaman .env'deki MONGODB_URI kullanılır
export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI tanımlı değil. backend/.env dosyasını kontrol et.");
  }

  await mongoose.connect(uri);

  // uri'yi asla yazdırma: içinde şifre var. Sadece host ve veritabanı adı.
  const { host, name } = mongoose.connection;
  const yer = uri.includes(".mongodb.net") ? "Atlas" : "yerel";
  console.log(`MongoDB bağlandı (${yer}): ${host}/${name}`);
}
