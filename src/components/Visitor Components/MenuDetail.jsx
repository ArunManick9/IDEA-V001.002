import "../../scss/MenuDetail.scss";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { faBars, faBowlFood } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fetchMenuItem } from "../../services/supported_api";

export default function MenuDetail() {
	const { loc_id, menu_id } = useParams();
	const [menuItem, setMenuItem] = useState({});
	const [cartCount, setCartCount] = useState(0);
	useEffect(() => {
		async function extractMenuItem() {
			try {
				const response = await fetchMenuItem(menu_id, loc_id);
				setMenuItem(response);
			} catch (error) {
				console.error("Error while fetching menu item");
			}
		}
		extractMenuItem();
	}, []);

	return (
		<div className="menu-details">
			<nav className="navbar">
				<div className="navbar-left">
					<header className="navbar__header">{menuItem.inmenu}</header>
					<header className="navbar__sub">{menuItem.incategory}</header>
				</div>
				<FontAwesomeIcon icon={faBars} className="navbar__menu" />
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
								menuItem.veg_or_nonveg === "Veg" ? "icon--red" : "icon--red"
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
								{menuItem.description}
							</div>
							{cartCount > 0 && (
								<div className="cart-counter">
									<button
										onClick={() =>
											setCartCount((currentCount) => currentCount - 1)
										}
										className="cart__icon rounded-full transition-all"
									>
										-
									</button>
									<span className="font-semibold">{cartCount}</span>
									<button
										onClick={() =>
											setCartCount((currentCount) => currentCount + 1)
										}
										className="cart__icon rounded-full transition-all"
									>
										+
									</button>
								</div>
							)}
						</div>
					</div>
					<div className="content__box--button">
						<button
							disabled={cartCount > 0}
							onClick={() => setCartCount(1)}
							className="neu-button neu-button--black"
						>
							Add to Cart
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
