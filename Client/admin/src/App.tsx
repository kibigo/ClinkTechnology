import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import AdminHome from "./components/AdminHome";
import AdminCustomers from "./components/AdminCustomers";
import Login from "./upfront/Login";
import Register from "./upfront/Register";
import AdminProduct from "./components/AdminProducts";
import { UserProvider } from "./context/userContext";
import PrivateRoute from "./upfront/PrivatedRoute";
import AdminOrder from "./components/AdminOrder";
import AddProduct from "./SecondPages/AddProduct";
import UpdateProduct from "./SecondPages/UpdateProduct";
import UpdateOrder from "./SecondPages/updateOrder";
import UpdateOrderItem from "./SecondPages/UpdateOrderItem";
import UpdateShipment from "./SecondPages/UpdateShipment";
import UpdateUser from "./SecondPages/UpdateUser";
import AddCustomer from "./SecondPages/AddCustomer";
import Settings from "./components/Settings";
import AdminProfile from "./components/AdminProfile";

function App() {


  return (
    <Router>
      <UserProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          >
            <Route index element={<AdminHome />} />
            <Route path="admin/customers" element={<AdminCustomers />} />
            <Route path="admin/customers/updatecustomer/:id" element={<UpdateUser/>}/>
            <Route path="admin/customers/addcustomer" element={<AddCustomer />}/>
            <Route path="admin/products" element={<AdminProduct />} />
            <Route path="admin/orders" element={<AdminOrder />} />
            <Route path="admin/settings" element={<Settings/>}/>
            <Route path="admin/profile" element={<AdminProfile />}/>
            <Route path="admin/products/addproduct" element={<AddProduct />} />
            <Route path="admin/products/updateproduct/:id" element={<UpdateProduct />}/>
            <Route path="admin/orders/updateorder/:id" element={<UpdateOrder/>}/>
            <Route path="admin/orders/updateorderitem/:id" element={<UpdateOrderItem/>}/>
            <Route path="admin/orders/updateshipment/:id" element={<UpdateShipment/>}/>
          </Route>
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
