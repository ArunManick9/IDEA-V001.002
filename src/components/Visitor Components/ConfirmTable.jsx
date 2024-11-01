import { useEffect, useState, useRef } from 'react';
import DigiMenu from './DigiMenu';
import { useParams } from 'react-router-dom';
import supabase from '../../services/supabase';

export default function ConfirmTable() {
  const [enteredKey, setEnteredKey] = useState(Array(5).fill(''));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { loc_id, table_id } = useParams();
  const [passKey, setPassKey] = useState('');
  const [hasInserted, setHasInserted] = useState(false); // Track insertion
  const inputRefs = useRef([]); // Refs to handle focus on each input

  useEffect(() => {
    if (hasInserted) return; // Prevent duplicate insertion

    // Generate a random 5-digit passkey
    const generatePassKey = () => {
      return Math.floor(10000 + Math.random() * 90000).toString();
    };

    // Insert passkey, loc_id, and table_id into Supabase table
    const insertPassKey = async () => {
      const newPassKey = generatePassKey();
      setPassKey(newPassKey);

      const { data, error } = await supabase
        .from('OTP_TABLE')
        .insert([
          { loc_id: loc_id, table_id: table_id, passKey: newPassKey }
        ])
        .select();

      if (error) {
        console.error('Error inserting passKey:', error.message);
      } else {
        console.log('PassKey inserted successfully:', data);
        setHasInserted(true); // Mark as inserted
      }
    };

    // Run insert function on component mount
    insertPassKey();
  }, [loc_id, table_id, hasInserted]);

  const handleAuthenticate = () => {
    const userEnteredKey = enteredKey.join('');
    if (userEnteredKey === passKey) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect Key! Please try again.');
    }
  };

  const handleChange = (e, index) => {
    const newEnteredKey = [...enteredKey];
    newEnteredKey[index] = e.target.value;
    setEnteredKey(newEnteredKey);

    // Move to the next input if a digit was entered and it's not the last box
    if (e.target.value && index < 4) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && index > 0 && !enteredKey[index]) {
      inputRefs.current[index - 1].focus();
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
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => (inputRefs.current[index] = el)}
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
