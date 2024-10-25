// src/components/ConfirmTableScreen.js
import { useEffect } from "react";
import { useWaiters } from "../../context/WaiterContext";

export default function ConfirmTableScreen() {
	const { tableData = { default: 2 }, passKey } = useWaiters(); // Access contERGTGRGTUHJNHext

	useEffect(() => {
		console.log("confirmation table", tableData, passKey);
	}, [tableData, passKey]);
  
	if (Object.values(tableData)?.every((value) => !value)) {
		return <p>No new table requests yet.</p>;
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
			<h1 className="text-2xl font-bold mb-4">New Table Confirmation</h1>
			<p className="text-lg">Table ID: {tableData.table_id}</p>
			<p className="text-lg">Passkey: {tableData.passKey}</p>
		</div>
	);
}
