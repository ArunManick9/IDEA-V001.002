import React, { useState, useEffect } from "react";
import { getdetailedmenu } from "../services/supported_api";
import { useParams } from "react-router-dom";

const ComboBanner = () => {
  const [comboName, setComboName] = useState("");
  const [itemCount, setItemCount] = useState(0);
  const [menuData, setMenuData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const { loc_id } = useParams();
  console.log(loc_id);

  // Fetch menu data on component mount
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const data = await getdetailedmenu(loc_id);
        setMenuData(data);
      } catch (error) {
        console.error("Error fetching menu data:", error);
      }
    };

    fetchMenuData();
  }, [loc_id]);

  // Handle search logic
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    const results = menuData.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  };

  // Handle adding an item to the selected list
  const handleAddItem = (item) => {
    if (selectedItems.length < itemCount) {
      setSelectedItems([...selectedItems, item]);
    } else {
      alert(`You can only add up to ${itemCount} items.`);
    }
    setSearchQuery(""); // Reset search query
    setSearchResults([]); // Reset search results
  };

  // Handle removing an item from the selected list
  const handleRemoveItem = (index) => {
    const updatedItems = [...selectedItems];
    updatedItems.splice(index, 1);
    setSelectedItems(updatedItems);
  };

  return (
    <div className="combo-banner-container">
      <label className="enhance-container--label">Combo Name</label>
      <input
        type="text"
        value={comboName}
        onChange={(e) => setComboName(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-lg mb-4"
        placeholder="Enter combo name"
      />

      <label className="enhance-container--label">Item Count</label>
      <input
        type="number"
        value={itemCount}
        onChange={(e) => setItemCount(Number(e.target.value))}
        className="w-full p-2 border border-gray-300 rounded-lg mb-4"
        placeholder="Enter number of items"
        min="1"
      />

      <div className="selected-items-box p-4 border border-gray-300 rounded-lg mb-4">
        <h4 className="font-semibold mb-2">Selected Items</h4>
        {selectedItems.length === 0 ? (
          <p className="text-gray-500">No items selected</p>
        ) : (
          <div className="flexbox flex-wrap gap-4">
            {selectedItems.map((item, index) => (
              <div
                key={index}
                className="item-box flexbox items-center gap-2 p-2 border border-gray-200 rounded-lg"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-10 h-10 object-cover rounded"
                />
                <span>{item.name}</span>
                <button
                  onClick={() => handleRemoveItem(index)}
                  className="text-red-500 text-sm font-semibold"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-2"
          placeholder="Add items from here"
        />
        <div className="search-results max-h-48 overflow-y-auto">
          {searchResults.length === 0 ? (
            <p className="text-gray-500">No results found</p>
          ) : (
            searchResults.map((item) => (
              <div
                key={item.name}
                onClick={() => handleAddItem(item)}
                className="p-2 cursor-pointer hover:bg-gray-200 flexbox items-center gap-2"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-8 h-8 object-cover rounded"
                />
                <span>{item.name}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ComboBanner;
