import supabase from "./supabase";


export async function addlocationtodb(locationData){
    // Assuming 'locationData' is an object containing the data you want to insert
  
    // Insert the data into the 'HOTEL_BASE' table
    const { data, error } = await supabase
      .from('HOTEL_BASE')
      .insert(locationData);
  
    if (error) {
      console.error('Error inserting data:', error.message);
    } else {
      console.log('Data inserted successfully:', data);
    }

  }

export async function getlocations(user_id) {

  
let { data: HOTEL_BASE, error } = await supabase
.from('HOTEL_BASE')
.select("*")
.eq('user_id', user_id)

if (error) {
  console.error('Error fetching locations:', error.message);
} else {
  console.log('Data  successfully:', HOTEL_BASE);
}


return HOTEL_BASE;
        
  
}


export async function deletelocation(loc_id) {

  const { error } = await supabase
  .from('HOTEL_BASE')
  .delete()
  .eq('loc_id', loc_id)
          
  
  if (error) {
    console.error("Error deleting row:", error);
  } else {
    console.log("Row deleted successfully");
  }       
  
}

export async function loadlocation(loc_id){

let { data, error } = await supabase
  .from('HOTEL_BASE')
  .select('*')
  .eq('loc_id', loc_id);

  console.log(data)


  if (error) {
    console.error("Error Loading location:", error);
  } else {
    console.log("Location loaded Sucessfully");
  }   


  return data;

}


export async function addmenuitem(newmenu){
  
const { data, error } = await supabase
.from('MENU_LIST')
.insert(newmenu)
        
if(error){
  console.log(error)
}
else{
  console.log(`added new item successfully ${data}`)
}
}


//api to edit menus
export async function editmenulist(modifieddata, loc_id) {
  console.log("Function entered");
  console.log(modifieddata);
  console.log(loc_id);

   const { data, error } = await supabase
    .from('HOTEL_BASE')
    .update({menus:modifieddata}) // Update the menus column with the stringified data
    .eq('loc_id',loc_id) // Ensure loc_id is a string comparison
    .select();

  if (error) {
    console.log(`Error updating file: ${error.message}`);
  } else {
    console.log(`Success:${data}`);
  }
}


//get Menulistboard


export async function getdetailedmenu(loc_id) {

  
 console.log('entereddd functionnnnnn')
 console.log(loc_id)
let { data: MENU_LIST, error } = await supabase
.from('MENU_LIST')
.select('*')
.eq('inlocation', loc_id)
  
  if (error) {
    console.error('Error fetching locations:', error.message);
  } else {
    console.log('Data successfully:', MENU_LIST);
  }
  
  
  return MENU_LIST;
          
    
  }
  
  export async function getlatestmenuid(loc_id,inmenu,incategory) {

  
    console.log('entereddd functionnnnnn')
    console.log(loc_id, inmenu,incategory)
   let { data: MENU_LIST, error } = await supabase
   .from('MENU_LIST')
   .select('*')
   .eq('inlocation', loc_id)
   //.eq('inmenu', inmenu)
   //.eq('inlocation', incategory)
     
     if (error) {
       console.error('Error fetching locations:', error.message);
     } else {
       console.log('Data successfully:', MENU_LIST);
     }
     
     console.log(`filerrrrr${MENU_LIST}`)

     return MENU_LIST;
             
       
     }

     export async function ordersubmit(orderdata){
      // Assuming 'locationData' is an object containing the data you want to insert
    
      // Insert the data into the 'HOTEL_BASE' table

      console.log(" order submit dunction callelddddd")
      const { data, error } = await supabase
        .from('ORDER_DB')
        .insert(orderdata);
    
      if (error) {
        console.error('Error inserting order data:', error.message);
      } else {
        console.log('Order Data inserted successfully:', data);
      }
  
    }
    ///function to update order status

    export async function updateOrderStatus(order_id, newStatus) {
      console.log("Updating order:", order_id, "to status:", newStatus);
    
      const { data, error } = await supabase
        .from('ORDER_DB')
        .update({ status: newStatus }) // Use the newStatus value passed as an argument
        .eq('order_id', order_id)      // Use the passed order_id, not hardcoded
        .select();
    
      if (error) {
        console.log(`Error updating status: ${error}`);
      } else {
        console.log("Successfully updated status:", data);
      }
    }

    export async function addagent(agentdetails){
  
    const { data, error } = await supabase
    .from('AGENT_DB')
    .insert(agentdetails)
        
      if(error){
        console.log(error)
      }
      else{
        console.log(`added agent successfully ${data}`)
      }
      }


      export async function getagentlogin(mbNum) {

  
        let { data: AGENT_DB, error } = await supabase
        .from('AGENT_DB')
        .select("*")
        .eq('mobile', mbNum)
        
        if (error) {
          console.error('Error fetching AGENT DETAILS:', error.message);
        } else {
          console.log('Agent Data  successfully fetched:', AGENT_DB);
        }
        
        
        return AGENT_DB;
                
          
        }
        export async function getagentdetails(agent_id) {

  
          let { data: AGENT_DB, error } = await supabase
          .from('AGENT_DB')
          .select("*")
          .eq('agent_id', agent_id )
          
          if (error) {
            console.error('Error fetching AGENT DETAILS:', error.message);
          } else {
            console.log('Agent Data  successfully fetched:', AGENT_DB);
          }
          
          
          return AGENT_DB;
                  
            
          }

          export async function deleteMenuItem(item_id) {
            console.log("Deleting menu item with ID:", item_id);
          
            const { error } = await supabase
              .from("MENU_LIST")
              .delete()
              .eq("id", item_id); // Replace 'id' with the actual column name if different
          
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