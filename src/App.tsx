import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

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
        <Routes>
          {/* Landing/Auth Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Doctor A Routes */}
          <Route path="/doctor-a/home" element={<DoctorAHome />} />
          <Route path="/doctor-a/departments" element={<Departments />} />
          <Route path="/doctor-a/specialists/:departmentId" element={<Specialists />} />
          <Route path="/doctor-a/consultation/:doctorId" element={<Consultation />} />
          <Route path="/doctor-a/case-summary/:doctorId" element={<CaseSummary />} />
          <Route path="/doctor-a/patients" element={<DoctorAPatients />} />
          <Route path="/doctor-a/history" element={<DoctorAHistory />} />
          <Route path="/doctor-a/profile" element={<DoctorAProfile />} />

          {/* Doctor B Routes */}
          <Route path="/doctor-b/home" element={<DoctorBHome />} />
          <Route path="/doctor-b/availability" element={<Availability />} />
          <Route path="/doctor-b/incoming/:requestId" element={<IncomingConsultation />} />
          <Route path="/doctor-b/patients" element={<DoctorBPatients />} />
          <Route path="/doctor-b/doctors" element={<DoctorBDoctors />} />
          <Route path="/doctor-b/profile" element={<DoctorBProfile />} />

          {/* Call Routes */}
          <Route path="/call/video/:callId" element={<VideoCall />} />
          <Route path="/call/audio/:callId" element={<VoiceCall />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
