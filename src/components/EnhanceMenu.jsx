import React, { useState } from "react";

const EnhanceMenu = () => {
  const [toggleBanners, setToggleBanners] = useState(false);
  const [bannerType, setBannerType] = useState("");

  const handleToggle = () => {
    setToggleBanners(!toggleBanners);
  };

  const handleBannerTypeChange = (type) => {
    setBannerType(type);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Enhance Your Menu</h1>

      <div className="flex justify-between items-center mb-4">
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
            <label htmlFor="banner-name" className="block text-gray-700 font-medium">
              Banner Name
            </label>
            <input
              type="text"
              id="banner-name"
              placeholder="Enter banner name"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <p className="text-gray-700 font-medium">Choose Display Type:</p>
            <div className="mt-2 flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="display-type"
                  value="scroll"
                  onChange={() => handleBannerTypeChange("scroll")}
                  className="form-radio h-4 w-4 text-indigo-600"
                />
                <span className="ml-2 text-gray-700">Scroll Show</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="display-type"
                  value="slide"
                  onChange={() => handleBannerTypeChange("slide")}
                  className="form-radio h-4 w-4 text-indigo-600"
                />
                <span className="ml-2 text-gray-700">Slide Show</span>
              </label>
            </div>
            <div className="mt-4 p-4 bg-gray-200 rounded-md text-center">
              {bannerType === "scroll" && (
                <div className="overflow-hidden w-full h-24 relative bg-gray-300">
                  <div className="flex animate-scroll-preview space-x-2">
                    {Array(5).fill(0).map((_, index) => (
                      <div
                        key={index}
                        className="w-16 h-20 bg-gray-400 rounded-md flex-shrink-0"
                      ></div>
                    ))}
                  </div>
                </div>
              )}
              {bannerType === "slide" && (
                <div className="overflow-hidden w-full h-24 relative bg-gray-300">
                  <div className="flex animate-slide-preview">
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
          </div>

          <div>
            <p className="text-gray-700 font-medium">Banner Type:</p>
            <div className="mt-2 space-y-2">
              <label className="block">
                <input
                  type="radio"
                  name="banner-type"
                  className="form-radio h-4 w-4 text-indigo-600"
                />
                <span className="ml-2 text-gray-700">Highlight Banner</span>
                <small className="block text-sm text-gray-500">This will be visible on the home screen</small>
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="banner-type"
                  className="form-radio h-4 w-4 text-indigo-600"
                />
                <span className="ml-2 text-gray-700">Combo Banner</span>
                <small className="block text-sm text-gray-500">Two items are required for a Combo Banner</small>
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="banner-type"
                  className="form-radio h-4 w-4 text-indigo-600"
                />
                <span className="ml-2 text-gray-700">Cart Suggestion Banner</span>
                <small className="block text-sm text-gray-500">Up to five products can be shown in the cart suggestion</small>
              </label>
            </div>
          </div>

          <button className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Add Banner
          </button>
        </div>
      )}
    </div>
  );
};

export default EnhanceMenu;
