import supabase from "./supabase";

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
      