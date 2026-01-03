import React from "react";
import heroImage from "../assets/landing.jpg";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/login";
  };

  const handleReg = () => {
    window.location.href = "/register";
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center p-5 font-sans">
      {/* Main Glass Container */}
      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <header className="flex justify-between items-center px-6 py-5 md:px-10 md:py-6 border-b border-white/20">
          <div className="text-white text-2xl font-bold">Campus Connect</div>

          <div className="flex gap-3">
            <button
              onClick={handleReg}
              className="px-6 py-2 rounded-full bg-white text-black font-bold shadow-lg hover:bg-gray-100 transition"
            >
              Register
            </button>
            <button
              onClick={handleLogin}
              className="px-6 py-2 rounded-full bg-white text-black font-bold shadow-lg hover:bg-gray-100 transition"
            >
              Login
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-col md:flex-row p-8 md:p-14 gap-12 items-center">
          {/* Text Section */}
          <div className="flex-1 w-full text-center md:text-left">
            <h1 className="text-white text-4xl md:text-5xl font-bold mb-6 leading-tight">
              All Campus Events.
              <br />
              One Place.
            </h1>

            <p className="text-white/80 text-lg mb-6">
              Discover upcoming college events, workshops, and activities. Clubs
              can post events easily, students never miss out.
            </p>

            <ul className="space-y-2 text-white/80 text-base">
              <li>• Clubs create and manage events</li>
              <li>• Students explore and register</li>
              <li>• AI-powered event descriptions</li>
            </ul>
          </div>

          <div
            className="flex-1 w-full min-h-[300px] rounded-2xl overflow-hidden border border-white/20"
            style={{
              backgroundImage: `url(${heroImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Dark overlay for readability */}
            <div className="w-full h-full bg-black/40"></div>
          </div>
        </main>
      </div>
    </div>
  );
}
