import React from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Products from "./components/Products";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ProductDetails from "./components/ProductDetails";
import Wishlist from "./components/Wishlist";
import Cart from "./components/Cart";
import { CartProvider } from "./contexts/CartContext";
import PaymentMethods from "./components/PaymentMethods";

function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-black flex flex-col">
        <NavBar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/payment" element={<PaymentMethods />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}

export default App;
