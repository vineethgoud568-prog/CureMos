import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Stethoscope } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, user, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect authenticated users to their dashboard
    if (user && userRole) {
      const dashboardPath = userRole === "doctor_a" ? "/doctor-a/home" : "/doctor-b/home";
      navigate(dashboardPath, { replace: true });
    }
  }, [user, userRole, navigate]);

  const handleLogin = async (userType: "doctor-a" | "doctor-b") => {
    setIsLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (!error) {
        const dashboardPath = userType === "doctor-a" ? "/doctor-a/home" : "/doctor-b/home";
        navigate(dashboardPath);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto bg-primary rounded-full p-3 w-fit">
            <Stethoscope className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Welcome to CureMos</CardTitle>
          <CardDescription>
            Connect with medical professionals for seamless consultations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="doctor-a" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="doctor-a">General Practitioner</TabsTrigger>
              <TabsTrigger value="doctor-b">Specialist</TabsTrigger>
            </TabsList>

            <TabsContent value="doctor-a" className="space-y-4">
              <LoginForm
                email={email}
                password={password}
                rememberMe={rememberMe}
                isLoading={isLoading}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onRememberMeChange={setRememberMe}
                onSubmit={() => handleLogin("doctor-a")}
              />
            </TabsContent>

            <TabsContent value="doctor-b" className="space-y-4">
              <LoginForm
                email={email}
                password={password}
                rememberMe={rememberMe}
                isLoading={isLoading}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onRememberMeChange={setRememberMe}
                onSubmit={() => handleLogin("doctor-b")}
              />
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center space-y-2">
            <Link to="/reset-password" className="text-sm text-primary hover:underline">
              Forgot Password?
            </Link>
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Sign Up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface LoginFormProps {
  email: string;
  password: string;
  rememberMe: boolean;
  isLoading: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onRememberMeChange: (value: boolean) => void;
  onSubmit: () => void;
}

function LoginForm({
  email,
  password,
  rememberMe,
  isLoading,
  onEmailChange,
  onPasswordChange,
  onRememberMeChange,
  onSubmit,
}: LoginFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="doctor@example.com"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="remember"
          checked={rememberMe}
          onChange={(e) => onRememberMeChange(e.target.checked)}
          className="w-4 h-4 rounded border-input text-primary focus:ring-primary"
        />
        <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
          Remember me
        </Label>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? <LoadingSpinner size="sm" /> : "Sign In"}
      </Button>
    </form>
  );
}
