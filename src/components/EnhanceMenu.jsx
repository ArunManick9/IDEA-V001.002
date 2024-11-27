import React, { useState, useContext } from "react";
import { updateBanner } from "../services/supported_api"; // Assuming LocationContext provides loc_id
import { useParams } from "react-router-dom";

const EnhanceMenu = () => {
  const { loc_id } = useParams(); // Access loc_id from context
  const [toggleBanners, setToggleBanners] = useState(false);
  const [bannerType, setBannerType] = useState("");
  const [bannerName, setBannerName] = useState("");
  const [displayType, setDisplayType] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  const handleToggle = () => {
    setToggleBanners(!toggleBanners);
  };

  const handleBannerTypeChange = (type) => {
    setBannerType(type);
  };

  const handleSubmit = async () => {
    try {
      let updatedBannerData = {};

      // Prepare data for the selected banner type
      if (bannerType === "highlight" && bannerName && displayType) {
        updatedBannerData = [{ name: bannerName, display: displayType }];
      } 
      // If Combo Banner is selected, set it to true
      else if (bannerType === "combo") {
        updatedBannerData = "true";
      } 
      // If Cart Suggestion Banner is selected, set it to true
      else if (bannerType === "cart") {
        updatedBannerData = "true";
      }

      // Update the relevant banner column in the database
      const result = await updateBanner(bannerType, updatedBannerData, loc_id);

      // Display success popup message based on banner type
      if (bannerType === "combo" || bannerType === "cart") {
        setPopupMessage(
          `Banner type enabled. Now proceed to configure menu items for the ${
            bannerType === "combo" ? "Combo Banner" : "Cart Suggestion Banner"
          }.`
        );
      } else {
        setPopupMessage("Highlight banner added successfully!");
      }

      console.log("API result:", result);
    } catch (error) {
      console.error("Error while submitting banner:", error);
      setPopupMessage("Failed to update banner. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Enhance Your Menu</h1>

      <div className="flexbox justify-between items-center mb-4">
        <label className="text-gray-700 text-lg">Add Banners in your menu?</label>
        <div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
          <input
            type="checkbox"
            id="toggle-banners"
            checked={toggleBanners}
            onChange={handleToggle}
            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
          />
          <label
            htmlFor="toggle-banners"
            className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
          ></label>
        </div>
      </div>

      {toggleBanners && (
        <div className="mt-4 space-y-6">
          <div>
            <p className="text-gray-700 font-medium">Choose Banner Type:</p>
            <div className="mt-2 space-y-2">
              <label className="block">
                <input
                  type="radio"
                  name="banner-type"
                  value="highlight"
                  onChange={() => handleBannerTypeChange("highlight")}
                  checked={bannerType === "highlight"}
                  className="mr-2"
                />
                Highlight Banner
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="banner-type"
                  value="combo"
                  onChange={() => handleBannerTypeChange("combo")}
                  checked={bannerType === "combo"}
                  className="mr-2"
                />
                Combo Banner
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="banner-type"
                  value="cart"
                  onChange={() => handleBannerTypeChange("cart")}
                  checked={bannerType === "cart"}
                  className="mr-2"
                />
                Cart Suggestion Banner
              </label>
            </div>
          </div>

          {bannerType === "highlight" && (
            <div>
              <label className="block text-gray-700">Banner Name</label>
              <input
                type="text"
                value={bannerName}
                onChange={(e) => setBannerName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter banner name"
              />
              <label className="block text-gray-700 mt-2">Display Type</label>
              <select
                value={displayType}
                onChange={(e) => setDisplayType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">Select Display Type</option>
                <option value="scroll">Scroll</option>
                <option value="slide">Slide</option>
              </select>

              {/* Scroll Animation Preview */}
              {displayType === "scroll" && (
                <div className="mt-4 overflow-hidden w-full h-24 relative bg-gray-300">
                  <div className="flexbox animate-scroll-preview space-x-2">
                    {Array(5).fill(0).map((_, index) => (
                      <div
                        key={index}
                        className="w-16 h-20 bg-gray-400 rounded-md flex-shrink-0"
                      ></div>
                    ))}
                  </div>
                </div>
              )}
              {/* Slide Animation Preview */}
              {displayType === "slide" && (
                <div className="mt-4 overflow-hidden w-full h-24 relative bg-gray-300">
                  <div className="flexbox animate-slide-preview">
                    {Array(5).fill(0).map((_, index) => (
                      <div
                        key={index}
                        className="w-full h-24 bg-gray-400 rounded-md flex-shrink-0"
                      ></div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white p-2 mt-4 rounded-lg"
          >
            Submit
          </button>

          {popupMessage && (
            <div className="text-center text-green-500 mt-4">
              {popupMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhanceMenu;
