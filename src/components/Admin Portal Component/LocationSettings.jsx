import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { loadlocation, editWaiterSupport, editMenuOtp } from "../../services/supported_api";

const LocationSettings = () => {
  const { loc_id } = useParams(); // Retrieve `loc_id` from URL params
  const [locationData, setLocationData] = useState(null);
  const [waiterSupport, setWaiterSupport] = useState(false);
  const [otpValidation, setOtpValidation] = useState(false);

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const data = await loadlocation(loc_id);
        console.log("Location Data:", data);
        setLocationData(data[0]); // Assuming the API returns an array
        setWaiterSupport(data[0]?.waiter_support || false);
        setOtpValidation(data[0]?.menu_otp || false);
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    };

    fetchLocationData();
  }, [loc_id]);

  const handleSave = async () => {
    try {
      await editWaiterSupport(waiterSupport, loc_id);
      await editMenuOtp(otpValidation, loc_id);
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings. Please try again.");
    }
  };

  const handleWaiterSupportToggle = () => {
    setWaiterSupport((prev) => !prev);
  };

  const handleOtpValidationToggle = () => {
    setOtpValidation((prev) => !prev);
  };

  if (!locationData) {
    return (
      <div className="flexbox justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Loading location settings...</p>
      </div>
    );
  }

  return (
    <div className="flexbox flex-col justify-start items-center p-6 min-h-screen bg-gray-100 space-y-8">
      {/* Title */}
      <h1 className="text-3xl font-semibold text-gray-800">Settings</h1>

      {/* Save Button */}
      <button
        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-500 transition"
        onClick={handleSave}
      >
        Save
      </button>

      {/* Waiter Application Support */}
      <div className="flexbox justify-between items-center w-full max-w-lg p-4 bg-white rounded-lg shadow-md">
        <p className="text-lg text-gray-700">
          Do you want waiter application support?
        </p>
        <button
          className={`relative w-12 h-6 rounded-full ${
            waiterSupport ? "bg-green-500" : "bg-gray-400"
          } transition duration-200`}
          onClick={handleWaiterSupportToggle}
        >
          <div
            className={`absolute w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
              waiterSupport ? "translate-x-6" : "translate-x-0"
            }`}
          ></div>
        </button>
      </div>

      {/* OTP Validation on Customer Login */}
      <div className="flexbox justify-between items-center w-full max-w-lg p-4 bg-white rounded-lg shadow-md">
        <p className="text-lg text-gray-700">
          Do you want OTP validation on Customer login?
        </p>
        <button
          className={`relative w-12 h-6 rounded-full ${
            otpValidation ? "bg-green-500" : "bg-gray-400"
          } transition duration-200`}
          onClick={handleOtpValidationToggle}
        >
          <div
            className={`absolute w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
              otpValidation ? "translate-x-6" : "translate-x-0"
            }`}
          ></div>
        </button>
      </div>
    </div>
  );
};

export default LocationSettings;
