
import supabase from "../../services/supabase";
import { useAdminAuth } from "../../context/AdminPortalAuthContext";
import "../../scss/LogoutButton.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
	const navigate = useNavigate()
	const { setIsAdminAuthenticated } = useAdminAuth();

	const handleLogout = async () => {
		try {
			const { error } = await supabase.auth.signOut();
			if (error) {
				console.error("Logout error:", error);
				return;
			}
			// Clear tokens from localStorage
			localStorage.removeItem("access_token");
			localStorage.removeItem("user_id");
			
			// Update app state
			setIsAdminAuthenticated(false);
	
			// Navigate to login page
			navigate("/");
		} catch (err) {
			console.error("Unexpected logout error:", err);
		}
	};
	return (
		<button onClick={handleLogout} className="logout-button">
			<FontAwesomeIcon icon={faUserSlash} />
			Logout
		</button>
	);
};

export default LogoutButton;
