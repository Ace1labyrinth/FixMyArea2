import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  // Navigate,
} from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Report from "./pages/Report";
import MyReports from "./pages/MyReport";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import About from "./pages/About";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/report" element={<Report />} />
        <Route path="/myreport" element={<MyReports />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
      <ToastContainer position="bottom-center" autoClose={3000} />
    </Router>
  );
}

export default App;
