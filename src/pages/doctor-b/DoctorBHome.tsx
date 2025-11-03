import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Users, DollarSign, Clock } from "lucide-react";
import { useState } from "react";

export default function DoctorBHome() {
  const [isAvailable, setIsAvailable] = useState(false);

  return (
    <MainLayout
      title="Dashboard"
      userType="doctor-b"
      notificationCount={2}
    >
      <div className="container max-w-4xl mx-auto p-4 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Welcome, Dr. Johnson</h2>
          <p className="text-muted-foreground">Specialist consultation dashboard</p>
        </div>

        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="availability" className="text-base font-semibold">
                  Availability Status
                </Label>
                <p className="text-sm text-muted-foreground">
                  {isAvailable ? "You're online and ready for consultations" : "You're currently offline"}
                </p>
              </div>
              <Switch
                id="availability"
                checked={isAvailable}
                onCheckedChange={setIsAvailable}
                className="data-[state=checked]:bg-accent"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-2xl font-bold">8</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-warning" />
                <span className="text-2xl font-bold">3</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-accent" />
                <span className="text-2xl font-bold">$450</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Consultation Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No pending consultation requests at the moment.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
