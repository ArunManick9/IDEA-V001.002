import React, { useState } from "react";
import { FaTimes } from "react-icons/fa"; // Import the close icon
import { ordersubmit } from "../../services/supported_api";
// styles written in digimenu

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
		<div className="relative cart">
			{/* Close Button */}
			<button
				className="cart__close-icon p-2 rounded-full text-gray-600 hover:text-gray-900 transition-all"
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
				<ul className="cart__items">
					{cartEntries.map((item) => (
						<li
							key={item.id}
							className="flexbox justify-between items-center cart__item pb-4"
						>
							{/* Item Details */}
							<div className="flexbox items-center">
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
							<div className="flexbox items-center cart__icons-flex">
								<button
									onClick={() =>
										setTimeout(() => {
											handleRemoveFromCart(item);
										}, 200)
									}
									className="cart__icon rounded-full transition-all"
								>
									-
								</button>
								<span className="font-semibold">{item.quantity}</span>
								<button
									onClick={() =>
										setTimeout(() => {
											handleAddToCart(item);
										}, 200)
									}
									className="cart__icon rounded-full transition-all"
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
					className="neu-button neu-button--submit"
					onClick={handleOrderNow}
				>
					Order Now
				</button>
			)}

			{/* Confirmation Modal */}
			{showConfirmation && (
				<div className="fixed inset-0 flexbox items-center justify-center cart__confirmation-modal z-50">
					<div className="cart__confirmation-modal--container text-center max-w-md mx-auto">
						<h3 className="text-xl font-semibold mb-4">
							Are you sure you want to place the order?
						</h3>
						<div className="flexbox justify-around mt-4">
							<button
								className="neu-button neu-button__small neu-button--yale"
								onClick={handleYes}
							>
								Proceed
							</button>
							<button
								className="neu-button neu-button__small neu-button--grey"
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
