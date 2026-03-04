# 🎓 LearnBridge: The Premium LMS Gateway

> **Empowering Learning through Immersive Design and Seamless Technology.**

LearnBridge is a modern, high-fidelity Learning Management System (LMS) built to provide a focused, distraction-free environment for students and a powerful management dashboard for instructors.

---

## ✨ Key Features

### 👨‍🎓 For Students
*   **Immersive Classroom**: A dedicated, full-screen course player designed to keep you focused on the content.
*   **Stripe Checkout**: Secure and professional payment gateway integration for instant course access.
*   **Progress Tracking**: High-fidelity progress bars and completion markers to keep your learning journey on track.
*   **Interactive Curriculum**: A sleek, glass-morphic sidebar to navigate through lessons effortlessly.

### 👨‍🏫 For Instructors
*   **Creator Dashboard**: Manage your courses, track enrollments, and update content in one place.
*   **Media Management**: Professional tools for course thumbnails and lesson video uploads via Cloudinary.
*   **Student Insights**: Monitor student progress and engagement across your curriculum.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React (Vite), Tailwind CSS, Framer Motion, Shadcn/UI |
| **Backend** | Node.js, Express, JWT Authentication |
| **Database** | MongoDB (NoSQL) |
| **Payments** | Stripe API (Test & Live Modes) |
| **Media** | Cloudinary & Multer |

---

## 🚀 Quick Start

### 1. Installation
Clone the repository and install dependencies in both the `frontend` and `backend` folders.

```bash
# Backend setup
cd backend
npm install

# Frontend setup
cd frontend
npm install
```

### 2. Environment Setup
Create a `.env` file in the `backend` folder with the following keys:
```env
PORT=8000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Run the Application
Open two terminals and run the following:

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

---

## 📄 Documentation
For a deep dive into the human-centered design philosophy and project requirements, see our [PRD.md](PRD.md).

---

## 🎨 Design Standard
LearnBridge follows a "Premium Standard" design philosophy, utilizing **Glassmorphism**, vibrant HSL color palettes, and smooth micro-animations to create a top-tier user experience.

---

*Built with ❤️ by Shubham Jamdar*
