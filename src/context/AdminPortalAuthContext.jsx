// context/AdminPortalAuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import supabase from "../services/supabase";

const AdminPortalAuthContext = createContext();

export const AdminPortalAuthProvider = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    const checkAdminSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAdminAuthenticated(!!session); // Admin is authenticated if a session exists
    };

    checkAdminSession();

    const { data: subscription } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAdminAuthenticated(!!session);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <AdminPortalAuthContext.Provider value={{ isAdminAuthenticated, setIsAdminAuthenticated }}>
      {children}
    </AdminPortalAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminPortalAuthContext);
