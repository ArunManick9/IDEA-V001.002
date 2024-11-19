// components/LogoutButton.jsx
import React from "react";
import supabase from "../services/supabase";
import { useAdminAuth } from "../context/AdminPortalAuthContext";
import "../scss/LogoutButton.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserSlash } from "@fortawesome/free-solid-svg-icons";

const LogoutButton = () => {
	const { setIsAdminAuthenticated } = useAdminAuth();

	const handleLogout = async () => {
		const { error } = await supabase.auth.signOut();
		if (!error) setIsAdminAuthenticated(false);
	};

	return (
		<button onClick={handleLogout} className="logout-button">
			<FontAwesomeIcon icon={faUserSlash} />
			Logout
		</button>
	);
};

export default LogoutButton;
