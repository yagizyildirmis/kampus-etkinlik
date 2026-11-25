import mongoose from "mongoose";
import { formatDate, parseDate } from "../utils/date.js";

// Kurallar schema'da: eksik ya da kurala uymayan kayıt veritabanına giremez
const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    category: {
      type: String,
      required: true,
      enum: ["Seminer", "Atölye", "Söyleşi", "Yarışma"],
    },
    capacity: { type: Number, min: 0, default: 0 },
    // API'de "GG-AA-YYYY", veritabanında Date (bkz. utils/date.js)
    date: { type: Date, required: true, set: parseDate, get: formatDate },
    time: { type: String, default: "" },
    location: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, maxlength: 500, default: "" },
  },
  {
    timestamps: true, // createdAt ve updatedAt kendiliğinden eklenir
    toJSON: { getters: true }, // yanıtta date "15-10-2026" görünsün
    id: false, // getters açıkken fazladan "id" alanı çıkmasın; _id yeterli
  }
);

// Model adı "Event" → MongoDB'de koleksiyon adı otomatik "events" olur
export const Event = mongoose.model("Event", eventSchema);
