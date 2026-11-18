import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "./config/database.js";

const PORT = process.env.PORT || 3000;

// Önce veritabanı, sonra sunucu
try {
  await connectDatabase();
  app.listen(PORT, (err) => {
    // Express 5 port hatasını (ör. port dolu) buraya verir
    if (err) {
      console.error(`Sunucu açılamadı (port ${PORT}): ${err.message}`);
      process.exit(1);
    }
    console.log(`API: http://localhost:${PORT}`);
  });
} catch (err) {
  console.error(`Bağlanılamadı: ${err.message}`);
  process.exit(1);
}
