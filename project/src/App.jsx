import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import About from "./pages/About";
import Contact from "../src/components/layout/Contact";
import Footer from "./components/layout/Footer";
import ProductDetails from "./pages/ProductDetails";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Login from "../src/pages/Auth/Login";
import Signup from "../src/pages/Auth/Signup";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import PaymentMethods from "../src/components/PaymentMethods/PaymentMethods";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OrderConfirmation from './pages/OrderConfirmation'
import Navbar from "../src/components/layout/NavBar";
import Profile from "./pages/Profile";

function App() {
  const location = useLocation();
  
  const hideNavbarRoutes = [
    "/login",
    "/signup", // Changed from "/register" to match your route
  ];

  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <div className="min-h-screen bg-black flex flex-col">
            {shouldShowNavbar && <Navbar />}
            
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/payment" element={<PaymentMethods />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="profile" element={<Profile/>}/>
              </Routes>
            </main>
            
            <Footer />
            <ToastContainer theme="dark" />
          </div>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;