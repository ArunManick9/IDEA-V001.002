import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getdetailedmenu, updateMenuItem } from "../services/supported_api"; // Import the API function
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import EditMenuItemModal from "./EditMenuItems";
import "../scss/MenuListDashboard.scss";
import LogoutButton from "./LogoutButton";

const MenuListDashboard = () => {
	const location = useLocation();
	const loc_id = location.state?.loc_id;

	const [menuData, setMenuData] = useState([]);
	const [showEditModal, setShowEditModal] = useState(false);
	const [selectedMenuItem, setSelectedMenuItem] = useState(null);
	const navigate = useNavigate();

	// Retrieve the access token from localStorage (or location state as fallback)
	const access_token =
		location.state?.access_token || localStorage.getItem("access_token");
	const user_id = location.state?.user_id || localStorage.getItem("user_id");

	// Ensure the token is set
	if (!access_token || !user_id) {
		navigate("/"); // Redirect to login if no token/user_id is found
	}

	useEffect(() => {
		const fetchData = async () => {
			try {
				const result = await getdetailedmenu(loc_id);
				console.log(result);
				setMenuData(result);
			} catch (error) {
				console.error("Error loading menus", error);
			}
		};

		fetchData();
	}, [loc_id]);

	const menuTabs = [
		"All Menu",
		...new Set(menuData.map((item) => item.inmenu)),
	];
	const [selectedMenu, setSelectedMenu] = useState("All Menu");
	const [selectedCategory, setSelectedCategory] = useState("All Categories");

	const categories =
		selectedMenu !== "All Menu"
			? [
					"All Categories",
					...new Set(
						menuData
							.filter((item) => item.inmenu === selectedMenu)
							.map((item) => item.incategory)
					),
			  ]
			: ["All Categories", ...new Set(menuData.map((item) => item.incategory))];

	useEffect(() => {
		if (categories.length > 0) {
			setSelectedCategory("All Categories");
		}
	}, [selectedMenu]);

	const menuItems =
		selectedMenu === "All Menu"
			? selectedCategory === "All Categories"
				? menuData
				: menuData.filter((item) => item.incategory === selectedCategory)
			: selectedCategory === "All Categories"
			? menuData.filter((item) => item.inmenu === selectedMenu)
			: menuData.filter(
					(item) =>
						item.inmenu === selectedMenu && item.incategory === selectedCategory
			  );

	const handleAddMenuClick = () => {
		navigate(`/additem/${loc_id}`);
	};

	const handleEditItem = (item) => {
		setSelectedMenuItem(item); // Set the selected item for editing
		setShowEditModal(true); // Open the modal
	};

	const handleSaveChanges = async (updatedMenuItem) => {
		const { id, ...updatedFields } = updatedMenuItem; // Separate ID from updated fields
		const response = await updateMenuItem(id, updatedFields);

		if (response.success) {
			console.log("Menu item updated successfully:", response.data);

			// Update local state to reflect changes
			setMenuData((prevData) =>
				prevData.map((item) =>
					item.id === id ? { ...item, ...updatedFields } : item
				)
			);
		} else {
			console.error("Failed to update menu item:", response.error);
		}

		setShowEditModal(false); // Close the modal
	};

	return (
		<div className="flexbox justify-center items-center min-h-screen menuboard-outer">
			<div className="logout-wrapper">
				<LogoutButton />
			</div>
			<div className="p-6 w-4/5 h-[80vh] max-h-[80vh] overflow-hidden menuboard">
				<div className="flexbox justify-between mb-8">
					<button
						className="menuboard-btn menuboard-btn--add"
						onClick={handleAddMenuClick}
					>
						<FontAwesomeIcon icon={faSquarePlus} /> Add Menu
					</button>
					<button
		className="menuboard-btn menuboard-btn--enhance"
		onClick={() => navigate(`${loc_id}/enhancemenu`)}
	>
		Enhance Menu
	</button>
				</div>

				<div className="flexbox space-x-4 mb-8 justify-center">
					{menuTabs.map((menu, index) => (
						<button
							key={index}
							className={`px-4 py-2 rounded-full menu-filter ${
								selectedMenu === menu
									? "bg-mikado fg-yale  shadow-md"
									: "bg-gray-1 text-gray-700"
							}`}
							onClick={() => setSelectedMenu(menu)}
						>
							{menu}
						</button>
					))}
				</div>

				{selectedMenu && (
					<div className="flexbox justify-center h-full">
						<div className="w-1/6 ">
							<h3 className="text-lg font-semibold text-center">Categories</h3>
							<ul className="h-[calc(100%-2rem)] overflow-y-auto">
								{categories.map((category, index) => (
									<li
										key={index}
										className={`category ${
											selectedCategory === category
												? "bg-mikado fg-yale font-bold shadow-md"
												: "bg-gray-1 text-gray-700"
										}`}
										onClick={() => setSelectedCategory(category)}
									>
										{category}
									</li>
								))}
							</ul>
						</div>

						<div className="w-3/4 ml-12  h-full">
							<h3 className="text-lg font-semibold">Menu Items</h3>
							{menuItems.length > 0 ? (
								<ul className="overflow-y-auto h-full">
									{menuItems.map((item, index) => (
										<li
											key={index}
											className="mb-6 flexbox items-center p-4 bg-gray-1 rounded-md shadow-md hover:shadow-lg transition-shadow duration-200 ease"
										>
											<img
												src={item.image}
												alt={item.name}
												className="w-20 h-20 rounded-md mr-4 object-cover"
											/>
											<div className="flex-grow">
												<h4 className="font-bold text-gray-800">{item.name}</h4>
												<p className="text-gray-600">{item.description}</p>
												<p className="text-sm text-gray-500">${item.price}</p>
											</div>
											<div className="flexbox items-center space-x-2">
												<FaEdit
													className="text-gray-500 hover:text-blue-500 cursor-pointer"
													onClick={() => handleEditItem(item)}
												/>
												<FaTrashAlt className="text-gray-500 hover:text-red-500 cursor-pointer" />
											</div>
										</li>
									))}
								</ul>
							) : (
								<p className="text-center text-gray-500">No items found here</p>
							)}
						</div>
					</div>
				)}

				{showEditModal && (
					<EditMenuItemModal
						menuItem={selectedMenuItem}
						onClose={() => setShowEditModal(false)}
						onSave={handleSaveChanges}
					/>
				)}
			</div>
		</div>
	);
};

export default MenuListDashboard;
