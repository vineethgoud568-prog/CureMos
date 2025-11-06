import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ResetPassword from "./pages/auth/ResetPassword";

// Doctor A Pages
import DoctorAHome from "./pages/doctor-a/DoctorAHome";
import Departments from "./pages/doctor-a/Departments";
import Specialists from "./pages/doctor-a/Specialists";
import Consultation from "./pages/doctor-a/Consultation";
import CaseSummary from "./pages/doctor-a/CaseSummary";
import DoctorAPatients from "./pages/doctor-a/DoctorAPatients";
import DoctorAHistory from "./pages/doctor-a/DoctorAHistory";
import DoctorAProfile from "./pages/doctor-a/DoctorAProfile";

// Doctor B Pages
import DoctorBHome from "./pages/doctor-b/DoctorBHome";
import DoctorBPatients from "./pages/doctor-b/DoctorBPatients";
import DoctorBDoctors from "./pages/doctor-b/DoctorBDoctors";
import DoctorBProfile from "./pages/doctor-b/DoctorBProfile";
import Availability from "./pages/doctor-b/Availability";
import IncomingConsultation from "./pages/doctor-b/IncomingConsultation";

// Call Pages
import VideoCall from "./pages/calls/VideoCall";
import VoiceCall from "./pages/calls/VoiceCall";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Landing/Auth Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Doctor A Routes - Protected */}
            <Route
              path="/doctor-a/home"
              element={
                <ProtectedRoute requiredUserType="doctor_a">
                  <DoctorAHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor-a/departments"
              element={
                <ProtectedRoute requiredUserType="doctor_a">
                  <Departments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor-a/specialists/:departmentId"
              element={
                <ProtectedRoute requiredUserType="doctor_a">
                  <Specialists />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor-a/consultation/:doctorId"
              element={
                <ProtectedRoute requiredUserType="doctor_a">
                  <Consultation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor-a/case-summary/:doctorId"
              element={
                <ProtectedRoute requiredUserType="doctor_a">
                  <CaseSummary />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor-a/patients"
              element={
                <ProtectedRoute requiredUserType="doctor_a">
                  <DoctorAPatients />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor-a/history"
              element={
                <ProtectedRoute requiredUserType="doctor_a">
                  <DoctorAHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor-a/profile"
              element={
                <ProtectedRoute requiredUserType="doctor_a">
                  <DoctorAProfile />
                </ProtectedRoute>
              }
            />

            {/* Doctor B Routes - Protected */}
            <Route
              path="/doctor-b/home"
              element={
                <ProtectedRoute requiredUserType="doctor_b">
                  <DoctorBHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor-b/availability"
              element={
                <ProtectedRoute requiredUserType="doctor_b">
                  <Availability />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor-b/incoming/:requestId"
              element={
                <ProtectedRoute requiredUserType="doctor_b">
                  <IncomingConsultation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor-b/patients"
              element={
                <ProtectedRoute requiredUserType="doctor_b">
                  <DoctorBPatients />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor-b/doctors"
              element={
                <ProtectedRoute requiredUserType="doctor_b">
                  <DoctorBDoctors />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor-b/profile"
              element={
                <ProtectedRoute requiredUserType="doctor_b">
                  <DoctorBProfile />
                </ProtectedRoute>
              }
            />

            {/* Call Routes - Protected */}
            <Route
              path="/call/video/:callId"
              element={
                <ProtectedRoute>
                  <VideoCall />
                </ProtectedRoute>
              }
            />
            <Route
              path="/call/audio/:callId"
              element={
                <ProtectedRoute>
                  <VoiceCall />
                </ProtectedRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
