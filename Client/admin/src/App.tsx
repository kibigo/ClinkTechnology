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
            <Route path="admin/products" element={<AdminProduct />} />
            <Route path="admin/orders" element={<AdminOrder />} />
            <Route path="admin/addproduct" element={<AddProduct />} />
            <Route path="admin/updateproduct/:id" element={<UpdateProduct />}/>
            <Route path="admin/updateorder/:id" element={<UpdateOrder/>}/>
          </Route>
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
