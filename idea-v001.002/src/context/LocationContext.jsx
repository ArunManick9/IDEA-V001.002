import React, { createContext, useState, useContext } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [locations, setLocations] = useState([]);
  const [newLocationAdded, setNewLocationAdded] = useState(false);

  const updateLocations = (newLocations) => {
    setLocations(newLocations);
  };

  const triggerLocationUpdate = () => {
    setNewLocationAdded(true);
  };

  const resetLocationUpdateFlag = () => {
    setNewLocationAdded(false);
  };

  return (
    <LocationContext.Provider value={{ locations, updateLocations, newLocationAdded, triggerLocationUpdate, resetLocationUpdateFlag }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocations = () => useContext(LocationContext);