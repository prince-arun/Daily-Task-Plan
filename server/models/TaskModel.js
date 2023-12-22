const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  user: { type: String, required: true },
  tasks: [
    {
      title: { type: String, required: true },
      tag: { type: String },
      status: { type: String },
      startTime: { type: Date },
      endTime: { type: Date },
    },
  ],
});

module.exports = mongoose.model("Tasks", taskSchema);
