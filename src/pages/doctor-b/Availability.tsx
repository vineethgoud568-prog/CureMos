import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Clock, Bell, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Availability() {
  const { toast } = useToast();
  const [isAvailable, setIsAvailable] = useState(true);
  const [autoOffline, setAutoOffline] = useState(false);
  const [consultationLimit, setConsultationLimit] = useState("10");
  const [breakTime, setBreakTime] = useState("12:00");
  
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  const handleSave = () => {
    toast({
      title: "Availability Updated",
      description: "Your availability settings have been saved successfully.",
    });
  };

  return (
    <MainLayout title="Availability Management" userType="doctor-b">
      <div className="container max-w-4xl mx-auto p-4 space-y-6">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary" />
              Current Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="space-y-1">
                <Label htmlFor="status" className="text-base font-semibold">
                  Online Status
                </Label>
                <p className="text-sm text-muted-foreground">
                  {isAvailable ? "Currently accepting consultations" : "Currently offline"}
                </p>
              </div>
              <Switch
                id="status"
                checked={isAvailable}
                onCheckedChange={setIsAvailable}
                className="data-[state=checked]:bg-accent"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Daily Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {weekDays.map((day) => (
              <div key={day} className="flex items-center justify-between py-2 border-b last:border-0">
                <span className="font-medium">{day}</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span>09:00 - 17:00</span>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Advanced Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="auto-offline" className="font-semibold">
                    Auto Offline Timer
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically go offline after inactivity
                  </p>
                </div>
                <Switch
                  id="auto-offline"
                  checked={autoOffline}
                  onCheckedChange={setAutoOffline}
                />
              </div>

              {autoOffline && (
                <div className="ml-4 space-y-2">
                  <Label htmlFor="timeout">Timeout Duration (minutes)</Label>
                  <Input
                    id="timeout"
                    type="number"
                    defaultValue="30"
                    className="max-w-xs"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="limit">Daily Consultation Limit</Label>
              <Input
                id="limit"
                type="number"
                value={consultationLimit}
                onChange={(e) => setConsultationLimit(e.target.value)}
                className="max-w-xs"
              />
              <p className="text-sm text-muted-foreground">
                Maximum consultations per day
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="break">Break Time</Label>
              <Input
                id="break"
                type="time"
                value={breakTime}
                onChange={(e) => setBreakTime(e.target.value)}
                className="max-w-xs"
              />
              <p className="text-sm text-muted-foreground">
                Schedule your daily break time
              </p>
            </div>

            <div className="pt-4">
              <Button onClick={handleSave} className="w-full sm:w-auto">
                Save Availability Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
