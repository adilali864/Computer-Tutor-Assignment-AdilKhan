import { Router } from "express";
import {
  createEvent,
  deleteEvent,
  getEvent,
  listEvents,
  updateEvent,
} from "../controller/event.controller.js";

const router = Router();

router.post("/create", createEvent);
router.put("/:id", updateEvent);
router.get("/", listEvents);
router.get("/:id", getEvent);
router.delete("/:id", deleteEvent);

export default router;
