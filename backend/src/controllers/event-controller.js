import mongoose from "mongoose";
import { Event } from "../models/event-model.js";
import { todayStart } from "../utils/date.js";

// İstemcinin değiştiremeyeceği alanlar (MongoDB ve timestamps yönetir)
const KORUNAN_ALANLAR = ["_id", "createdAt", "updatedAt", "__v"];

// Aynı 404 yanıtı tek yerde
function notFound(res) {
  return res.status(404).json({ error: { message: "Event not found" } });
}

// Schema kuralı (ValidationError) ya da yanlış tür/tarih (CastError) → 400
function isClientError(err) {
  return err.name === "ValidationError" || err.name === "CastError";
}

// GET /events  (?search=atölye & ?category=Atölye isteğe bağlı)
export async function getEvents(req, res, next) {
  try {
    const { category, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (search) {
      // ( * ? gibi işaretler regex'i bozmasın diye kaçırılır
      const guvenli = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.title = { $regex: guvenli, $options: "i" }; // büyük/küçük harf fark etmez
    }
    const events = await Event.find(filter).sort({ date: 1, time: 1 });
    res.json(events);
  } catch (err) {
    next(err);
  }
}

// GET /events/upcoming  (bugün ve sonrası, en yakın önce)
export async function getUpcomingEvents(req, res, next) {
  try {
    const events = await Event.find({ date: { $gte: todayStart() } }).sort({
      date: 1,
      time: 1,
    });
    res.json(events);
  } catch (err) {
    next(err);
  }
}

// GET /events/:id
export async function getEventById(req, res, next) {
  try {
    // Biçimi yanlış id ("yok", "111111") Mongoose'da CastError → 500 olurdu; 404 dönüyoruz
    if (!mongoose.isValidObjectId(req.params.id)) return notFound(res);

    const event = await Event.findById(req.params.id);
    if (!event) return notFound(res);
    res.json(event);
  } catch (err) {
    next(err);
  }
}

// POST /events
// Zorunlu alan, enum, minlength, tarih biçimi gibi kuralları schema denetler; burada 400'e çevrilir
export async function createEvent(req, res, next) {
  try {
    const event = await Event.create(req.body ?? {});
    res.status(201).json(event);
  } catch (err) {
    if (isClientError(err)) {
      return res.status(400).json({ error: { message: err.message } });
    }
    next(err);
  }
}

// PATCH /events/:id  (sadece gönderilen alanlar değişir)
export async function updateEvent(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return notFound(res);

    const body = req.body ?? {};
    if (Object.keys(body).length === 0) {
      return res.status(400).json({ error: { message: "Body is empty" } });
    }

    const korunan = Object.keys(body).filter((k) => KORUNAN_ALANLAR.includes(k));
    if (korunan.length > 0) {
      return res
        .status(400)
        .json({ error: { message: `${korunan.join(", ")} cannot be changed` } });
    }

    const event = await Event.findByIdAndUpdate(req.params.id, body, {
      returnDocument: "after", // yanıtta güncellenmiş kayıt dönsün
      runValidators: true, // schema kuralları güncellemede de çalışsın
    });
    if (!event) return notFound(res);
    res.json(event);
  } catch (err) {
    if (isClientError(err)) {
      return res.status(400).json({ error: { message: err.message } });
    }
    next(err);
  }
}

// DELETE /events/:id  (başarılıysa 204, gövde yok)
export async function deleteEvent(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return notFound(res);

    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return notFound(res); // aynı kaydı ikinci kez silmek de buraya düşer
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
