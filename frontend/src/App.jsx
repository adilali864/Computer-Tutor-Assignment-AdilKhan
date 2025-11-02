import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useEventStore } from "./stores/useEventStore.js";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import CalendarMain from "./components/CalendarMain";
import EventModal from "./components/EventModal";
import EventDetailsSidebar from "./components/EventDetailsSidebar";

const App = () => {
  const { events, listEvents, createEvent, updateEvent, deleteEvent } =
    useEventStore();
  const [view, setView] = useState("month");
  const [showSidebar, setShowSidebar] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [calendarApi, setCalendarApi] = useState(null);
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

  const resetForm = () => {
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
  };

  const handleCreateNew = () => {
    setSelectedEvent(null);
    resetForm();
    setShowModal(true);
  };

  const handleEventClick = (clickInfo) => {
    const ext = clickInfo.event.extendedProps;
    setSelectedEvent(ext || {});
  };

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

  const toLocalInputString = (date) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    const tzOffset = d.getTimezoneOffset() * 60000;
    const localISOTime = new Date(d.getTime() - tzOffset)
      .toISOString()
      .slice(0, 16);
    return localISOTime;
  };

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

  const handleNavigation = {
    prev: () => {
      if (calendarApi) {
        calendarApi.prev();
        setNavDate(new Date(calendarApi.getDate()));
      }
    },
    next: () => {
      if (calendarApi) {
        calendarApi.next();
        setNavDate(new Date(calendarApi.getDate()));
      }
    },
    today: () => {
      if (calendarApi) {
        calendarApi.today();
        setNavDate(new Date(calendarApi.getDate()));
      }
    },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-right" />

      <Header
        navDate={navDate}
        view={view}
        setView={setView}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        handleNavigation={handleNavigation}
        handleCreateNew={handleCreateNew}
        calendarApi={calendarApi}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          showSidebar={showSidebar}
          events={events}
          calendarApi={calendarApi}
          setNavDate={setNavDate}
          setView={setView}
          handleCreateNew={handleCreateNew}
        />

        <CalendarMain
          view={view}
          events={events}
          handleDateSelect={handleDateSelect}
          handleEventClick={handleEventClick}
          setCalendarApi={setCalendarApi}
          setNavDate={setNavDate}
        />
      </div>

      <EventModal
        showModal={showModal}
        setShowModal={setShowModal}
        form={form}
        setForm={setForm}
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        handleSave={handleSave}
        handleDelete={handleDelete}
      />

      <EventDetailsSidebar
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        setShowModal={setShowModal}
        setForm={setForm}
        handleDelete={handleDelete}
        toLocalInputString={toLocalInputString}
      />
    </div>
  );
};

export default App;
