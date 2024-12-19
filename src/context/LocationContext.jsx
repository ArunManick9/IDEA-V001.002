import React, { createContext, useState, useContext, useEffect } from "react";

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
	const [locations, setLocations] = useState([]);
	const [newLocationAdded, setNewLocationAdded] = useState(false);
	const [activeTheme, setActiveTheme] = useState("three");

	const updateLocations = (newLocations) => {
		setLocations(newLocations);
	};

	const triggerLocationUpdate = () => {
		setNewLocationAdded(true);
	};

	const resetLocationUpdateFlag = () => {
		setNewLocationAdded(false);
	};

	const updateTheme = (theme) => {
		setActiveTheme(theme);
	};

	useEffect(() => {
		// Example side effect: Logging theme changes
		console.log("Active theme changed to:", activeTheme);
	}, [activeTheme]);

	return (
		<LocationContext.Provider
			value={{
				locations,
				updateLocations,
				newLocationAdded,
				triggerLocationUpdate,
				resetLocationUpdateFlag,
				activeTheme,
				updateTheme,
			}}
		>
			{children}
		</LocationContext.Provider>
	);
};

export const useLocations = () => useContext(LocationContext);
