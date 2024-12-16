import React, { useEffect, useState, useRef } from "react";
import "../../scss/HighlightBanner.scss";
import {
	faCircleArrowLeft,
	faCircleArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const HighlightBanner = ({ highlightDetails, bannerHeight = 100 }) => {
	const [items, setItems] = useState([]);
	const [current, setCurrent] = useState(0);
	const timerRef = useRef(null);

	useEffect(() => {
		setItems(JSON.parse(highlightDetails.associate_item || "[]"));
	}, [highlightDetails]);

	const startTimer = () => {
		clearInterval(timerRef.current);
		timerRef.current = setInterval(() => {
			nextSlide();
		}, 4000);
	};

	const previousSlide = () => {
		setCurrent((prev) => (prev + 1) % items.length);
		startTimer();
	};

	const nextSlide = () => {
		setCurrent((prev) => (prev - 1 + items.length) % items.length);
		startTimer();
	};

	const getCurrentItem = () => items[current] || {};
	const [animationClass, setAnimationClass] = useState("");
	const ref = useRef(false);

	useEffect(() => {
		if (ref.current) {
			setAnimationClass("white-fade");
			const timer = setTimeout(() => setAnimationClass(""), 750);
			return () => clearTimeout(timer);
		} else {
			// Skip animation on initial render
			ref.current = true;
		}
	}, [current]);

	useEffect(() => {
		if (items.length > 0) {
			startTimer();
		}
		return () => clearInterval(timerRef.current);
	}, [items]);

	return (
		<div
			className={`banner ${animationClass}`}
			style={{ height: bannerHeight + "px" }}
		>
			<div className="banner__background">
				<img
					className="banner__background--image"
					src={getCurrentItem().image}
					alt="background"
					style={{ height: bannerHeight + "px" }}
				/>
			</div>
			<div className="banner__textings">
				<div
					className="banner__name banner__title"
					style={{ maxWidth: bannerHeight === 100 ? "175px" : "325px" }}
				>
					{highlightDetails.banner_name}
				</div>
				<div
					className="banner__name"
					style={{ maxWidth: bannerHeight === 100 ? "175px" : "325px" }}
				>
					{getCurrentItem().name}
				</div>
			</div>
			{items?.length > 1 && (
				<>
					<div className="banner__icons">
						<FontAwesomeIcon icon={faCircleArrowLeft} onClick={nextSlide} />
						<FontAwesomeIcon
							icon={faCircleArrowRight}
							onClick={previousSlide}
						/>
					</div>
					<div className="banner__dots">
						{Array.from({ length: items.length }, (_, i) => i).map(
							(_, index) => (
								<div
									className={`banner__dots-unit ${
										index === current ? "banner__dots-unit--active" : ""
									}`}
									key={index}
								></div>
							)
						)}
					</div>
					<div
						key={current}
						className="banner__progress"
						style={{ height: bannerHeight === 100 ? "2px" : "4px" }}
					></div>
				</>
			)}
		</div>
	);
};

export default HighlightBanner;
