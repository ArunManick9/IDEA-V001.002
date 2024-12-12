import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { ordersubmit } from "../../services/supported_api";
import OrderConfirmationOverlay from "./OrderPlacedOverlay";
const Cart = ({
  cartItems,
  handleAddToCart,
  handleRemoveFromCart,
  handleCloseCart,
  table_id,
  waiter_sup,
  clearCart, // New function to clear the cart

}) => {
	const [showConfirmation, setShowConfirmation] = useState(false);
	const [showOverlay, setShowOverlay] = useState(false);
	const cartEntries = Object.values(cartItems);

	const visitorid = "ABC_EFG_001"; // Static for now

	const generateOrderId = (loc_id) => {
		const locSuffix = loc_id.slice(-6);
		const randomDigits = Math.floor(100000 + Math.random() * 900000);
		return `${locSuffix}_${table_id}_${randomDigits}`;
	};

  const handleYes = () => {
    if (cartEntries.length > 0) {
        const loc_id = cartEntries[0].inlocation;
        const order_id = generateOrderId(loc_id);
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
            status: waiter_sup ? "New" : "Verified" , // Conditional status assignment
        };

        console.log("Order Request Body:", orderRequestBody);

        ordersubmit(orderRequestBody);
        setShowConfirmation(false);
        setShowOverlay(true); // Show overlay after order submission
    }
};



	return (
		<div className="relative cart">
			<button
				className="cart__close-icon p-2 rounded-full text-gray-600 hover:text-gray-900 transition-all"
				onClick={handleCloseCart}
			>
				<FaTimes className="w-4 h-4" />
			</button>
			<h2 className="text-xl font-semibold mb-6">Your Cart</h2>
			{cartEntries.length === 0 ? (
				<p className="text-gray-600">Your cart is empty</p>
			) : (
				<ul className="cart__items">
					{cartEntries.map((item) => (
						<li
							key={item.id}
							className="flexbox justify-between items-center cart__item"
						>
							<div className="flexbox items-center">
								<img
									src={item.image}
									alt={item.name}
									className="w-12 h-12 object-cover rounded mr-4"
								/>
								<div>
									<h3 className="cart__item--name">{item.name}</h3>
									<p className="text-gray-600 cart__item--price">
										${item.price.toFixed(2)}
									</p>
								</div>
							</div>
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
								<span className="font-semibold cart__quantity">
									{item.quantity}
								</span>
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
			{cartEntries.length > 0 && (
				<button
					className="neu-button neu-button--submit"
					onClick={() => setShowConfirmation(true)}
				>
					Order Now
				</button>
			)}
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
			{showOverlay && (
				<OrderConfirmationOverlay
					orderSummary={cartEntries}
					onOrderMore={() => {
						clearCart(); // Clear the cart
						setShowOverlay(false); // Hide overlay
					}}
					onNoMoreOrders={() => {
						localStorage.setItem("iscustomerauthenticated", "false");
						setShowOverlay(false);
					}}
				/>
			)}
		</div>
	);
};

export default Cart;
