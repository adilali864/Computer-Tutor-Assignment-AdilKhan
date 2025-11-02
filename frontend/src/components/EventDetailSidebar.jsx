const EventDetailSidebar = ({ event, onClose, onEdit, onDelete }) => {
  const startDate = new Date(event.start);
  const endDate = new Date(event.end);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Event Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div
            className="h-3 rounded-full"
            style={{ backgroundColor: event.color || "#1a74e8" }}
          />

          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              {event.title}
            </h3>
            {event.description && (
              <p className="text-slate-600">{event.description}</p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {startDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                {!event.allDay && (
                  <p className="text-sm text-slate-600">
                    {startDate.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    -{" "}
                    {endDate.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
                {event.allDay && (
                  <span className="inline-block mt-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">
                    All Day
                  </span>
                )}
              </div>
            </div>

            {event.location && (
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                <p className="text-sm text-slate-900">{event.location}</p>
              </div>
            )}

            {event.attendees && event.attendees.length > 0 && (
              <div className="flex items-start space-x-3">
                <Users className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-900 mb-1">
                    {event.attendees.length} Attendee
                    {event.attendees.length !== 1 ? "s" : ""}
                  </p>
                  <div className="space-y-1">
                    {event.attendees.map((attendee, index) => (
                      <p key={index} className="text-sm text-slate-600">
                        {attendee}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3 pt-4 border-t border-slate-200">
            <button
              onClick={() => onEdit(event)}
              className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => onDelete(event._id)}
              className="flex-1 flex items-center justify-center space-x-2 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailSidebar;
