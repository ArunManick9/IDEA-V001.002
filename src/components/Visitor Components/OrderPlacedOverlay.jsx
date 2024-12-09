import React from "react";
import { useNavigate } from "react-router-dom";

const OrderConfirmationOverlay = ({ onOrderMore, onNoMoreOrders, orderSummary }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-white p-6 rounded-lg max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Order Placed!</h2>
        <div className="text-left mb-4">
          <h3 className="font-semibold mb-2">Order Summary:</h3>
          <ul>
            {orderSummary.map((item, index) => (
              <li key={index} className="mb-1">
                {item.quantity}x {item.name} - ${item.price.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-around mt-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={onOrderMore}
          >
            I will order more in sometime
          </button>
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            onClick={() => {
              localStorage.removeItem("iscustomerauthenticated"); // Clear authentication
              navigate(`/digimenu/thank-you`); // Redirect to the thank-you page
            }}
          >
            No more orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationOverlay;
