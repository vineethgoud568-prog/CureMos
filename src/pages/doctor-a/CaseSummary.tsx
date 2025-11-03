import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

export default function CaseSummary() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [caseNotes, setCaseNotes] = useState("");
  const [showReferralForm, setShowReferralForm] = useState(false);
  const [patientDetails, setPatientDetails] = useState({
    fullName: "",
    dateOfBirth: "",
    phone: "",
    medicalHistory: "",
  });

  const consultationSummary = {
    specialist: "Dr. Sarah Johnson",
    department: "Cardiology",
    duration: "25 minutes",
    recommendations:
      "Patient shows signs of mild hypertension. Recommend lifestyle modifications and follow-up monitoring.",
  };

  const handleCloseCase = () => {
    toast({
      title: "Case Closed",
      description: "Consultation has been marked as complete",
    });
    navigate("/doctor-a/home");
  };

  const handleReferToHospital = () => {
    if (!patientDetails.fullName || !patientDetails.dateOfBirth || !patientDetails.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required patient details",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Referral Created",
      description: "Patient has been referred to the hospital",
    });
    navigate("/doctor-a/home");
  };

  return (
    <MainLayout title="Case Summary" userType="doctor-a">
      <div className="container max-w-4xl mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Consultation Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Specialist</p>
                <p className="font-medium">{consultationSummary.specialist}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="font-medium">{consultationSummary.department}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">{consultationSummary.duration}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Specialist Recommendations</p>
              <Card className="bg-muted/50">
                <CardContent className="pt-4">
                  <p className="text-sm">{consultationSummary.recommendations}</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Case Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Add your notes about this consultation..."
              value={caseNotes}
              onChange={(e) => setCaseNotes(e.target.value)}
              rows={6}
            />
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button variant="outline" onClick={handleCloseCase} className="flex-1">
            Close Case
          </Button>
          <Button onClick={() => setShowReferralForm(true)} className="flex-1">
            Refer to Hospital
          </Button>
        </div>

        <Dialog open={showReferralForm} onOpenChange={setShowReferralForm}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Patient Referral Details</DialogTitle>
              <DialogDescription>
                Please provide patient information for hospital referral
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={patientDetails.fullName}
                  onChange={(e) =>
                    setPatientDetails({ ...patientDetails, fullName: e.target.value })
                  }
                  placeholder="Patient's full name"
                />
              </div>
              <div>
                <Label htmlFor="dob">Date of Birth *</Label>
                <Input
                  id="dob"
                  type="date"
                  value={patientDetails.dateOfBirth}
                  onChange={(e) =>
                    setPatientDetails({ ...patientDetails, dateOfBirth: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={patientDetails.phone}
                  onChange={(e) =>
                    setPatientDetails({ ...patientDetails, phone: e.target.value })
                  }
                  placeholder="Patient's contact number"
                />
              </div>
              <div>
                <Label htmlFor="history">Medical History</Label>
                <Textarea
                  id="history"
                  value={patientDetails.medicalHistory}
                  onChange={(e) =>
                    setPatientDetails({ ...patientDetails, medicalHistory: e.target.value })
                  }
                  placeholder="Relevant medical history..."
                  rows={4}
                />
              </div>
              <Button onClick={handleReferToHospital} className="w-full">
                Submit Referral
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
