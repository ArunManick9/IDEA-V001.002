import { useState } from "react";
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

  const handleViewAllBanners = () => {
    // Navigate to the desired route with loc_id
    navigate(`/menuboard/${loc_id}/enhancemenu/allbanners`);
  };

  return (
    <div className="enhance-wrapper">
      <div className="max-w-lg mx-auto p-6 rounded-lg enhance-container">
        <h1 className="enhance-container--header">Enhance Your Menu</h1>

        {/* View All Banners Button */}
        <div className="mt-4">
          <button
            onClick={handleViewAllBanners}
            className="btn btn--submit w-full py-2 text-center bg-green-500 text-white rounded-lg"
          >
            View All Banners
          </button>
        </div>

        {/* Section Heading */}
        <h2 className="mt-6 text-lg font-semibold text-gray-700 text-center">
          Create New Banners
        </h2>

        {/* Direct Banner Options as Cards */}
        <div className="mt-4 flex flex-wrap gap-4 justify-center">
          <div
            onClick={() => handleBannerTypeChange("highlight")}
            className="card w-40 h-24 bg-white text-black rounded-lg shadow-md cursor-pointer flex flex-col items-center justify-center hover:shadow-lg transition-shadow"
          >
            <span className="text-center font-medium">Create Highlight Banner</span>
          </div>
          <div
            onClick={() => handleBannerTypeChange("combo")}
            className="card w-40 h-24 bg-white text-black rounded-lg shadow-md cursor-pointer flex flex-col items-center justify-center hover:shadow-lg transition-shadow"
          >
            <span className="text-center font-medium">Create Combo Banner</span>
          </div>
          <div
            onClick={() => handleBannerTypeChange("cart")}
            className="card w-40 h-24 bg-white text-black rounded-lg shadow-md cursor-pointer flex flex-col items-center justify-center hover:shadow-lg transition-shadow"
          >
            <span className="text-center font-medium">Create Cart Suggestion Banner</span>
          </div>
        </div>

        {/* Render selected banner type content */}
        {bannerType === "highlight" && (
          <HighlightBanner onBannerDataChange={setHighlightBannerData} />
        )}

        {bannerType === "combo" && <ComboBanner />} {/* Render ComboBanner when combo is selected */}

        {popupMessage && (
          <div className="text-center text-green-500 mt-4">{popupMessage}</div>
        )}
      </div>
    </div>
  );
};

export default EnhanceMenu;
