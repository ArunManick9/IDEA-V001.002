// src/components/ConfirmTableScreen.js
import { useEffect } from 'react';
import { useWaiters } from '../../context/WaiterContext';

export default function ConfirmTableScreen() {
  const { tableData, passKey } = useWaiters(); // Access contERGTGRGTUHJNHext
  console.log(`confirmationtable`, tableData, passKey)

  useEffect(()=> {
    console.log('confirmation table', tableData, passKey)
  },[tableData,passKey])
  if (!tableData) {
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
