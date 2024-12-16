import React, { useEffect, useState, useRef } from "react";
import "../../scss/HighlightBanner.scss";
import {
	faCircleArrowLeft,
	faCircleArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { progress } from "framer-motion";

const HighlightBanner = ({ highlightDetails }) => {
	const [items, setItems] = useState([]);
	const [current, setCurrent] = useState(0);

	useEffect(() => {
		setItems(JSON.parse(highlightDetails.associate_item || "[]"));
	}, [highlightDetails]);

	const previousSlide = () => {
		setCurrent((prev) => (prev + 1) % items.length);
	};

	const nextSlide = () => {
		setCurrent((prev) => (prev - 1 + items.length) % items.length);
	};

	useEffect(() => {
		if (items.length > 0) {
			startTimer();
		}
		return () => clearInterval(timerRef.current);
	}, [items]);

	const getCurrentItem = () => items[current] || {};
	const [animationClass, setAnimationClass] = useState("");
	const ref = useRef(false);

	useEffect(() => {
		console.log(
			`current item ${current}`,
			items.length,
			`for item ${highlightDetails.id}`
		);
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
			<div className="banner__background">
				<img
					className="banner__background--image"
					src={getCurrentItem().image}
					alt="background"
				/>
			</div>
			<div className="banner__name">{getCurrentItem().name}</div>
			<div className="banner__icons">
				<FontAwesomeIcon icon={faCircleArrowLeft} onClick={nextSlide} />
				<FontAwesomeIcon icon={faCircleArrowRight} onClick={previousSlide} />
			</div>
			<div className="banner__dots">
				{Array.from({ length: items.length }, (_, i) => i).map((_, index) => (
					<div
						className={`banner__dots-unit ${
							index === current ? "banner__dots-unit--active" : ""
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
