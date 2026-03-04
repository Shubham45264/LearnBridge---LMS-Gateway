import express from "express";
import { isAuthenticated, optionalAuth, restrictTo } from "../middleware/auth.middleware.js";
import {
  createNewCourse,
  searchCourses,
  getPublishedCourses,
  getMyCreatedCourses,
  updateCourseDetails,
  getCourseDetails,
  addLectureToCourse,
  getCourseLectures,
  togglePublishCourse,
} from "../controllers/course.controller.js";
import upload from "../utils/multer.js";

const router = express.Router();

// Public routes
router.get("/published", getPublishedCourses);
router.get("/search", searchCourses);

// Protected routes (General)
router.post("/", isAuthenticated, restrictTo("instructor"), upload.single("thumbnail"), createNewCourse);
router.get("/instructor", isAuthenticated, restrictTo("instructor"), getMyCreatedCourses);

// Course details and updates
router
  .route("/:courseId")
  .patch(
    isAuthenticated,
    restrictTo("instructor"),
    upload.single("thumbnail"),
    updateCourseDetails
  );

router
  .route("/:courseId/publish")
  .patch(isAuthenticated, restrictTo("instructor"), togglePublishCourse);

router
  .route("/c/:courseId")
  .get(getCourseDetails);

// Lecture management
router
  .route("/:courseId/lecture")
  .post(isAuthenticated, restrictTo("instructor"), upload.single("video"), addLectureToCourse);

router
  .route("/c/:courseId/lectures")
  .get(optionalAuth, getCourseLectures);

export default router;
