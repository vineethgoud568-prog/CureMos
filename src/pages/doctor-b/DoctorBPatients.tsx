import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, UserCheck, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { usePatients } from "@/hooks/usePatients";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { format } from "date-fns";

export default function DoctorBPatients() {
  const [searchQuery, setSearchQuery] = useState("");
  const { patients, loading } = usePatients();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "accepted":
        return "default";
      case "admitted":
        return "default";
      case "completed":
        return "outline";
      default:
        return "outline";
    }
  };

  const getAge = (dateOfBirth: string | null) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const filteredPatients = patients.filter((patient) =>
    patient.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.medical_history?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingCount = patients.filter(p => p.referral?.status === "pending").length;
  const admittedCount = patients.filter(p => p.referral?.status === "admitted").length;

  if (loading) {
    return (
      <MainLayout title="My Patients" userType="doctor-b">
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="My Patients" userType="doctor-b">
      <div className="container max-w-4xl mx-auto p-4 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Export Data
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-warning" />
                <div>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                  <p className="text-sm text-muted-foreground">Pending Admission</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-2xl font-bold">{admittedCount}</p>
                  <p className="text-sm text-muted-foreground">Currently Admitted</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Patients</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
            <TabsTrigger value="admitted">Admitted ({admittedCount})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4 mt-4">
            {filteredPatients.map((patient) => {
              const age = getAge(patient.date_of_birth);
              return (
                <Card key={patient.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {patient.full_name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{patient.full_name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {age ? `${age} years` : "Age not specified"}
                              {patient.gender && ` • ${patient.gender}`}
                            </p>
                            {patient.medical_history && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                History: {patient.medical_history}
                              </p>
                            )}
                          </div>
                          {patient.referral && (
                            <Badge variant={getStatusColor(patient.referral.status)}>
                              {patient.referral.status}
                            </Badge>
                          )}
                        </div>

                        <div className="text-sm text-muted-foreground space-y-1">
                          {patient.referral && (
                            <>
                              <div>
                                Referral Date: {format(new Date(patient.referral.referral_date), "MMM dd, yyyy")}
                              </div>
                              {patient.referral.admission_date && (
                                <div>
                                  Admission: {format(new Date(patient.referral.admission_date), "MMM dd, yyyy")}
                                </div>
                              )}
                              {patient.referral.diagnosis && (
                                <div>Diagnosis: {patient.referral.diagnosis}</div>
                              )}
                            </>
                          )}
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            View Records
                          </Button>
                          {patient.referral?.status === "pending" && (
                            <Button variant="default" size="sm" className="flex-1">
                              Accept Referral
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4 mt-4">
            {filteredPatients.filter(p => p.referral?.status === "pending").map((patient) => {
              const age = getAge(patient.date_of_birth);
              return (
                <Card key={patient.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {patient.full_name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div>
                          <h3 className="font-semibold">{patient.full_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {age ? `${age} years` : "Age not specified"}
                            {patient.gender && ` • ${patient.gender}`}
                          </p>
                        </div>
                        <Button variant="default" size="sm" className="w-full">
                          Accept Referral
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="admitted" className="space-y-4 mt-4">
            {filteredPatients.filter(p => p.referral?.status === "admitted").map((patient) => {
              const age = getAge(patient.date_of_birth);
              return (
                <Card key={patient.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {patient.full_name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div>
                          <h3 className="font-semibold">{patient.full_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {age ? `${age} years` : "Age not specified"}
                            {patient.gender && ` • ${patient.gender}`}
                          </p>
                          {patient.referral?.admission_date && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Admitted: {format(new Date(patient.referral.admission_date), "MMM dd, yyyy")}
                            </p>
                          )}
                        </div>
                        <Button variant="default" size="sm" className="w-full">
                          Discharge
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
