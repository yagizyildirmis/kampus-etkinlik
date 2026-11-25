import { Router } from "express";
import {
  createEvent,
  deleteEvent,
  getEventById,
  getEvents,
  getUpcomingEvents,
  updateEvent,
} from "../controllers/event-controller.js";

const router = Router();

// app.js "/events" önekini verdi; buradaki yollar onun devamı.
// Express yukarıdan aşağı dener: sabit "/upcoming" adresi "/:id"den ÖNCE olmalı,
// yoksa "upcoming" bir id sanılır ve 404 döner.
router.get("/", getEvents);
router.get("/upcoming", getUpcomingEvents);
router.get("/:id", getEventById);
router.post("/", createEvent);
router.patch("/:id", updateEvent);
router.delete("/:id", deleteEvent);

export default router;
