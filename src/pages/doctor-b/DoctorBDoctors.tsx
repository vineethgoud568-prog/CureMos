import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Star, MessageSquare, MapPin, TrendingUp } from "lucide-react";
import { useState } from "react";

export default function DoctorBDoctors() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - will be replaced with actual data from Supabase
  const referringDoctors = [
    {
      id: "1",
      name: "Dr. Sarah Mitchell",
      specialization: "General Practice",
      hospital: "City Medical Center",
      consultationCount: 45,
      lastConsultation: "2025-01-02",
      rating: 4.8,
      isPreferred: true,
      avatar: "",
    },
    {
      id: "2",
      name: "Dr. Robert Chen",
      specialization: "Family Medicine",
      hospital: "Downtown Health Clinic",
      consultationCount: 32,
      lastConsultation: "2025-01-03",
      rating: 4.9,
      isPreferred: true,
      avatar: "",
    },
    {
      id: "3",
      name: "Dr. Lisa Anderson",
      specialization: "Internal Medicine",
      hospital: "Memorial Hospital",
      consultationCount: 28,
      lastConsultation: "2024-12-30",
      rating: 4.7,
      isPreferred: false,
      avatar: "",
    },
    {
      id: "4",
      name: "Dr. James Wilson",
      specialization: "Emergency Medicine",
      hospital: "Central Emergency Care",
      consultationCount: 19,
      lastConsultation: "2024-12-28",
      rating: 4.6,
      isPreferred: false,
      avatar: "",
    },
  ];

  const filteredDoctors = referringDoctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.hospital.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalConsultations = referringDoctors.reduce((sum, doc) => sum + doc.consultationCount, 0);
  const preferredCount = referringDoctors.filter(d => d.isPreferred).length;

  return (
    <MainLayout title="My Doctors" userType="doctor-b">
      <div className="container max-w-4xl mx-auto p-4 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search referring doctors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-1">
                <p className="text-2xl font-bold">{referringDoctors.length}</p>
                <p className="text-sm text-muted-foreground">Total Doctors</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <p className="text-2xl font-bold">{totalConsultations}</p>
                </div>
                <p className="text-sm text-muted-foreground">Consultations</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-warning fill-warning" />
                  <p className="text-2xl font-bold">{preferredCount}</p>
                </div>
                <p className="text-sm text-muted-foreground">Preferred</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={doctor.avatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {doctor.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{doctor.name}</h3>
                          {doctor.isPreferred && (
                            <Star className="w-4 h-4 text-warning fill-warning" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {doctor.hospital}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-warning fill-warning" />
                        <span className="font-semibold">{doctor.rating}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                        <span>{doctor.consultationCount} consultations</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-muted-foreground" />
                        <span>Last: {doctor.lastConsultation}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        View History
                      </Button>
                      <Button size="sm" variant="outline">
                        Message
                      </Button>
                      {doctor.isPreferred ? (
                        <Button size="sm" variant="ghost">
                          Remove from Preferred
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost">
                          Mark as Preferred
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No doctors found matching your search.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
