import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const VIEWS = {
  month: "dayGridMonth",
  week: "timeGridWeek",
  day: "timeGridDay",
  agenda: "listWeek",
};

const MiniCalendar = ({ events, calendarApi, setNavDate, setView }) => {
  const [miniMonthDate, setMiniMonthDate] = useState(new Date());

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
  );
};

export default MiniCalendar;
