import { supabase } from "../supabase/client";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function SelectRole() {
  const { user } = useAuth();

  const saveRole = async (role) => {
    const { error } = await supabase.from("users").insert([
      {
        uid: user.uid,
        role,
        club_name: role === "club" ? "My Club" : null,
      },
    ]);

    if (error) {
      toast.error(error.message);
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-bold">Select your role</h2>

      <button
        onClick={() => saveRole("club")}
        className="px-6 py-3 bg-blue-600 text-white rounded"
      >
        I am a Club
      </button>

      <button
        onClick={() => saveRole("student")}
        className="px-6 py-3 bg-green-600 text-white rounded"
      >
        I am a Student
      </button>
    </div>
  );
}
