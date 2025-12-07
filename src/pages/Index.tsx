import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, Users, Video, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import CuremosLogo from "@/assets/curemoslogo.png"; // <-- add this line

const Index = () => {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Redirect authenticated users to their dashboard
  if (user && userRole) {
    const dashboardPath = userRole === "doctor_a" ? "/doctor-a/home" : "/doctor-b/home";
    return <Navigate to={dashboardPath} replace />;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 mb-16">
          <div className="mx-auto rounded-full p-4 w-fit">
            <img
              src={CuremosLogo}
              alt="Curemos logo"
              className="h-24 w-auto mx-auto"
            />
          </div>
          <h1 className="text-5xl font-bold text-balance">Welcome to CureMos</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Bridging the gap between general practitioners and specialist doctors through seamless digital communication
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button asChild size="lg">
              <Link to="/login">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/register">Sign Up</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <Users className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Expert Network</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Connect with specialist doctors across various medical departments instantly
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Video className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Multi-Modal</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Text, voice, and video consultations for comprehensive medical discussions
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Secure Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                End-to-end encrypted communication ensuring patient data privacy
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Stethoscope className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Case Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Streamlined referral workflow and patient case tracking system
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
