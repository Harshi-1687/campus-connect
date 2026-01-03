import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { useAuth } from "../context/AuthContext";
import EventCard from "../components/EventCard";
import RegistrationModal from "../components/RegistrationModal";

export default function Home() {
  // 🔑 IMPORTANT: get loading from auth
  const { user, role, loading: loadingAuth } = useAuth();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [search, setSearch] = useState("");
  const [clubFilter, setClubFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // 🔒 AUTH GUARDS (MOST IMPORTANT FIX)
  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!user) {
    window.location.href = "/login";
    return null;
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true });

    setEvents(data || []);
    setLoading(false);
  };

  const filteredEvents = events.filter((e) => {
    const matchesSearch = e.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesClub = e.club_name
      ?.toLowerCase()
      .includes(clubFilter.toLowerCase());

    const matchesDate = dateFilter ? e.date === dateFilter : true;

    return matchesSearch && matchesClub && matchesDate;
  });

  const getDateOnly = (date) =>
    new Date(date).toISOString().split("T")[0];

  const today = getDateOnly(new Date());
  const tomorrow = getDateOnly(
    new Date(new Date().setDate(new Date().getDate() + 1))
  );

  const todayEvents = filteredEvents.filter(
    (e) => getDateOnly(e.date) === today
  );

  const tomorrowEvents = filteredEvents.filter(
    (e) => getDateOnly(e.date) === tomorrow
  );

  const upcomingEvents = filteredEvents.filter(
    (e) => getDateOnly(e.date) > tomorrow
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const handleCreate = () => {
    window.location.href = "/create";
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this event?");
    if (!ok) return;

    await supabase.from("events").delete().eq("id", id);
    setEvents(events.filter((e) => e.id !== id));
  };

  const handleRegisterClick = (event) => {
    setSelectedEvent(event);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading events...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-7xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 md:p-10 text-white">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Campus Events</h1>

          <div className="flex gap-3">
            <button
              onClick={() => (window.location.href = "/past-events")}
              className="px-5 py-2 rounded-full bg-white text-black font-bold shadow-lg hover:bg-gray-100 transition"
            >
              Past Events
            </button>

            {role === "club" && (
              <button
                onClick={handleCreate}
                className="px-5 py-2 rounded-full bg-white text-black font-bold shadow-lg hover:bg-gray-100 transition"
              >
                Create Event
              </button>
            )}

            <button
              onClick={handleLogout}
              className="px-5 py-2 rounded-full bg-white text-black font-bold shadow-lg hover:bg-gray-100 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="flex flex-wrap gap-4 mb-10">
          <input
            type="text"
            placeholder="Search events"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[220px] px-4 py-2 rounded-full bg-white text-black outline-none"
          />

          <input
            type="text"
            placeholder="Filter by club"
            value={clubFilter}
            onChange={(e) => setClubFilter(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2 rounded-full bg-white text-black outline-none"
          />

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 rounded-full bg-white text-black outline-none"
          />
        </div>

        {/* EVENTS SECTIONS (UNCHANGED) */}
        <div className="grid gap-8">
          {[
            { title: "Today", data: todayEvents },
            { title: "Tomorrow", data: tomorrowEvents },
            { title: "Upcoming", data: upcomingEvents },
          ].map((section) => (
            <section key={section.title}>
              <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
              {section.data.length === 0 ? (
                <div className="text-white/80 font-bold text-xl py-10">
                  No events available
                </div>
              ) : (
                <div className="grid gap-8 lg:grid-cols-2">
                  {section.data.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      role={role}
                      user={user}
                      onDelete={handleDelete}
                      onRegister={handleRegisterClick}
                    />
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </div>

      {/* REGISTRATION MODAL */}
      {selectedEvent && (
        <RegistrationModal
          event={selectedEvent}
          user={user}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}
