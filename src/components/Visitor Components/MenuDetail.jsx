import "../../scss/MenuDetail.scss";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchMenuItem } from "../../services/supported_api";

export default function MenuDetail() {
	const { loc_id, menu_id } = useParams();
	const [menuItem, setMenuItem] = useState({});
	useEffect(() => {
		async function extractMenuItem() {
			try {
				const response = await fetchMenuItem(menu_id, loc_id);
				setMenuItem(response);
			} catch (error) {
				console.error("Error while fetching menu item");
			}
		}
		extractMenuItem();
	}, []);

	return (
		<div className="menu-detail">
			This is the menu detail component - {menuItem.name}
		</div>
	);
}
