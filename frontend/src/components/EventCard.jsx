import { Clock, Edit2, MapPin, Trash2, Users } from "lucide-react";

const EventCard = ({ event, onEdit, onDelete, onSelect }) => {
  const startDate = new Date(event.start);

  return (
    <div
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-slate-200 overflow-hidden group"
      onClick={() => onSelect(event)}
    >
      <div
        className="h-2"
        style={{ backgroundColor: event.color || "#1a74e8" }}
      />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-slate-900 line-clamp-2">
            {event.title}
          </h3>
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(event);
              }}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4 text-slate-600" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(event._id);
              }}
              className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>

        {event.description && (
          <p className="text-sm text-slate-600 mb-3 line-clamp-2">
            {event.description}
          </p>
        )}

        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <Clock className="w-4 h-4" />
            <span>
              {startDate.toLocaleDateString()}{" "}
              {!event.allDay &&
                startDate.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
            </span>
          </div>

          {event.location && (
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <MapPin className="w-4 h-4" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          )}

          {event.attendees && event.attendees.length > 0 && (
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <Users className="w-4 h-4" />
              <span>
                {event.attendees.length} attendee
                {event.attendees.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {event.allDay && (
          <span className="inline-block mt-3 px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">
            All Day
          </span>
        )}
      </div>
    </div>
  );
};

export default EventCard;
