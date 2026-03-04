import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import MainLayout from "@/layouts/MainLayout";
import HomePage from "@/pages/HomePage";
import SigninPage from "@/pages/SigninPage";
import SignupPage from "@/pages/SignupPage";
import ProfilePage from "@/pages/ProfilePage";
import SearchPage from "@/pages/SearchPage";
import CourseDetailPage from "@/pages/CourseDetailPage";
import CoursePlayerPage from "@/pages/CoursePlayerPage";
import MyLearningPage from "@/pages/MyLearningPage";
import InstructorDashboard from "@/pages/InstructorDashboard";
import CreateCoursePage from "@/pages/CreateCoursePage";
import EditCoursePage from "@/pages/EditCoursePage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/signin" element={<SigninPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/course/:courseId/learn" element={<ProtectedRoute><CoursePlayerPage /></ProtectedRoute>} />
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/course/:courseId" element={<CourseDetailPage />} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/my-learning" element={<ProtectedRoute><MyLearningPage /></ProtectedRoute>} />
              <Route path="/instructor" element={<ProtectedRoute requiredRole="instructor"><InstructorDashboard /></ProtectedRoute>} />
              <Route path="/instructor/create" element={<ProtectedRoute requiredRole="instructor"><CreateCoursePage /></ProtectedRoute>} />
              <Route path="/instructor/edit/:courseId" element={<ProtectedRoute requiredRole="instructor"><EditCoursePage /></ProtectedRoute>} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
