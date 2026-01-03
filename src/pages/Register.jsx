import { useState } from "react";
import { supabase } from "../supabase/client";
import toast from "react-hot-toast";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [clubName, setClubName] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    // 1️⃣ Create Auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    const user = data.user;

    if (!user?.id) {
      toast.error("User creation failed");
      return;
    }

    // 2️⃣ Insert into users table (CRITICAL)
    const { error: dbError } = await supabase.from("users").insert([
      {
        id: user.id, // ✅ CORRECT COLUMN
        email: user.email,
        role: role,
        club_name: role === "club" ? clubName : null,
      },
    ]);

    if (dbError) {
      console.error(dbError);
      toast.error("Failed to save user profile");
      return;
    }

    toast.success("Registration successful. Please login.");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center p-5">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">
        <h2 className="text-white text-3xl font-bold text-center mb-6">
          Register
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <label className="text-white/70 ml-2 font-medium">
            Email Address
          </label>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-xl bg-white/20 text-white outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="text-white/70 ml-2 font-medium">
            Password
          </label>
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-xl bg-white/20 text-white outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label className="text-white/70 ml-2 font-medium">Role</label>
          <select
            className="w-full p-3 rounded-xl bg-white/20 text-white outline-none"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="student" className="text-black">
              Register as Student
            </option>
            <option value="club" className="text-black">
              Register as Club
            </option>
          </select>

          {role === "club" && (
            <div className="space-y-1">
              <label className="text-white/70 text-sm ml-2 font-medium">
                Club Name
              </label>
              <input
                type="text"
                placeholder="Club Name"
                className="w-full p-3 rounded-xl bg-white/20 text-white outline-none"
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 rounded-full bg-white text-black font-bold shadow-lg hover:bg-gray-100 transition-all"
          >
            REGISTER
          </button>
        </form>

        <p className="text-white text-center mt-6 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => (window.location.href = "/login")}
            className="underline cursor-pointer font-semibold"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
