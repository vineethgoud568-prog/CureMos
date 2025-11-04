import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Users, Clock, AlertCircle, TrendingUp } from "lucide-react";

const recentConsultations = [
  {
    id: "1",
    specialist: "Dr. Sarah Johnson",
    department: "Cardiology",
    date: "2025-01-02",
    status: "completed",
  },
  {
    id: "2",
    specialist: "Dr. Michael Chen",
    department: "Neurology",
    date: "2024-12-28",
    status: "completed",
  },
];

export default function DoctorAHome() {
  return (
    <MainLayout
      title="Dashboard"
      userType="doctor-a"
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
              <p className="text-xs text-muted-foreground mt-1">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                +2 this week
              </p>
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
              <p className="text-xs text-muted-foreground mt-1">Awaiting admission</p>
            </CardContent>
          </Card>
        </div>

        <Button asChild className="w-full" size="lg">
          <Link to="/doctor-a/departments">
            <Stethoscope className="mr-2" />
            New Consultation
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Consultations</span>
              <Link to="/doctor-a/history">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentConsultations.length > 0 ? (
              recentConsultations.map((consultation) => (
                <div key={consultation.id} className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {consultation.specialist
                        .split(" ")
                        .map((n) => n[1])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{consultation.specialist}</p>
                    <p className="text-xs text-muted-foreground">{consultation.department}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">Completed</Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(consultation.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No recent consultations. Start a new consultation to connect with specialists.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            <Button variant="outline" asChild>
              <Link to="/doctor-a/patients">My Patients</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/doctor-a/history">History</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
