import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, UserCheck, Clock, Calendar } from "lucide-react";
import { useState } from "react";

export default function DoctorBPatients() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - will be replaced with actual data from Supabase
  const referredPatients = [
    {
      id: "1",
      name: "John Smith",
      age: 45,
      gender: "Male",
      referredBy: "Dr. Sarah Mitchell",
      referralDate: "2025-01-02",
      status: "admitted",
      condition: "Acute chest pain, suspected MI",
      admissionDate: "2025-01-03",
    },
    {
      id: "2",
      name: "Emily Johnson",
      age: 32,
      gender: "Female",
      referredBy: "Dr. Robert Chen",
      referralDate: "2025-01-03",
      status: "pending",
      condition: "Severe migraine, neurological assessment needed",
    },
    {
      id: "3",
      name: "Michael Brown",
      age: 58,
      gender: "Male",
      referredBy: "Dr. Lisa Anderson",
      referralDate: "2024-12-28",
      status: "discharged",
      condition: "Post-operative follow-up",
      dischargeDate: "2025-01-01",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "admitted":
        return "default";
      case "pending":
        return "secondary";
      case "discharged":
        return "outline";
      default:
        return "outline";
    }
  };

  const filteredPatients = referredPatients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingCount = referredPatients.filter(p => p.status === "pending").length;
  const admittedCount = referredPatients.filter(p => p.status === "admitted").length;

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
          
          <TabsContent value="all" className="space-y-4">
            {filteredPatients.map((patient) => (
              <Card key={patient.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{patient.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {patient.age} years • {patient.gender}
                      </p>
                    </div>
                    <Badge variant={getStatusColor(patient.status)}>
                      {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold">Condition</p>
                    <p className="text-sm text-muted-foreground">{patient.condition}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <UserCheck className="w-4 h-4 text-muted-foreground" />
                      <span>Referred by {patient.referredBy}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{patient.referralDate}</span>
                    </div>
                  </div>
                  {patient.status === "admitted" && patient.admissionDate && (
                    <p className="text-sm text-muted-foreground">
                      Admitted on {patient.admissionDate}
                    </p>
                  )}
                  {patient.status === "discharged" && patient.dischargeDate && (
                    <p className="text-sm text-muted-foreground">
                      Discharged on {patient.dischargeDate}
                    </p>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline">View Details</Button>
                    {patient.status === "pending" && (
                      <Button size="sm" variant="default">Accept Admission</Button>
                    )}
                    {patient.status === "admitted" && (
                      <Button size="sm" variant="outline">Update Status</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {filteredPatients.filter(p => p.status === "pending").map((patient) => (
              <Card key={patient.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{patient.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {patient.age} years • {patient.gender}
                      </p>
                    </div>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold">Condition</p>
                    <p className="text-sm text-muted-foreground">{patient.condition}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <UserCheck className="w-4 h-4 text-muted-foreground" />
                      <span>Referred by {patient.referredBy}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{patient.referralDate}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline">View Details</Button>
                    <Button size="sm" variant="default">Accept Admission</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="admitted" className="space-y-4">
            {filteredPatients.filter(p => p.status === "admitted").map((patient) => (
              <Card key={patient.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{patient.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {patient.age} years • {patient.gender}
                      </p>
                    </div>
                    <Badge>Admitted</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold">Condition</p>
                    <p className="text-sm text-muted-foreground">{patient.condition}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <UserCheck className="w-4 h-4 text-muted-foreground" />
                      <span>Referred by {patient.referredBy}</span>
                    </div>
                    {patient.admissionDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>Admitted {patient.admissionDate}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline">View Details</Button>
                    <Button size="sm" variant="outline">Update Status</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
