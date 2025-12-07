import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CuremosLogo from "@/assets/curemoslogo.png";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, user, userRole } = useAuth();
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [medicalLicenseNumber, setMedicalLicenseNumber] = useState("");
  const [placeOfWork, setPlaceOfWork] = useState("");

  useEffect(() => {
    // Redirect authenticated users to their dashboard
    if (user && userRole) {
      const dashboardPath = userRole === "doctor_a" ? "/doctor-a/home" : "/doctor-b/home";
      navigate(dashboardPath, { replace: true });
    }
  }, [user, userRole, navigate]);

  const handleRegister = async (userType: "doctor_a" | "doctor_b") => {
    if (password !== confirmPassword) {
      return;
    }

    if (password.length < 6) {
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signUp(email, password, userType, fullName);
      if (!error) {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto p-3 w-fit">
           <img
              src={CuremosLogo}
              alt="Curemos logo"
              className="h-24 w-auto mx-auto"
            />
          </div>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>
            Join CureMos to connect with medical professionals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="doctor-a" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="doctor-a">Doctor</TabsTrigger>
              <TabsTrigger value="doctor-b">CureMos Doctor</TabsTrigger>
            </TabsList>

            <TabsContent value="doctor-a" className="space-y-4">
  <RegisterForm
    email={email}
    password={password}
    fullName={fullName}
    confirmPassword={confirmPassword}
    phoneNumber={phoneNumber}
    medicalLicenseNumber={medicalLicenseNumber}
    placeOfWork={placeOfWork}
    isLoading={isLoading}
    onEmailChange={setEmail}
    onPasswordChange={setPassword}
    onFullNameChange={setFullName}
    onConfirmPasswordChange={setConfirmPassword}
    onPhoneNumberChange={setPhoneNumber}
    onMedicalLicenseNumberChange={setMedicalLicenseNumber}
    onPlaceOfWorkChange={setPlaceOfWork}
    onSubmit={() => handleRegister("doctor_a")}
  />
</TabsContent>

<TabsContent value="doctor-b" className="space-y-4">
  <RegisterForm
    email={email}
    password={password}
    fullName={fullName}
    confirmPassword={confirmPassword}
    phoneNumber={phoneNumber}
    medicalLicenseNumber={medicalLicenseNumber}
    placeOfWork={placeOfWork}
    isLoading={isLoading}
    onEmailChange={setEmail}
    onPasswordChange={setPassword}
    onFullNameChange={setFullName}
    onConfirmPasswordChange={setConfirmPassword}
    onPhoneNumberChange={setPhoneNumber}
    onMedicalLicenseNumberChange={setMedicalLicenseNumber}
    onPlaceOfWorkChange={setPlaceOfWork}
    onSubmit={() => handleRegister("doctor_b")}
  />
</TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface RegisterFormProps {
  email: string;
  password: string;
  fullName: string;
  confirmPassword: string;
  phoneNumber: string;
  medicalLicenseNumber: string;
  placeOfWork: string;
  isLoading: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onFullNameChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onPhoneNumberChange: (value: string) => void;
  onMedicalLicenseNumberChange: (value: string) => void;
  onPlaceOfWorkChange: (value: string) => void;
  onSubmit: () => void;
}


function RegisterForm({
email,
  password,
  fullName,
  confirmPassword,
  phoneNumber,
  medicalLicenseNumber,
  placeOfWork,
  isLoading,
  onEmailChange,
  onPasswordChange,
  onFullNameChange,
  onConfirmPasswordChange,
  onPhoneNumberChange,
  onMedicalLicenseNumberChange,
  onPlaceOfWorkChange,
  onSubmit,
}: RegisterFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          type="text"
          placeholder="Dr. John Smith"
          value={fullName}
          onChange={(e) => onFullNameChange(e.target.value)}
          required
        />
      </div>

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
          minLength={6}
        />
        <p className="text-xs text-muted-foreground">
          Must be at least 6 characters
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => onConfirmPasswordChange(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          type="tel"
          placeholder="+91 98765 43210"
          value={phoneNumber}
          onChange={(e) => onPhoneNumberChange(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="medicalLicenseNumber">Medical License Number</Label>
        <Input
          id="medicalLicenseNumber"
          type="text"
          placeholder="MCI / State Reg. No."
          value={medicalLicenseNumber}
          onChange={(e) => onMedicalLicenseNumberChange(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="placeOfWork">Place of Work</Label>
        <Input
          id="placeOfWork"
          type="text"
          placeholder="Hospital / Clinic name"
          value={placeOfWork}
          onChange={(e) => onPlaceOfWorkChange(e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? <LoadingSpinner size="sm" /> : "Create Account"}
      </Button>
    </form>
    
  );
}
