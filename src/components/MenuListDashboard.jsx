import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getdetailedmenu, updateMenuItem } from "../services/supported_api"; // Import the API function
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import EditMenuItemModal from "./EditMenuItems";

const MenuListDashboard = () => {
  const location = useLocation();
  const loc_id = location.state?.loc_id;

  const [menuData, setMenuData] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const navigate = useNavigate();

  // Retrieve the access token from localStorage (or location state as fallback)
  const access_token = location.state?.access_token || localStorage.getItem("access_token");
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

  const menuTabs = ["All Menu", ...new Set(menuData.map((item) => item.inmenu))];
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-md shadow-lg w-4/5 h-[80vh] max-h-[80vh] overflow-hidden">
        <div className="flex justify-between mb-8">
          <button
            className="w-20 h-20 bg-opacity-50 bg-gray-700 text-black font-semibold rounded-lg shadow-md hover:bg-opacity-100 hover:shadow-lg transition-all duration-300 ease-in-out flex flex-col justify-center items-center relative group"
            onClick={handleAddMenuClick}
          >
            <span className="text-3xl">+</span>
            <span className="text-xs absolute bottom-2">Add Menu</span>
          </button>
        </div>

        <div className="flex space-x-4 mb-8 justify-center">
          {menuTabs.map((menu, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-full transition-all duration-300 ease-in-out ${
                selectedMenu === menu
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-700"
              } hover:bg-blue-400 hover:text-white`}
              onClick={() => setSelectedMenu(menu)}
            >
              {menu}
            </button>
          ))}
        </div>

        {selectedMenu && (
          <div className="flex justify-center h-[calc(100%-2rem)]">
            <div className="w-1/6 overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4 text-center">
                Categories
              </h3>
              <ul>
                {categories.map((category, index) => (
                  <li
                    key={index}
                    className={`cursor-pointer mb-2 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out ${
                      selectedCategory === category
                        ? "bg-blue-100 text-blue-600 font-bold shadow-md"
                        : "bg-gray-200 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-3/4 ml-12 overflow-y-auto h-full">
              <h3 className="text-lg font-semibold mb-4">Menu Items</h3>
              {menuItems.length > 0 ? (
                <ul>
                  {menuItems.map((item, index) => (
                    <li
                      key={index}
                      className="mb-6 flex items-center p-4 bg-white rounded-md shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out"
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
                      <div className="flex items-center space-x-2">
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
