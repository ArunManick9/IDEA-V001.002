import "../../scss/MenuDetail.scss";
import { useEffect, useState } from "react";
import { faBowlFood, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fetchMenuItem } from "../../services/supported_api";

export default function MenuDetail({
	loc_id,
	menu_id,
	handleAddToCart,
	handleRemoveFromCart,
	cartItems,
	handleCloseModal,
	adjustAddons,
}) {
	const [menuItem, setMenuItem] = useState({});
	const [itemName, setItemName] = useState();
	const [itemPrice, setItemPrice] = useState();
	const [cartCount, setCartCount] = useState(0);
	const [size, setItemSize] = useState();
	const [addOnObject, setAddOnObject] = useState([]);

	useEffect(() => {
		async function extractMenuItem() {
			try {
				const response = await fetchMenuItem(menu_id, loc_id);
				await setMenuItem(response);
			} catch (error) {
				console.error("Error while fetching menu item:", error);
			}
		}
		extractMenuItem();
	}, [menu_id, loc_id]);

	useEffect(() => {
		const getId = () => (size ? `${menuItem.id}${size}` : menuItem.id);
		// Check if the menu item exists in cartItems after menuItem is updated
		if (menuItem.id && cartItems[getId()]) {
			setCartCount(cartItems[getId()].quantity || 0);
		} else {
			setCartCount(0);
		}
	}, [menuItem, cartItems, size]);

	const isQuantityBasedComponent = () => Boolean(menuItem.quantity_component);

	const isAddOnsAvailable = () => Boolean(menuItem.addons_list);

	const getAddOnString = () => addOnObject.join(", ");

	function handleAddOnChange(e) {
		if (e.target.checked) {
			setAddOnObject((prev) => [...prev, e.target.name]);
		} else {
			setAddOnObject((prev) => prev.filter((item) => item !== e.target.name));
		}
	}

	useEffect(() => {
		const addOnTotal =
			getAddons()
				?.filter((addOn) => addOnObject.includes(addOn.name))
				?.reduce((sum, current) => sum + Number(current.price), 0) || 0;
		if (size) {
			setItemPrice((prev) => parseFloat(Number(prev + addOnTotal).toFixed(2)));
		} else if (addOnObject.length > 0) {
			setItemPrice(parseFloat(Number(menuItem.price) + addOnTotal));
		}
		// propagating the changes upwards
		if (isAddOnsAvailable() && cartCount > 0) {
			adjustAddons(
				isQuantityBasedComponent() ? `${menuItem.id}${size}` : menuItem.id,
				{
					...menuItem,
					price: itemPrice,
					...(isQuantityBasedComponent() && {
						name: itemName,
						storageId: `${menuItem.id}${size}`,
					}),
				},
				getAddOnString()
			);
		}
	}, [addOnObject, size]);

	const getQuantityComponent = () => JSON.parse(menuItem.quantity_component);
	const getAddons = () => JSON.parse(menuItem.addons_list || "[]") || [];
	function handleQuantitySelection(size, price) {
		setItemName(`${menuItem.name} : ${size}`);
		setItemPrice(parseFloat(Number(price).toFixed(2)));
		setItemSize(size);
	}

	return (
		<div className="menu-details-modal">
			<div className="menu-details-modal__content">
				<nav className="navbar">
					<div className="navbar-left">
						<header className="navbar__header">{menuItem.inmenu}</header>
						<header className="navbar__sub">{menuItem.incategory}</header>
					</div>
					{/* Close icon added here */}
					<FontAwesomeIcon
						icon={faTimes}
						className="navbar__close-icon"
						onClick={handleCloseModal}
					/>
				</nav>
				<div className="menu-details--content">
					<div className="menu-details--content__box">
						<div className="content__box--top">
							<img
								src={menuItem.image}
								alt={menuItem.name}
								className="menu-details--content__box--image object-cover"
							/>
							<div
								className={`menu-details--content__box--icon ${
									menuItem.veg_or_nonveg === "Veg" ? "icon--green" : "icon--red"
								}`}
							>
								<FontAwesomeIcon icon={faBowlFood} />
							</div>
						</div>
						<div className="content__box--bottom">
							<div className="menu-details--content__box--name">
								{menuItem.name}
							</div>
							<div className="content__box--bottom-2">
								<div className="menu-details--content__box--description">
									{menuItem.description?.length > 300
										? menuItem.description?.slice(0, 300).concat("...")
										: menuItem.description}
								</div>
								{cartCount > 0 && (
									<div className="cart-counter">
										<button
											onClick={(e) => {
												setCartCount((currentCount) => currentCount - 1);
												e.stopPropagation();
												handleRemoveFromCart(
													{
														...menuItem,
														...(isQuantityBasedComponent() && {
															name: itemName,
															price: itemPrice,
															storageId: `${menuItem.id}${size}`,
														}),
													},
													isQuantityBasedComponent()
														? `${menuItem.id}${size}`
														: menuItem.id
												);
											}}
											className="cart__icon rounded-full transition-all"
										>
											-
										</button>
										<span className="font-semibold">{cartCount}</span>
										<button
											onClick={(e) => {
												setCartCount((currentCount) => currentCount + 1);
												e.stopPropagation();
												handleAddToCart(
													{
														...menuItem,
														...(isQuantityBasedComponent() && {
															name: itemName,
															price: itemPrice,
															storageId: `${menuItem.id}${size}`,
														}),
													},
													isQuantityBasedComponent()
														? `${menuItem.id}${size}`
														: menuItem.id
												);
											}}
											className="cart__icon rounded-full transition-all"
										>
											+
										</button>
									</div>
								)}
							</div>
							{isQuantityBasedComponent() && (
								<div className="content__box--bottom-4">
									<div className="menu-details--content__box--quantity">
										Choose Quantity
									</div>
									<div className="menu-details--content__box--quantity-bubbles">
										{getQuantityComponent().map((bubble, index) => (
											<div
												className={`menu-details--content__box--quantity-bubble ${
													size == bubble.size ? "selected-bubble" : ""
												}`}
												key={index}
												onClick={() =>
													handleQuantitySelection(bubble.size, bubble.price)
												}
											>
												{bubble.size}: ${bubble.price}
											</div>
										))}
									</div>
								</div>
							)}

							{isAddOnsAvailable() && (
								<div className="content__box--bottom-5">
									<div className="menu-details--content__box--addons">
										Choose Addons
									</div>
									<div className="menu-details--content__box--addon-bubbles">
										{getAddons().map((item, index) => (
											<div
												className="menu-details--content__box--addon-bubble"
												key={index}
											>
												<input
													type="checkbox"
													name={item.name}
													id={item.name}
													checked={addOnObject.includes(item.name)}
													onChange={handleAddOnChange}
												/>
												<span>
													{item.name} - ${item.price}
												</span>
											</div>
										))}
									</div>
								</div>
							)}

							<div className="content__box--bottom-3">
								Price:{" "}
								<span>
									${itemPrice?.toFixed(2) || menuItem.price?.toFixed(2)}
								</span>
							</div>
						</div>
						<div className="content__box--button">
							{cartCount === 0 && (
								<button
									onClick={(e) => {
										setCartCount(1);
										e.stopPropagation();
										handleAddToCart(
											{
												...menuItem,
												...(isQuantityBasedComponent() && {
													name: itemName,
													price: itemPrice,
													storageId: `${menuItem.id}${size}`,
												}),
												...(isAddOnsAvailable() && {
													addOns: getAddOnString(),
													price: itemPrice,
												}),
											},
											isQuantityBasedComponent()
												? `${menuItem.id}${size}`
												: menuItem.id
										);
									}}
									className="neu-button neu-button--black"
									disabled={isQuantityBasedComponent() && !size}
								>
									Add to Cart
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
