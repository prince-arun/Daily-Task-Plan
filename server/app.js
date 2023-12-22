const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const Tasks = require("./models/TaskModel");

//Initializing Packages
const app = express();

dotenv.config();

//Initializing Middleware
app.use(express.json());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded());

//Initializing Constants
const PORT = process.env.PORT || 5000;

//Creating Server
app.get("/", (req, res) => {
  res.status(200).send("Welcome to the Server");
});

//Connecting to server before listening
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.CONNECTION_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

//Post Request
app.post("/api/tasks", async (req, res) => {
  try {
    // Destructure the details from the request body
    const { user, title, tag, status } = req.body;

    // Check if the user already exists
    let existingUser = await Tasks.findOne({ user });

    if (!existingUser) {
      // If the user doesn't exist, create a new user
      existingUser = await Tasks.create({ user, tasks: [] });
    }

    // Add the task details to the user's tasks
    existingUser.tasks.push({ title, tag, status });
    await existingUser.save();

    res.status(201).json({ success: true, message: "Task added successfully" });
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

//Get Request
app.get("/api/tasks/:user", async (req, res) => {
  try {
    const user = req.params.user;
    console.log("Fetching tasks for user:", user);

    // Find the user by their unique identifier
    const existingUser = await Tasks.findOne({ user });

    if (!existingUser) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    console.log("Tasks for user:", existingUser.tasks);

    // Return the tasks for the user
    res.status(200).json({ success: true, tasks: existingUser.tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});
//Listening to Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("listening for requests");
  });
});
