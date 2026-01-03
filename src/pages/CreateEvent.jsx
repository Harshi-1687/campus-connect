import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { useAuth } from "../context/AuthContext";
import { improveDescription } from "../utils/gemini";
import toast from "react-hot-toast";

export default function CreateEvent() {
  const { user } = useAuth();
  const [aiUpdated, setAiUpdated] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [loadingClub, setLoadingClub] = useState(true);

  const [form, setForm] = useState({
    title: "",
    club_name: "",
    date: "",
    time: "",
    venue: "",
    description: "",
    max_registrations: "",
  });

  useEffect(() => {
    if (user) fetchClubName();
  }, [user]);

  const fetchClubName = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("club_name")
      .eq("id", user.id)
      .single();

    if (!error && data?.club_name) {
      setForm((prev) => ({
        ...prev,
        club_name: data.club_name,
      }));
    }

    setLoadingClub(false);
  };

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      created_by: user.id,
      max_registrations:
        form.max_registrations === ""
          ? null
          : Number(form.max_registrations),
    };

    const { error } = await supabase.from("events").insert([payload]);

    if (!error) {
      window.location.href = "/home";
    } else {
      toast.error(error.message);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center px-6">
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-xl rounded-3xl p-8 text-white shadow-2xl">
        {/* Back */}
        <button
          onClick={() => (window.location.href = "/home")}
          className="text-black/80 font-semibold mb-6 "
        >
          ← Back to Home
        </button>

        <h2 className="text-3xl font-bold mb-6 text-center">
          Create Event
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* TITLE */}
          <input
            name="title"
            placeholder="EVENT TITLE"
            required
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-white/20 text-white outline-none"
          />

          {/* CLUB NAME (AUTO + LOCKED) */}
          <input
            value={loadingClub ? "Loading club..." : form.club_name}
            disabled
            className="w-full p-3 rounded-xl bg-white/30 text-white opacity-80 cursor-not-allowed"
          />

          {/* VENUE */}
          <input
            name="venue"
            placeholder="VENUE"
            required
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-white/20 text-white outline-none"
          />

          {/* DATE */}
          <input
            type="date"
            name="date"
            required
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-white/20 text-white outline-none"
          />

          {/* TIME */}
          <input
            type="text"
            name="time"
            placeholder="04:00 PM – 06:00 PM"
            required
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-white/20 text-white outline-none"
          />

          {/* MAX REGISTRATIONS */}
          <input
            type="number"
            name="max_registrations"
            placeholder="Max registrations (optional)"
            min="1"
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-white/20 text-white outline-none"
          />

          {/* DESCRIPTION */}
          <textarea
            name="description"
            placeholder="Event Description"
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
                } else {
                  toast.error("AI did not return valid text.");
                }
              } catch (err) {
                console.error(err);
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
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
}
