import supabase from "./supabase";

//FUNCTION TO LOGIN INTO ACCOUNT
export async function login({email, password}) {
    
const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  console.log(data)

  if(error){
    console.log(error)
    return null
  }
  else{
    console.log("logged in successfully")
    return(data)  
  
  }



}

export async function createUser({email,password}) {


  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })
  console.log(data)

  if(error){
    console.log(error)
    return null
  }
  else{
    console.log("USer created sucessfully")
    return(data)  
  
  }

  
}