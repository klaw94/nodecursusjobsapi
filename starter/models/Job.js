const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide a company name"],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, "Please provide a position"],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["interview", "decluned", "pending"],
      default: "pending",
    },
    createdBy: {
      //link to the user
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
  },
  {
    //this add createdAt and UpdatedAt for us.
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", JobSchema);
