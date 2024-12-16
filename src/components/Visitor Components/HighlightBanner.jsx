import React, { useEffect, useState, useRef } from "react";
import "../../scss/HighlightBanner.scss";
import {
	faCircleArrowLeft,
	faCircleArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const HighlightBanner = ({ highlightDetails }) => {
	const [items, setItems] = useState([]);
	const [current, setCurrent] = useState(0);
	const itemsRef = useRef([]);

	useEffect(() => {
		setItems(JSON.parse(highlightDetails.associate_item || "[]"));
	}, [highlightDetails]);

	useEffect(() => {
		itemsRef.current = itemsRef.current.slice(0, items.length);
	}, [items]);

	const previousSlide = () => {
		setCurrent((prev) => (prev + 1) % items.length);
	};

	const nextSlide = () => {
		setCurrent((prev) => (prev - 1 + items.length) % items.length);
	};

	const getCurrentItem = () => items[current] || {};
	const [animationClass, setAnimationClass] = useState("");
	const ref = useRef(false);

	const isVisibleInViewport = (element) => {
		const rect = element?.getBoundingClientRect();
		if (!rect) return;
		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <=
				(window.innerHeight || document.documentElement.clientHeight) &&
			rect.right <= (window.innerWidth || document.documentElement.clientWidth)
		);
	};

	useEffect(() => {
		if (ref.current) {
			// Trigger animation on re-render
			setAnimationClass("white-fade");

			// Optionally reset animation after it's done
			const timer = setTimeout(() => setAnimationClass(""), 750);
			return () => clearTimeout(timer);
		} else {
			// Skip animation on initial render
			ref.current = true;
		}
	}, [current]);

	return (
		<div className={`banner ${animationClass}`}>
			<div className="banner-items">
				{items.map((item, index) => (
					<div
						className={`banner__content ${
							current === index ? "banner__content--active" : ""
						}`}
						key={item.id}
						ref={(el) => (itemsRef.current[current] = el)}
					>
						<div className="banner__background">
							<div className="banner__name">{item.name}</div>
							<img
								className="banner__background--image"
								src={item.image}
								alt="background"
							/>
						</div>
					</div>
				))}
			</div>

			<div className="banner__icons">
				<FontAwesomeIcon icon={faCircleArrowLeft} onClick={nextSlide} />
				<FontAwesomeIcon icon={faCircleArrowRight} onClick={previousSlide} />
			</div>
			<div className="banner__dots">
				{Array.from({ length: items.length }, (_, i) => i).map((_, index) => (
					<div
						className={`banner__dots-unit ${
							index === isVisibleInViewport(itemsRef.current[index])
								? "banner__dots-unit--active"
								: ""
						}`}
						key={index}
					></div>
				))}
			</div>
			{/* <div key={current} className="banner__progress"></div> */}
		</div>
	);
};

export default HighlightBanner;
