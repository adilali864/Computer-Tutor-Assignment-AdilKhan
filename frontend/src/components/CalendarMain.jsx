import { useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";

const VIEWS = {
  month: "dayGridMonth",
  week: "timeGridWeek",
  day: "timeGridDay",
  agenda: "listWeek",
};

const CalendarMain = ({
  view,
  events,
  handleDateSelect,
  handleEventClick,
  setCalendarApi,
  setNavDate,
}) => {
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

  return (
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
            if (ref && setCalendarApi) {
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

      <style>{`
        .fc {
          font-family: inherit;
        }
        
        .fc .fc-button {
          background: transparent;
          border: none;
          color: #5f6368;
          font-weight: 500;
          text-transform: capitalize;
          padding: 4px 8px;
        }
        
        .fc .fc-button:hover {
          background: #f1f3f4;
        }
        
        .fc .fc-button-active {
          background: #e8f0fe !important;
          color: #1967d2 !important;
        }
        
        .fc-theme-standard td,
        .fc-theme-standard th {
          border-color: #dadce0;
        }
        
        .fc .fc-col-header-cell {
          padding: 8px 4px;
          font-size: 11px;
          font-weight: 500;
          color: #70757a;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }
        
        .fc .fc-daygrid-day-number {
          padding: 8px;
          font-size: 12px;
          color: #3c4043;
        }
        
        .fc .fc-daygrid-day.fc-day-today {
          background-color: #e8f0fe;
        }
        
        .fc .fc-daygrid-day.fc-day-today .fc-daygrid-day-number {
          background: #1967d2;
          color: white;
          border-radius: 50%;
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 4px;
        }
        
        .fc .fc-event {
          border: none;
          padding: 2px 4px;
          margin: 1px 2px;
          font-size: 12px;
          cursor: pointer;
        }
        
        .fc .fc-event:hover {
          filter: brightness(0.95);
        }
        
        .fc .fc-timegrid-slot {
          height: 48px;
          border-color: #dadce0;
        }
        
        .fc .fc-timegrid-slot-label {
          font-size: 10px;
          color: #70757a;
          text-transform: uppercase;
        }
        
        .fc .fc-list-event:hover td {
          background-color: #f1f3f4;
        }
        
        .fc .fc-list-event-time,
        .fc .fc-list-event-title {
          font-size: 14px;
        }
        
        .fc-scrollgrid {
          border-color: #dadce0 !important;
        }
        
        .fc .fc-more-link {
          color: #1967d2;
          font-size: 11px;
          font-weight: 500;
        }
      `}</style>
    </main>
  );
};

export default CalendarMain;
