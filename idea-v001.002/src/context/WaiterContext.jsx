// src/context/WaiterContext.js
import React, { createContext, useContext, useState } from 'react';

const WaiterContext = createContext();

export const WaiterProvider = ({ children }) => {
  const [passKey, setPassKey] = useState('74856');
  const [newTable, setNewTable] = useState({});
  console.log(passKey)
  console.log(newTable)

  return (
    <WaiterContext.Provider value={{ passKey, setPassKey, newTable, setNewTable }}>
      {children}
    </WaiterContext.Provider>
  );
};
export const useWaiters = () =>  useContext(WaiterContext);