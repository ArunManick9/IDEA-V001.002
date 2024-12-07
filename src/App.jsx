import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AdminPortalAuthProvider } from "./context/AdminPortalAuthContext";
import { LocationProvider } from "./context/LocationContext"; // Import LocationContext

//Components

import LoginScreen from "./components/Admin Portal Component/LoginScreen";
import MenuList from "./components/Admin Portal Component/MenuList";
import MenuListDashboard from "./components/Admin Portal Component/MenuListDashboard";
import AddItemForm from "./components/Admin Portal Component/AddItem";
import CreateQR from "./components/Admin Portal Component/CreateQR";
import Orders from "./components/Order Management Components/Orders";
import CreateAgent from "./components/Admin Portal Component/CreateAgent";
import WaiterLogin from "./components/Waiter Portal Components/WaiterLogin";
import AgentHome from "./components/Waiter Portal Components/AgentHome";
import ConfirmTable from "./components/Visitor Components/ConfirmTable";
import OrderModal from "./components/Waiter Portal Components/OrderModal";
import EnhanceMenu from "./components/Admin Portal Component/EnhanceMenu";
import LocationCards from "./components/Admin Portal Component/LocationCards";
import Dummy from "./components/Dummy";
import MenuDetail from "./components/Visitor Components/MenuDetail";

const App = () => {

	return (
		<AdminPortalAuthProvider>
			<LocationProvider>
				{" "}
				{/* Wrap with LocationProvider */}
				<Router>
					<Routes>
						{/* Public Routes */}
						<Route path="/dummy" element={<Dummy />} />
						<Route path="/" element={<LoginScreen />} />
						<Route path="/locations" element={<LocationCards />} />
						<Route path="/location/:loc_id/menus" element={<MenuList />} />
						<Route path="/:loc_id/menuboard" element={<MenuListDashboard />} />
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
						<Route
							path="menuboard/:loc_id/enhancemenu"
							element={<EnhanceMenu />}
						/>
					</Routes>
				</Router>
			</LocationProvider>{" "}
			{/* Close LocationProvider */}
		</AdminPortalAuthProvider>
	);
};

export default App;
