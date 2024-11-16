import supabase from "./supabase";


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
       