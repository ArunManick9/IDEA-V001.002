// components/LogoutButton.jsx
import React from "react";
import { supabase } from "../services/supabaseClient";
import { useAdminAuth } from "../context/AdminPortalAuthContext";

const LogoutButton = () => {
  const { setIsAdminAuthenticated } = useAdminAuth();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) setIsAdminAuthenticated(false);
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
