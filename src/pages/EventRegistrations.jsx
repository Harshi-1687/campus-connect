import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase/client";
import { useAuth } from "../context/AuthContext";

export default function EventRegistrations() {
  const { id } = useParams();
  const { role } = useAuth();

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role !== "club") {
      window.location.href = "/home";
      return;
    }
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    const { data, error } = await supabase
      .from("registrations")
      .select("student_name, roll_no, year, created_at")
      .eq("event_id", id)
      .order("created_at", { ascending: true });

    if (!error) setRegistrations(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading registrations...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] p-8">
      <div className="max-w-5xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-6">
          Registered Students
        </h2>

        {registrations.length === 0 ? (
          <p className="text-white/70">
            No registrations yet.
          </p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left border-b border-white/30">
                <th className="py-3">Name</th>
                <th>Roll No</th>
                <th>Year</th>
                <th>Registered At</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((r, i) => (
                <tr
                  key={i}
                  className="border-b border-white/10"
                >
                  <td className="py-3">{r.student_name}</td>
                  <td>{r.roll_no}</td>
                  <td>{r.year}</td>
                  <td>
                    {new Date(r.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button
          onClick={() => window.history.back()}
          className="mt-6 px-6 py-3 rounded-full bg-white text-black font-bold shadow-lg hover:bg-gray-100 transition"
        >
          Back
        </button>
      </div>
    </div>
  );
}
