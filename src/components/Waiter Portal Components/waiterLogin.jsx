import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import useNavigate and useParams
import { getagentlogin } from "../../services/supported_api";
import LogoutButton from "../LogoutButton";

export default function WaiterLogin() {
	const [mbNum, setMbNum] = useState("");
	const [password, setPassword] = useState(["", "", "", "", "", ""]);
	const [error, setError] = useState("");
	const [showModal, setShowModal] = useState(false); // Modal state
	const navigate = useNavigate();
	const { loc_id } = useParams(); // Get loc_id from the URL

	const handleMobileChange = (e) => {
		const value = e.target.value;
		if (/^\d*$/.test(value)) {
			// Only allow numbers
			setMbNum(value);
		}
	};

	const handlePasswordChange = (index, value) => {
		if (value.length <= 1) {
			const newPassword = [...password];
			newPassword[index] = value;
			setPassword(newPassword);

			if (value && index < 5) {
				document.getElementById(`password-${index + 1}`).focus();
			}
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!mbNum || password.includes("")) {
			setError("Both mobile number and password are required.");
			setShowModal(true);
			return;
		}

		const passwordString = password.join("");
		console.log(passwordString);

		try {
			const response = await getagentlogin(mbNum);
			console.log(response[0].password);
			if (response[0].password === passwordString) {
				navigate(`/location/${loc_id}/${response[0].agent_id}`);
			} else {
				setError("Invalid mobile number or password.");
				setShowModal(true);
			}
		} catch (err) {
			setError("An error occurred during login. Please try again.");
			setShowModal(true);
		}
	};

	const closeModal = () => setShowModal(false);

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
			<div className="logout-wrapper">
				<LogoutButton />
			</div>
			<div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
				<h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
					Waiter Login
				</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-600">
							Mobile Number
						</label>
						<input
							type="text"
							value={mbNum}
							onChange={handleMobileChange}
							required
							maxLength={10}
							placeholder="Enter mobile number"
							className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-600 mb-2">
							6-Digit Password
						</label>
						<div className="flex justify-between space-x-2">
							{password.map((digit, index) => (
								<input
									key={index}
									type="text"
									id={`password-${index}`}
									value={digit}
									maxLength={1}
									onChange={(e) => handlePasswordChange(index, e.target.value)}
									className="w-12 h-12 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg font-semibold"
								/>
							))}
						</div>
					</div>

					<button
						type="submit"
						className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition duration-200"
					>
						Login
					</button>
				</form>
			</div>

			{/* Modal for Errors */}
			{showModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
					<div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
						<h3 className="text-lg font-semibold mb-4 text-red-600">Error</h3>
						<p className="text-sm text-gray-700 mb-4">{error}</p>
						<button
							onClick={closeModal}
							className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition duration-200"
						>
							Close
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
