import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Camera, Star, DollarSign, Clock, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function DoctorBProfile() {
  const { toast } = useToast();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    toast({
      title: "Profile Updated",
      description: "Your professional profile has been saved successfully.",
    });
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <MainLayout title="Professional Profile" userType="doctor-b">
      <div className="container max-w-4xl mx-auto p-4 space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="w-32 h-32">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                    DJ
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 rounded-full"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex-1 text-center sm:text-left space-y-2">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-2xl font-bold">Dr. Michael Johnson</h2>
                  <Badge variant="default">Verified</Badge>
                </div>
                <p className="text-muted-foreground">Cardiologist</p>
                <div className="flex flex-wrap gap-4 justify-center sm:justify-start text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-warning fill-warning" />
                    <span className="font-semibold">4.9</span>
                    <span className="text-muted-foreground">(127 reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>5+ years experience</span>
                  </div>
                </div>
              </div>

              <Button
                variant={isEditing ? "outline" : "default"}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  defaultValue="Dr. Michael Johnson"
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="michael.johnson@doctalk.com"
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  defaultValue="+1 (555) 123-4567"
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="license">Medical License</Label>
                <Input
                  id="license"
                  defaultValue="MD123456"
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              <Input
                id="specialization"
                defaultValue="Cardiology"
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hospital">Hospital Affiliation</Label>
              <Input
                id="hospital"
                defaultValue="St. Mary's Medical Center"
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                rows={4}
                defaultValue="Board-certified cardiologist with over 5 years of experience in interventional cardiology. Specialized in treating complex cardiac conditions and providing expert consultation for general practitioners."
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Consultation Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rate">Consultation Rate (per hour)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="rate"
                    type="number"
                    defaultValue="150"
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="avgTime">Average Consultation Time</Label>
                <Input
                  id="avgTime"
                  defaultValue="30 minutes"
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="languages">Languages</Label>
              <Input
                id="languages"
                defaultValue="English, Spanish"
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Professional Credentials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="education">Education</Label>
              <Textarea
                id="education"
                rows={3}
                defaultValue="MD - Harvard Medical School (2015)&#10;Residency - Johns Hopkins Hospital (2015-2018)&#10;Fellowship - Mayo Clinic (2018-2020)"
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="certifications">Board Certifications</Label>
              <Textarea
                id="certifications"
                rows={2}
                defaultValue="American Board of Internal Medicine - Cardiology&#10;Advanced Cardiac Life Support (ACLS)"
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>

        {isEditing && (
          <div className="flex gap-3">
            <Button onClick={handleSave} className="flex-1">
              Save Changes
            </Button>
            <Button onClick={() => setIsEditing(false)} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" className="w-full" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
