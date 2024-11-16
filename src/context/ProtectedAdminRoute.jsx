// components/ProtectedAdminRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "./AdminPortalAuthContext";

const ProtectedAdminRoute = ({ children }) => {
  const { isAdminAuthenticated } = useAdminAuth();

  return isAdminAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedAdminRoute;
