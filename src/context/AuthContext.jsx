import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkUser();
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.id) {
      setUser(null);
      setRole(null);
      setLoading(false);
      return;
    }

    setUser(user);

    const { data, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle(); // 👈 IMPORTANT CHANGE


    if (!error && data) {
      setRole(data.role);
    } else {
      setRole(null);
    }

    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
