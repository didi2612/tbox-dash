import React, { useState } from "react";
import { HomeIcon, UserCircleIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

const Topbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    // Clear cookies
    document.cookie.split(";").forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=" + new Date(0).toUTCString() + ";path=/";
    });

    // Clear local storage
    localStorage.clear();

    // Redirect to login page
    window.location.href = "/login"; // Update the path to your login page if needed
  };

  return (
    <header className="bg-white shadow-md py-3 px-6 fixed top-0 left-0 w-full z-50 flex items-center justify-between">
      {/* Logo & Mobile Menu Button */}
      <div className="flex items-center gap-6">
        <img src="https://office.iium.edu.my/ocap/wp-content/uploads/sites/2/2023/08/logo-IIUM-ori-768x225-1.png" alt="Logo" className="h-8 w-26" />
        
        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        </button>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-6">
        <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
          <HomeIcon className="w-5 h-5" /> Fuel Cards
        </a>
        <a href="#" className="text-gray-700 hover:text-blue-600">Telematics</a>
        <a href="#" className="text-gray-700 hover:text-blue-600">Vehicle Check</a>
        <a href="#" className="text-gray-700 hover:text-blue-600">Dashboard</a>
        <a href="#" className="text-gray-700 hover:text-blue-600">Invoices</a>
        <a href="#" className="text-gray-700 hover:text-blue-600">Contact & Help</a>
      </nav>

      {/* Account & Logout */}
      <div className="hidden md:flex items-center gap-4">
        <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
          <UserCircleIcon className="w-6 h-6" /> 
        </a>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Log out
        </button>
      </div>

      {/* Mobile Navigation (Dropdown) */}
      {isMenuOpen && (
        <nav className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-center gap-4 py-4 md:hidden">
          <a href="#" className="text-gray-700 hover:text-blue-600">Fuel Cards</a>
          <a href="#" className="text-gray-700 hover:text-blue-600">Telematics</a>
          <a href="#" className="text-gray-700 hover:text-blue-600">Vehicle Check</a>
          <a href="#" className="text-gray-700 hover:text-blue-600">Dashboard</a>
          <a href="#" className="text-gray-700 hover:text-blue-600">Invoices</a>
          <a href="#" className="text-gray-700 hover:text-blue-600">Contact & Help</a>
          <hr className="w-4/5 border-gray-300" />
          <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
            <UserCircleIcon className="w-6 h-6" /> Account
          </a>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Log out
          </button>
        </nav>
      )}
    </header>
  );
};

export default Topbar;
