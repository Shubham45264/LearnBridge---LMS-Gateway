import { User } from "../models/user.model.js";
import { catchAsync, AppError } from "../middleware/error.middleware.js";
import { generateToken } from "../utils/generateToken.js";
import { uploadMedia, deleteMediaFromCloudinary } from "../utils/cloudinary.js";


// help to avoid the use of try catch by wrapping inside another function


// create a user
export const createUserAccount = catchAsync(async (req, res) => {
  const { name, email, password, role = 'student' } = req.body;

  // we will do validations globally

  const exisitingUser = await User.findOne({ email: email.toLowerCase() })

  if (exisitingUser) {
    throw new AppError("User already exists", 400);
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role
  })
  await user.updateLastActive();
  generateToken(res, user, "User Account Created Successfully");
});

// login the user
export const AuthenticateUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password')

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid Email and Password", 400);
  }

  await user.updateLastActive();

  generateToken(res, user, ` Welcome Back ${user.name}`);
})

// logout the user / req not used so use _
export const signOutUser = catchAsync(async (_, res) => {
  res.cookie("token", '', { maxAge: 0 });
  res.status(200).json({ success: true, message: "Logged Out Successfully" });
})

export const getCurrentUserProfile = catchAsync(async (req, res) => {
  console.log(`[USER_CONTROLLER] Fetching profile for ${req.id}`);
  const user = await User.findById(req.id)
    .populate({
      path: "enrolledCourses.course",
      select: "title thumbnail subtitle description category price instructor lectures",
      populate: {
        path: "instructor",
        select: "name avatar"
      }
    });

  if (!user) {
    throw new AppError("User not found", 400);
  }

  // Fetch progress for each course
  const { CourseProgress } = await import("../models/courseProgress.model.js");
  const progresses = await CourseProgress.find({ user: req.id });
  console.log(`[PROGRESS_SYNC] Found ${progresses.length} progress documents for user.`);

  const enrolledWithProgress = user.enrolledCourses.map(item => {
    const courseObj = item.course;
    if (!courseObj) return item;

    const progressDoc = progresses.find(p => p.course.toString() === courseObj._id.toString());

    // Calculate details for logging
    const totalLectures = courseObj.lectures?.length || 0;
    const completedLectures = progressDoc
      ? Array.from(new Set(progressDoc.lectureProgress.filter(lp => lp.isCompleted).map(lp => lp.lecture.toString()))).length
      : 0;

    const percentage = totalLectures > 0
      ? Math.min(100, Math.round((completedLectures / totalLectures) * 100))
      : 0;

    console.log(`[PROGRESS_SYNC] Course: ${courseObj.title} | Total: ${totalLectures} | Done: ${completedLectures} | %: ${percentage}`);

    return {
      course: courseObj,
      enrolledAt: item.enrolledAt,
      progress: percentage
    };
  });

  const userData = user.toObject();

  res.status(200).json({
    success: true,
    data: {
      ...userData,
      enrolledCourses: enrolledWithProgress,
      totalEnrolledCourses: enrolledWithProgress.length,
    }
  });
  console.log(`[USER_CONTROLLER] Sent profile for ${user.email} with ${enrolledWithProgress.length} courses.`);
});

export const updateUserProfile = catchAsync(async (req, res) => {
  const { name, email, bio } = req.body
  const updateData = {
    name,
    email: email?.toLowerCase(),
    bio
  };

  if (req.file) {
    const avatarResult = await uploadMedia(req.file.path);
    updateData.avatar = avatarResult.secure_url;

    // delete old avatar
    const user = await User.findById(req.id)
    if (user.avatar && user.avatar !== 'default-avatar.png') {
      // Extract publicId if needed, but for now just pass URL and hope for best or fix it in utility
      // Usually it's URL, so we might need to extract publicId from URL
      const publicId = user.avatar.split('/').pop().split('.')[0];
      await deleteMediaFromCloudinary(publicId);
    }


  }

  // update user and get updated doc
  const updatedUser = await User.findByIdAndUpdate
    (
      req.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

  if (!updatedUser) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Profile Updated Successfully",
    data: updatedUser
  })


});
