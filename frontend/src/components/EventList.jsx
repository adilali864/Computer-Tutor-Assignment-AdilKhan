import EventCard from "./EventCard.jsx";
import { Calendar } from "lucide-react";

const EventList = ({ events, onEdit, onDelete, onSelect }) => {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.start) - new Date(b.start)
  );

  if (events.length === 0) {
    return (
      <div className="text-center py-16">
        <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          No events yet
        </h3>
        <p className="text-slate-600">Create your first event to get started</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {sortedEvents.map((event) => (
        <EventCard
          key={event._id}
          event={event}
          onEdit={onEdit}
          onDelete={onDelete}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

export default EventList;
