import "../../scss/MenuDetail.scss";
import { useEffect, useState } from "react";
import { faBars, faBowlFood, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fetchMenuItem } from "../../services/supported_api";

export default function MenuDetail({ loc_id, menu_id, handleAddToCart, handleRemoveFromCart, cartItems, handleCloseModal }) {
    const [menuItem, setMenuItem] = useState({});
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        async function extractMenuItem() {
            try {
                const response = await fetchMenuItem(menu_id, loc_id);
                setMenuItem(response);
            } catch (error) {
                console.error("Error while fetching menu item:", error);
            }
        }
        extractMenuItem();
    }, [menu_id, loc_id]);

    useEffect(() => {
        // Check if the menu item exists in cartItems after menuItem is updated
        if (menuItem.id && cartItems[menuItem.id]) {
            setCartCount(cartItems[menuItem.id].quantity || 0);
        }
    }, [menuItem, cartItems]);

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
                                    {menuItem.description}
                                </div>
                                {cartCount > 0 && (
                                    <div className="cart-counter">
                                        <button
                                            onClick={(e) => {
                                                setCartCount((currentCount) => currentCount - 1);
                                                e.stopPropagation();
                                                handleRemoveFromCart(menuItem);
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
                                                handleAddToCart(menuItem);
                                            }}
                                            className="cart__icon rounded-full transition-all"
                                        >
                                            +
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="content__box--bottom-3">
                                Price: <span>${menuItem.price?.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="content__box--button">
                            {cartCount === 0 && (
                                <button
                                    onClick={() => setCartCount(1)}
                                    className="neu-button neu-button--black"
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
