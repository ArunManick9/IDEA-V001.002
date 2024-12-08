import React, { useEffect, useState } from "react";
import { getagentdetails } from "../../services/supported_api";

export default function ProfileScreen({ agent_id, loc_id }) {
  const [agent, setAgent] = useState(null); // Store agent details
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch agent details on mount
  useEffect(() => {
    const fetchAgentDetails = async () => {
      try {
        const [agentData] = await getagentdetails(agent_id); // Get first object
        setAgent(agentData);
      } catch (error) {
        console.error("Failed to fetch agent details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentDetails();
  }, [agent_id]);

  if (loading) {
    return <p className="text-center mt-10">Loading agent details...</p>;
  }

  if (!agent) {
    return (
      <p className="text-center mt-10 text-red-500">
        Failed to load agent data.
      </p>
    );
  }

  // Parse assignedtables string to array if valid
  let assignedTablesArray = [];
  try {
    assignedTablesArray = agent.assignedtables
      ? JSON.parse(agent.assignedtables)
      : [];
  } catch (error) {
    console.error("Failed to parse assignedtables:", error);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      {/* Dummy Profile Picture */}
      <div className="w-32 h-32 rounded-full bg-gray-300 mb-4 flex items-center justify-center">
        <span className="text-5xl text-gray-600">👤</span>
      </div>

      {/* Agent Details */}
      <h1 className="text-2xl font-bold mb-2">{agent.name}</h1>
      <p className="text-lg text-gray-700 mb-1">
        <span className="font-semibold">Gender:</span> {agent.gender}
      </p>
      <p className="text-lg text-gray-700 mb-1">
        <span className="font-semibold">Mobile:</span> {agent.mobile}
      </p>
      <p className="text-lg text-gray-700 mb-1">
        <span className="font-semibold">Level:</span> {agent.level}
      </p>
	  <p className="text-lg text-gray-700 font-semibold mb-2">Assigned Tables:</p>
        {assignedTablesArray.length > 0 ? (
          <ul className="list-disc list-inside text-gray-700">
            {assignedTablesArray.map((tableName, index) => (
              <li key={index} className="text-gray-600">
                Table {tableName}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No tables assigned.</p>
        )}
    </div>
  );
}
