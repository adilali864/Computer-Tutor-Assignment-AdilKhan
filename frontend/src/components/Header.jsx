import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalIcon,
  Menu,
  Search,
  Settings,
  HelpCircle,
} from "lucide-react";

const VIEWS = {
  month: "dayGridMonth",
  week: "timeGridWeek",
  day: "timeGridDay",
  agenda: "listWeek",
};

const Header = ({
  navDate,
  view,
  setView,
  showSidebar,
  setShowSidebar,
  handleNavigation,
  handleCreateNew,
  calendarApi,
}) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="h-16 flex items-center px-4 gap-4">
        {/* Left section */}
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

        {/* Center section */}
        <div className="flex items-center gap-3 ml-8">
          <button
            onClick={handleNavigation.today}
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50 text-sm font-medium text-gray-700 transition"
          >
            Today
          </button>

          <div className="flex items-center">
            <button
              onClick={handleNavigation.prev}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={handleNavigation.next}
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

        {/* Right section */}
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
  );
};

export default Header;
