import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useConsultations } from "@/hooks/useConsultations";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { format } from "date-fns";

export default function DoctorAHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const { consultations, loading } = useConsultations();

  const filteredConsultations = consultations.filter((consultation) => {
    const matchesSearch =
      consultation.doctor_b_profile?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      consultation.patient?.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || consultation.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      completed: "default",
      active: "secondary",
      pending: "outline",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  if (loading) {
    return (
      <MainLayout title="Consultation History" userType="doctor-a">
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Consultation History" userType="doctor-a">
      <div className="container max-w-4xl mx-auto p-4 space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="search"
              placeholder="Search consultations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredConsultations.map((consultation) => (
            <Card key={consultation.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={consultation.doctor_b_profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {consultation.doctor_b_profile?.full_name?.split(" ").map(n => n[0]).join("") || "?"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{consultation.doctor_b_profile?.full_name || "Specialist"}</h3>
                        <p className="text-sm text-muted-foreground">{consultation.doctor_b_profile?.specialization || "Specialist"}</p>
                        {consultation.patient?.full_name && (
                          <p className="text-sm text-muted-foreground">Patient: {consultation.patient.full_name}</p>
                        )}
                      </div>
                      <div className="text-right space-y-1">
                        {getStatusBadge(consultation.status)}
                        <p className="text-sm text-muted-foreground mt-2">
                          {format(new Date(consultation.start_time), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>

                    <div className="text-sm">
                      <p className="text-muted-foreground">Type: {consultation.consultation_type}</p>
                      <p className="text-muted-foreground">Urgency: {consultation.urgency_level}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredConsultations.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No consultations found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
