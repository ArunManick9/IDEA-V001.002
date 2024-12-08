import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import MenuDetail from "./MenuDetail";

const MenuItemCard = ({
	item,
	handleAddToCart,
	handleRemoveFromCart,
	cartItems,
	loc_id,
	menuItemsFormat,
}) => {
	const [showDetail, setShowDetail] = useState(false);

	return (
		<>
			<div
				className={`flexbox items-center p-2 menu-item menu-item--${menuItemsFormat}`}
				onClick={() => setShowDetail(true)} // Show modal on click
			>
				<div className="menu-item--image-wrapper">
					<img
						src={item.image}
						alt={item.name}
						className="w-16 h-16 object-cover rounded-md menu-item--image"
					/>
				</div>
				<div className="flex-1">
					<h2 className="text-md font-semibold text-gray-800 truncate item__name">
						{item.name}
					</h2>
					<p className=" text-gray-600 truncate">{item.description}</p>
					<span className="font-bold text-gray-900">${item.price}</span>
				</div>
				<div className="flexbox items-center ml-3 icons-wrapper">
					<button
						onClick={(e) => {
							e.stopPropagation(); // Prevent parent click event
							handleRemoveFromCart(item);
						}}
						className="p-1 rounded-lg menu-item--icons transition-all duration-200"
					>
						<FaMinus />
					</button>
					<span className="mx-2 text-gray-900 font-semibold item__quantity">
						{cartItems[item.id]?.quantity || 0}
					</span>
					<button
						onClick={(e) => {
							e.stopPropagation(); // Prevent parent click event
							handleAddToCart(item);
						}}
						className="p-1 rounded-lg menu-item--icons transition-all duration-200"
					>
						<FaPlus />
					</button>
				</div>
			</div>

			{/* Modal Overlay */}
			{showDetail && (
				<div className="modal-overlay">
					<div className="modal-content">
						<MenuDetail
							menu_id={item.menu_id}
							loc_id={loc_id}
							handleRemoveFromCart={handleRemoveFromCart}
							handleAddToCart={handleAddToCart}
							cartItems={cartItems}
							handleCloseModal={() => setShowDetail(false)}
						/>
						<button
							className="close-button"
							onClick={() => setShowDetail(false)} // Close modal on click
						>
							Close
						</button>
					</div>
				</div>
			)}
		</>
	);
};

export default MenuItemCard;
