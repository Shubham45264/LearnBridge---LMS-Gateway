import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Course must have a title"],
    trim: true,
    maxLength: [100, "Course title must have less or equal then 100 characters"],
  },
  subtitle: {
    type: String,
    trim: true,
    maxLength: [200, "Course subtitle must have less or equal then 200 characters"],
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    required: [true, "Course must have a category"],
    trim: true,

  },
  level: {
    type: String,
    required: [true, "Course must have a level"],
    trim: true,
    enum: {
      values: ["beginner", "intermediate", "advanced"],
      message: "Please select a valid level"
    },
    default: "beginner"
  },
  price: {
    type: Number,
    required: [true, "Course must have a price"],
    min: [0, "Price must be greater than 0"],
  },
  thumbnail: {
    type: String,
    required: [true, "Course thumbnail is required"]
  },

  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
  ],
  lectures: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lecture"
  }
  ],
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Course must have an instructor"]
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  totalDuration: {
    type: Number,
    default: 0
  },
  totalLectures: {
    type: Number,
    default: 0
  },
},
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  });

courseSchema.virtual("averageRating").get(function () {
  return 0; // placeholder assignment
});


courseSchema.pre("save", async function () {
  if (this.lectures && Array.isArray(this.lectures)) {
    this.totalLectures = this.lectures.length;
  }
});




export const Course = mongoose.model("Course", courseSchema);
