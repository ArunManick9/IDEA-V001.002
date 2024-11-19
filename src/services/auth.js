import supabase from "./supabase";

export const login = async ({ email, password }) => {
  try {
    // Log in the user
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    // Store the access_token and user_id in localStorage
    const accessToken = data.session.access_token;
    const userId = data.user.id;

    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('user_id', userId);  // Store user ID

    // Return the user and session data
    return {
      user: data.user,
      session: data.session,
    };
  } catch (err) {
    console.error('Error during login:', err);
    return null;  // or you can return error details
  }
};

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