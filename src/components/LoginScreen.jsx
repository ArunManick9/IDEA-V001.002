import React, { useState } from "react";
import { login } from "../services/auth";
import { useNavigate } from "react-router-dom";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("login"); // 'login' or 'createUser'
  const [signedIn, setSignedIn] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    if (!email || !password) return;

    const returnedvalue = await login({ email, password });

    if (returnedvalue) {
      // Store access_token and user_id in localStorage
      const accessToken = returnedvalue.session.access_token;
      const userId = returnedvalue.user.id;
      
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("user_id", userId);

      navigate("/locations", { state: { user_id: userId } });
    } else {
      setError("Login failed. Please try again.");
    }
  }

  async function handleCreateUser(e) {
    e.preventDefault();
    if (!email || !password) return;

    const returnedvalue = await createUser({ email, password });

    if (returnedvalue) {
      setActiveTab("login");
    }

    console.log(`User created ${email}`);
  }

  const handleGoogleSignIn = () => {
    console.log("Google Sign-In clicked");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
        <div className="flex justify-center mb-4">
          <button
            className={`px-4 py-2 mr-2 font-medium ${
              activeTab === "login" ? "bg-indigo-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
            onClick={() =>
              setActiveTab("login") &
              setEmail("") &
              setPassword("") &
              setConfirmPassword("")
            }
          >
            Log In
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "createUser" ? "bg-indigo-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
            onClick={() =>
              setActiveTab("createUser") &
              setEmail("") &
              setPassword("") &
              setConfirmPassword("")
            }
          >
            Create User
          </button>
        </div>

        {activeTab === "login" ? (
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-200"
            >
              Log In
            </button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleCreateUser}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-600">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-200"
            >
              Create User
            </button>
          </form>
        )}

        <div className="flex items-center justify-center mt-6">
          <p className="text-sm text-gray-600">Or sign in with</p>
        </div>
        <button
          onClick={handleGoogleSignIn}
          className="w-full px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-200"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;
