import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stethoscope, Users, Clock, AlertCircle } from "lucide-react";

export default function DoctorAHome() {
  return (
    <MainLayout
      title="Dashboard"
      userType="doctor-a"
      notificationCount={3}
      showEmergencyContact
    >
      <div className="container max-w-4xl mx-auto p-4 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Welcome, Dr. Smith</h2>
          <p className="text-muted-foreground">Your consultation dashboard</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Cases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-2xl font-bold">12</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Referrals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-warning" />
                <span className="text-2xl font-bold">5</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Button className="w-full" size="lg">
          <Stethoscope className="mr-2" />
          New Consultation
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              Recent Consultations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No recent consultations. Start a new consultation to connect with specialists.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
