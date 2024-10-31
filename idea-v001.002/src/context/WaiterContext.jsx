// src/context/WaiterContext.js
import React, { createContext, useContext, useState } from "react";

const WaiterContext = createContext();

export const WaiterProvider = ({ children }) => {
	const [passKey, setPassKey] = useState("74856");
	const [newTable, setNewTable] = useState({ defaultAttribute: 0 });

	return (
		<WaiterContext.Provider
			value={{ passKey, setPassKey, newTable, setNewTable }}
		>
			{children}
		</WaiterContext.Provider>
	);
};
export const useWaiters = () => useContext(WaiterContext);
