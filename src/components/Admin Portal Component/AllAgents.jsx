import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
	getagentslist,
	updateAssignedTables,
} from "../../services/supported_api";
import "../../scss/AllAgents.scss";

export default function AllAgents() {
	const { loc_id } = useParams(); // Get the location ID from the route params
	const [agents, setAgents] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchAgents = async () => {
			try {
				const data = await getagentslist(loc_id); // Fetch agent data
				setAgents(
					data.map((agent) => ({
						...agent,
						assignedtables: agent.assignedtables
							? JSON.parse(agent.assignedtables.replace(/'/g, '"')) // Parse string into an array
							: [], // Default to an empty array
					}))
				);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchAgents();
	}, [loc_id]);

	// Add a new table value
	const addTable = (agent_id, value) => {
		setAgents((prevAgents) =>
			prevAgents.map((agent) =>
				agent.agent_id === agent_id
					? {
							...agent,
							assignedtables: [...agent.assignedtables, value],
					  }
					: agent
			)
		);
	};

	// Remove a table value
	const removeTable = (agent_id, table) => {
		setAgents((prevAgents) =>
			prevAgents.map((agent) =>
				agent.agent_id === agent_id
					? {
							...agent,
							assignedtables: agent.assignedtables.filter((t) => t !== table),
					  }
					: agent
			)
		);
	};

	// Save changes: Call Supabase API
	const saveChanges = async () => {
		try {
			for (const agent of agents) {
				await updateAssignedTables(agent.agent_id, agent.assignedtables); // Update each agent's assigned tables
			}
			alert("Changes saved successfully!");
		} catch (err) {
			alert(`Error saving changes: ${err.message}`);
		}
	};

	const filteredAgents = agents.filter((agent) =>
		agent.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error}</p>;

	return (
		<div className="p-4 all-agents-wrapper">
			<div className="flexbox justify-between items-center mb-4">
				<h1 className="all-agents--header">Agents</h1>
				<button className="btn btn--submit" onClick={saveChanges}>
					Save
				</button>
			</div>
			<input
				type="text"
				placeholder="Search by Name"
				className="p-2 mb-4 search-input"
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
			/>
			<table className="table-auto w-full border-collapse border table">
				<thead>
					<tr className="bg-gray-100">
						<th className="border px-4 py-2 table-header--item">Agent ID</th>
						<th className="border px-4 py-2 table-header--item">Name</th>
						<th className="border px-4 py-2 table-header--item">Level</th>
						<th className="border px-4 py-2 table-header--item">Gender</th>
						<th className="border px-4 py-2 table-header--item">Mobile</th>
						<th className="border px-4 py-2 table-header--item">
							Assigned Tables
						</th>
					</tr>
				</thead>
				<tbody>
					{filteredAgents.map((agent) => (
						<tr key={agent.agent_id}>
							<td className="border px-4 py-2">{agent.agent_id}</td>
							<td className="border px-4 py-2">{agent.name}</td>
							<td className="border px-4 py-2">{agent.level}</td>
							<td className="border px-4 py-2">{agent.gender}</td>
							<td className="border px-4 py-2">{agent.mobile}</td>
							<td className="border px-4 py-2">
								<div className="flexbox flex-wrap items-center gap-2">
									{agent.assignedtables.map((table, index) => (
										<div
											key={index}
											className="px-2 py-1 rounded flexbox items-center assigned-table-item"
										>
											<span>{table}</span>
											<button
												className="text-red-700 ml-2"
												onClick={() => removeTable(agent.agent_id, table)}
											>
												×
											</button>
										</div>
									))}
									<input
										type="text"
										className="border-none outline-none assigned-table-input"
										onKeyDown={(e) => {
											if (e.key === "Enter" && e.target.value.trim()) {
												addTable(agent.agent_id, e.target.value.trim());
												e.target.value = ""; // Clear input field
											}
										}}
									/>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
