import React, { useContext, useEffect, useState } from 'react';
import DigiMenu from './DigiMenu';
import { useParams } from 'react-router-dom';
import { useWaiters } from '../../context/WaiterContext';

export default function ConfirmTable() {
  const [enteredKey, setEnteredKey] = useState(Array(5).fill(''));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { loc_id, table_id } = useParams();
  const { setNewTable, setPassKey, passKey } = useWaiters();

  // Run only once when the component mounts
  useEffect(() => {
    console.log("before",passKey);
    const generatedKey = Math.floor(10000 + Math.random() * 90000).toString();
    setPassKey(generatedKey); // Set passKey in context
    setNewTable({ loc_id, table_id, passKey: generatedKey }); // StorRHTYUJUIOLe table data

    // Only run once on mount by using an empty dependency array
  }, [loc_id, table_id, setNewTable, setPassKey]);
  
  useEffect(()=> {
    console.log('after', passKey);
  }, [passKey])

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d$/.test(value) || value === '') {
      const newKey = [...enteredKey];
      newKey[index] = value;
      setEnteredKey(newKey);
    }
  };

  const handleAuthenticate = () => {
    const userEnteredKey = enteredKey.join('');
    if (userEnteredKey === passKey) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect Key! Please try again.');
    }
  };

  if (isAuthenticated) {
    return <DigiMenu />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-xl font-bold mb-4">Please enter the 5-digit key</h1>
      <div className="flex space-x-2">
        {enteredKey.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            className="w-12 h-12 text-center border rounded-lg text-2xl"
            value={digit}
            onChange={(e) => handleChange(e, index)}
          />
        ))}
      </div>
      <button
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
        onClick={handleAuthenticate}
      >
        Okay
      </button>
    </div>
  );
}
