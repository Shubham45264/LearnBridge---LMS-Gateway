import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./database/db.js";
import { errorHandler } from "./middleware/error.middleware.js";
import healthRoute from "./routes/health.route.js";
import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js";
import purchaseRoute from "./routes/purchaseCourse.route.js";
import progressRoute from "./routes/courseProgress.route.js";
import mediaRoute from "./routes/media.route.js";


dotenv.config();

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 8000;


// Global rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again in an hour!",
});

// security middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(hpp());
app.use('/api', limiter);



// logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body Parser Middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// CORS configuration
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:8080", "http://localhost:8081", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEADER"],
  credentials: true,


  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Access-Control-Allow-Origin",
    "device-remember-token",
    "Origin",
    "Accept"
  ],
}));

// API Routes
app.use("/health", healthRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/progress", progressRoute);
app.use("/api/v1/media", mediaRoute);


// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    success: false,
    message: "Route not found",
  });
});

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});




