import React, { useEffect, useState } from "react";
import axios from "axios";
import Topbar from "./Topbar"; // Assuming you have a Topbar component

// Define the type for the Vehicle Data
interface VehicleData {
  _id: string;
  timeStamp: string;
  deviceType: string;
  deviceName: string;
  id: string;
  version: string;
  event: string;
  licensePlateNo: string | null;
  status: Array<any>;
}

// Define the type for the User
interface User {
  _id: string;
  tbox: string | null;
  fullName: string;
  // Add other user fields here if necessary
}

const TBoxScreen: React.FC = () => {
  const [user, setUser] = useState<User | null>(null); // Set type for user state
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null); // Set type for vehicleData
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the stored user details from localStorage
    const storedUser = localStorage.getItem("userDetails");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser); // Parse the user object from localStorage
      setUser(parsedUser); // Set the user state with the stored user details
      // Fetch the user data based on the user ID (you can customize the URL accordingly)
      axios
        .get(`http://localhost:5000/get-user/${parsedUser._id}`)
        .then((response) => {
          setLoading(false); // Set loading to false after data is fetched
          if (response.data && response.data.tbox) {
            const tbox = response.data.tbox;
            setUser(response.data);
            // Fetch the vehicle data based on the user's tbox field (deviceName or tbox ID)
            axios
              .get(`http://localhost:5000/api/vehicle/${tbox}`)
              .then((vehicleResponse) => {
                setVehicleData(vehicleResponse.data); // Set the vehicle data
              })
              .catch((error) => {
                console.error("Error fetching vehicle data:", error);
                setError("Failed to fetch vehicle data");
              });
          } else {
            setError("No Tbox data available for this user.");
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setError("Failed to fetch user details");
          setLoading(false);
        });
    } else {
      setError("No user data found in localStorage");
      setLoading(false);
    }
  }, []);

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg max-w-lg mx-auto mt-10">
        <strong>Error:</strong> {error}
      </div>
    ); // Styled error message
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-500">
        Loading...
      </div>
    ); // Loading message
  }

  if (!vehicleData) {
    return (
      <div className="max-w-4xl mx-auto p-6 mt-10 text-center">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800">No vehicle data available.</h2>
        </div>
      </div>
    ); // Handle case where vehicle data is not fetched
  }

  return (
    <div className="h-screen bg-gray-100">
      <Topbar />\
      <div className="container mx-auto p-6 mt-8 max-w-6xl">
      <div className="text-lg font-semibold text-gray-600 mb-4">
  Welcome, {user?.fullName || "User"}!
</div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">TBox Data</h1>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Device Info Card */}
            <div className="flex items-center bg-gray-50 p-6 rounded-lg shadow-md max-w-sm">
              <div className="w-1/3">
                <img
                  src="https://www.svgrepo.com/show/29111/package-boxes.svg" // Add your image URL
                  alt="Device Image"
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <div className="ml-4 w-2/3">
                <h2 className="text-lg font-semibold text-gray-600 mb-4">Device Info</h2>
                <p className="text-sm text-gray-500 mb-2">
                  <strong>Device Type:</strong> {vehicleData.deviceType}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  <strong>Device Name:</strong> {vehicleData.deviceName}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  <strong>Version:</strong> {vehicleData.version}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Event:</strong> {vehicleData.event}
                </p>
              </div>
            </div>

            {/* Vehicle Info Card */}
            <div className="flex items-center bg-gray-50 p-6 rounded-lg shadow-md max-w-sm">
              <div className="w-1/3">
                <img
                  src="https://images.vexels.com/media/users/3/318528/isolated/preview/c5b67134589df22b8dceab03b8b49a46-high-quality-car-hand-drawn-sketch.png" // Add your image URL
                  alt="Vehicle Image"
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <div className="ml-4 w-2/3">
                <h2 className="text-lg font-semibold text-gray-600 mb-4">Vehicle Info</h2>
                <p className="text-sm text-gray-500">
                  <strong>License Plate:</strong> {vehicleData.licensePlateNo || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TBoxScreen;
