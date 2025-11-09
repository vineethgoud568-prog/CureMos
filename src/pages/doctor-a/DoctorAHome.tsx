import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Users, Clock } from "lucide-react";
import { useConsultations } from "@/hooks/useConsultations";
import { usePatients } from "@/hooks/usePatients";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

export default function DoctorAHome() {
  const { user } = useAuth();
  const { consultations, loading: loadingConsultations } = useConsultations();
  const { patients, loading: loadingPatients } = usePatients();

  const activeCases = consultations.filter((c) => c.status === "active" || c.status === "pending").length;
  const pendingReferrals = patients.filter((p) => p.referral?.status === "pending").length;
  const recentConsultations = consultations.slice(0, 5);

  if (loadingConsultations || loadingPatients) {
    return (
      <MainLayout title="Dashboard" userType="doctor-a">
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Dashboard" userType="doctor-a" showEmergencyContact>
      <div className="container max-w-4xl mx-auto p-4 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">
            Welcome, {user?.email?.split('@')[0]}
          </h2>
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
                <span className="text-2xl font-bold">{activeCases}</span>
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
                <span className="text-2xl font-bold">{pendingReferrals}</span>
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
                    <AvatarImage src={consultation.doctor_b_profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {consultation.doctor_b_profile?.full_name?.split(" ").map(n => n[0]).join("") || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{consultation.doctor_b_profile?.full_name || "Specialist"}</p>
                    <p className="text-xs text-muted-foreground">{consultation.doctor_b_profile?.specialization || "Specialist"}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={consultation.status === "completed" ? "default" : "secondary"}>
                      {consultation.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(consultation.start_time), "MMM dd")}
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
