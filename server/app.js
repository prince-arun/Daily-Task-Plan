const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const Tasks = require("./models/TaskModel");

//Initializing Packages
const app = express();

dotenv.config();

//Initializing Middleware
app.use(cors());
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
    const { user, title, tag, status } = req.body;
    let existingUser = await Tasks.findOne({ user });

    //Checking the user already exists
    if (!existingUser) {
      existingUser = await Tasks.create({ user, tasks: [] });
    }

    //Adding tasks
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

    // Finding the user by their user value
    const existingUser = await Tasks.findOne({ user });

    if (!existingUser) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    res.status(200).json({ success: true, tasks: existingUser.tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

//Patch Request
app.patch("/api/tasks/:taskId", async (req, res) => {
  const userId = req.body.user;
  const taskId = req.params.taskId;
  const { timePeriod } = req.body;

  try {
    const user = await Tasks.findOne({ user: userId });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Finding the particular Task based on task id
    const taskToUpdate = user.tasks.find(
      (task) => task._id.toString() === taskId
    );
    if (!taskToUpdate) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }
    taskToUpdate.timePeriod = formatTimer(timePeriod);
    await user.save();

    res.json({ success: true, updatedTask: taskToUpdate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

//Delete Request
app.delete("/api/tasks/:taskId", async (req, res) => {
  const userId = req.body.user;
  const taskId = req.params.taskId;

  try {
    const user = await Tasks.findOne({ user: userId });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Finding the Task's index
    const taskIndex = user.tasks.findIndex(
      (task) => task._id.toString() === taskId
    );

    if (taskIndex === -1) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }

    // Removing the task from array
    user.tasks.splice(taskIndex, 1);

    await user.save();

    res.json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Function to formate time
const formatTimer = (seconds) => {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${days}d ${hours}h ${minutes}m ${remainingSeconds}s`;
};

//Listening to Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("listening for requests");
  });
});
