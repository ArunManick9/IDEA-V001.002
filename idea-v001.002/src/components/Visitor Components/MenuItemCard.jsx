import React from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

const MenuItemCard = ({
	item,
	handleAddToCart,
	handleRemoveFromCart,
	cartItems,
}) => {
	return (
		<div className="flex items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 mb-4">
			<img
				src={item.image}
				alt={item.name}
				className="w-14 h-14 object-cover rounded-md mr-3"
			/>
			<div className="flex-1">
				<h2 className="text-md font-semibold text-gray-800 truncate">
					{item.name}
				</h2>
				<p className="text-sm text-gray-600 truncate">{item.description}</p>
				<span className="text-lg font-bold text-gray-900">${item.price}</span>
			</div>
			<div className="flex items-center ml-3">
				<button
					onClick={() => handleRemoveFromCart(item)}
					className="bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300 transition-all duration-200"
				>
					<FaMinus />
				</button>
				<span className="mx-2 text-gray-900 font-semibold">
					{cartItems[item.id]?.quantity || 0}
				</span>
				<button
					onClick={() => handleAddToCart(item)}
					className="bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300 transition-all duration-200"
				>
					<FaPlus />
				</button>
			</div>
		</div>
	);
};

export default MenuItemCard;
