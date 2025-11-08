import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Suspense, lazy } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Landing page (eager load)
import Index from "./pages/Index";

// Auth Pages (eager load for better UX)
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ResetPassword from "./pages/auth/ResetPassword";

// Lazy load doctor pages for better performance
const DoctorAHome = lazy(() => import("./pages/doctor-a/DoctorAHome"));
const Departments = lazy(() => import("./pages/doctor-a/Departments"));
const Specialists = lazy(() => import("./pages/doctor-a/Specialists"));
const Consultation = lazy(() => import("./pages/doctor-a/Consultation"));
const CaseSummary = lazy(() => import("./pages/doctor-a/CaseSummary"));
const DoctorAPatients = lazy(() => import("./pages/doctor-a/DoctorAPatients"));
const DoctorAHistory = lazy(() => import("./pages/doctor-a/DoctorAHistory"));
const DoctorAProfile = lazy(() => import("./pages/doctor-a/DoctorAProfile"));

const DoctorBHome = lazy(() => import("./pages/doctor-b/DoctorBHome"));
const DoctorBPatients = lazy(() => import("./pages/doctor-b/DoctorBPatients"));
const DoctorBDoctors = lazy(() => import("./pages/doctor-b/DoctorBDoctors"));
const DoctorBProfile = lazy(() => import("./pages/doctor-b/DoctorBProfile"));
const Availability = lazy(() => import("./pages/doctor-b/Availability"));
const IncomingConsultation = lazy(() => import("./pages/doctor-b/IncomingConsultation"));

const VideoCall = lazy(() => import("./pages/calls/VideoCall"));
const VoiceCall = lazy(() => import("./pages/calls/VoiceCall"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <LoadingSpinner size="lg" />
  </div>
);

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Suspense fallback={<LoadingFallback />}>
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
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
