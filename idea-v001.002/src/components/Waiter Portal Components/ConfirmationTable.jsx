
import { useEffect } from 'react';

export default function ConfirmTableScreen({loc_id}) {



	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
			<h1 className="text-2xl font-bold mb-4">New Table Confirmation</h1>
			<p className="text-lg">Table ID: {tableData.table_id}</p>
			<p className="text-lg">Passkey: {tableData.passKey}</p>
		</div>
	);
}
