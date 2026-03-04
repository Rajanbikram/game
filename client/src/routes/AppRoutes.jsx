import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../page/public/auth/Login";
import Register from "../page/public/auth/Register";
import Home from "../page/private/user/Home";
import ProductDetail from "../page/private/user/ProductDetail";
import Cart from "../page/private/user/Cart";
import Checkout from "../page/private/user/Checkout";
import Orders from "../page/private/user/Orders";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/product/:id" element={<PrivateRoute><ProductDetail /></PrivateRoute>} />
        <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
        <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
        <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}