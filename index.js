import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


import User from "./models/User.js";
import Event from "./models/Event.js";

const app = express();


app.use(cors());
app.use(express.json());


mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Mongo Error:", err));


app.get("/", (req, res) => {
  res.send("Event App API running");
});


function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization; 
  if (!authHeader) return res.status(401).json({ message: "No token" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
}


app.post("/userRegister", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.json({ msg: "All fields are required" });

    const exist = await User.findOne({ email });
    if (exist) return res.json({ msg: "User already exist !" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      passwordHash: hashedPassword,
      role: "user",
    });

    res.json({
      msg: "Registration Success !",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.log(err);
    res.json({ msg: "Server Error" });
  }
});


app.post("/userLogin", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password)
      return res.json({
        serverMsg: "All fields are required",
        loginStatus: false,
      });

    const user = await User.findOne({ email });
    if (!user)
      return res.json({
        serverMsg: "User not found",
        loginStatus: false,
      });

   
    if (role && user.role !== role)
      return res.json({
        serverMsg: "Access denied for this role",
        loginStatus: false,
      });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch)
      return res.json({
        serverMsg: "Incorrect password",
        loginStatus: false,
      });

   
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      serverMsg: "Login Success",
      loginStatus: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.log(err);
    res.json({ serverMsg: "Server Error", loginStatus: false });
  }
});




app.get("/events", async (req, res) => {
  try {
    const events = await Event.find().sort({ eventDate: 1 });
    res.json(events);
  } catch (error) {
    console.log(error);
    res.json({ msg: "Error loading events" });
  }
});

//  Add event
app.post("/addEvent", authMiddleware, adminOnly, async (req, res) => {
  try {
    const newEvent = await Event.create({
      ...req.body,
      createdBy: req.user.id,
    });
    res.json({ msg: "Event Added", event: newEvent });
  } catch (error) {
    console.log(error);
    res.json({ msg: "Error adding event" });
  }
});

// Update event
app.put("/updateEvent/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ msg: "Event updated successfully", event: updatedEvent });
  } catch (error) {
    console.log(error);
    res.json({ msg: "Update error" });
  }
});

// Delete event
app.delete("/deleteEvent/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ msg: "Event deleted" });
  } catch (error) {
    console.log(error);
    res.json({ msg: "Delete error" });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
