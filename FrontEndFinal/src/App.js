import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home/Home";
import SignIn from "./pages/Account/SignIn";
import SignUp from "./pages/Account/SignUp";
import AddProduct from "./components/home/Admin/AddProduct";
import Inventory from "./components/home/Admin/Inventory";
import { UserProvider } from "./UserContext";
import Shop from "./pages/Shop/Shop";
import ProductDetails from "./pages/Shop/ProductDetails";
import Cart from "./pages/Cart/Cart"; 
import ForgotPassword from "./pages/Account/ForgotPassword";
import Profile from "./pages/Profile/Profile";
import Contact from "./components/home/Header/Contact";
import About from "./components/home/Header/About";
import MyOrder from "./pages/Order/MyOrder";
import Overview from "./components/home/Admin/Overview";
import BestSeller from "./pages/Shop/BestSeller";
import OrderConfirm from "./pages/Order/OrderConfirm";
import ProtectedRoute from "./ProtectedRoute"; // Import the ProtectedRoute component

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
      </Route>
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/bestseller" element={<BestSeller />} />
      <Route path="/cart" element={<ProtectedRoute element={<Cart />} />} />
      <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
      <Route path="/myorder" element={<ProtectedRoute element={<MyOrder />} />} />
      <Route path="/orderconfirm" element={<ProtectedRoute element={<OrderConfirm />} />} />
      <Route path="/product/:productName" element={<ProductDetails />} /> 
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/addproduct" element={<ProtectedRoute element={<AddProduct />} />} />
      <Route path="/inventory" element={<ProtectedRoute element={<Inventory />} />} />
      <Route path="/overview" element={<ProtectedRoute element={<Overview />} />} />
    </>
  )
);

function App() {
  return (
    <UserProvider>
      <div className="font-bodyFont">
        <RouterProvider router={router} />
      </div>
    </UserProvider>
  );
}

export default App;
