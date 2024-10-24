import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getdetailedmenu } from '../services/supported_api';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const MenuListDashboard = () => {
  const location = useLocation();
  const loc_id = location.state?.loc_id;

  const [menuData, setMenuData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getdetailedmenu(loc_id);
        console.log(result);
        setMenuData(result);
      } catch (error) {
        console.error('Error loading menus', error);
      }
    };

    fetchData();
  }, [loc_id]);

  const menuTabs = ['All Menu', ...new Set(menuData.map((item) => item.inmenu))];  // Add "All Menu" tab for menus
  const [selectedMenu, setSelectedMenu] = useState('All Menu');  // Default to "All Menu" tab
  const [selectedCategory, setSelectedCategory] = useState('All Menu');  // Default to "All Menu" category
  const navigate = useNavigate();

  const categories = selectedMenu !== 'All Categories'
    ? ['All Categories', ...new Set(menuData.filter((item) => item.inmenu === selectedMenu).map((item) => item.incategory))]  // Add "All Menu" to categories
    : ['All Categories', ...new Set(menuData.map((item) => item.incategory))];  // Show all categories in "All Menu" menu tab

  useEffect(() => {
    if (categories.length > 0) {
      setSelectedCategory('All Categories');  // Default to "All Menu" category
    }
  }, [selectedMenu]);

  const menuItems = selectedMenu === 'All Menu'
    ? selectedCategory === 'All Categories'
      ? menuData  // Show all items if both "All Menu" menu and "All Menu" category are selected
      : menuData.filter((item) => item.incategory === selectedCategory)
    : selectedCategory === 'All Categories'
    ? menuData.filter((item) => item.inmenu === selectedMenu)
    : menuData.filter((item) => item.inmenu === selectedMenu && item.incategory === selectedCategory);

  const handleAddMenuClick = () => {
    navigate(`/additem/${loc_id}`);
  };

  const handleEditItem = (item) => {
    console.log('Edit item:', item);
    // Add your edit functionality here
  };

  const handleDeleteItem = (item) => {
    console.log('Delete item:', item);
    // Add your delete functionality here
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-md shadow-lg w-4/5 h-[80vh] max-h-[80vh] overflow-hidden">
        
        {/* Add Menu Button */}
        <div className="flex justify-between mb-8">
  <button
    className="w-20 h-20 bg-opacity-50 bg-gray-700 text-black font-semibold rounded-lg shadow-md hover:bg-opacity-100 hover:shadow-lg transition-all duration-300 ease-in-out flex flex-col justify-center items-center relative group"
    onClick={handleAddMenuClick}
  >
    <span className="text-3xl">+</span>
    <span className="text-xs absolute bottom-2">
      Add Menu
    </span>
  </button>
</div>
        {/* Menu Tabs */}
        <div className="flex space-x-4 mb-8 justify-center">
          {menuTabs.map((menu, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-full transition-all duration-300 ease-in-out ${
                selectedMenu === menu ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
              } hover:bg-blue-400 hover:text-white`}
              onClick={() => setSelectedMenu(menu)}
            >
              {menu}
            </button>
          ))}
        </div>

        {/* Category List */}
        {selectedMenu && (
          <div className="flex justify-center h-[calc(100%-2rem)]">
            <div className="w-1/6 overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4 text-center">Categories</h3>
              <ul>
                {categories.map((category, index) => (
                  <li
                    key={index}
                    className={`cursor-pointer mb-2 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out ${
                      selectedCategory === category
                        ? 'bg-blue-100 text-blue-600 font-bold shadow-md'
                        : 'bg-gray-200 text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </li>
                ))}
              </ul>
            </div>

            {/* Menu Items */}
            <div className="w-3/4 ml-12 overflow-y-auto h-full">
              <h3 className="text-lg font-semibold mb-4">Menu Items</h3>
              {menuItems.length > 0 ? (
                <ul>
                  {menuItems.map((item, index) => (
                    <li
                      key={index}
                      className="mb-6 flex items-center p-4 bg-white rounded-md shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out"
                    >
                      <img src={item.image} alt={item.name} className="w-20 h-20 rounded-md mr-4 object-cover" />
                      <div className="flex-grow">
                        <h4 className="font-bold text-gray-800">{item.name}</h4>
                        <p className="text-gray-600">{item.description}</p>
                        <p className="text-sm text-gray-500">${item.price}</p>
                      </div>

                      {/* Edit and Delete Icons */}
                      <div className="flex items-center space-x-2">
                        <FaEdit
                          className="text-gray-500 hover:text-blue-500 cursor-pointer"
                          onClick={() => handleEditItem(item)}
                        />
                        <FaTrashAlt
                          className="text-gray-500 hover:text-red-500 cursor-pointer"
                          onClick={() => handleDeleteItem(item)}
                        />
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
      </div>
    </div>
  );
};

export default MenuListDashboard;
