import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CategoryList from "./CategoryList";
import { editmenulist, loadlocation } from "../../services/supported_api";
import { useLocations } from "../../context/LocationContext.jsx";
import Loading from "./Loading";
import LogoutButton from "./LogoutButton";
import "../../scss/MenuList.scss";

const MenuList = () => {
	const { loc_id } = useParams(); // Get loc_id from the URL
	const [menus, setMenus] = useState([]);
	const [showSaveButton, setShowSaveButton] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [menuToDelete, setMenuToDelete] = useState(null);
	const [showAddModal, setShowAddModal] = useState(false);
	const [newMenu, setNewMenu] = useState("");
	const [selectedMenu, setSelectedMenu] = useState(null);
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true); // New loading state
	const { activeTheme } = useLocations();

	const navigate = useNavigate();
	// Retrieve the access token from localStorage (or location state as fallback)
	const access_token =
		location.state?.access_token || localStorage.getItem("access_token");
	const user_id = location.state?.user_id || localStorage.getItem("user_id");

	// Ensure the token is set
	if (!access_token || !user_id) {
		navigate("/"); // Redirect to login if no token/user_id is found
	}

	const handleBackClick = () => {
		navigate(-1); // Goes back to the previous page
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true); // Set loading to true before fetching data
				const result = await loadlocation(loc_id);
				setData(result);
				// Parse JSON text to object
				const parsedMenus = JSON.parse(result[0].menus); // Ensure menus is a JSON string
				setMenus(parsedMenus);
			} catch (error) {
				console.error("Error fetching location data:", error);
			} finally {
				setLoading(false); // Set loading to false after data is fetched
			}
		};

		fetchData();
	}, [loc_id]);

	useEffect(() => {
		const handleKeyPress = (e) => {
			if (e.key === "Escape") {
				setSelectedMenu(null);
			}
		};
		window.addEventListener("keydown", handleKeyPress);
		return () => {
			window.removeEventListener("keydown", handleKeyPress);
		};
	}, []);

	const handleAddMenu = () => {
		setShowAddModal(true);
	};

	const handleAddMenuConfirm = () => {
		if (newMenu) {
			setMenus([...menus, { menu_type: newMenu, categories: [] }]);
			setShowSaveButton(true);
			setNewMenu("");
		}
		setShowAddModal(false);
	};

	const handleDeleteClick = (index) => {
		setMenuToDelete(index);
		setShowDeleteModal(true);
	};

	const confirmDelete = () => {
		const updatedMenus = menus.filter((_, i) => i !== menuToDelete);
		setMenus(updatedMenus);
		setShowSaveButton(true);
		setShowDeleteModal(false);
		setMenuToDelete(null);
	};

	const handleSave = () => {
		console.log("Menus saved:", menus);
		// Convert menus object to JSON string
		editmenulist(JSON.stringify(menus), loc_id);
		setShowSaveButton(false);
	};

	const handleMenuClick = (menu) => {
		if (selectedMenu === menu) {
			setSelectedMenu(null);
		} else {
			setSelectedMenu(menu);
		}
	};

	const getCategoriesForMenu = (menuType) => {
		const menu = menus.find((m) => m.menu_type === menuType);
		return menu ? menu.categories : [];
	};

	const handleViewOrEditButtonClick = () => {
		navigate(`/${loc_id}/menuboard`);
	};

	const handleCreateQRCode = () => {
		console.log(`create qr clicked`);
		navigate(`/location/${loc_id}/createqr`);
	};

	const handleCreateAgents = () => {
		navigate(`/location/${loc_id}/createagent`);
	};

	const handleSettingsClick = () => {
		navigate(`/location/${loc_id}/locationsettings`);
	};

	if (loading) {
		return <Loading />; // Show the Loading component while data is being fetched
	}

	return (
		<div
			className={`flexbox flex-col justify-center items-center space-y-6 min-h-screen transition-all duration-300 menu-list-container theme-${activeTheme}`}
		>
			<div className="logout-wrapper">
				<LogoutButton />
			</div>
			{/* Back Button */}
			<button onClick={handleBackClick} className="btn-back">
				Back To Location
			</button>

			{/* Heading */}
			<h1 className="heading">
				Consolidated View of your Menu and Categories at{" "}
				<span className="fg-contrast">{data[0]?.name}</span>
			</h1>

			{/* Button Group: View/Edit All Menus, Create QR for Menu, Create Agent(s), and Settings */}
			<div className="flexbox space-x-4 mt-4">
				<button className="btn" onClick={handleViewOrEditButtonClick}>
					View/Edit All Menus
				</button>
				<button className="btn" onClick={handleCreateQRCode}>
					Create QR for Menu
				</button>
				<button className="btn" onClick={handleCreateAgents}>
					Create Agent(s)
				</button>
				<button className="btn btn--settings" onClick={handleSettingsClick}>
					<i className="fas fa-cog"></i> Settings
				</button>
			</div>

			{/* Menus and Categories */}
			<div className="w-full flexbox justify-center items-start space-x-6 transition-all duration-300">
				<div className="p-20px bg-gray-1 shadow-lg rounded-lg overflow-hidden relative">
					{data && (
						<>
							<div className="flexbox items-center p-6">
								<div className="flex-1">
									<h2 className="text-2xl font-medium text-gray-800 mb-2">
										{data[0].name}
									</h2>
									<p className="text-gray-600">{data[0].address}</p>
								</div>
								<img
									className="w-24 h-24 rounded-full object-cover ml-4 shadow-sm"
									src={data[0].image}
									alt={data[0].name}
								/>
							</div>

							<div className="p-6 grid grid-cols-1 gap-4">
								<h1 className="text-lg">List Of Menu</h1>
								{menus.map((menu, index) => (
									<div
										key={index}
										className="menu-item p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer justify-between items-center"
										onClick={() => handleMenuClick(menu.menu_type)}
									>
										<p className="text-gray-800 font-normal">
											{menu.menu_type}
										</p>
										<button
											className="text-red-500 hover:text-red-700"
											onClick={(e) => {
												e.stopPropagation();
												handleDeleteClick(index);
											}}
										>
											&#10005; {/* Cross icon for delete */}
										</button>
									</div>
								))}
							</div>

							{!selectedMenu && (
								<div className="p-6 flexbox justify-between">
									<button className="btn btn--add" onClick={handleAddMenu}>
										Add Menu
									</button>
									{showSaveButton && (
										<button className="btn btn--submit" onClick={handleSave}>
											Save
										</button>
									)}
								</div>
							)}
						</>
					)}

					{showDeleteModal && (
						<div className="fixed inset-0 bg-black bg-opacity-50 flexbox justify-center items-center">
							<div className="bg-white p-6 rounded-lg shadow-lg">
								<p className="mb-4">
									Are you sure you want to delete this menu item?
								</p>
								<div className="flexbox justify-end space-x-4">
									<button
										className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition"
										onClick={() => setShowDeleteModal(false)}
									>
										Cancel
									</button>
									<button
										className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
										onClick={confirmDelete}
									>
										Yes, Delete
									</button>
								</div>
							</div>
						</div>
					)}

					{showAddModal && (
						<div className="fixed inset-0 bg-black bg-opacity-50 flexbox justify-center items-center">
							<div className="bg-white p-6 rounded-lg shadow-lg add-menu-modal">
								<h2 className="text-lg font-light mb-4">Add a New Menu</h2>
								<input
									type="text"
									className="w-full p-2 border border-gray-300 rounded-lg mb-4 add-menu-modal--input"
									placeholder="Enter menu name"
									value={newMenu}
									onChange={(e) => setNewMenu(e.target.value)}
								/>
								<div className="flexbox justify-end space-x-4">
									<button
										className="btn"
										onClick={() => setShowAddModal(false)}
									>
										Cancel
									</button>
									<button
										className="btn btn--submit"
										onClick={handleAddMenuConfirm}
									>
										Add Menu
									</button>
								</div>
							</div>
						</div>
					)}
				</div>

				{selectedMenu && (
					<div className="w-1/5 bg-white shadow-lg p-6 rounded-lg">
						{" "}
						{/* Adjusted for centering and width */}
						<button
							className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
							onClick={() => setSelectedMenu(null)}
						>
							&#10005; {/* Cross icon for close */}
						</button>
						<h2 className="text-xl font-light mb-4">
							Categories for {selectedMenu}
						</h2>
						<CategoryList
							data={{ categories: getCategoriesForMenu(selectedMenu) }}
							menus={menus}
							selectedMenu={selectedMenu}
							loc_id={loc_id}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default MenuList;
