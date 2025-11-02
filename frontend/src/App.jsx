import { useEffect, useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalIcon,
  Plus,
  X,
  ChevronDown,
  Edit2,
  Trash2,
  Clock,
  MapPin,
  Users,
  Menu,
  Search,
  Settings,
  HelpCircle,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useEventStore } from "./stores/useEventStore.js";

const VIEWS = {
  month: "dayGridMonth",
  week: "timeGridWeek",
  day: "timeGridDay",
  agenda: "listWeek",
};

const App = () => {
  const { events, loading, listEvents, createEvent, updateEvent, deleteEvent } =
    useEventStore();
  const [view, setView] = useState("month");
  const [showSidebar, setShowSidebar] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [calendarApi, setCalendarApi] = useState(null);
  const [miniMonthDate, setMiniMonthDate] = useState(new Date());
  const [navDate, setNavDate] = useState(new Date());

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    start: "",
    end: "",
    allDay: false,
    color: "#1967d2",
    attendees: "",
  });

  useEffect(() => {
    listEvents();
  }, [listEvents]);

  const calendarEvents = useMemo(
    () =>
      (events || []).map((e) => ({
        id: e._id,
        title: e.title,
        start: e.start,
        end: e.end,
        allDay: !!e.allDay,
        backgroundColor: e.color || "#1967d2",
        borderColor: e.color || "#1967d2",
        extendedProps: e,
      })),
    [events]
  );

  const handleDateSelect = (selectInfo) => {
    const start = selectInfo.allDay
      ? selectInfo.startStr.split("T")[0] + "T09:00"
      : selectInfo.startStr;
    const end = selectInfo.allDay
      ? selectInfo.endStr
        ? new Date(new Date(selectInfo.endStr).getTime() - 86400000)
            .toISOString()
            .split("T")[0] + "T10:00"
        : selectInfo.startStr.split("T")[0] + "T10:00"
      : selectInfo.endStr || selectInfo.startStr;

    resetForm();
    setForm((f) => ({
      ...f,
      start: toLocalInputString(start),
      end: toLocalInputString(end),
      allDay: selectInfo.allDay,
    }));
    setSelectedEvent(null);
    setShowModal(true);
  };

  const handleEventClick = (clickInfo) => {
    const ext = clickInfo.event.extendedProps;
    setSelectedEvent(ext || {});
  };

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
  }, [selectedEvent]);

  function toLocalInputString(date) {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return "";
    }
    const tzOffset = d.getTimezoneOffset() * 60000;
    const localISOTime = new Date(d.getTime() - tzOffset)
      .toISOString()
      .slice(0, 16);
    return localISOTime;
  }

  function resetForm() {
    setForm({
      title: "",
      description: "",
      location: "",
      start: "",
      end: "",
      allDay: false,
      color: "#1967d2",
      attendees: "",
    });
  }

  const handleSave = async () => {
    if (!form.title?.trim()) {
      toast.error("Please enter an event title");
      return;
    }

    if (!form.start) {
      toast.error("Please select a start date and time");
      return;
    }

    if (!form.end) {
      toast.error("Please select an end date and time");
      return;
    }

    const startDate = new Date(form.start);
    const endDate = new Date(form.end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      toast.error("Invalid date format");
      return;
    }

    if (endDate <= startDate) {
      toast.error("End date must be after start date");
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description?.trim() || "",
      location: form.location?.trim() || "",
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      allDay: !!form.allDay,
      color: form.color || "#1967d2",
      attendees: form.attendees
        ? form.attendees
            .split(",")
            .map((a) => a.trim())
            .filter(Boolean)
        : [],
    };

    try {
      if (selectedEvent && selectedEvent._id) {
        await updateEvent(selectedEvent._id, payload);
        toast.success("Event updated successfully");
      } else {
        await createEvent(payload);
        toast.success("Event created successfully");
      }
      setShowModal(false);
      setSelectedEvent(null);
      resetForm();
    } catch (err) {
      console.error("Error saving event:", err);
      toast.error(err.message || "Error saving event. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    if (!confirm("Delete this event?")) return;
    try {
      await deleteEvent(id);
      setSelectedEvent(null);
      setShowModal(false);
      toast.success("Event deleted");
    } catch (err) {
      toast.error("Error deleting");
    }
  };

  const handlePrev = () => {
    if (!calendarApi) return;
    calendarApi.prev();
    setNavDate(new Date(calendarApi.getDate()));
  };
  const handleNext = () => {
    if (!calendarApi) return;
    calendarApi.next();
    setNavDate(new Date(calendarApi.getDate()));
  };
  const handleToday = () => {
    if (!calendarApi) return;
    calendarApi.today();
    setNavDate(new Date(calendarApi.getDate()));
  };

  const prevMiniMonth = () =>
    setMiniMonthDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMiniMonth = () =>
    setMiniMonthDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const miniMonthGrid = useMemo(() => {
    const date = new Date(
      miniMonthDate.getFullYear(),
      miniMonthDate.getMonth(),
      1
    );
    const firstDayIndex = date.getDay();
    const daysInMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();
    const cells = [];
    for (let i = 0; i < firstDayIndex; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++)
      cells.push(new Date(date.getFullYear(), date.getMonth(), d));
    return {
      cells,
      monthName: date.toLocaleString(undefined, {
        month: "long",
        year: "numeric",
      }),
    };
  }, [miniMonthDate]);

  const getEventCountForDay = (day) => {
    if (!day) return 0;
    const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
    const dayEnd = new Date(
      day.getFullYear(),
      day.getMonth(),
      day.getDate() + 1
    );
    return (events || []).filter(
      (e) => new Date(e.start) < dayEnd && new Date(e.end) >= dayStart
    ).length;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Toaster position="top-right" />

      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="h-16 flex items-center px-4 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-3 rounded-full hover:bg-gray-100 transition"
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </button>

            <div className="flex items-center gap-3">
              <CalIcon className="w-6 h-6 text-gray-700" />
              <span className="text-[22px] text-gray-700">Calendar</span>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-8">
            <button
              onClick={handleToday}
              className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50 text-sm font-medium text-gray-700 transition"
            >
              Today
            </button>

            <div className="flex items-center">
              <button
                onClick={handlePrev}
                className="p-2 rounded-full hover:bg-gray-100 transition"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 rounded-full hover:bg-gray-100 transition"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <div className="text-[22px] font-normal text-gray-700 ml-2">
              {navDate.toLocaleString(undefined, {
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button className="p-3 rounded-full hover:bg-gray-100 transition">
              <Search className="w-5 h-5 text-gray-700" />
            </button>
            <button className="p-3 rounded-full hover:bg-gray-100 transition">
              <HelpCircle className="w-5 h-5 text-gray-700" />
            </button>
            <button className="p-3 rounded-full hover:bg-gray-100 transition">
              <Settings className="w-5 h-5 text-gray-700" />
            </button>

            <div className="h-6 w-px bg-gray-300 mx-2" />

            <select
              value={view}
              onChange={(e) => {
                setView(e.target.value);
                if (calendarApi) calendarApi.changeView(VIEWS[e.target.value]);
              }}
              className="px-4 py-2 rounded border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer outline-none"
            >
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="agenda">Agenda</option>
            </select>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <AnimatePresence>
          {showSidebar && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 256, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-r border-gray-200 overflow-hidden"
            >
              <div className="w-64 p-4 h-full overflow-y-auto">
                <button
                  onClick={() => {
                    setSelectedEvent(null);
                    resetForm();
                    setShowModal(true);
                  }}
                  className="w-full mb-6 flex items-center gap-3 bg-white shadow-md hover:shadow-lg rounded-full pl-5 pr-6 py-3 transition"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-base font-medium text-gray-700">
                    Create
                  </span>
                </button>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <button
                      onClick={prevMiniMonth}
                      className="p-1 rounded hover:bg-gray-100"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>
                    <div className="text-sm font-medium text-gray-900">
                      {miniMonthGrid.monthName}
                    </div>
                    <button
                      onClick={nextMiniMonth}
                      className="p-1 rounded hover:bg-gray-100"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-[11px] font-medium text-gray-500 mb-2">
                    {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                      <div
                        key={i}
                        className="text-center h-6 flex items-center justify-center"
                      >
                        {d}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {miniMonthGrid.cells.map((dt, idx) => {
                      const count = getEventCountForDay(dt);
                      const today = new Date();
                      const isToday =
                        dt &&
                        dt.getDate() === today.getDate() &&
                        dt.getMonth() === today.getMonth() &&
                        dt.getFullYear() === today.getFullYear();
                      return (
                        <div
                          key={idx}
                          className={`h-8 flex items-center justify-center text-xs cursor-pointer rounded-full transition ${
                            isToday
                              ? "bg-blue-600 text-white font-semibold"
                              : dt
                              ? "hover:bg-gray-100 text-gray-900"
                              : "text-transparent"
                          }`}
                          onClick={() => {
                            if (dt && calendarApi) {
                              calendarApi.gotoDate(dt);
                              setNavDate(new Date(dt));
                            }
                          }}
                        >
                          {dt ? dt.getDate() : ""}
                        </div>
                      );
                    })}
                  </div>
                </div>

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

        <main className="flex-1 overflow-auto bg-white">
          <div className="h-full p-4">
            <FullCalendar
              plugins={[
                dayGridPlugin,
                timeGridPlugin,
                interactionPlugin,
                listPlugin,
              ]}
              initialView={VIEWS[view]}
              headerToolbar={false}
              height="100%"
              selectable
              selectMirror
              dayMaxEvents={3}
              events={calendarEvents}
              select={handleDateSelect}
              eventClick={handleEventClick}
              ref={(ref) => {
                if (ref && !calendarApi) {
                  try {
                    setCalendarApi(ref.getApi());
                    setNavDate(new Date(ref.getApi().getDate()));
                  } catch (e) {}
                }
              }}
              eventContent={(arg) => {
                return (
                  <div
                    className="text-xs px-2 py-0.5 truncate font-medium"
                    style={{
                      backgroundColor: arg.event.backgroundColor,
                      color: "#fff",
                      borderRadius: 4,
                    }}
                  >
                    {!arg.event.allDay && (
                      <span className="mr-1">
                        {new Date(arg.event.start).toLocaleTimeString([], {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                    {arg.event.title}
                  </div>
                );
              }}
            />
          </div>
        </main>
      </div>

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
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <input
                      name="title"
                      value={form.title}
                      onChange={(e) =>
                        setForm((s) => ({ ...s, title: e.target.value }))
                      }
                      className="w-full text-2xl font-normal border-0 border-b border-gray-300 focus:border-blue-600 outline-none pb-2"
                      placeholder="Add title"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setSelectedEvent(null);
                    }}
                    className="p-2 rounded-full hover:bg-gray-100 ml-4"
                  >
                    <X className="w-5 h-5 text-gray-700" />
                  </button>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-gray-600 mt-3" />
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Start date & time *
                        </label>
                        <input
                          type="datetime-local"
                          name="start"
                          value={form.start}
                          onChange={(e) =>
                            setForm((s) => ({ ...s, start: e.target.value }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          End date & time *
                        </label>
                        <input
                          type="datetime-local"
                          name="end"
                          value={form.end}
                          onChange={(e) =>
                            setForm((s) => ({ ...s, end: e.target.value }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                          required
                        />
                      </div>
                    </div>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={form.allDay}
                        onChange={(e) =>
                          setForm((s) => ({ ...s, allDay: e.target.checked }))
                        }
                        className="w-4 h-4 rounded border-gray-300 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">All day</span>
                    </label>
                  </div>
                </div>

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

      <AnimatePresence>
        {selectedEvent && !showModal && (
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
                          {new Date(selectedEvent.start).toLocaleTimeString(
                            [],
                            {
                              hour: "numeric",
                              minute: "2-digit",
                            }
                          )}{" "}
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
    </div>
  );
};

export default App;
