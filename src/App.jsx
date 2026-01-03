import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";
import PastEvents from "./pages/PastEvents";
import EventRegistrations from "./pages/EventRegistrations";
import { AuthProvider, useAuth } from "./context/AuthContext";

function ProtectedRoute({ children, allowedRoles }) {
  const { user, role, loading } = useAuth();

  // ⏳ Wait until auth is checked
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Checking authentication...
      </div>
    );
  }

  // 🚫 Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 Role not allowed
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/past-events" element={<PastEvents />} />

          {/* Protected pages */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create"
            element={
              <ProtectedRoute allowedRoles={["club"]}>
                <CreateEvent />
              </ProtectedRoute>
            }
          />

          <Route
            path="/event/:id/registrations"
            element={
              <ProtectedRoute allowedRoles={["club"]}>
                <EventRegistrations />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute allowedRoles={["club"]}>
                <EditEvent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
