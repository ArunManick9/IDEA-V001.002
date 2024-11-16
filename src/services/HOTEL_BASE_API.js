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
  