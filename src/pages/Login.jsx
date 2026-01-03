import { useState } from "react";
import { supabase } from "../supabase/client";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      window.location.href = "/home";
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center p-5">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">
        <h2 className="text-white text-3xl font-bold text-center mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <label className="text-white/70 text-ml ml-2 font-medium">Email Address</label>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-4 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-white/30 transition-all"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="text-white/70 text-ml ml-2 font-medium">Password</label>
          <input
            type="password"
            placeholder="Password"
           className="w-full p-4 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-white/30 transition-all"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-white text-black font-bold shadow-lg hover:bg-gray-100 hover:-translate-y-0.5 transition-all duration-300"
          >
            LOGIN
          </button>
        </form>

        <p className="text-white text-center mt-6 text-sm">
          Don’t have an account?{" "}
          <span
            onClick={() => (window.location.href = "/register")}
            className="underline cursor-pointer font-semibold"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
