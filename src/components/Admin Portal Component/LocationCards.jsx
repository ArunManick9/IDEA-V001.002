import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocations } from "../../context/LocationContext.jsx";
import { deletelocation, getlocations } from "../../services/supported_api.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Loading from "./Loading.jsx";
import { useLocation } from "react-router-dom";
import CreateOrganization from "./CreateOrganisation.jsx";
import "../../scss/LocationCards.scss";
import LogoutButton from "./LogoutButton.jsx";

const LocationCards = () => {
	const [createOrgClicked, setCreateOrgClicked] = useState(false);
	const {
		locations,
		updateLocations,
		newLocationAdded,
		resetLocationUpdateFlag,
		activeTheme,
		updateTheme,
	} = useLocations();
	const [deleteModal, setDeleteModal] = useState({
		show: false,
		locationId: "",
	});
	const [loading, setLoading] = useState(false);
	const [hasFetched, setHasFetched] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();

	// Retrieve the access token from localStorage (or location state as fallback)
	const access_token =
		location.state?.access_token || localStorage.getItem("access_token");
	const user_id = location.state?.user_id || localStorage.getItem("user_id");

	// Ensure the token is set
	if (!access_token || !user_id) {
		navigate("/"); // Redirect to login if no token/user_id is found
	}

	console.log(activeTheme, updateTheme);

	useEffect(() => {
		const fetchLocations = async () => {
			setLoading(true);
			try {
				if (!access_token || !user_id) {
					console.error("No access token or user_id found!");
					return;
				}

				const data = await getlocations(user_id, access_token);
				updateLocations(data);
				setHasFetched(true);
				resetLocationUpdateFlag();
			} catch (error) {
				console.error("Error fetching locations:", error);
			} finally {
				setLoading(false);
			}
		};

		if ((locations.length === 0 && !hasFetched) || newLocationAdded) {
			fetchLocations();
		}
	}, [
		newLocationAdded,
		updateLocations,
		resetLocationUpdateFlag,
		hasFetched,
		user_id,
		locations.length,
		access_token,
	]);

	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.key === "Escape") {
				setCreateOrgClicked(false);
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	const handleDeleteClick = (locationId) => {
		setDeleteModal({ show: true, locationId });
	};

	const confirmDelete = async () => {
		setLoading(true);
		try {
			await deletelocation(deleteModal.locationId, access_token);
			const data = await getlocations(user_id, access_token);
			updateLocations(data);
		} catch (error) {
			console.error("Error deleting location:", error);
		} finally {
			setLoading(false);
			closeModal();
		}
	};

	const closeModal = () => {
		setDeleteModal({ show: false, locationId: null });
	};

	const handleCardClick = (loc_id) => {
		navigate(`/location/${loc_id}/menus`);
	};

	const handleCreateNewClick = () => {
		console.log("Create New Location clicked");
		setCreateOrgClicked(true);
	};

	return (
		<div
			className={`relative min-h-screen locations-container theme-${activeTheme}`}
		>
			{createOrgClicked && (
				<CreateOrganization
					user_id={user_id}
					setCreateOrgClicked={setCreateOrgClicked}
				/>
			)}
			{loading && <Loading />}
			<div className="locations-container--inner mx-auto">
				<div className="w-full flexbox justify-end">
					<LogoutButton />
				</div>
				<h1 className="header mb-8 text-center">Manage Your Locations</h1>

				<div className="locations-flex">
					{locations.map((location, index) => (
						<div
							key={index}
							onClick={() => handleCardClick(location.loc_id)}
							className="relative rounded-lg transition-all transform hover:scale-105 hover:shadow-lg  cursor-pointer location-card"
						>
							<img
								src={location.image}
								alt={location.name}
								className="w-full h-48 object-cover rounded-t-lg"
							/>
							<div className="p-6">
								<h3 className="text-xl font-semibold mb-2">{location.name}</h3>
								<p className="fg-gray-1">{location.address}</p>
								<p className="fg-gray-1 text-sm mt-1">
									Location ID: {location.customerId}
								</p>
							</div>
							<button
								onClick={(e) => {
									e.stopPropagation();
									handleDeleteClick(location.loc_id);
								}}
								className="absolute top-3 right-3 delete-wrapper"
							>
								<FontAwesomeIcon icon={faTrash} />
							</button>
						</div>
					))}

					<div
						onClick={handleCreateNewClick}
						className="relative rounded-lg transition-all transform hover:scale-105 hover:shadow-lg cursor-pointer flexbox items-center justify-center location-card--new"
					>
						<div className="p-6 text-center ">
							<h3 className="text-lg font-semibold mb-2">
								Create New Location
							</h3>
							<p>Click here to add a new location</p>
						</div>
					</div>
				</div>

				{deleteModal.show && (
					<div className="fixed inset-0 bg-gray-800 bg-opacity-75 flexbox items-center justify-center z-50">
						<div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
							<h2 className="text-lg font-semibold text-gray-800 mb-4">
								Confirm Deletion
							</h2>
							<p className="text-gray-600">
								Are you sure you want to delete this location?
							</p>
							<div className="mt-6 flexbox justify-end space-x-4">
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
