import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Calendar, Clock, User } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockConsultations = [
  {
    id: "1",
    specialist: "Dr. Sarah Johnson",
    department: "Cardiology",
    date: "2025-01-02",
    duration: "25 min",
    outcome: "closed",
    patientName: "John Doe",
  },
  {
    id: "2",
    specialist: "Dr. Michael Chen",
    department: "Neurology",
    date: "2024-12-28",
    duration: "30 min",
    outcome: "referred",
    patientName: "Jane Smith",
  },
  {
    id: "3",
    specialist: "Dr. Emily Rodriguez",
    department: "Orthopedics",
    date: "2024-12-20",
    duration: "20 min",
    outcome: "closed",
    patientName: "Robert Johnson",
  },
];

export default function DoctorAHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterOutcome, setFilterOutcome] = useState("all");

  const filteredConsultations = mockConsultations.filter((consultation) => {
    const matchesSearch =
      consultation.specialist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      consultation.patientName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      filterDepartment === "all" || consultation.department === filterDepartment;
    const matchesOutcome = filterOutcome === "all" || consultation.outcome === filterOutcome;
    return matchesSearch && matchesDepartment && matchesOutcome;
  });

  const getOutcomeBadge = (outcome: string) => {
    return outcome === "referred" ? (
      <Badge variant="default">Referred</Badge>
    ) : (
      <Badge variant="secondary">Closed</Badge>
    );
  };

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

          <div className="flex gap-2 overflow-x-auto pb-2">
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Cardiology">Cardiology</SelectItem>
                <SelectItem value="Neurology">Neurology</SelectItem>
                <SelectItem value="Orthopedics">Orthopedics</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterOutcome} onValueChange={setFilterOutcome}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Outcome" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Outcomes</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="referred">Referred</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredConsultations.map((consultation) => (
            <Card key={consultation.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {consultation.specialist
                        .split(" ")
                        .map((n) => n[1])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{consultation.specialist}</h3>
                        <p className="text-sm text-muted-foreground">{consultation.department}</p>
                      </div>
                      {getOutcomeBadge(consultation.outcome)}
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(consultation.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {consultation.duration}
                      </div>
                      {consultation.patientName && (
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {consultation.patientName}
                        </div>
                      )}
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
