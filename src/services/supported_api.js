import { IconUfo } from "@tabler/icons-react";
import supabase from "./supabase";

export async function addlocationtodb(locationData) {
	// Assuming 'locationData' is an object containing the data you want to insert

	// Insert the data into the 'HOTEL_BASE' table
	const { data, error } = await supabase
		.from("HOTEL_BASE")
		.insert(locationData);

	if (error) {
		console.error("Error inserting data:", error.message);
	} else {
		console.log("Data inserted successfully:", data);
	}
}

export async function getlocations(user_id) {
	let { data: HOTEL_BASE, error } = await supabase
		.from("HOTEL_BASE")
		.select("*")
		.eq("user_id", user_id);

	if (error) {
		console.error("Error fetching locations:", error.message);
	} else {
		console.log("Data  successfully:", HOTEL_BASE);
	}

	return HOTEL_BASE;
}

export async function deletelocation(loc_id) {
	const { error } = await supabase
		.from("HOTEL_BASE")
		.delete()
		.eq("loc_id", loc_id);

	if (error) {
		console.error("Error deleting row:", error);
	} else {
		console.log("Row deleted successfully");
	}
}

export async function loadlocation(loc_id) {
	let { data, error } = await supabase
		.from("HOTEL_BASE")
		.select("*")
		.eq("loc_id", loc_id);

	console.log(data);

	if (error) {
		console.error("Error Loading location:", error);
	} else {
		console.log("Location loaded Sucessfully");
	}

	return data;
}

export async function getMenuOtp(loc_id) {
	try {
	  let { data, error } = await supabase
		.from("HOTEL_BASE")
		.select("menu_otp") // Only select the menu_otp field
		.eq("loc_id", loc_id);
  
	  if (error) {
		console.error("Error fetching menu_otp:", error);
		return null; // Return null if there is an error
	  }
  
	  if (data && data.length > 0) {
		const menuOtp = data[0].menu_otp; // Extract the menu_otp value
		console.log("menu_otp fetched successfully:", menuOtp);
		return menuOtp; // Return the extracted value
	  } else {
		console.warn("No menu_otp found for the provided loc_id.");
		return null; // Return null if no data is found
	  }
	} catch (err) {
	  console.error("Unexpected error fetching menu_otp:", err);
	  return null; // Return null for unexpected errors
	}
  }
  



export async function addmenuitem(newmenu) {
	const { data, error } = await supabase.from("MENU_LIST").insert(newmenu);

	if (error) {
		console.log(error);
	} else {
		console.log(`added new item successfully ${data}`);
	}
}

//api to edit menus
export async function editmenulist(modifieddata, loc_id) {
	console.log("Function entered");
	console.log(modifieddata);
	console.log(loc_id);

	const { data, error } = await supabase
		.from("HOTEL_BASE")
		.update({ menus: modifieddata }) // Update the menus column with the stringified data
		.eq("loc_id", loc_id) // Ensure loc_id is a string comparison
		.select();

	if (error) {
		console.log(`Error updating file: ${error.message}`);
	} else {
		console.log(`Success:${data}`);
	}
}

// Update the waiter_support field
export async function editWaiterSupport(waiterSupport, loc_id) {
	console.log("Updating waiter_support:", waiterSupport, "for loc_id:", loc_id);
  
	const { data, error } = await supabase
	  .from("HOTEL_BASE")
	  .update({ waiter_support: waiterSupport })
	  .eq("loc_id", loc_id)
	  .select();
  
	if (error) {
	  console.log(`Error updating waiter_support: ${error.message}`);
	} else {
	  console.log(`Waiter support updated successfully:`, data);
	}
  }
  
  // Update the menu_otp field
  export async function editMenuOtp(menuOtp, loc_id) {
	console.log("Updating menu_otp:", menuOtp, "for loc_id:", loc_id);
  
	const { data, error } = await supabase
	  .from("HOTEL_BASE")
	  .update({ menu_otp: menuOtp })
	  .eq("loc_id", loc_id)
	  .select();
  
	if (error) {
	  console.log(`Error updating menu_otp: ${error.message}`);
	} else {
	  console.log(`Menu OTP updated successfully:`, data);
	}
  }

  export async function edittheme(activetheme, loc_id) {
	console.log("Updating waiter_support:", activetheme, "for loc_id:", loc_id);
  
	const { data, error } = await supabase
	  .from("HOTEL_BASE")
	  .update({ active_theme: activetheme })
	  .eq("loc_id", loc_id)
	  .select();
  
	if (error) {
	  console.log(`Error updating waiter_support: ${error.message}`);
	} else {
	  console.log(`Waiter support updated successfully:`, data);
	}
  }
  

