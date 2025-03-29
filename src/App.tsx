import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import Dashboard from "./screens/Dashboard";
import axios from "axios";
import jwt_decode from "jwt-decode";
import TBoxScreen from "./screens/Tbox";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Use null to indicate loading state

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("authToken"); // Get the token from localStorage

      if (!token) {
        setIsAuthenticated(false); // No token, redirect to login
        return;
      }

      try {
        // Decode the token to check its expiration
        const decoded: any = jwt_decode(token);
        const currentTime = Date.now() / 1000; // Get current time in seconds
        if (decoded.exp < currentTime) {
          console.log("Token expired.");
          setIsAuthenticated(false); // Token expired, redirect to login
          return;
        }

        // Send the token to the server for verification
        const response = await axios.post(
          "http://localhost:5000/verify-token", 
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log(response);  // Log the response to debug

        if (response.status === 200) {
          setIsAuthenticated(true); // Valid token, allow access to the dashboard
        } else {
          setIsAuthenticated(false); // Invalid token, redirect to login
        }
      } catch (err) {
        console.error("Error verifying token:", err);  // Log any error for debugging
        setIsAuthenticated(false); // In case of any error, redirect to login
      }
    };

    verifyToken();
  }, []);

  if (isAuthenticated === null) return <div>Loading...</div>; // Show loading state until token verification is done

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/tbox" element={<TBoxScreen />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      </Routes>
    </Router>
  );
};

export default App;
