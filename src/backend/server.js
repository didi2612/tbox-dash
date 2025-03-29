import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express();

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true,               // Allow cookies and authentication headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

// MongoDB Connection (Explicitly Using "Tbox" Database)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "Tbox", // Connects to "Tbox" DB
}).then(() => console.log("Connected to MongoDB (Tbox)"))
  .catch((err) => console.log(err));

const VehicleSchema = new mongoose.Schema({
  timeStamp: String,
  deviceType: String,
  deviceName: String,
  id: String,
  version: String,
  event: String,
  licensePlateNo: String,
  status: [Object], // Array of objects as seen in your data
});

const Vehicle = mongoose.model('Vehicle', VehicleSchema, 'vehicle');

const UserSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
});

// Add a method to the User schema to verify passwords
UserSchema.methods.verifyPassword = function (password) {
  return bcrypt.compare(password, this.password); // Compare plain password with hashed password
};

const User = mongoose.model("User", UserSchema, "users"); // Explicitly using "users" collection

// Signup Route
app.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullName, email, password: hashedPassword });
    await newUser.save();
    res.json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Authenticate the user (e.g., check email and password)
  const user = await User.findOne({ email });
  if (!user || !(await user.verifyPassword(password))) {  // Check password
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Generate JWT token
  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

  // Send token and user details in the response
  res.json({
    message: "Login successful",
    token,
    user: {
      _id: user._id,
    }
  });
});

// Dashboard Route
app.get("/", (req, res) => {
  console.log("Cookies:", req.cookies);  // Log the cookies to check if authToken is present

  const token = req.cookies.authToken;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ message: "Welcome to the dashboard", user: decoded });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// Token Verification Route
app.post("/verify-token", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // token from the header

  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send("Unauthorized");
    }
    res.status(200).send("Token is valid");
  });
});

// Vehicle Details Route
app.get('/api/vehicle/:deviceName', async (req, res) => {
  const { deviceName } = req.params;

  try {
    // Fetch the vehicle data from the Vehicle model based on the deviceName
    const vehicle = await Vehicle.findOne({ deviceName });

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // Return the vehicle data
    res.json(vehicle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching vehicle data" });
  }
});

// Get User Details by ID Route
app.get("/get-user/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id); // Find the user by ID
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user data
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user data" });
  }
});

// Logout Route
app.post("/logout", (req, res) => {
  res.clearCookie("authToken");
  res.json({ message: "Logged out successfully" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
