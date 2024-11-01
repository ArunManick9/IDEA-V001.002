// App.js

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { LocationProvider } from './context/LocationContext.jsx';
import MenuList from './components/MenuList.jsx';
import MenuListDashboard from './components/MenuListDashboard.jsx';
import AddItemForm from './components/AddItem.jsx';
import LoginScreen from './components/LoginScreen.jsx';
import LocationCards from './components/LocationCards.jsx';
import CreateOrganization from './components/CreateOrganisation.jsx';
import CreateQR from './components/CreateQR.jsx';
import Orders from './components/Order Management Components/Orders.jsx';
import CreateAgent from './components/CreateAgent.jsx';
import WaiterLogin from './components/Waiter Portal Components/waiterLogin.jsx';
import AgentHome from './components/Waiter Portal Components/AgentHome.jsx';
import ConfirmTable from './components/Visitor Components/ConfirmTable.jsx';
import OrderModal from './components/Waiter Portal Components/OrderModal.jsx';

const App = () => {
  return (
    <LocationProvider>
        <Router>
          <Routes>
            <Route path="/createlocation" element={<CreateOrganization />} />
            <Route path="/" element={<LoginScreen />} />
            <Route path="/locations" element={<LocationCards />} />
            <Route path="/location/:loc_id/menus" element={<MenuList />} />
            <Route path="/menuboard/" element={<MenuListDashboard />} />
            <Route path="/additem/:loc_id" element={<AddItemForm />} />
            <Route path="/location/:loc_id/createqr" element={<CreateQR />} />
            <Route path="/digimenu/:loc_id/:table_id" element={<ConfirmTable/>} />
            <Route path="/kitchenroom/:loc_id/orders" element={<Orders />} />
            <Route path="/location/:loc_id/createagent" element={<CreateAgent />} />
            <Route path="/location/:loc_id/agentlogin" element={<WaiterLogin />} />
            <Route path="/location/:loc_id/:agent_id" element={<AgentHome />} />
            <Route path="/location/:loc_id/orders/:order_id" element={<OrderModal/>} />
          </Routes>
        </Router>
    </LocationProvider>
  );
};

export default App;