//get Menulistboard

export async function getdetailedmenu(loc_id) {
	console.log("entereddd functionnnnnn");
	console.log(loc_id);
	let { data: MENU_LIST, error } = await supabase
		.from("MENU_LIST")
		.select("*")
		.eq("inlocation", loc_id);

	if (error) {
		console.error("Error fetching locations:", error.message);
	} else {
		console.log("Data successfully:", MENU_LIST);
	}

	return MENU_LIST;
}

export async function getlatestmenuid(loc_id, inmenu, incategory) {
	console.log("entereddd functionnnnnn");
	console.log(loc_id, inmenu, incategory);
	let { data: MENU_LIST, error } = await supabase
		.from("MENU_LIST")
		.select("*")
		.eq("inlocation", loc_id);
	//.eq('inmenu', inmenu)
	//.eq('inlocation', incategory)

	if (error) {
		console.error("Error fetching locations:", error.message);
	} else {
		console.log("Data successfully:", MENU_LIST);
	}

	console.log(`filerrrrr${MENU_LIST}`);

	return MENU_LIST;
}

export async function ordersubmit(orderdata) {
	// Assuming 'locationData' is an object containing the data you want to insert

	// Insert the data into the 'HOTEL_BASE' table

	console.log(" order submit dunction callelddddd");
	const { data, error } = await supabase.from("ORDER_DB").insert(orderdata);

	if (error) {
		console.error("Error inserting order data:", error.message);
	} else {
		console.log("Order Data inserted successfully:", data);
	}
}
///function to update order status

export async function updateOrderStatus(order_id, newStatus) {
	console.log("Updating order:", order_id, "to status:", newStatus);

	const { data, error } = await supabase
		.from("ORDER_DB")
		.update({ status: newStatus }) // Use the newStatus value passed as an argument
		.eq("order_id", order_id) // Use the passed order_id, not hardcoded
		.select();

	if (error) {
		console.log(`Error updating status: ${error}`);
	} else {
		console.log("Successfully updated status:", data);
	}
}

export async function addagent(agentdetails) {
	const { data, error } = await supabase.from("AGENT_DB").insert(agentdetails);

	if (error) {
		console.log(error);
	} else {
		console.log(`added agent successfully ${data}`);
	}
}

export async function getagentlogin(mbNum) {
	let { data: AGENT_DB, error } = await supabase
		.from("AGENT_DB")
		.select("*")
		.eq("mobile", mbNum);

	if (error) {
		console.error("Error fetching AGENT DETAILS:", error.message);
	} else {
		console.log("Agent Data  successfully fetched:", AGENT_DB);
	}

	return AGENT_DB;
}
export async function getagentdetails(agent_id) {
	let { data: AGENT_DB, error } = await supabase
		.from("AGENT_DB")
		.select("*")
		.eq("agent_id", agent_id);

	if (error) {
		console.error("Error fetching AGENT DETAILS:", error.message);
	} else {
		console.log("Agent Data  successfully fetched:", AGENT_DB);
	}

	return AGENT_DB;
}

export async function deleteMenuItem(item_id) {
	console.log("Deleting menu item with ID:", item_id);

	const { error } = await supabase.from("MENU_LIST").delete().eq("id", item_id); // Replace 'id' with the actual column name if different

	if (error) {
		console.log(`Error deleting item: ${error.message}`);
	} else {
		console.log(`Successfully deleted item with ID: ${item_id}`);
	}

	return error;
}

export async function updateMenuItem(menuItemId, updatedFields) {
	console.log("Function entered: updateMenuItem");
	console.log("Menu Item ID:", menuItemId);
	console.log("Updated Fields:", updatedFields);

	try {
		// Update the MENU_LIST table with the provided fields
		const { data, error } = await supabase
			.from("MENU_LIST")
			.update(updatedFields) // Update with dynamic fields passed in the function
			.eq("id", menuItemId) // Match the item using its unique ID
			.select(); // Optionally return the updated record

		if (error) {
			console.error(`Error updating menu item: ${error.message}`);
			return { success: false, error: error.message };
		}

		console.log("Update Success:", data);
		return { success: true, data };
	} catch (err) {
		console.error("Unexpected error:", err);
		return { success: false, error: "Unexpected error occurred" };
	}
}
// API to update individual banner columns (cartsuggestionbanner, combobanners, or highlightbanner)
export async function updateBanner(bannerType, bannerData, loc_id) {
	console.log("Location ID:", loc_id);
	console.log("Banner Type:", bannerType);
	console.log("Banner Data:", bannerData);

	try {
		let updateData = {};

		// Prepare the data to update based on the banner type
		if (bannerType === "highlight") {
			updateData.highlightbanner = bannerData;
		} else if (bannerType === "combo") {
			updateData.combobanners = bannerData;
		} else if (bannerType === "cart") {
			updateData.cartsuggestionbanner = bannerData;
		}

		// Update the relevant banner column in the database
		const { data, error } = await supabase
			.from("HOTEL_BASE")
			.update(updateData) // Update only the selected banner column
			.eq("loc_id", loc_id)
			.select();

		if (error) {
			console.error(`Error updating banner: ${error.message}`);
			throw error;
		}

		console.log("Banner updated successfully:", data);
		return data;
	} catch (error) {
		console.error("Error in updating banner:", error.message);
		throw error;
	}
}

