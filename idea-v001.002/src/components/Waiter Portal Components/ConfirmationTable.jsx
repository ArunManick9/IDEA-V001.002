import { useEffect, useState } from 'react';
import supabase from '../../services/supabase';

export default function ConfirmTableScreen({ loc_id }) {
	const [tableRecords, setTableRecords] = useState([]);

	useEffect(() => {
		const locIdString = JSON.stringify(loc_id);
		console.log('Setting up subscription for loc_id:', locIdString);

		const channel = supabase.channel('custom-update-channel')
			.on(
				'postgres_changes',
				{ event: 'INSERT', schema: 'public', table: 'OTP_TABLE', filter: `loc_id=eq.${loc_id}` },
				(payload) => {
					console.log('Update received!', payload);
					const { table_id, passKey } = payload.new;
					console.log('Extracted table_id:', table_id, 'and passKey:', passKey);

					// Add the new record to the existing list of table records
					setTableRecords((prevRecords) => [
						...prevRecords,
						{ table_id, passKey },
					]);
				}
			)
			.subscribe();

		console.log('Subscription set up complete.');

		return () => {
			console.log('Cleaning up subscription for loc_id:', locIdString);
			supabase.removeChannel(channel);
		};
	}, [loc_id]);

	const handleClose = (index) => {
		setTableRecords((prevRecords) => prevRecords.filter((_, i) => i !== index));
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-green-100 space-y-4">
			<h1 className="text-2xl font-bold mb-4">New Table Confirmation</h1>
			{tableRecords.length > 0 ? (
				tableRecords.map((record, index) => (
					<div
						key={index}
						className="w-11/12 max-w-md p-6 bg-white rounded-lg shadow-lg transition-transform transform scale-100 hover:scale-105 duration-200 ease-in-out relative"
					>
						<button
							onClick={() => handleClose(index)}
							className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition duration-200 ease-in-out"
						>
							&times;
						</button>
						<p className="text-lg font-semibold text-center mb-2">Share the below PassKey</p>
						<p className="text-xl font-bold text-center text-blue-600">{record.passKey}</p>
						<p className="text-lg text-center text-gray-700 mt-2">to Table Number {record.table_id}</p>
					</div>
				))
			) : (
				<p className="text-lg text-gray-500">No Table Record</p>
			)}
		</div>
	);
}
