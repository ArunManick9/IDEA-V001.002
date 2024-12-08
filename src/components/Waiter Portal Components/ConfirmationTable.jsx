import { useEffect, useState } from 'react';
import supabase from '../../services/supabase';

export default function ConfirmTableScreen({ loc_id, onCountChange }) {
  const [tableRecords, setTableRecords] = useState([]);

  // Fetch records with waiter_consumed set to FALSE on page load
  const fetchInitialRecords = async () => {
    const { data, error } = await supabase
      .from('OTP_TABLE')
      .select('*')
      .eq('waiter_consumed', false)
      .eq('loc_id', loc_id);

    if (error) {
      console.error('Error fetching records:', error);
    } else {
      setTableRecords(data);
      onCountChange(data.length); // Update the notification counter with the number of fetched records
    }
  };

  useEffect(() => {
    fetchInitialRecords();

    const locIdString = JSON.stringify(loc_id);
    console.log('Setting up subscription for loc_id:', locIdString);

    const channel = supabase.channel('custom-update-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'OTP_TABLE', filter: `loc_id=eq.${loc_id}` },
        (payload) => {
          console.log('Update received!', payload);
          const { table_id, passKey, waiter_consumed } = payload.new;

          // Only add the record if waiter_consumed is FALSE
          if (!waiter_consumed) {
            setTableRecords((prevRecords) => [
              ...prevRecords,
              { table_id, passKey, id: payload.new.id },
            ]);
            onCountChange((prevCount) => prevCount + 1); // Increment counter for the new record
          }
        }
      )
      .subscribe();

    console.log('Subscription set up complete.');

    return () => {
      console.log('Cleaning up subscription for loc_id:', locIdString);
      supabase.removeChannel(channel);
    };
  }, [loc_id, onCountChange]);

  // Handle close button click and update waiter_consumed to TRUE
  const handleClose = async (index, id) => {
    // Update waiter_consumed to TRUE for the specific record in Supabase
    const { error } = await supabase
      .from('OTP_TABLE')
      .update({ waiter_consumed: true })
      .eq('id', id);

    if (error) {
      console.error('Error updating waiter_consumed:', error);
    } else {
      // Remove the record from the displayed list
      setTableRecords((prevRecords) => prevRecords.filter((_, i) => i !== index));
      onCountChange((prevCount) => prevCount - 1); // Decrease counter when a table is confirmed
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100 space-y-4">
      <h1 className="text-2xl font-bold mb-4">New Table Confirmation</h1>
      {tableRecords.length > 0 ? (
        tableRecords.map((record, index) => (
          <div
            key={record.id}
            className="w-11/12 max-w-md p-6 bg-white rounded-lg shadow-lg transition-transform transform scale-100 hover:scale-105 duration-200 ease-in-out relative"
          >
            <button
              onClick={() => handleClose(index, record.id)}
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
