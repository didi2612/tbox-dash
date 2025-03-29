import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tncAccepted, setTncAccepted] = useState(false);
  const navigate = useNavigate(); // Navigation hook

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tncAccepted) {
      toast.error("You must accept the Terms & Conditions to continue.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Signup successful! Redirecting...", {
          autoClose: 2000, // Ensures it stays visible for 2 seconds
        });
      
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(data.message || "Signup failed. Try a different email.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An error occurred. Please try again.");
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

      {/* Right Side - Signup Form */}
      <div className="flex flex-col justify-center items-center bg-white px-10">
        {/* Logo */}
        <div className="mb-6">
          <img
            src="https://office.iium.edu.my/ocap/wp-content/uploads/sites/2/2023/08/logo-IIUM-ori-768x225-1.png"
            alt="Logo"
            className="w-40"
          />
        </div>

        <h2 className="text-4xl font-bold text-blue-600">Create an Account</h2>
        <p className="text-gray-500 text-lg mt-2">Sign up to get started</p>

        <form onSubmit={handleSignup} className="mt-8 w-full max-w-lg">
          <div>
            <label className="block text-lg font-medium text-gray-600">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-4 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-lg"
              required
            />
          </div>

          <div className="mt-6">
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

          {/* Terms & Conditions Checkbox */}
          <div className="mt-6 flex items-center">
            <input
              type="checkbox"
              checked={tncAccepted}
              onChange={() => setTncAccepted(!tncAccepted)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ml-3 text-gray-600 text-lg">
              I agree to the{" "}
              <a href="/terms" className="text-blue-500 hover:underline">
                Terms & Conditions
              </a>
            </label>
          </div>

          <button
            type="submit"
            className={`w-full py-4 mt-8 text-xl rounded-lg transition font-semibold ${
              tncAccepted ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
            disabled={!tncAccepted}
          >
            Sign Up
          </button>
        </form>

        <p className="text-gray-500 text-lg mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
