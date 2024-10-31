import React from "react";
import CreateOrganization from "./CreateOrganisation";
import LocationCards from "./LocationCards";
import { LocationProvider } from "../context/LocationContext";

export default function LocationBoard() {
	return (
		<div>
			<LocationProvider>
				<CreateOrganization />
				<LocationCards />
			</LocationProvider>
		</div>
	);
}
