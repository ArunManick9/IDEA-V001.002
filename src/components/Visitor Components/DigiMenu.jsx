import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { fetchAllMenuCardData } from "../../services/supported_api";
import { FaShoppingCart } from "react-icons/fa";
import MenuItemCard from "./MenuItemCard";
import Cart from "./Cart";

import HighlightBanner from "./HighlightBanner";

export default function DigiMenu() {
	const { loc_id, table_id } = useParams();
	const [locationName, setLocationName] = useState("");
	const [menuData, setMenuData] = useState([]);
	const [locationData, setLocationData] = useState({});
	const [selectedMenu, setSelectedMenu] = useState("All");
	const [enhanceDetails, setEnhanceDetails] = useState([]);
	const [cartItems, setCartItems] = useState({});
	const [showCart, setShowCart] = useState(false);
	const [showGreet, setShowGreet] = useState(false);
	const [searchParams] = useSearchParams();
	const menuItemsFormat = searchParams.get("displayType") || "grid";

	const theme = searchParams.get("theme") || "default";

	const [themeFile, setThemeFile] = useState("");

	// Dynamically load theme based on query parameter
	useEffect(() => {
		if (theme === "yellow") {
			setThemeFile("flatdigimenu.scss");
		} else {
			setThemeFile("DigiMenu.scss");
		}
	}, [theme]);

	// Import the theme CSS dynamically
	useEffect(() => {
		if (themeFile) {
			import(`../../scss/${themeFile}`)
				.then(() => {
					console.log(`${themeFile} has been applied`);
				})
				.catch((error) => {
					console.error("Error loading theme:", error);
				});
		}
	}, [themeFile]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const result = await fetchAllMenuCardData(loc_id);
				setMenuData(result.menuDetails);
				setLocationName(result.locationDetails?.name || "");
				setLocationData(result.locationDetails);
				setEnhanceDetails(result.enhanceDetails || []);
				if (!localStorage.getItem("greeted")) {
					setShowGreet(true);
					localStorage.setItem("greeted", "true");
					setTimeout(() => {
						setShowGreet(false);
					}, 2500);
				}
			} catch (error) {
				console.error("Error loading menus:", error);
			}
		};

		fetchData();
	}, [loc_id]);

	const waiter_sup = locationData.waiter_support;

	const getMenus = () => [
		"All",
		...new Set(menuData.map((item) => item.inmenu)),
	];

	const getAllCategories = () => [
		...new Set(getMenuItems().map((item) => item.incategory)),
	];

	const getMenuItemsToDisplay = () =>
		getAllCategories().map((category) => ({
			category,
			menuItems: getMenuItems().filter((item) => item.incategory === category),
		}));

	const getMenuItems = () =>
		menuData.filter(
			(item) => selectedMenu === "All" || item.inmenu === selectedMenu
		);

	const getHighlightBanners = () =>
		enhanceDetails.filter(
			(item) => item.banner_type === "Highlight" && item.isActive
		);

	const isMoreThanOneHighlightBanners = () => getHighlightBanners().length > 1;

	const handleAddToCart = (item, storageId) => {
		const identifier = storageId || item.id;
		setCartItems((prev) => ({
			...prev,
			[identifier]: {
				...item,
				quantity: (prev[identifier]?.quantity || 0) + 1,
			},
		}));
	};

	const handleRemoveFromCart = (item, storageId = "") => {
		const identifier = storageId || item.id;
		setCartItems((prev) => {
			const newCartItems = { ...prev };

			if (newCartItems[identifier]?.quantity > 1) {
				newCartItems[identifier].quantity -= 1;
			} else {
				delete newCartItems[identifier];
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
	};

	return (
		<div className="digimenu">
			{showGreet && (
				<div className="digimenu__greet">
					<div className="digimenu__greet--content">
						<h2 className="digimenu__greet--content-header">
							Welcome to <span>{locationName}</span>
						</h2>
						<h3 className="digimenu__greet--content-sub">
							Table: <span>{table_id}</span>
						</h3>
					</div>
				</div>
			)}
			<h1 className="digimenu__header mb-6">
				Welcome to <span>{locationName} | </span> Table: <span>{table_id}</span>
			</h1>
			<div className="digimenu__highlights-container">
				{getHighlightBanners()?.map((banner) => (
					<div
						className="digimenu__highlight-container"
						style={{
							width: isMoreThanOneHighlightBanners() ? "45vw" : "95vw",
						}}
						key={banner.id}
					>
						<HighlightBanner
							highlightDetails={banner}
							bannerHeight={isMoreThanOneHighlightBanners() ? 100 : 200}
						/>
					</div>
				))}
			</div>
			{/* Menu Tabs with Dropdowns */}
			<div className="category-wrapper">
				{getMenus()?.map((menu) => (
					<div
						key={menu}
						className={`category ${
							selectedMenu === menu ? "category--active" : ""
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
			{getMenuItemsToDisplay().map((menuItem) => (
				<div className="menu-items__category" key={menuItem.category}>
					<div className="menu-items__category--header">
						{menuItem.category}
					</div>
					<div
						className={`menu-items ${
							menuItemsFormat === "grid"
								? "menu-items--grid"
								: "menu-items--list"
						}`}
					>
						{menuItem.menuItems?.map((item) => (
							<MenuItemCard
								key={item.id + selectedMenu}
								item={item}
								menuItemsFormat={menuItemsFormat}
								handleAddToCart={handleAddToCart}
								handleRemoveFromCart={handleRemoveFromCart}
								cartItems={cartItems}
								loc_id={loc_id}
							/>
						))}
					</div>
				</div>
			))}
			{/* Cart Toggle */}
			{showCart && (
				<div className={` ${cartWrapperClass}`}>
					<Cart
						cartItems={cartItems}
						handleAddToCart={handleAddToCart}
						handleRemoveFromCart={handleRemoveFromCart}
						handleCloseCart={handleCloseCart}
						table_id={table_id}
						waiter_sup={waiter_sup}
						clearCart={() => setCartItems({})} // Clear the cart
					/>
				</div>
			)}
			{/* Floating Cart Button */}
			<button className="cart-button" onClick={handleCloseCart}>
				<FaShoppingCart className="cart-icon" />
			</button>
		</div>
	);
}
