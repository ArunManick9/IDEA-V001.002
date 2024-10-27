import React, { useState } from "react";
import { FaTimes } from "react-icons/fa"; // Import the close icon
import { ordersubmit } from "../../services/supported_api";

const Cart = ({
	cartItems,
	handleAddToCart,
	handleRemoveFromCart,
	handleCloseCart,
	table_id,
}) => {
	const [showConfirmation, setShowConfirmation] = useState(false); // State to show confirmation modal
	const cartEntries = Object.values(cartItems); // Get array of items from cartItems object

	const visitorid = "ABC_EFG_001"; // Static for now

	// Helper function to generate a unique order ID
	const generateOrderId = (loc_id) => {
		const locSuffix = loc_id.slice(-6); // Last 6 characters of loc_id
		const randomDigits = Math.floor(100000 + Math.random() * 900000); // 6 random digits
		return `${locSuffix}_${table_id}_${randomDigits}`;
	};

	// Handle the "Yes" button click for placing the order
	const handleYes = () => {
		if (cartEntries.length > 0) {
			// Extract loc_id from the first item in the cart (assuming it's uniform for all items)
			const loc_id = cartEntries[0].inlocation;

			// Generate the order_id based on the logic
			const order_id = generateOrderId(loc_id);

			// Create the request body
			const orderRequestBody = {
				order_id,
				table_id,
				loc_id,
				order_list: cartEntries.map((item) => ({
					item_id: item.id,
					item_name: item.name,
					quantity: item.quantity,
					price: item.price,
				})),
				visitorid,
				status: "New",
			};

			// For now, just log the request body
			console.log("Order Request Body:", orderRequestBody);

			ordersubmit(orderRequestBody);

			// Close the confirmation modal
			setShowConfirmation(false);
		}
	};

	const handleOrderNow = () => {
		setShowConfirmation(true); // Show confirmation modal
	};

	return (
		<div className="relative p-6 bg-white shadow-xl rounded-lg">
			{/* Close Button */}
			<button
				className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow-lg text-gray-600 hover:text-gray-900 transition-all"
				onClick={handleCloseCart}
			>
				<FaTimes className="w-4 h-4" />
			</button>

			{/* Cart Header */}
			<h2 className="text-2xl font-bold mb-6">Your Cart</h2>

			{/* Cart Items */}
			{cartEntries.length === 0 ? (
				<p className="text-gray-600">Your cart is empty</p>
			) : (
				<ul className="space-y-4">
					{cartEntries.map((item) => (
						<li
							key={item.id}
							className="flex justify-between items-center border-b pb-4"
						>
							{/* Item Details */}
							<div className="flex items-center">
								<img
									src={item.image}
									alt={item.name}
									className="w-12 h-12 object-cover rounded mr-4"
								/>
								<div>
									<h3 className="text-lg font-semibold">{item.name}</h3>
									<p className="text-gray-600">${item.price.toFixed(2)}</p>
								</div>
							</div>

							{/* Quantity Controls */}
							<div className="flex items-center space-x-2">
								<button
									onClick={() => handleRemoveFromCart(item)}
									className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition-all"
								>
									-
								</button>
								<span className="font-semibold">{item.quantity}</span>
								<button
									onClick={() => handleAddToCart(item)}
									className="bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 transition-all"
								>
									+
								</button>
							</div>
						</li>
					))}
				</ul>
			)}

			{/* Cart Total */}
			{cartEntries.length > 0 && (
				<div className="mt-8 border-t pt-4">
					<h3 className="text-xl font-semibold">
						Total:{" "}
						<span className="font-bold">
							$
							{cartEntries
								.reduce((total, item) => total + item.price * item.quantity, 0)
								.toFixed(2)}
						</span>
					</h3>
				</div>
			)}

			{/* Order Now Button */}
			{cartEntries.length > 0 && (
				<button
					className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700 transition-all"
					onClick={handleOrderNow}
				>
					Order Now
				</button>
			)}

			{/* Confirmation Modal */}
			{showConfirmation && (
				<div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
					<div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md mx-auto">
						<h3 className="text-xl font-semibold mb-4">
							Are you sure you want to place the order?
						</h3>
						<div className="flex justify-around mt-4">
							<button
								className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-all"
								onClick={handleYes}
							>
								Yes
							</button>
							<button
								className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-all"
								onClick={() => setShowConfirmation(false)}
							>
								View Cart
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Cart;