export async function addenhancedetails(enhancedetails) {
	const { data, error } = await supabase
		.from("ENHANCE_TABLE")
		.insert(enhancedetails);

	if (error) {
		console.error("Error inserting data:", error.message);
	} else {
		console.log("Data inserted successfully:", data);
	}
}

export async function fetchMenuItem(menuItemId, locationId) {
	const { data, error } = await supabase
		.from("MENU_LIST")
		.select("*")
		.eq("menu_id", menuItemId)
		.eq("inlocation", locationId);
	if (error) {
		console.error(`Error updating banner: ${error.message}`);
		throw error;
	} else if (data.length) {
		return data[0];
	} else {
		return {};
	}
}

//Get menulist, location base, and enhance details

export async function fetchAllMenuCardData(loc_id) {
	try {
		// Fetch location details
		const { data: locationData, error: locationError } = await supabase
			.from("HOTEL_BASE")
			.select("*")
			.eq("loc_id", loc_id);

		if (locationError) {
			console.error("Error fetching location details:", locationError);
			throw new Error("Failed to fetch location details");
		}

		// Fetch detailed menu
		const { data: menuList, error: menuError } = await supabase
			.from("MENU_LIST")
			.select("*")
			.eq("inlocation", loc_id);

		if (menuError) {
			console.error("Error fetching menu list:", menuError);
			throw new Error("Failed to fetch menu list");
		}

		// Fetch enhance table data
		const { data: enhanceTableData, error: enhanceError } = await supabase
			.from("ENHANCE_TABLE")
			.select("*")
			.eq("loc_id", loc_id);

		if (enhanceError) {
			console.error("Error fetching enhance table data:", enhanceError);
			throw new Error("Failed to fetch enhance table data");
		}

		let result = {
			locationDetails: locationData[0],
			menuDetails: menuList,
			enhanceDetails: enhanceTableData,
		};

		console.log(result);

		// Combine all responses into one object with identifiable keys
		return result;
	} catch (error) {
		console.error("Error in fetchAllData wrapper:", error);
		throw error;
	}
}

export async function getagentslist(loc_id) {
	let { data, error } = await supabase
	.from("AGENT_DB")
	.select("*")
	.eq("location_id", loc_id); 
	if (error) {
		console.error("Error fetching locations:", error.message);
	} else {
		console.log("Data  successfully:", data);
	}

	return data;
}

export const updateAssignedTables = async (agentId, assignedTables) => {
	const { data, error } = await supabase
	  .from("AGENT_DB") // Replace "agents" with your table name
	  .update({ assignedtables: JSON.stringify(assignedTables) }) // Update the assignedtables field
	  .eq("agent_id", agentId);
  
	if (error) {
	  throw new Error(error.message);
	}
	return data;
  };

  

  export async function getEnhanceTableRows(loc_id) {
	let { data, error } = await supabase
	  .from("ENHANCE_TABLE")
	  .select("*")
	  .eq("loc_id", loc_id);
  
	if (error) {
	  console.error("Error fetching enhance table rows:", error.message);
	} else {
	  console.log("Data fetched successfully:", data);
	}
  
	return data;
  }
  

  export async function handleToggleStatus(bannerId, currentStatus, setData) {
	try {
	  const updatedStatus = !currentStatus; // Toggle the current status
  
	  const { data, error } = await supabase
		.from('ENHANCE_TABLE')
		.update({ isActive: updatedStatus })
		.eq('id', bannerId)
		.select();
  
	  if (error) {
		throw new Error(error.message);
	  }
  
	  console.log(`Banner ${bannerId} status updated successfully:`, data);
  
	  // Update the state with the new status
	  setData(prevData => 
		prevData.map(banner =>
		  banner.id === bannerId ? { ...banner, isActive: updatedStatus } : banner
		)
	  );
	  
	  return data; // Return the updated data
  
	} catch (error) {
	  console.error("Error updating banner status:", error.message);
	  return null; // Return null in case of an error
	}
  }