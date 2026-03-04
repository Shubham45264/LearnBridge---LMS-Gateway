import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User must have a name"],
    trim: true,
    maxLength: [50, "User name must have less or equal then 50 characters"],

  },
  email: {
    type: String,
    required: [true, "User must have a email"],
    trim: true,
    unique: true,
    lowercase: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "User must have a password"],
    minLength: [8, "User password must have more or equal then 8 characters"],
    select: false,
  },
  role: {
    type: String,
    enum: {
      values: ["student", "admin", "instructor"],
      message: "Please select a valid role"
    },
    default: "student"
  },
  avatar: {
    type: String,
    default: "default-avatar.png"
  },
  bio: {
    type: String,
    maxLength: [200, "Bio Cannot Exceed 200 characters"],

  },
  enrolledCourses: [{
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course"
    },
    enrolledAt: {
      type: Date,
      default: Date.now()
    }
  }],
  createdCourse: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  }],
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  LastActiveAt: {
    type: Date,
    default: Date.now()
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// hashing of the password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
});


// compare password
userSchema.methods.comparePassword = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password);
}

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
}

userSchema.methods.updateLastActive = function () {
  this.LastActiveAt = Date.now();
  return this.save({ validateBeforeSave: false });
}


// virtual field for total enrolled courses
userSchema.virtual("totalEnrolledCourses").get(function () {
  return this.enrolledCourses ? this.enrolledCourses.length : 0;
})


export const User = mongoose.model("User", userSchema);
