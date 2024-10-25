import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useLocations } from '../context/LocationContext.jsx';
import { deletelocation, getlocations } from '../services/supported_api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Loading from './Loading.jsx'; // Import the Loading component
import { useLocation } from 'react-router-dom';
import CreateOrganization from './CreateOrganisation.jsx';

const LocationCards = () => {
  const [createOrgClicked, setCreateOrgClicked] = useState(false);
  const { locations, updateLocations, newLocationAdded, resetLocationUpdateFlag } = useLocations();
  const [deleteModal, setDeleteModal] = useState({ show: false, locationId: "" });
  const [loading, setLoading] = useState(false); // State for managing loading spinner
  const [hasFetched, setHasFetched] = useState(false); // New state to track if locations have been fetched
  const navigate = useNavigate(); // Initialize navigate
  const location = useLocation();
  const user_id = location.state?.user_id;

  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true); // Start loading
      try {
        const data = await getlocations(user_id);
        updateLocations(data);
        setHasFetched(true); // Mark that the locations have been fetched
        resetLocationUpdateFlag();
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    // Only fetch locations if not already fetched or a new location was added
    if ((locations.length === 0 && !hasFetched) || newLocationAdded) {
      fetchLocations();
    }
  }, [newLocationAdded, updateLocations, resetLocationUpdateFlag, hasFetched, user_id, locations.length]);

  useEffect(() => {
    // Function to handle keydown events
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setCreateOrgClicked(false);
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    // Clean up event listener on component unmount
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleDeleteClick = (locationId) => {
    setDeleteModal({ show: true, locationId });
  };

  const confirmDelete = async () => {
    setLoading(true); // Start loading during deletion
    try {
      await deletelocation(deleteModal.locationId);
      // Refetch locations after deletion
      const data = await getlocations(user_id);
      updateLocations(data);
    } catch (error) {
      console.error("Error deleting location:", error);
    } finally {
      setLoading(false); // End loading after deletion
      closeModal();
    }
  };

  const closeModal = () => {
    setDeleteModal({ show: false, locationId: null });
  };

  const handleCardClick = (loc_id) => {
    navigate(`/location/${loc_id}/menus`); // Navigate to the MenuDashboard with the loc_id
  };

  const handleCreateNewClick = () => {
    console.log('Create New Location clicked');
    setCreateOrgClicked(true);
  };

  return (
    <div className="relative min-h-screen bg-white">
      {createOrgClicked && <CreateOrganization user_id = {user_id} />} {/* Conditionally render CreateOrganization */}
      {loading && <Loading />} {/* Display loading spinner */}
      <div className="container mx-auto py-12">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Manage Your Locations</h1>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {locations.map((location, index) => (
            <div
              key={index}
              onClick={() => handleCardClick(location.loc_id)} // Add onClick to navigate
              className="relative bg-white border border-gray-200 rounded-lg shadow-sm transition-all transform hover:scale-105 hover:shadow-lg cursor-pointer"
            >
              <img
                src={location.image}
                alt={location.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{location.name}</h3>
                <p className="text-gray-600">{location.address}</p>
                <p className="text-gray-500 text-sm mt-1">Location ID: {location.customerId}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleDeleteClick(location.loc_id); }} // Stop propagation to prevent navigation on delete
                className="absolute top-3 right-3 p-2 bg-red-600 rounded-full text-white hover:bg-red-800 transition-colors"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))}

          {/* Create New Location Card */}
          <div
            onClick={handleCreateNewClick} // Add onClick to trigger function
            className="relative bg-gray-100 border border-gray-300 rounded-lg shadow-sm transition-all transform hover:scale-105 hover:shadow-lg cursor-pointer flex items-center justify-center"
          >
            <div className="p-6 text-center text-gray-600">
              <h3 className="text-lg font-semibold mb-2">Create New Location</h3>
              <p className="text-gray-500">Click here to add a new location</p>
            </div>
          </div>
        </div>
        
        {/* Modal Popup */}
        {deleteModal.show && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h2>
              <p className="text-gray-600">Are you sure you want to delete this location?</p>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-800 transition-colors"
                >
                  Yes
                </button>
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationCards;
