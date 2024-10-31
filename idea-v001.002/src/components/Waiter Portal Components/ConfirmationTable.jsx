
import { useEffect, useState } from 'react';

import supabase from '../../services/supabase';

export default function ConfirmTableScreen({ loc_id }) {
	const [tableData, setTableData] = useState({ table_id: null, passKey: null });

	useEffect(() => {
		const locIdString = JSON.stringify(loc_id);
		console.log('Setting up subscription for loc_id:', locIdString);
		
		const channel = supabase.channel('custom-update-channel')
			.on(
				'postgres_changes',
				{ event: 'INSERT', schema: 'public', table: 'OTP_TABLE', filter: `loc_id=eq.${loc_id}` },
				(payload) => {
					console.log('Update received!', payload); // Log the full payload for inspection
					const { table_id, passKey } = payload.new;
					console.log('Extracted table_id:', table_id, 'and passKey:', passKey); // Log the extracted values
					setTableData({ table_id, passKey });
				}
			)
			.subscribe();
		
		console.log('Subscription set up complete.');

		// Cleanup subscription on component unmount
		return () => {
			console.log('Cleaning up subscription for loc_id:', locIdString);
			supabase.removeChannel(channel);
		};
	}, [loc_id]);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
			<h1 className="text-2xl font-bold mb-4">New Table Confirmation</h1>
			<p className="text-lg">Table ID: {tableData.table_id}</p>
			<p className="text-lg">Passkey: {tableData.passKey}</p>
		</div>
	);
}

