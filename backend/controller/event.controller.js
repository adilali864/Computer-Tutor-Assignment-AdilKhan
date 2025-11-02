import { Event } from "../model/event.model.js";

const createEvent = async (req, res) => {
  const eventData = req.body;
  try {
    if (!eventData.title || !eventData.start || !eventData.end) {
      return res
        .status(400)
        .json({ message: "Title, start date, and end date are required!" });
    }
    const newEvent = await Event.create(eventData);
    return res
      .status(201)
      .json({ message: "Event created successfully!", data: newEvent });
  } catch (error) {
    console.log("Error in createEvent controller: ", error.message);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

const listEvents = async (req, res) => {
  try {
    const { start, end } = req.query;
    const filter = {};
    if (start && end) {
      filter.$or = [
        { start: { $lt: new Date(end) }, end: { $gt: new Date(start) } },
      ];
    }
    const events = await Event.find(filter).lean();
    res.status(200).json({ message: "Event fetched", data: events });
  } catch (error) {
    console.log("Error in listEvents controller: ", error.message);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

const getEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found!" });
    }
    return res.status(200).json({ message: "Event fetched", data: event });
  } catch (error) {
    console.log("Error in getEvent controller: ", error.message);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

const updateEvent = async (req, res) => {
  const { id } = req.params;
  const eventData = req.body;
  try {
    const event = await Event.findByIdAndUpdate(id, eventData, {
      new: true,
      runValidators: true,
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found!" });
    }
    return res
      .status(200)
      .json({ message: "Event updated successfully!", data: event });
  } catch (error) {
    console.log("Error in updateEvent controller: ", error.message);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

const deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    await Event.findByIdAndDelete(id);
    return res.status(200).json({ message: "Event deleted successfully!" });
  } catch (error) {
    console.log("Error in deleteEvent controller: ", error.message);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export { createEvent, listEvents, getEvent, updateEvent, deleteEvent };
