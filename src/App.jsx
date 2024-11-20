import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AdminPortalAuthProvider } from "./context/AdminPortalAuthContext";
import { LocationProvider } from "./context/LocationContext"; // Import LocationContext
import ProtectedAdminRoute from "./context/ProtectedAdminRoute";

// Components
import LoginScreen from "./components/LoginScreen";
import CreateOrganization from "./components/CreateOrganisation";
import LocationCards from "./components/LocationCards";
import MenuList from "./components/MenuList";
import MenuListDashboard from "./components/MenuListDashboard";
import AddItemForm from "./components/AddItem";
import CreateQR from "./components/CreateQR";
import Orders from "./components/Order Management Components/Orders";
import CreateAgent from "./components/CreateAgent";
import WaiterLogin from "./components/Waiter Portal Components/WaiterLogin";
import AgentHome from "./components/Waiter Portal Components/AgentHome";
import ConfirmTable from "./components/Visitor Components/ConfirmTable";
import OrderModal from "./components/Waiter Portal Components/OrderModal";

const App = () => {
	return (
		<AdminPortalAuthProvider>
			<LocationProvider>
				{" "}
				{/* Wrap with LocationProvider */}
				<Router>
					<Routes>
						{/* Public Routes */}
						<Route path="/" element={<LoginScreen />} />
						<Route path="/locations" element={<LocationCards />} />
						<Route path="/location/:loc_id/menus" element={<MenuList />} />
						<Route path="/menuboard" element={<MenuListDashboard />} />
						<Route path="/additem/:loc_id" element={<AddItemForm />} />
						<Route path="/location/:loc_id/createqr" element={<CreateQR />} />
						<Route
							path="/location/:loc_id/agentlogin"
							element={<WaiterLogin />}
						/>
						<Route path="/kitchenroom/:loc_id/orders" element={<Orders />} />{" "}
						{/*not sure how consme this page yet but it shows all order for ktichen*/}
						<Route
							path="/location/:loc_id/createagent"
							element={<CreateAgent />}
						/>
						<Route path="/location/:loc_id/:agent_id" element={<AgentHome />} />
						<Route
							path="/digimenu/:loc_id/:table_id"
							element={<ConfirmTable />}
						/>
						<Route
							path="/location/:loc_id/orders/:order_id"
							element={<OrderModal />}
						/>
					</Routes>
				</Router>
			</LocationProvider>{" "}
			{/* Close LocationProvider */}
		</AdminPortalAuthProvider>
	);
};

export default App;
