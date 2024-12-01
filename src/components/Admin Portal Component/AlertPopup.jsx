import React from "react";
import "../../scss/AlertPopup.scss";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AlertPopup = ({ message, colorClass, closeFunction }) => {
	return (
		<div className={`alert ${colorClass}`}>
			{message}{" "}
			{closeFunction && (
				<span className="alert-close-container">
					<FontAwesomeIcon icon={faCircleXmark} onClick={closeFunction} />
				</span>
			)}
		</div>
	);
};

export default AlertPopup;
