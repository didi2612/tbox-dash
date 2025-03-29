import React, { useEffect, useState } from "react";
import Topbar from "./Topbar"; // Import Topbar component
import axios from "axios"; // Import axios to make HTTP requests

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data from backend using the user ID from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("userDetails"); // Fetch from localStorage
   
    if (storedUser) {
      console.log(storedUser); // Log the stored user details to ensure it's correct

      const { _id } = JSON.parse(storedUser); // Parse the userDetails and get the _id

      axios
        .get(`https://100.109.28.20:5000/get-user/${_id}`) // Use the get-user endpoint to fetch user data
        .then((response) => {
          setUser(response.data); // Assuming the response contains the user object
          setLoading(false);
          
        });
    } else {
      setError("No user data found in localStorage");
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>; // You can display a loading screen while fetching user data
  }

  if (error) {
    return <div>{error}</div>; // Display error message if there was an issue fetching data
  }

  if (!user) {
    return <div>User data not available</div>; // Fallback message if user data isn't available
  }

  return (
    <div className="bg-gray-100 min-h-screen pt-16">
      {/* Top Navigation Bar */}
      <Topbar />

      {/* Dashboard Content */}
      <div className="p-6">
        {/* Personalized Greeting */}
        <h2 className="text-2xl font-semibold mb-4">
          Welcome back, {user.fullName}!
        </h2>

        {/* Optional Personalized Content */}
        <div className="bg-blue-100 p-4 mb-6">
          <p className="text-gray-700">
            You have {user.deviceCount} devices connected. Stay up to date with the latest
            updates and insights about your vehicles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card Components */}
          {[{
            title: "Tbox Panel",
            description: "Your Tbox",
            linkText: "Go to my account",
            link: "/tbox",
            image: "https://cdn-icons-png.flaticon.com/512/871/871906.png",
            textColor: "text-blue-600",
          }, {
            title: "Vehicle Check",
            description: "Make daily safety and maintenance checks easy.",
            linkText: "Go to my account",
            link: "#",
            image: "https://cdn-icons-png.flaticon.com/512/2137/2137894.png",
            textColor: "text-red-600",
          }, {
            title: "Maintenance Schedule",
            description: "Track your vehicle maintenance schedules.",
            linkText: "Go to my account",
            link: "#",
            image: "https://cdn-icons-png.flaticon.com/512/2936/2936285.png",
            textColor: "text-green-600",
          }].map((item, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-lg shadow-md flex items-center hover:scale-105 hover:shadow-lg transition-transform"
            >
              {/* Image on the Left */}
              <img src={item.image} alt={item.title} className="h-24 w-24 object-cover rounded-lg mr-4" />

              {/* Content */}
              <div className="flex-1">
                <h3 className={`text-lg font-semibold ${item.textColor}`}>{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>

                {/* Separate Clickable Link */}
                <a href={item.link} className={`${item.textColor} mt-2 inline-block hover:underline`}>
                  {item.linkText} &gt;
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
