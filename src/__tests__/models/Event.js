import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  location: String,
  eventDate: Date,
  capacity: Number,
  isOnline: { type: Boolean, default: false },

  status: { type: String, default: "Upcoming" },
  imageUrl: String,

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

const Event = mongoose.model("Event", eventSchema);

export default Event;
