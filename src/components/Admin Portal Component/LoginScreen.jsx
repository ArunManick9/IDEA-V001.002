import { useState } from "react";
import { login } from "../../services/auth";
import { useNavigate } from "react-router-dom";
import "../../scss/LoginScreen.scss";

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
		<div className="flexbox items-center justify-center min-h-screen outer-container">
			<div className="w-full max-w-md p-8 space-y-6  inner-container">
				<div className="flexbox justify-center mb-4 login-buttons-container">
					<button
						className={`px-4 py-2 mr-2 font-medium login-form--label ${
							activeTab === "login"
								? "white-color bg-yale active-tab"
								: "dark-gray-color bg-light-gray"
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
						className={`px-4 py-2 font-medium login-form--label ${
							activeTab === "createUser"
								? "white-color bg-yale active-tab"
								: "dark-gray-color bg-light-gray"
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
					<form className="space-y-6" onSubmit={handleLogin}>
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium login-form--label"
							>
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
							<label
								htmlFor="password"
								className="block text-sm font-medium login-form--label"
							>
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
							className="w-full px-4 py-2 login-btn login-btn--login"
						>
							Log In
						</button>
					</form>
				) : (
					<form className="space-y-6" onSubmit={handleCreateUser}>
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium login-form--label"
							>
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
							<label
								htmlFor="password"
								className="block text-sm font-medium login-form--label"
							>
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
							<label
								htmlFor="confirm-password"
								className="block text-sm font-medium login-form--label"
							>
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
							className="w-full px-4 py-2 login-btn login-btn--create"
						>
							Create User
						</button>
					</form>
				)}

				<div className="flexbox items-center justify-center mt-6">
					<p className="text-sm help-text">Or sign in with</p>
				</div>
				<button
					onClick={handleGoogleSignIn}
					className="w-full px-4 py-2 login-btn login-btn--google"
				>
					Sign in with Google
				</button>
			</div>
		</div>
	);
};

export default LoginScreen;
