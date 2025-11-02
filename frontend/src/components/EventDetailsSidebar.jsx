import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, MapPin, Users, Edit2, Trash2 } from "lucide-react";

const EventDetailsSidebar = ({
  selectedEvent,
  setSelectedEvent,
  setShowModal,
  setForm,
  handleDelete,
  toLocalInputString,
}) => {
  useEffect(() => {
    if (selectedEvent) {
      setForm({
        title: selectedEvent.title || "",
        description: selectedEvent.description || "",
        location: selectedEvent.location || "",
        start: selectedEvent.start
          ? toLocalInputString(selectedEvent.start)
          : "",
        end: selectedEvent.end ? toLocalInputString(selectedEvent.end) : "",
        allDay: !!selectedEvent.allDay,
        color: selectedEvent.color || "#1967d2",
        attendees: Array.isArray(selectedEvent.attendees)
          ? selectedEvent.attendees.join(", ")
          : selectedEvent.attendees || "",
      });
    }
  }, [selectedEvent, setForm, toLocalInputString]);

  return (
    <AnimatePresence>
      {selectedEvent && (
        <motion.div
          className="fixed right-0 top-16 bottom-0 w-96 bg-white border-l border-gray-200 shadow-xl z-30"
          initial={{ x: 384 }}
          animate={{ x: 0 }}
          exit={{ x: 384 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
        >
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Event details
              </h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div
                className="h-1.5 rounded-full"
                style={{ backgroundColor: selectedEvent.color || "#1967d2" }}
              />

              <div>
                <h4 className="text-xl font-medium text-gray-900 mb-2">
                  {selectedEvent.title}
                </h4>
                {selectedEvent.description && (
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {selectedEvent.description}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(selectedEvent.start).toLocaleDateString(
                        undefined,
                        {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </div>
                    {!selectedEvent.allDay && (
                      <div className="text-sm text-gray-600 mt-1">
                        {new Date(selectedEvent.start).toLocaleTimeString([], {
                          hour: "numeric",
                          minute: "2-digit",
                        })}{" "}
                        –{" "}
                        {new Date(selectedEvent.end).toLocaleTimeString([], {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {selectedEvent.location && (
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-900">
                        {selectedEvent.location}
                      </div>
                    </div>
                  </div>
                )}

                {selectedEvent.attendees &&
                  selectedEvent.attendees.length > 0 && (
                    <div className="flex items-start gap-4">
                      <Users className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 mb-2">
                          {selectedEvent.attendees.length} guest
                          {selectedEvent.attendees.length > 1 ? "s" : ""}
                        </div>
                        <div className="space-y-1">
                          {selectedEvent.attendees.map((a, i) => (
                            <div key={i} className="text-sm text-gray-700">
                              {a}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 flex items-center gap-3">
              <button
                onClick={() => {
                  setShowModal(true);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm font-medium transition flex items-center justify-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(selectedEvent._id)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium transition flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EventDetailsSidebar;
