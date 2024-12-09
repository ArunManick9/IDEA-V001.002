import React from "react";

const ThankYouScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Thank You!</h1>
      <p className="text-gray-600 text-lg mb-6">
        Your order has been placed successfully.
      </p>
      <p className="text-gray-600 mb-8">
        To order again, please scan the QR code displayed on your table.
      </p>
      <button
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        onClick={() => {
          window.location.reload(); // Reloads to clear any state or restart the app
        }}
      >
        Reload
      </button>
    </div>
  );
};

export default ThankYouScreen;
