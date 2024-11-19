import React, { useState } from "react";
import QRCode from "qrcode";
import { FiDownload } from "react-icons/fi"; // For download icon
import { useNavigate, useParams } from "react-router-dom";
import LogoutButton from "./LogoutButton";

export default function CreateQR() {
	const { loc_id } = useParams();
	const [tableIdentifier, setTableIdentifier] = useState("");
	const [qrImage, setQrImage] = useState("");
	const [generatedUrl, setGeneratedUrl] = useState("");

	const navigate = useNavigate();

	// Retrieve the access token from localStorage (or location state as fallback)
	const access_token =
		location.state?.access_token || localStorage.getItem("access_token");
	const user_id = location.state?.user_id || localStorage.getItem("user_id");

	// Ensure the token is set
	if (!access_token || !user_id) {
		navigate("/"); // Redirect to login if no token/user_id is found
	}

	// Handle table identifier change and update the URL
	const handleTableIdentifierChange = (e) => {
		const tableId = e.target.value;
		setTableIdentifier(tableId);
		setGeneratedUrl(`http://localhost:5173/digimenu/${loc_id}/${tableId}`);
	};

	// Function to generate the QR code
	const handleCreateQRCode = () => {
		if (!tableIdentifier) return;
		QRCode.toDataURL(generatedUrl, (err, qr) => {
			if (err) console.error(err);
			setQrImage(qr); // Set the QR code image
		});
	};

	// Function to download the QR code image
	const handleDownloadQRCode = () => {
		const link = document.createElement("a");
		link.href = qrImage;
		link.download = `QR_${tableIdentifier}.png`;
		link.click();
	};

	return (
		<div className="flex flex-col items-center justify-center p-6 space-y-6 bg-gray-100 rounded-lg shadow-lg">
			<div className="logout-wrapper">
				<LogoutButton />
			</div>
			{/* Heading */}
			<h2 className="text-2xl font-medium text-gray-800">
				Enter Table Name to Generate a Unique QR Code
			</h2>

			{/* Table Identifier Input */}
			<input
				type="text"
				value={tableIdentifier}
				onChange={handleTableIdentifierChange}
				placeholder="Enter Table Identifier (e.g., A5)"
				className="p-3 border rounded-lg w-full max-w-md"
			/>

			{/* Non-editable URL field */}
			<div className="w-full max-w-md">
				<label className="block text-gray-700 mb-2">Generated URL</label>
				<input
					type="text"
					value={generatedUrl}
					readOnly
					className="p-3 border rounded-lg w-full bg-gray-200"
				/>
			</div>

			{/* Create QR Button */}
			<button
				onClick={handleCreateQRCode}
				className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
			>
				Create QR Code
			</button>

			{/* QR Code Display and Download */}
			{qrImage && (
				<div className="flex flex-col items-center mt-6 space-y-4">
					<img src={qrImage} alt="Generated QR Code" className="w-48 h-48" />
					<button
						onClick={handleDownloadQRCode}
						className="flex items-center space-x-2 bg-green-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
					>
						<FiDownload />
						<span>Download QR Code</span>
					</button>
				</div>
			)}
		</div>
	);
}
