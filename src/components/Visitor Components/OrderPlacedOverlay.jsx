import React from "react";
import { useNavigate } from "react-router-dom";
// styles written in digimenu

const OrderConfirmationOverlay = ({
	onOrderMore,
	onNoMoreOrders,
	orderSummary,
}) => {
	const navigate = useNavigate();

	return (
		<div className="fixed inset-0 flexbox items-center justify-center bg-black bg-opacity-60 z-50">
			<div className="p-6 max-w-md mx-auto text-center order-overlay">
				<h2 className="text-2xl font-bold mb-4 fg-rich-black">Order Placed!</h2>
				<div className="text-left mb-4">
					<h3 className="mb-2 order-title">Order Summary:</h3>
					<ul>
						{orderSummary.map((item, index) => (
							<li key={index} className="mb-1 order-detail">
								{item.quantity}x {item.name} - ${item.price.toFixed(2)}
							</li>
						))}
					</ul>
				</div>
				<div className="flexbox justify-between mt-4">
					<button
						className="neu-button neu-button__small neu-button--secondary"
						onClick={onOrderMore}
					>
						Order soon
					</button>
					<button
						className="neu-button neu-button__small neu-button--submit"
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
