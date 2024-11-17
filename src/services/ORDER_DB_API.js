import supabase from "./supabase";


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
