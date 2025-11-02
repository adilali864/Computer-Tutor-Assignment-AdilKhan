import mongoose from "mongoose";

const recurrenceSchema = new mongoose.Schema(
  {
    freq: {
      type: String,
      enum: ["Daily", "Weekly", "Monthly", "Yearly"],
      default: null,
    },
    interval: {
      type: Number,
      default: 1,
    },
    byweekday: [Number],
    until: {
      type: Date,
    },
    count: {
      type: Number,
    },
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    location: {
      type: String,
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    allDay: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: "#1a74e8",
    },
    attendees: [String],
    recurrence: recurrenceSchema,
  },
  {
    timestamps: true,
  }
);

export const Event = mongoose.model("Event", eventSchema);
