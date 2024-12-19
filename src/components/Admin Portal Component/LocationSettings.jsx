import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
	loadlocation,
	editWaiterSupport,
	editMenuOtp,
} from "../../services/supported_api";
import "../../scss/LocationSettings.scss";

const LocationSettings = () => {
	const { loc_id } = useParams(); // Retrieve `loc_id` from URL params
	const [locationData, setLocationData] = useState(null);
	const [waiterSupport, setWaiterSupport] = useState(false);
	const [otpValidation, setOtpValidation] = useState(false);

	const [activeTheme, setActiveTheme] = useState("three");

	const hardCodedColorPalettes = [
		{
			id: 1,
			name: "one",
			primary: "#001d3dff",
			secondary: "#003566ff",
			contrast: "#ffc300ff",
			darkPrimary: "#000814ff",
		},
		{
			id: 2,
			name: "two",
			primary: "#500096",
			secondary: "#7a178b",
			contrast: "#ea698b",
			darkPrimary: "#220039",
		},
		{
			id: 3,
			name: "three",
			primary: "#22223b",
			secondary: "#4a4e69",
			contrast: "#f2e9e4",
			darkPrimary: "#12121e",
		},
		{
			id: 4,
			name: "four",
			primary: "#033f63",
			secondary: "#28666e",
			contrast: "#fedc97",
			darkPrimary: "#002135",
		},
	];

	useEffect(() => {
		const fetchLocationData = async () => {
			try {
				const data = await loadlocation(loc_id);
				console.log("Location Data:", data);
				setLocationData(data[0]); // Assuming the API returns an array
				setWaiterSupport(data[0]?.waiter_support || false);
				setOtpValidation(data[0]?.menu_otp || false);
			} catch (error) {
				console.error("Error fetching location data:", error);
			}
		};

		fetchLocationData();
	}, [loc_id]);

	const handleSave = async () => {
		try {
			await editWaiterSupport(waiterSupport, loc_id);
			await editMenuOtp(otpValidation, loc_id);
			alert("Settings saved successfully!");
		} catch (error) {
			console.error("Error saving settings:", error);
			alert("Failed to save settings. Please try again.");
		}
	};

	const handleWaiterSupportToggle = () => {
		setWaiterSupport((prev) => !prev);
	};

	const handleOtpValidationToggle = () => {
		setOtpValidation((prev) => !prev);
	};

	if (!locationData) {
		return (
			<div className="flexbox justify-center items-center min-h-screen settings-loader">
				<p className="text-lg fg-white">Loading location settings...</p>
			</div>
		);
	}

	return (
		<div className="flexbox flex-col justify-start items-center p-6 min-h-screen settings">
			{/* Title */}
			<h1 className=" settings__header">Settings</h1>

			{/* Waiter Application Support */}
			<div className="flexbox justify-between items-center w-full max-w-lg p-4 bg-gray-1 rounded-lg shadow-md">
				<p className="text-lg fg-secondary">
					Do you want waiter application support?
				</p>
				<button
					className={`relative w-12 h-6 rounded-full ${
						waiterSupport ? "bg-secondary" : "bg-gray-400"
					} transition duration-200`}
					onClick={handleWaiterSupportToggle}
				>
					<div
						className={`absolute w-6 h-6 toggle-button ${
							waiterSupport ? "toggle-button--on" : "toggle-button--off"
						}`}
					></div>
				</button>
			</div>

			{/* OTP Validation on Customer Login */}
			<div className="flexbox justify-between items-center w-full max-w-lg p-4 bg-gray-1 rounded-lg shadow-md">
				<p className="text-lg fg-secondary">
					Do you want OTP validation on Customer login?
				</p>
				<button
					className={`relative w-12 h-6 rounded-full ${
						otpValidation ? "bg-secondary" : "bg-gray-400"
					} transition duration-200`}
					onClick={handleOtpValidationToggle}
				>
					<div
						className={`absolute w-6 h-6 toggle-button ${
							otpValidation ? "toggle-button--on" : "toggle-button--off"
						}`}
					></div>
				</button>
			</div>
			<div className="settings__color-palette">
				<h3 className="settings__color-palette--header">
					Choose a color palette for your admin portal:
				</h3>
				<div className="settings__color-palette--container">
					{hardCodedColorPalettes.map((palette) => (
						<div
							className={`settings__color-palette--item-wrapper ${
								activeTheme === palette.name ? "active-theme" : ""
							}`}
							key={palette.id}
						>
							<div
								className="settings__color-palette--item"
								onClick={() => setActiveTheme(palette.name)}
							>
								<div
									className="color--contrast"
									style={{ backgroundColor: palette.contrast }}
								></div>
								<div
									className="color--secondary"
									style={{ backgroundColor: palette.secondary }}
								></div>
								<div
									className="color--primary"
									style={{ backgroundColor: palette.primary }}
								></div>
							</div>
						</div>
					))}
				</div>
			</div>
			{/* Save Button */}
			<button className="btn btn--submit" onClick={handleSave}>
				Save
			</button>
		</div>
	);
};

export default LocationSettings;
