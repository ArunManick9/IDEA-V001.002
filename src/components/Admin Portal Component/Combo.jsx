import { useState, useEffect } from "react";
import { addenhancedetails, getdetailedmenu } from "../../services/supported_api";
import { useParams } from "react-router-dom";

const ComboBanner = () => {
  const [comboName, setComboName] = useState("");
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
    if (!comboName || itemCount <= 0) {
      setError("Please fill all mandatory fields.");
      return;
    }
    setError("");

    const comboData = {
      loc_id,
      banner_name: comboName,
      banner_type: "Combo",
      item_count: itemCount,
      associate_item: selectedItems,
      isActive: isActive,
    };

    try {
      const response = await addenhancedetails(comboData);
      setSuccessMessage("Combo banner details saved successfully!");
      console.log("API Response:", response);

      // Reset fields after successful save
      setComboName("");
      setItemCount(0);
      setSelectedItems([]);
      setSearchQuery("");
      setSearchResults([]);
      setIsActive(false);
    } catch (error) {
      console.error("Error saving combo banner details:", error);
      setError("Failed to save combo banner details. Please try again.");
    }
  };

  return (
    <div>
      <label className="enhance-container--label">Combo Name *</label>
      <input
        type="text"
        value={comboName}
        onChange={(e) => setComboName(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-lg"
        placeholder="Enter combo name"
      />

      <label className="enhance-container--label">Number of Items *</label>
      <input
        type="number"
        value={itemCount}
        onChange={(e) => setItemCount(Number(e.target.value))}
        className="w-full p-2 border border-gray-300 rounded-lg mb-4"
        placeholder="Enter number of items"
        min="1"
      />

      <label className="enhance-container--label flexbox items-center gap-2">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="mr-2"
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
                  src={item.image || "placeholder.jpg"}
                  alt={item.name || "Unnamed Item"}
                  className="w-10 h-10 object-cover rounded"
                />
                <span>{item.name || "Unnamed Item"}</span>
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
                key={item.name || Math.random()}
                onClick={() => handleAddItem(item)}
                className="p-2 cursor-pointer hover:bg-gray-200 flexbox items-center gap-2"
              >
                <img
                  src={item.image || "placeholder.jpg"}
                  alt={item.name || "Unnamed Item"}
                  className="w-8 h-8 object-cover rounded"
                />
                <span>{item.name || "Unnamed Item"}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white p-2 rounded-lg mt-4"
      >
        Save Combo Banner
      </button>
    </div>
  );
};

export default ComboBanner;
