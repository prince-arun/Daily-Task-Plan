const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

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

//Listening to Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("listening for requests");
  });
});
