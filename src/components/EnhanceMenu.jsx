import React, { useState } from "react";
import { updateBanner } from "../services/supported_api"; // Assuming LocationContext provides loc_id
import { Navigate, useNavigate, useParams } from "react-router-dom";
import "../scss/EnhanceMenu.scss";
import ComboBanner from "./Combo";
import HighlightBanner from "./HighlightBanner";

const EnhanceMenu = () => {
  const { loc_id } = useParams(); // Access loc_id from context
  const [toggleBanners, setToggleBanners] = useState(false);
  const [bannerType, setBannerType] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [highlightBannerData, setHighlightBannerData] = useState(null);

  const navigate = useNavigate();

  // Retrieve the access token from localStorage (or location state as fallback)
	const access_token =
	location.state?.access_token || localStorage.getItem("access_token");
const user_id = location.state?.user_id || localStorage.getItem("user_id");

// Ensure the token is set
if (!access_token || !user_id) {
	navigate("/"); // Redirect to login if no token/user_id is found
}


  const handleToggle = () => {
    setToggleBanners((previousValue) => !previousValue);
  };

  const handleBannerTypeChange = (type) => {
    setBannerType(type);
  };

  const handleSubmit = async () => {
    try {
      let updatedBannerData = {};

      // Prepare data for the selected banner type
      if (bannerType === "highlight" && highlightBannerData) {
        updatedBannerData = [highlightBannerData];
      } else if (bannerType === "combo") {
        updatedBannerData = "true";
      } else if (bannerType === "cart") {
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
    <div className="enhance-wrapper">
      <div className="max-w-lg mx-auto p-6 rounded-lg enhance-container">
        <h1 className="enhance-container--header">Enhance Your Menu</h1>

        <div className="flexbox justify-between items-center mb-4">
          <label className="enhance-container--label">Add Banners in your menu?</label>
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
          <div className="mt-4">
            <div>
              <p className="enhance-container--label">Choose Banner Type :</p>
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
              <HighlightBanner onBannerDataChange={setHighlightBannerData} />
            )}

            {bannerType === "combo" && <ComboBanner />} {/* Render ComboBanner when combo is selected */}

            <button onClick={handleSubmit} className="btn btn--submit w-full mt-6">
              Submit
            </button>

            {popupMessage && (
              <div className="text-center text-green-500 mt-4">{popupMessage}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhanceMenu;
