const EventModal = ({ event, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: event?.title || "",
    description: event?.description || "",
    location: event?.location || "",
    start: event?.start ? new Date(event.start).toISOString().slice(0, 16) : "",
    end: event?.end ? new Date(event.end).toISOString().slice(0, 16) : "",
    allDay: event?.allDay || false,
    color: event?.color || "#1a74e8",
    attendees: event?.attendees?.join(", ") || "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.start || !formData.end) {
      toast.error("Please fill in all required fields");
      return;
    }
    const submitData = {
      ...formData,
      attendees: formData.attendees
        ? formData.attendees
            .split(",")
            .map((a) => a.trim())
            .filter(Boolean)
        : [],
      start: new Date(formData.start).toISOString(),
      end: new Date(formData.end).toISOString(),
    };
    onSubmit(submitData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            {event ? "Edit Event" : "Create New Event"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Event title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Event description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Event location"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Start Date & Time *
              </label>
              <input
                type="datetime-local"
                name="start"
                value={formData.start}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                End Date & Time *
              </label>
              <input
                type="datetime-local"
                name="end"
                value={formData.end}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="allDay"
              id="allDay"
              checked={formData.allDay}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="allDay"
              className="text-sm font-medium text-slate-700"
            >
              All Day Event
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Color
            </label>
            <input
              type="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="w-full h-10 px-2 border border-slate-300 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Attendees (comma-separated)
            </label>
            <input
              type="text"
              name="attendees"
              value={formData.attendees}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="john@example.com, jane@example.com"
            />
          </div>

          <div className="flex items-center space-x-3 pt-4">
            <button
              onClick={handleSubmit}
              className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Check className="w-5 h-5" />
              <span>{event ? "Update Event" : "Create Event"}</span>
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
