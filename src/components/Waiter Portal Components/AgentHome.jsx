import React, { useState, useEffect } from "react";
import OrdersHandlerScreen from "./OrderHandlerScreen";
import ConfirmTableScreen from "./ConfirmationTable";
import ProfileScreen from "./ProfileScreen";
import { useParams } from "react-router-dom";
import { getagentdetails } from "../../services/supported_api";
import "../../scss/AgentHome.scss";

export default function AgentHome() {
	const [currentPage, setCurrentPage] = useState(0);
	const [assignedTables, setAssignedTables] = useState([]);
	const [confirmCounter, setConfirmCounter] = useState(0);
	const [ordersCounter, setOrdersCounter] = useState(0);

	const { loc_id, agent_id } = useParams();

	useEffect(() => {
		const fetchAgentDetails = async () => {
			try {
				const [agentData] = await getagentdetails(agent_id); // Fetch agent details
				if (agentData && agentData.assignedtables) {
					setAssignedTables(agentData.assignedtables); // Set assigned tables
				}
			} catch (error) {
				console.error("Error fetching agent details:", error);
			}
		};

		fetchAgentDetails();
	}, [agent_id]);

	const tabs = [
		{
			id: 0,
			label: "Confirm Tables",
			counter: confirmCounter,
			component: (
				<ConfirmTableScreen
					loc_id={loc_id}
					assignedTables={assignedTables}
					onCountChange={setConfirmCounter} // Update Confirm Tables counter
				/>
			),
		},
		{
			id: 1,
			label: "Orders",
			counter: ordersCounter,
			component: (
				<OrdersHandlerScreen
					loc_id={loc_id}
					onCountChange={setOrdersCounter} // Update Orders counter
				/>
			),
		},
		{
			id: 2,
			label: "Profile",
			counter: 0, // No notifications for Profile
			component: <ProfileScreen agent_id={agent_id} loc_id={loc_id} />,
		},
	];

	return (
		<div className="w-screen h-screen flexbox flex-col bg-gray-50 agent-home">
			{/* Tab Bar */}
			<div className="flex justify-evenly agent-tab-container">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						className={`flex-1 py-2 text-center relative ${
							currentPage === tab.id
								? "border-b-2 fg-contrast font-semibold agent-tab agent-tab--active"
								: "agent-tab"
						}`}
						onClick={() => setCurrentPage(tab.id)}
					>
						{tab.label}
						{tab.counter > 0 && (
							<span className="absolute -top-1 -right-3 text-xs notification-bubble rounded-full px-1 py-0.5">
								{tab.counter}
							</span>
						)}
					</button>
				))}
			</div>

			{/* Content Section */}
			<div className="flex-1 overflow-auto bg-white">
				{tabs.map((tab) => (
					<div
						key={tab.id}
						className={`w-full h-full ${
							currentPage === tab.id ? "block" : "hidden"
						}`}
					>
						{tab.component}
					</div>
				))}
			</div>
		</div>
	);
}
