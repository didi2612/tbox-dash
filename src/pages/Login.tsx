import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css"; // Correct CSS import
import { useNavigate } from "react-router-dom"; // Use React Router's useNavigate

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook to programmatically navigate

  // Log the authToken to the console
  console.log("Auth Token:", localStorage.getItem("authToken"));

  // Check if the user is already logged in (i.e., authToken exists)
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      navigate("/"); // Redirect to dashboard if authToken exists
    }
  }, [navigate]); // Re-run when navigate changes

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const res = await axios.post(
        "http://100.109.28.20:5000/login", // Backend login route
        { email, password },
        { withCredentials: true } // Ensure cookies are sent with the request
      );
  
      // Show success notification with react-toastify
      toast.success(res.data.message, {
        position: "top-center", 
        autoClose: 2000,
      });
  
      // Store the token and user details in localStorage
      localStorage.setItem("authToken", res.data.token); // Store the authToken
      localStorage.setItem("userDetails", JSON.stringify(res.data.user)); // Store the user details
  
      // Redirect after login
      navigate("/"); 
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
      toast.error(err.response?.data?.message || "Login failed", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };
  

  return (
    <div className="h-screen w-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Side - Image */}
      <div className="hidden md:flex items-center justify-center bg-blue-600">
        <img
          src="https://images.prismic.io/velocity-test/1d476306-a0ed-4b16-91e7-74a435c15c6c_Login+Image+UK.png?auto=compress,format"
          alt="IIUM Campus"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="flex flex-col justify-center items-center bg-white px-10">
        <h2 className="text-4xl font-bold text-blue-600">Welcome Back</h2>
        <p className="text-gray-500 text-lg mt-2">Sign in to continue</p>

        {error && <p className="text-red-500 mt-2">{error}</p>}

        <form onSubmit={handleLogin} className="mt-8 w-full max-w-lg">
          <div>
            <label className="block text-lg font-medium text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-lg"
              required
            />
          </div>

          <div className="mt-6">
            <label className="block text-lg font-medium text-gray-600">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-lg"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 mt-8 text-xl text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Login
          </button>
        </form>

        <p className="text-gray-500 text-lg mt-6">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
