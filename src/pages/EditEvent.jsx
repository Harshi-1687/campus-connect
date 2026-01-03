import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { improveDescription } from "../utils/gemini";
import toast from "react-hot-toast";


export default function EditEvent() {
  const { id } = useParams();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiUpdated, setAiUpdated] = useState(false);

  const [form, setForm] = useState({
    title: "",
    club_name: "",
    date: "",
    time: "",
    venue: "",
    description: "",
    max_registrations: "",
  });

  /* ---------------- FETCH EVENT ---------------- */
  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      toast.error("Event not found");
      window.location.href = "/home";
      return;
    }

    // Safety: only owner can edit
    if (data.created_by !== user.id) {
      toast.error("You are not allowed to edit this event");
      window.location.href = "/home";
      return;
    }

    setForm({
      title: data.title,
      club_name: data.club_name,
      date: data.date,
      time: data.time,
      venue: data.venue,
      description: data.description,
      max_registrations: data.max_registrations || "",
    });

    setLoading(false);
  };

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      date: form.date,
      time: form.time,
      venue: form.venue,
      description: form.description,
      max_registrations:
        form.max_registrations === ""
          ? null
          : Number(form.max_registrations),
    };

    const { error } = await supabase
      .from("events")
      .update(payload)
      .eq("id", id);

    if (!error) {
      window.location.href = "/home";
    } else {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading event...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center px-6">
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-xl rounded-3xl p-8 text-white shadow-2xl">
        {/* Back */}
        <button
          onClick={() => (window.location.href = "/home")}
          className="text-white/80 font-semibold mb-6 hover:text-white"
        >
          ← Back to Home
        </button>

        <h2 className="text-3xl font-bold mb-6 text-center">
          Edit Event
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* TITLE */}
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl bg-white/20 text-white outline-none"
          />

          {/* CLUB NAME (LOCKED) */}
          <input
            value={form.club_name}
            disabled
            className="w-full p-3 rounded-xl bg-white/30 text-white opacity-80 cursor-not-allowed"
          />

          {/* VENUE */}
          <input
            name="venue"
            value={form.venue}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl bg-white/20 text-white outline-none"
          />

          {/* DATE */}
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl bg-white/20 text-white outline-none"
          />

          {/* TIME */}
          <input
            type="text"
            name="time"
            value={form.time}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl bg-white/20 text-white outline-none"
          />

          {/* MAX REGISTRATIONS */}
          <input
            type="number"
            name="max_registrations"
            value={form.max_registrations}
            min="1"
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-white/20 text-white outline-none"
          />

          {/* DESCRIPTION */}
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-white/20 text-white outline-none"
          />

          {/* AI BUTTON */}
          <button
            type="button"
            disabled={aiLoading}
            onClick={async () => {
              if (!form.description.trim()) {
                toast.error("Please write a description first.");
                return;
              }

              try {
                setAiLoading(true);

                const improved = await improveDescription({
                  title: form.title,
                  club: form.club_name,
                  venue: form.venue,
                  time: form.time,
                  description: form.description,
                });

                if (improved?.trim()) {
                  setForm((prev) => ({
                    ...prev,
                    description: improved,
                  }));
                  setAiUpdated(true);
                  setTimeout(() => setAiUpdated(false), 3000);
                }
              } catch (err) {
                toast.error("AI improvement failed.");
              } finally {
                setAiLoading(false);
              }
            }}
            className="text-sm text-black/80"
          >
            {aiLoading ? "✨ Improving..." : "✨ Improve Description with AI"}
          </button>

          {aiUpdated && (
            <div className="text-sm text-green-300 font-semibold">
              ✅ Description improved using AI
            </div>
          )}

          {/* SUBMIT */}
          <button className="w-full bg-white text-black py-3 rounded-full font-bold">
            Update Event
          </button>
        </form>
      </div>
    </div>
  );
}
