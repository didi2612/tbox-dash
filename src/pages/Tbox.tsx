import React, { useEffect, useState } from "react";
import axios from "axios";
import Topbar from "./Topbar";

interface VehicleData {
  _id: string;
  timeStamp: string;
  deviceType: string;
  deviceName: string;
  id: string;
  version: string;
  event: string;
  licensePlateNo: string | null;
  status: any;
}

interface User {
  _id: string;
  tbox: string | null;
  fullName: string;
}

const TBoxScreen: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userDetails");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      axios
        .get(`https://serveazp.tailf2655f.ts.net/get-user/${parsedUser._id}`)
        .then((response) => {
          setLoading(false);
          if (response.data && response.data.tbox) {
            const tbox = response.data.tbox;
            setUser(response.data);
            axios
              .get(`https://serveazp.tailf2655f.ts.net/api/vehicle/${tbox}`)
              .then((vehicleResponse) => {
                setVehicleData(vehicleResponse.data);
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

  const formatStatus = (status: any) => {
    if (!status) return null;
    return {
      Engine: status.engineOn?.$numberInt === "1" ? "On" : "Off",
      "Door Lock": status.doorLock?.$numberInt === "1" ? "Locked" : "Unlocked",
      "Door Open": status.doorOpen?.map((door: any, idx: number) => `Door ${idx + 1}: ${door.$numberInt === "1" ? "Open" : "Closed"}`),
      "Windows Open": status.doorWindow?.map((win: any, idx: number) => `Window ${idx + 1}: ${win.$numberInt === "1" ? "Open" : "Closed"}`),
      Alarm: status.alarm?.$numberInt === "1" ? "Activated" : "Deactivated",
      "Seat Belt": status.seatBelt?.map((belt: any, idx: number) => `Seat ${idx + 1}: ${belt.$numberInt === "1" ? "Fastened" : "Unfastened"}`),
      "Head Lamps": status.headLamp?.$numberInt === "1" ? "On" : "Off",
      "Turn Signal": status.turnSignal?.map((signal: any, idx: number) => `Signal ${idx + 1}: ${signal.$numberInt === "1" ? "On" : "Off"}`),
      "Steering Angle": `${status.steeringAngle?.$numberDouble}°`,
      "Tyre Pressure": status.tyrePressure?.map((tyre: any, idx: number) => `Tyre ${idx + 1}: ${tyre.$numberInt} psi`),
      "Fuel Level": `${status.fuel?.$numberDouble} L`,
      Speed: `${status.speed?.$numberDouble} km/h`,
      Odometer: `${status.odometer?.$numberInt} km`,
      "Cabin Temp": `${status.cabinTemp?.$numberDouble}°C`,
      "Aircon Temp": `${status.airconTemp?.$numberDouble}°C`,
      "GPS Location": `Lat: ${status.gpsLocation?.[0]?.$numberDouble}, Lon: ${status.gpsLocation?.[1]?.$numberDouble}`,
      "Battery Level": `${status.battery?.$numberDouble} V`,
      "Hand Brake": status.handBrake?.$numberInt === "1" ? "Engaged" : "Released",
    };
  };

  const statusData = vehicleData?.status ? formatStatus(vehicleData.status) : null;

  if (error) {
    return <div className="bg-red-100 text-red-700 p-4 rounded-lg max-w-lg mx-auto mt-10"><strong>Error:</strong> {error}</div>;
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl text-gray-500">Loading...</div>;
  }

  return (
    <div className="h-screen bg-gray-100">
      <Topbar />
      <div className="container mx-auto p-6 mt-8 max-w-6xl">
        <div className="text-lg font-semibold text-gray-600 mb-4">
          Welcome, {user?.fullName || "User"}!
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">TBox Data</h1>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Device Info Card */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-600 mb-4">Device Info</h2>
              <p><strong>Device Type:</strong> {vehicleData?.deviceType}</p>
              <p><strong>Device Name:</strong> {vehicleData?.deviceName}</p>
              <p><strong>Version:</strong> {vehicleData?.version}</p>
              <p><strong>Event:</strong> {vehicleData?.event}</p>
            </div>

            {/* Vehicle Info Card */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-600 mb-4">Vehicle Info</h2>
              <p><strong>License Plate:</strong> {vehicleData?.licensePlateNo || "N/A"}</p>
            </div>
          </div>

          {/* Status Card */}
          {statusData && (
            <div className="bg-gray-50 p-6 rounded-lg shadow-md mt-6">
              <h2 className="text-lg font-semibold text-gray-600 mb-4">Status</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-600">
                {Object.entries(statusData).map(([key, value], index) => (
                  <div key={index} className="bg-white p-4 rounded shadow text-sm">
                    <strong>{key}:</strong> {Array.isArray(value) ? value.join(", ") : value}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default TBoxScreen;
