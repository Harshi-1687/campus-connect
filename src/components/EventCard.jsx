import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";

export default function EventCard({ event, role, user, onDelete, onRegister }) {
  const [expanded, setExpanded] = useState(false);
  const isOwner = role === "club" && event.created_by === user.id;
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetchCount();
  }, []);

  const shortDescription = (text, words = 6) => {
    if (!text) return "";
    return text.split(" ").slice(0, words).join(" ") + "...";
  };

  const fetchCount = async () => {
    const { count } = await supabase
      .from("registrations")
      .select("*", { count: "exact", head: true })
      .eq("event_id", event.id);

    setCount(count || 0);
  };

  const isFull = event.max_registrations && count >= event.max_registrations;

  const actionBtn =
    "flex-1 bg-white text-black py-2 rounded-full font-bold shadow hover:bg-gray-100 transition";

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="relative p-8 rounded-[2rem] bg-white/20 backdrop-blur-lg border border-white/30 shadow-xl text-white"
    >
      {/* LIMIT BADGE */}
      {event.max_registrations && (
        <div className="absolute top-4 right-4 bg-white text-black text-xs font-bold px-3 py-1 rounded-full">
          {count}/{event.max_registrations}
        </div>
      )}

      <h2 className="text-3xl font-bold mb-4">{event.title}</h2>

      <div className="text-sm text-white/80 space-y-1">
        <div>📅 {event.date}</div>
        <div>⏰ {event.time}</div>
        <div>📍 {event.venue}</div>
      </div>

      <div className="mt-4 text-sm text-white/80">
        {expanded ? event.description : shortDescription(event.description)}
      </div>

      <p className="mt-2 text-xs text-white/60 italic">
        {expanded ? "Click to collapse" : "Click to read more"}
      </p>

      <div className="mt-6">
        {/* STUDENT */}
        {role === "student" && (
          <button
            disabled={isFull}
            onClick={() => onRegister(event)}
            className={`w-full py-3 rounded-full font-bold ${
              isFull
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            {isFull ? "Registrations Full" : "Register Now"}
          </button>
        )}

        {/* CLUB OWNER */}
        {isOwner && (
          <div className="flex gap-3 mt-4 flex-wrap">
            <button
              onClick={() => (window.location.href = `/edit/${event.id}`)}
              className={actionBtn}
            >
              Edit
            </button>

            <button
              onClick={() =>
                (window.location.href = `/event/${event.id}/registrations`)
              }
              className={actionBtn}
            >
              Participants
            </button>

            <button onClick={() => onDelete(event.id)} className={actionBtn}>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
