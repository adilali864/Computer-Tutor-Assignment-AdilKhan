import { Plus, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MiniCalendar from "./MiniCalendar";

const Sidebar = ({
  showSidebar,
  events,
  calendarApi,
  setNavDate,
  setView,
  handleCreateNew,
}) => {
  return (
    <AnimatePresence>
      {showSidebar && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 256, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="border-r border-gray-200 overflow-hidden px-4"
        >
          <div className="w-64 p-4 h-full overflow-y-auto">
            <button
              onClick={handleCreateNew}
              className="w-full mb-6 flex items-center gap-3 bg-white shadow-md hover:shadow-lg rounded-full pl-5 pr-6 py-3 transition"
            >
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <span className="text-base font-medium text-gray-700">
                Create
              </span>
            </button>

            <MiniCalendar
              events={events}
              calendarApi={calendarApi}
              setNavDate={setNavDate}
              setView={setView}
            />

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-sm font-medium text-gray-900">
                  My calendars
                </h3>
                <button className="p-1 rounded hover:bg-gray-100">
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-3 px-1 py-1 rounded cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded text-blue-600 border-gray-300"
                  />
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: "#1967d2" }}
                  />
                  <span className="text-sm text-gray-900">Events</span>
                </label>

                <label className="flex items-center gap-3 px-1 py-1 rounded cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded text-blue-600 border-gray-300"
                  />
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: "#0b8043" }}
                  />
                  <span className="text-sm text-gray-900">Reminders</span>
                </label>

                <label className="flex items-center gap-3 px-1 py-1 rounded cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-blue-600 border-gray-300"
                  />
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: "#e67c73" }}
                  />
                  <span className="text-sm text-gray-900">Tasks</span>
                </label>
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
