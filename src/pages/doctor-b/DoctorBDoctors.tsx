import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MessageSquare, MapPin } from "lucide-react";
import { useState } from "react";
import { useReferringDoctors } from "@/hooks/useReferringDoctors";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { format } from "date-fns";

export default function DoctorBDoctors() {
  const [searchQuery, setSearchQuery] = useState("");
  const { doctors, loading } = useReferringDoctors();

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.hospital_affiliation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalConsultations = doctors.reduce((sum, doc) => sum + doc.consultationCount, 0);

  if (loading) {
    return (
      <MainLayout title="My Doctors" userType="doctor-b">
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }

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

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-1">
                <p className="text-2xl font-bold">{doctors.length}</p>
                <p className="text-sm text-muted-foreground">Total Doctors</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-1">
                <p className="text-2xl font-bold">{totalConsultations}</p>
                <p className="text-sm text-muted-foreground">Consultations</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={doctor.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {doctor.full_name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{doctor.full_name}</h3>
                        <p className="text-sm text-muted-foreground">{doctor.specialization || "General Practice"}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {doctor.hospital_affiliation || "Not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div>{doctor.consultationCount} consultations</div>
                      {doctor.lastConsultation && (
                        <div>
                          Last: {format(new Date(doctor.lastConsultation), "MMM dd, yyyy")}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        View History
                      </Button>
                      <Button variant="default" size="sm" className="flex-1">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message
                      </Button>
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
