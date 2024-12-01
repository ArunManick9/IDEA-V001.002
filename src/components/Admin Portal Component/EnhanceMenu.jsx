import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../scss/EnhanceMenu.scss";
import ComboBanner from "./Combo";
import HighlightBanner from "./HighlightBanner";

const EnhanceMenu = () => {
  const { loc_id } = useParams(); // Access loc_id from context
  const [bannerType, setBannerType] = useState("");
  const [highlightBannerData, setHighlightBannerData] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");

  const navigate = useNavigate();

  // Retrieve the access token from localStorage (or location state as fallback)
  const access_token =
    location.state?.access_token || localStorage.getItem("access_token");
  const user_id = location.state?.user_id || localStorage.getItem("user_id");

  // Ensure the token is set
  if (!access_token || !user_id) {
    navigate("/"); // Redirect to login if no token/user_id is found
  }

  const handleBannerTypeChange = (type) => {
    setBannerType(type);
  };

  return (
    <div className="enhance-wrapper">
      <div className="max-w-lg mx-auto p-6 rounded-lg enhance-container">
        <h1 className="enhance-container--header">Enhance Your Menu</h1>

        {/* Direct Banner Options */}
        <div className="mt-4 space-y-4">
          <button
            onClick={() => handleBannerTypeChange("highlight")}
            className="btn btn--banner-option w-full py-2 text-center bg-white text-black rounded-lg shadow-md"
          >
            Highlight Banner
          </button>
          <button
            onClick={() => handleBannerTypeChange("combo")}
            className="btn btn--banner-option w-full py-2 text-center bg-white text-black rounded-lg shadow-md"
          >
            Combo Banner
          </button>
          <button
            onClick={() => handleBannerTypeChange("cart")}
            className="btn btn--banner-option w-full py-2 text-center bg-white text-black rounded-lg shadow-md"
          >
            Cart Suggestion Banner
          </button>
        </div>

        {/* Render selected banner type content */}
        {bannerType === "highlight" && (
          <HighlightBanner onBannerDataChange={setHighlightBannerData} />
        )}

        {bannerType === "combo" && <ComboBanner />} {/* Render ComboBanner when combo is selected */}

        {/* View All Banners Button */}
        {bannerType && (
          <div className="mt-6">
            <button className="btn btn--submit w-full py-2 text-center bg-green-500 text-white rounded-lg">
              View All Banners
            </button>
          </div>
        )}

        {popupMessage && (
          <div className="text-center text-green-500 mt-4">{popupMessage}</div>
        )}
      </div>
    </div>
  );
};

export default EnhanceMenu;
