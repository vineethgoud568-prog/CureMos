import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useParams, useNavigate } from "react-router-dom";
import { AlertCircle, Clock, MapPin, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function IncomingConsultation() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock data - will be replaced with actual data from Supabase
  const consultation = {
    id: requestId,
    doctorA: {
      name: "Dr. Sarah Mitchell",
      specialization: "General Practice",
      hospital: "City Medical Center",
      avatar: "",
    },
    urgency: "high",
    estimatedTime: "15-20 min",
    casePreview: "Patient presenting with acute chest pain and shortness of breath. History of hypertension. Vital signs stable but requires immediate specialist consultation.",
    patientAge: "45",
    patientGender: "Male",
  };

  const handleAccept = async () => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Consultation Accepted",
        description: "You will be connected with Dr. Mitchell shortly.",
      });
      navigate(`/doctor-b/consultation/${requestId}`);
    }, 1000);
  };

  const handleDecline = async () => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Consultation Declined",
        description: "The request has been declined and sent to another specialist.",
      });
      navigate("/doctor-b/home");
    }, 1000);
  };

  const handleTransfer = () => {
    toast({
      title: "Transfer Feature",
      description: "Transfer to another specialist feature coming soon.",
    });
  };

  return (
    <MainLayout title="Incoming Consultation" userType="doctor-b">
      <div className="container max-w-4xl mx-auto p-4 space-y-6">
        <div className="flex items-center gap-2 text-warning">
          <AlertCircle className="w-5 h-5" />
          <span className="font-semibold">Consultation Request Pending</span>
        </div>

        <Card className="border-2 border-warning">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Case Details</CardTitle>
              <Badge variant={consultation.urgency === "high" ? "destructive" : "default"}>
                {consultation.urgency === "high" ? "High Urgency" : "Normal"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={consultation.doctorA.avatar} />
                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                  {consultation.doctorA.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{consultation.doctorA.name}</h3>
                <p className="text-sm text-muted-foreground">{consultation.doctorA.specialization}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" />
                  {consultation.doctorA.hospital}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>Est. {consultation.estimatedTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>Available Now</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Patient Information</h4>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <p className="text-sm"><strong>Age:</strong> {consultation.patientAge} years</p>
                <p className="text-sm"><strong>Gender:</strong> {consultation.patientGender}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Case Preview</h4>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm">{consultation.casePreview}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleAccept}
            disabled={isProcessing}
            className="flex-1"
            variant="default"
          >
            Accept Consultation
          </Button>
          <Button
            onClick={handleTransfer}
            disabled={isProcessing}
            className="flex-1"
            variant="outline"
          >
            Transfer to Another Specialist
          </Button>
          <Button
            onClick={handleDecline}
            disabled={isProcessing}
            variant="destructive"
          >
            Decline
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Response Templates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start text-sm" size="sm">
              "I'll be available in 5 minutes"
            </Button>
            <Button variant="outline" className="w-full justify-start text-sm" size="sm">
              "Please send patient vitals first"
            </Button>
            <Button variant="outline" className="w-full justify-start text-sm" size="sm">
              "Request additional medical history"
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
