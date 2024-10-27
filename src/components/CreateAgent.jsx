import React, { useState } from "react";
import { useParams } from "react-router-dom"; // Import to get route parameters
import { addagent } from "../services/supported_api";

export default function CreateAgent() {
	const { loc_id } = useParams(); // Get location_id from URL

	const [agent, setAgent] = useState({
		name: "",
		mobile: "",
		gender: "",
		level: "L1",
	});
	const [password, setPassword] = useState("");
	const [isModalVisible, setIsModalVisible] = useState(false); // Modal for password display
	const [showCreateButton, setShowCreateButton] = useState(true); // Show/Hide Create Agent button
	const [confirmationModalVisible, setConfirmationModalVisible] =
		useState(false); // Confirmation modal

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setAgent({ ...agent, [name]: value });
	};

	const generatePassword = () => {
		const digits = "0123456789";
		let pass = "";
		for (let i = 0; i < 6; i++) {
			pass += digits.charAt(Math.floor(Math.random() * digits.length));
		}
		return pass;
	};

	const generateAgentId = (loc_id, level) => {
		const randomDigits = Math.floor(1000 + Math.random() * 9000);
		const locPrefix = loc_id.slice(0, 5).toUpperCase();
		return `${locPrefix}-${level}-${randomDigits}`;
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const newPassword = generatePassword();
		setPassword(newPassword);
		const agentId = generateAgentId(loc_id, agent.level);

		setIsModalVisible(true);
		setShowCreateButton(false); // Hide Create Agent button

		const agentPayload = {
			...agent,
			password: newPassword,
			agent_id: agentId,
			assignedtables: "",
			location_id: loc_id,
		};

		console.log("Submitting agent:", agentPayload);
		addagent(agentPayload);
	};

	const handleCreateAnother = () => {
		setConfirmationModalVisible(true); // Show confirmation modal
	};

	const handleConfirmationOk = () => {
		setConfirmationModalVisible(false); // Hide confirmation modal
		setIsModalVisible(false); // Hide password modal
		setShowCreateButton(true); // Show Create Agent button again
		setAgent({ name: "", mobile: "", gender: "", level: "L1" }); // Reset form
		setPassword(""); // Clear password
	};

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
			<h1 className="text-4xl font-semibold mb-6 text-gray-700 text-center">
				Create and Manage Your Agents
			</h1>

			{/* Action buttons */}
			<div className="flex space-x-8 mb-10">
				<button
					className="bg-white text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
					onClick={() => alert("Create Login QR functionality coming soon!")}
				>
					Create Login QR
				</button>
				<button
					className="bg-white text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
					onClick={() => alert("View All Agents functionality coming soon!")}
				>
					View All Agents
				</button>
			</div>

			<div className="flex items-start space-x-16">
				{/* Form Section */}
				<div className="bg-white shadow-xl rounded-lg p-8 w-96">
					<h2 className="text-2xl font-medium mb-6 text-center text-gray-700">
						Create Agent
					</h2>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-600">
								Name
							</label>
							<input
								type="text"
								name="name"
								value={agent.name}
								onChange={handleInputChange}
								required
								className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-600">
								Mobile
							</label>
							<input
								type="text"
								name="mobile"
								value={agent.mobile}
								onChange={handleInputChange}
								required
								className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-600">
								Gender
							</label>
							<select
								name="gender"
								value={agent.gender}
								onChange={handleInputChange}
								required
								className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
							>
								<option value="">Select Gender</option>
								<option value="male">Male</option>
								<option value="female">Female</option>
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-600">
								Level
							</label>
							<select
								name="level"
								value={agent.level}
								onChange={handleInputChange}
								className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
							>
								<option value="L1">L1</option>
								<option value="L2">L2</option>
								<option value="L3">L3</option>
							</select>
						</div>

						{showCreateButton && (
							<button
								type="submit"
								className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition duration-200"
							>
								Create Agent
							</button>
						)}
					</form>
				</div>

				{/* Password Modal */}
				{isModalVisible && (
					<div className="ml-8 bg-white shadow-xl rounded-lg p-6 w-80">
						<h3 className="text-lg font-semibold mb-4 text-center text-gray-700">
							Agent Details
						</h3>
						<div className="mb-4">
							<h4 className="text-sm font-medium text-gray-600">
								Generated Password:
							</h4>
							<div className="flex space-x-2 justify-center mt-2">
								{password.split("").map((char, index) => (
									<div
										key={index}
										className="w-12 h-12 flex items-center justify-center bg-gray-200 border border-gray-300 rounded-md text-lg font-semibold text-gray-800"
									>
										{char}
									</div>
								))}
							</div>
						</div>
						<button
							onClick={handleCreateAnother}
							className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200 mt-4"
						>
							Create Another Agent
						</button>
					</div>
				)}

				{/* Confirmation Modal */}
				{confirmationModalVisible && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
						<div className="bg-white p-6 rounded-lg shadow-lg">
							<h3 className="text-center text-lg font-semibold mb-4">
								Please make sure the password is shared or noted separately.
							</h3>
							<button
								onClick={handleConfirmationOk}
								className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-200"
							>
								OK
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
