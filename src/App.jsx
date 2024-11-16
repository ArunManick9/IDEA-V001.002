import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AdminPortalAuthProvider } from "./context/AdminPortalAuthContext";
import { LocationProvider } from "./context/LocationContext";  // Import LocationContext
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
import WaiterLogin from "./components/Waiter Portal Components/waiterLogin";
import AgentHome from "./components/Waiter Portal Components/AgentHome";
import ConfirmTable from "./components/Visitor Components/ConfirmTable";
import OrderModal from "./components/Waiter Portal Components/OrderModal";

const App = () => {
  return (
    <AdminPortalAuthProvider>
      <LocationProvider>  {/* Wrap with LocationProvider */}
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LoginScreen />} />
            <Route path="/location/:loc_id/agentlogin" element={<WaiterLogin />} />
            <Route path="/location/:loc_id/:agent_id" element={<AgentHome />} />
            <Route path="/digimenu/:loc_id/:table_id" element={<ConfirmTable />} />
            <Route path="/location/:loc_id/orders/:order_id" element={<OrderModal />} />

            {/* Protected Admin Routes */}
            <Route
              path="/createlocation"
              element={
                <ProtectedAdminRoute>
                  <CreateOrganization />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/locations"
              element={
                <ProtectedAdminRoute>
                  <LocationCards />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/location/:loc_id/menus"
              element={
                <ProtectedAdminRoute>
                  <MenuList />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/menuboard"
              element={
                <ProtectedAdminRoute>
                  <MenuListDashboard />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/additem/:loc_id"
              element={
                <ProtectedAdminRoute>
                  <AddItemForm />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/location/:loc_id/createqr"
              element={
                <ProtectedAdminRoute>
                  <CreateQR />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/kitchenroom/:loc_id/orders"
              element={
                <ProtectedAdminRoute>
                  <Orders />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/location/:loc_id/createagent"
              element={
                <ProtectedAdminRoute>
                  <CreateAgent />
                </ProtectedAdminRoute>
              }
            />
          </Routes>
        </Router>
      </LocationProvider> {/* Close LocationProvider */}
    </AdminPortalAuthProvider>
  );
};

export default App;
