import Stripe from "stripe";
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";
import { catchAsync } from "../middleware/error.middleware.js";
import { AppError } from "../middleware/error.middleware.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Create a Stripe checkout session for course purchase
 * @route POST /api/v1/purchase/checkout/create-checkout-session
 */
export const initiateStripeCheckout = catchAsync(async (req, res) => {
  const { courseId } = req.body;

  // Find course and validate
  const course = await Course.findById(courseId);
  if (!course) {
    throw new AppError("Course not found", 404);
  }

  // Create a new course purchase record
  const newPurchase = new CoursePurchase({
    course: courseId,
    user: req.id,
    amount: course.price,
    currency: "INR",
    status: "pending",
    paymentMethod: "stripe",
    paymentId: "pending" // Placeholder until session is created

  });

  // Create Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: course.title,
            images: [course.thumbnail],
          },
          unit_amount: course.price * 100, // Amount in paise
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/course/${courseId}/learn`,
    cancel_url: `${process.env.CLIENT_URL}/course/${courseId}`,

    metadata: {
      courseId: courseId,
      userId: req.id,
    },
  });

  if (!session.url) {
    throw new AppError("Failed to create checkout session", 400);
  }

  // Save purchase record with session ID
  newPurchase.paymentId = session.id;
  await newPurchase.save();

  res.status(200).json({
    success: true,
    data: {
      checkoutUrl: session.url,
    },
  });
});

/**
 * Handle Stripe webhook events
 * @route POST /api/v1/purchase/webhook
 */
export const handleStripeWebhook = catchAsync(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    throw new AppError(`Webhook Error: ${error.message}`, 400);
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Find and update purchase record
    const purchase = await CoursePurchase.findOne({
      paymentId: session.id,
    }).populate("course");

    if (!purchase) {
      throw new AppError("Purchase record not found", 404);
    }

    // Update purchase details
    purchase.status = "completed";
    await purchase.save();

    // Update user's enrolled courses
    await User.findByIdAndUpdate(
      purchase.user,
      { $addToSet: { enrolledCourses: { course: purchase.course._id } } },
      { new: true }
    );

    // Update course's enrolled students
    await Course.findByIdAndUpdate(
      purchase.course._id,
      { $addToSet: { enrolledStudents: purchase.user } },
      { new: true }
    );
  }

  res.status(200).json({ received: true });
});

/**
 * Get course details with purchase status
 */
export const getCoursePurchaseStatus = catchAsync(async (req, res) => {
  const { courseId } = req.params;

  // Find course with populated data
  const course = await Course.findById(courseId)
    .populate("instructor", "name avatar")
    .populate("lectures", "title videoUrl duration");

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  // Check if user has purchased the course
  const purchased = await CoursePurchase.exists({
    user: req.id,
    course: courseId,
    status: "completed",
  });

  res.status(200).json({
    success: true,
    data: {
      course,
      isPurchased: Boolean(purchased),
    },
  });
});

/**
 * Get all purchased courses
 */
export const getPurchasedCourses = catchAsync(async (req, res) => {
  const purchases = await CoursePurchase.find({
    user: req.id,
    status: "completed",
  }).populate({
    path: "course",
    select: "title thumbnail subtitle price description category",
    populate: {
      path: "instructor",
      select: "name avatar",
    },
  });

  res.status(200).json({
    success: true,
    data: purchases.map((purchase) => purchase.course),
  });
});

/**
 * Enroll in a free course directly
 */
export const enrollInFreeCourse = catchAsync(async (req, res) => {
  const { courseId } = req.body;

  const course = await Course.findById(courseId);
  if (!course) {
    throw new AppError("Course not found", 404);
  }

  // Allow price bypass ONLY in development mode for easy testing
  if (course.price > 0 && process.env.NODE_ENV !== "development") {
    throw new AppError("This course is not free", 400);
  }

  // Check if already enrolled
  const existingPurchase = await CoursePurchase.findOne({
    course: courseId,
    user: req.id,
    status: "completed",
  });

  if (existingPurchase) {
    return res.status(200).json({
      success: true,
      message: "Already enrolled",
      data: existingPurchase,
    });
  }

  // Create completed purchase for free course
  const purchase = await CoursePurchase.create({
    course: courseId,
    user: req.id,
    amount: 0,
    currency: "INR",
    status: "completed",
    paymentMethod: "free",
    paymentId: `free_${Date.now()}`,
  });

  // Add to user's enrolled list
  await User.findByIdAndUpdate(req.id, {
    $addToSet: { enrolledCourses: { course: courseId } },
  });

  // Add to course's student list
  await Course.findByIdAndUpdate(courseId, {
    $addToSet: { enrolledStudents: req.id },
  });

  res.status(200).json({
    success: true,
    message: "Enrolled successfully",
    data: purchase,
  });
});

