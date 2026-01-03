import { useState } from "react";
import { supabase } from "../supabase/client";
import toast from "react-hot-toast";

export default function RegistrationModal({ event, user, onClose }) {
  const [form, setForm] = useState({
    name: "",
    roll: "",
    year: "",
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from("registrations").insert([
      {
        event_id: event.id,
        user_id: user.id,
        student_name: form.name,
        roll_no: form.roll.trim().toUpperCase(),
        year: form.year,
      },
    ]);

    if (error) {
      // 🔥 THIS IS THE KEY PART
      if (error.code === "23505") {
        toast.error("This roll number is already registered for this event.");
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success("Registered successfully!");
      setSuccess(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-gradient-to-br from-[#667eea] to-[#764ba2] w-full max-w-xl rounded-3xl p-8 relative">
        {/* Back */}
        <button onClick={onClose} className="text-indigo-600 font-bold mb-6">
          ← Back to Events
        </button>

        {!success ? (
          <>
            <h2 className="text-3xl font-black mb-2">Event Registration</h2>

            <p className="text-gray font-bold mb-6 italic">
              Registering for: {event.title}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                placeholder="Full Name"
                required
                onChange={handleChange}
                className="w-full p-4 bg-slate-50 border rounded-2xl"
              />

              <input
                name="roll"
                placeholder="Roll Number"
                required
                onChange={handleChange}
                className="w-full p-4 bg-slate-50 border rounded-2xl"
              />

              <select
                name="year"
                required
                onChange={handleChange}
                className="w-full p-4 bg-slate-50 border rounded-2xl"
              >
                <option value="">Year of Study</option>
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
              </select>

              <button className="w-full bg-indigo-900 text-black font-bold py-4 rounded-2xl">
                Confirm Registration
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
              ✓
            </div>
            <h2 className="text-3xl font-bold text-white  mb-2">
              Successfully Registered!
            </h2>
            <p className="text-white mb-8">
              You are registered for this event.
            </p>
            <button
              onClick={onClose}
              className="bg-slate-900 text-black px-8 py-3 rounded-xl font-bold"
            >
              Return to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
