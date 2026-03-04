import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Lecture must have a title"],
    trim: true,
    maxLength: [100, "Lecture title must have less or equal then 100 characters"],
  },
  description: {
    type: String,
    trim: true,
    maxLength: [500, "Lecture description must have less or equal then 500 characters"]
  },
  videoUrl: {
    type: String,
    required: [true, "Lecture must have a video"],
  },
  duration: {
    type: Number,
    default: 0,
  },
  publicId: {
    type: String,
    required: [true, "Public Id is required for video management"],
  },
  isPreview: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    required: [true, "Lecture order is required"],
    default: 0
  }
},
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  });

lectureSchema.pre("save", async function () {
  if (this.duration) {
    this.duration = Math.round(this.duration * 100) / 100
  }
});


export const Lecture = mongoose.model("Lecture", lectureSchema);