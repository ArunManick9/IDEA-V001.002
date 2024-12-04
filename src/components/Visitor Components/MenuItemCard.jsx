import React from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { Link } from "react-router-dom";
// styling is written in DigiMenu.scss

const MenuItemCard = ({
	item,
	handleAddToCart,
	handleRemoveFromCart,
	cartItems,
}) => {

	console.log(item)
	return (
		<div className="flexbox items-center p-4 menu-item">
			<Link to={`/digimenu/${item.inlocation}/menuitem/${item.menu_id}`}>
				<img
					src={item.image}
					alt={item.name}
					className="w-16 h-16 object-cover rounded-md mr-3"
				/>
			</Link>
			<Link
				to={`/digimenu/${item.inlocation}/menuitem/${item.menu_id}`}
				className="flex-1"
			>
				<h2 className="text-md font-semibold text-gray-800 truncate item__name">
					{item.name}
				</h2>
				<p className="text-sm text-gray-600 truncate">{item.description}</p>
				<span className="text-lg font-bold text-gray-900">${item.price}</span>
			</Link>
			<div className="flexbox items-center ml-3 icons-wrapper">
				<button
					onClick={() => handleRemoveFromCart(item)}
					className=" p-2 rounded-lg menu-item--icons transition-all duration-200"
				>
					<FaMinus />
				</button>
				<span className="mx-2 text-gray-900 font-semibold">
					{cartItems[item.id]?.quantity || 0}
				</span>
				<button
					onClick={() => handleAddToCart(item)}
					className=" p-2 rounded-lg menu-item--icons transition-all duration-200"
				>
					<FaPlus />
				</button>
			</div>
		</div>
	);
};

export default MenuItemCard;
