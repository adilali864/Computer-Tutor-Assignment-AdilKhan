import { create } from "zustand";
import axios from "../lib/axios.js";
import { toast } from "react-hot-toast";

export const useEventStore = create((set) => ({
  event: null,
  events: [],
  loading: false,

  createEvent: async (eventData) => {
    set({ loading: true });
    try {
      const res = await axios.post("/event/create", eventData);
      toast.success("Event created!");
      set((state) => ({
        events: [...state.events, res.data.data],
        event: res.data.data,
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occured");
    } finally {
      set({ loading: false });
    }
  },
  listEvents: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/event");
      set({ events: res.data.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred!");
    } finally {
      set({ loading: false });
    }
  },
  getEvent: async (id) => {
    set({ loading: true });
    try {
      const res = await axios.get(`/event/${id}`);
      toast.success("Event fetched!");
      set({ event: res.data.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred!");
    } finally {
      set({ loading: false });
    }
  },
  updateEvent: async (id, eventData) => {
    set({ loading: true });
    try {
      const res = await axios.put(`/event/${id}`, eventData);
      set((state) => ({
        events: state.events.map((e) => (e._id === id ? res.data.data : e)),
        event: res.data.data,
      }));
      toast.success("Event updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred!");
    } finally {
      set({ loading: false });
    }
  },
  deleteEvent: async (id) => {
    set({ loading: true });
    try {
      await axios.delete(`/event/${id}`);
      set((state) => ({
        events: state.events.filter((e) => e._id !== id),
      }));
      toast.success("Event deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred!");
    } finally {
      set({ loading: false });
    }
  },
}));
