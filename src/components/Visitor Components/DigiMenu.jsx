// DigiMenu.js
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getdetailedmenu } from "../../services/supported_api";
import { FaShoppingCart, FaChevronDown, FaChevronUp } from "react-icons/fa";
import MenuItemCard from "./MenuItemCard";
import Cart from "./Cart";
import "../../scss/DigiMenu.scss";

export default function DigiMenu() {
	const { loc_id, table_id } = useParams();
	const [menuData, setMenuData] = useState([]);
	const [selectedMenu, setSelectedMenu] = useState("All");
	const [selectedCategory, setSelectedCategory] = useState("");
	const [cartItems, setCartItems] = useState({});
	const [showCart, setShowCart] = useState(false);
	const [openMenus, setOpenMenus] = useState({});
	const [showGreet, setShowGreet] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const result = await getdetailedmenu(loc_id);
				setMenuData(result);
				setShowGreet(true);
				setTimeout(() => {
					setShowGreet(false);
				}, 2500);
			} catch (error) {
				console.error("Error loading menus:", error);
			}
		};

		fetchData();
	}, [loc_id]);

	const getMenus = () => {
		return ["All", ...new Set(menuData.map((item) => item.inmenu))];
	};

	const getCategories = (menu) => {
		const filteredData =
			menu === "All"
				? menuData
				: menuData.filter((item) => item.inmenu === menu);
		return [...new Set(filteredData.map((item) => item.incategory))];
	};

	const getMenuItems = () => {
		return menuData.filter(
			(item) =>
				(selectedMenu === "All" || item.inmenu === selectedMenu) &&
				(!selectedCategory || item.incategory === selectedCategory)
		);
	};

	const toggleMenuDropdown = (menu) => {
		setOpenMenus((prev) => ({
			...prev,
			[menu]: !prev[menu],
		}));
	};

	const handleAddToCart = (item) => {
		setCartItems((prev) => ({
			...prev,
			[item.id]: {
				...item,
				quantity: (prev[item.id]?.quantity || 0) + 1,
			},
		}));
	};

	const handleRemoveFromCart = (item) => {
		setCartItems((prev) => {
			const newCartItems = { ...prev };

			if (newCartItems[item.id]?.quantity > 1) {
				newCartItems[item.id].quantity -= 1;
			} else {
				delete newCartItems[item.id];
			}

			return newCartItems;
		});
	};

	const [cartWrapperClass, setCartWrapperClass] = useState("cart-wrapper");

	const handleCloseCart = () => {
		if (showCart) {
			setCartWrapperClass("cart-wrapper cart-wrapper--disappear");
			setTimeout(() => {
				setShowCart(false);
			}, 600);
		} else {
			setCartWrapperClass("cart-wrapper");
			setShowCart(true);
		}
		console.log(cartItems);
	};

	return (
		<div className="p-6 min-h-screen digimenu">
			{showGreet && (
				<div className="digimenu__greet">
					<div className="digimenu__greet--content">
						<h2 className="digimenu__greet--content-header">
							Welcome to <span>{loc_id}</span>
						</h2>
						<h3 className="digimenu__greet--content-sub">
							Table: <span>{table_id}</span>
						</h3>
					</div>
				</div>
			)}
			<h1 className={`digimenu__header mb-6`}>
				Welcome to <span>{loc_id} | </span> Table: <span>{table_id}</span>
			</h1>

			{/* Menu Tabs with Dropdowns */}
			<div className={`category-wrapper`}>
				{getMenus()?.map((menu) => (
					<div
						key={menu}
						className={`category ${
							selectedMenu === menu && "category--active"
						}`}
						onClick={() => {
							setSelectedMenu(menu);
						}}
					>
						<span>{menu}</span>
					</div>
				))}
			</div>

			{/* Menu Items */}
			<div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
				{getMenuItems().map((item) => (
					<MenuItemCard
						key={item.id}
						item={item}
						handleAddToCart={handleAddToCart}
						handleRemoveFromCart={handleRemoveFromCart}
						cartItems={cartItems}
					/>
				))}
			</div>

			{/* Cart Toggle */}
			{showCart && (
				<div
					className={`fixed bottom-0 right-0 w-full md:w-1/3 h-4/5 ${cartWrapperClass} p-6 overflow-y-auto z-5`}
				>
					<Cart
						cartItems={cartItems}
						handleAddToCart={handleAddToCart}
						handleRemoveFromCart={handleRemoveFromCart}
						handleCloseCart={handleCloseCart}
						table_id={table_id}
					/>
				</div>
			)}

			{/* Floating Cart Button */}
			<button
				className=" p-5 rounded-full digimenu__cart z-4"
				onClick={handleCloseCart}
			>
				<FaShoppingCart className="w-6 h-6" />
			</button>
		</div>
	);
}
