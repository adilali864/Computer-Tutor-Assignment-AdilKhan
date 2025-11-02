import { useState } from "react";

const CalendarView = ({ events, onEdit }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const getEventsForDay = (day) => {
    if (!day) return [];
    const dayDate = new Date(year, month, day);
    const nextDay = new Date(year, month, day + 1);
    return events.filter((event) => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      return eventStart < nextDay && eventEnd >= dayDate;
    });
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          {monthNames[month]} {year}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            ←
          </button>
          <button
            onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center font-semibold text-slate-600 py-2"
          >
            {day}
          </div>
        ))}

        {days.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          return (
            <div
              key={index}
              className={`min-h-24 border border-slate-200 rounded-lg p-2 ${
                day ? "bg-white hover:bg-slate-50" : "bg-slate-50"
              }`}
            >
              {day && (
                <>
                  <div className="text-sm font-medium text-slate-700 mb-1">
                    {day}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div
                        key={event._id}
                        className="text-xs p-1 rounded truncate cursor-pointer"
                        style={{
                          backgroundColor: event.color + "20",
                          color: event.color,
                        }}
                        onClick={() => onEdit(event)}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-slate-500">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
