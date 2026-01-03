import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import EventCard from "../components/EventCard";
import { useAuth } from "../context/AuthContext";

const getDateOnly = (date) =>
  new Date(date).toISOString().split("T")[0];

export default function PastEvents() {
  const { user, role } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPastEvents();
  }, []);

  const fetchPastEvents = async () => {
    const today = getDateOnly(new Date());

    const { data } = await supabase
      .from("events")
      .select("*")
      .lt("date", today)
      .order("date", { ascending: false });

    setEvents(data || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading past events...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] px-6 py-10">
      <div className="max-w-7xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 text-white">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Past Events</h1>
          <button
            onClick={() => window.location.href = "/home"}
            className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition"
          >
            ← Back to Home
          </button>
        </div>

        {events.length === 0 ? (
          <p className="text-white/70 text-center py-20">
            No past events available.
          </p>
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                role={role}
                user={user}
                past
              />
            ))}
          </div>
        )}

        {/* Placeholder for future ratings */}
        <p className="text-white/50 text-sm text-center mt-10 italic">
          ⭐ Ratings & feedback coming soon
        </p>
      </div>
    </div>
  );
}
