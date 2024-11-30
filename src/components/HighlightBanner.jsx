import React, { useState, useEffect } from "react";
import HighlightBannerPreview from "./HighlightBannerPreview";
import { addenhancedetails, getdetailedmenu } from "../services/supported_api";
import { useParams } from "react-router-dom";

const HighlightBanner = ({ onBannerDataChange }) => {
  const [bannerName, setBannerName] = useState("");
  const [displayType, setDisplayType] = useState("");
  const [itemCount, setItemCount] = useState(0);
  const [menuData, setMenuData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { loc_id } = useParams();

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

  const handleNameChange = (e) => {
    const name = e.target.value;
    setBannerName(name);
    onBannerDataChange({ name, display: displayType });
  };

  const handleDisplayTypeChange = (e) => {
    const type = e.target.value;
    setDisplayType(type);
    onBannerDataChange({ name: bannerName, display: type });
  };

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

  const handleAddItem = (item) => {
    if (selectedItems.length < itemCount) {
      setSelectedItems([...selectedItems, item]);
    } else {
      alert(`You can only add up to ${itemCount} items.`);
    }
    setSearchQuery(""); // Reset search query
    setSearchResults([]); // Reset search results
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...selectedItems];
    updatedItems.splice(index, 1);
    setSelectedItems(updatedItems);
  };

  const handleSubmit = async () => {
    if (!bannerName || !displayType || itemCount <= 0) {
      setError("Please fill all mandatory fields.");
      return;
    }
    setError("");

    const bannerData = {
      loc_id,
      banner_name: bannerName,
      banner_type: "Highlight",
      item_count: itemCount,
      associate_item: selectedItems,
      display_type: displayType,
      isActive,
    };

    try {
      const response = await addenhancedetails(bannerData);
      setSuccessMessage("Banner details saved successfully!");
      console.log("API Response:", response);

      // Reset fields after successful save
      setBannerName("");
      setDisplayType("");
      setItemCount(0);
      setSelectedItems([]);
      setIsActive(false);
      setSearchQuery("");
      setSearchResults([]);
    } catch (error) {
      console.error("Error saving banner details:", error);
      setError("Failed to save banner details. Please try again.");
    }
  };

  return (
    <div>
      <label className="enhance-container--label input-label">Banner Name *</label>
      <input
        type="text"
        value={bannerName}
        onChange={handleNameChange}
        className="w-full p-2 border border-gray-300 rounded-lg"
        placeholder="Enter banner name"
      />

      <label className="enhance-container--label input-label">Display Type *</label>
      <select
        value={displayType}
        onChange={handleDisplayTypeChange}
        className="w-full p-2 border border-gray-300 rounded-lg"
      >
        <option value="">Select Display Type</option>
        <option value="scroll">Scroll</option>
        <option value="slide">Slide</option>
      </select>

      <label className="enhance-container--label input-label">Number of Items *</label>
      <input
        type="number"
        value={itemCount}
        onChange={(e) => setItemCount(Number(e.target.value))}
        className="w-full p-2 border border-gray-300 rounded-lg mb-4"
        placeholder="Enter number of items"
        min="1"
      />

      <label className="enhance-container--label input-label flexbox items-center gap-2">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        Active in Menu
      </label>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

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

      {displayType && <HighlightBannerPreview displayType={displayType} />}

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white p-2 rounded-lg mt-4"
      >
        Save Banner
      </button>
    </div>
  );
};

export default HighlightBanner;
