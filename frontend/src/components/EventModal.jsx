import { motion, AnimatePresence } from "framer-motion";
import { Users, MapPin } from "lucide-react";

const EventModal = ({
  showModal,
  setShowModal,
  form,
  setForm,
  selectedEvent,
  setSelectedEvent,
  handleSave,
  handleDelete,
}) => {
  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            setShowModal(false);
            setSelectedEvent(null);
          }}
        >
          <motion.div
            className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-5">
              <div className="flex items-start gap-4">
                <Users className="w-5 h-5 text-gray-600 mt-3" />
                <div className="flex-1">
                  <input
                    value={form.attendees}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, attendees: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-blue-600 outline-none"
                    placeholder="Add guests"
                  />
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-gray-600 mt-3" />
                <div className="flex-1">
                  <input
                    value={form.location}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, location: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-blue-600 outline-none"
                    placeholder="Add location"
                  />
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-5 h-5 mt-3 flex items-center justify-center">
                  <div
                    className="w-4 h-4 rounded-full border-2 border-gray-400"
                    style={{ backgroundColor: form.color }}
                  />
                </div>
                <div className="flex-1">
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, description: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-blue-600 outline-none resize-none"
                    rows={3}
                    placeholder="Add description"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-700">Color:</label>
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, color: e.target.value }))
                    }
                    className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                </div>

                <div className="flex items-center gap-3">
                  {selectedEvent && (
                    <button
                      onClick={() => handleDelete(selectedEvent._id)}
                      className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded transition"
                    >
                      Delete
                    </button>
                  )}
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EventModal;
