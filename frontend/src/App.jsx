import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, PlusCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useEventStore } from "./stores/useEventStore.js";

const App = () => {
  const { events, listEvents, createEvent, updateEvent, deleteEvent } =
    useEventStore();
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({ title: "", start: "", end: "" });

  useEffect(() => {
    listEvents();
  }, [listEvents]);

  const handleDateSelect = (info) => {
    setFormData({ title: "", start: info.startStr, end: info.endStr });
    setSelectedEvent(null);
    setShowModal(true);
  };

  const handleEventClick = (info) => {
    const event = events.find((e) => e._id === info.event.id);
    if (!event) return;
    setSelectedEvent(event);
    setFormData({ title: event.title, start: event.start, end: event.end });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.start || !formData.end)
      return toast.error("Please fill all fields");

    if (selectedEvent) {
      await updateEvent(selectedEvent._id, formData);
    } else {
      await createEvent(formData);
    }
    setShowModal(false);
  };

  const handleDelete = async () => {
    if (selectedEvent) {
      await deleteEvent(selectedEvent._id);
      setShowModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <Toaster position="top-right" />
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-3 bg-white shadow">
        <div className="flex items-center gap-2">
          <CalendarDays className="text-blue-600" size={26} />
          <h1 className="text-xl font-semibold">Google Calendar Clone</h1>
        </div>
        <button
          onClick={() => {
            setSelectedEvent(null);
            setFormData({ title: "", start: "", end: "" });
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
        >
          <PlusCircle size={18} /> Add Event
        </button>
      </nav>

      {/* Calendar */}
      <div className="p-6">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            start: "prev,next today",
            center: "title",
            end: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          selectable
          select={handleDateSelect}
          events={events.map((e) => ({
            id: e._id,
            title: e.title,
            start: e.start,
            end: e.end,
            color: e.color || "#1a73e8",
          }))}
          eventClick={handleEventClick}
          height="85vh"
        />
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md"
            >
              <h2 className="text-xl font-semibold mb-4">
                {selectedEvent ? "Edit Event" : "Create Event"}
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Event Title"
                  className="w-full border rounded px-3 py-2"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-500 mb-1">
                      Start
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full border rounded px-3 py-2"
                      value={formData.start}
                      onChange={(e) =>
                        setFormData({ ...formData, start: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm text-gray-500 mb-1">
                      End
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full border rounded px-3 py-2"
                      value={formData.end}
                      onChange={(e) =>
                        setFormData({ ...formData, end: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                {selectedEvent && (
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                )}
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
