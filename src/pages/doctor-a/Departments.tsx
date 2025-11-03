import { useState } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Heart, Brain, Bone, Baby, Scan, BrainCircuit, Scissors, User, Search } from "lucide-react";

const departments = [
  { id: "1", name: "Cardiology", description: "Heart and cardiovascular system", icon: Heart, available: 12 },
  { id: "2", name: "Neurology", description: "Brain and nervous system", icon: Brain, available: 8 },
  { id: "3", name: "Orthopedics", description: "Bones, joints, and muscles", icon: Bone, available: 15 },
  { id: "4", name: "Pediatrics", description: "Children's health", icon: Baby, available: 10 },
  { id: "5", name: "Dermatology", description: "Skin conditions", icon: Scan, available: 6 },
  { id: "6", name: "Psychiatry", description: "Mental health", icon: BrainCircuit, available: 9 },
  { id: "7", name: "General Surgery", description: "Surgical procedures", icon: Scissors, available: 7 },
  { id: "8", name: "Gynecology", description: "Women's health", icon: User, available: 11 },
];

export default function Departments() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout title="Select Department" userType="doctor-a">
      <div className="container max-w-4xl mx-auto p-4 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Medical Departments</h2>
          <p className="text-muted-foreground">Choose a department to connect with specialists</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="search"
            placeholder="Search departments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDepartments.map((dept) => {
            const Icon = dept.icon;
            return (
              <Link key={dept.id} to={`/doctor-a/specialists/${dept.id}`}>
                <Card className="hover:border-primary hover:shadow-md transition-all cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <Badge variant="secondary">{dept.available} available</Badge>
                    </div>
                    <CardTitle className="mt-4">{dept.name}</CardTitle>
                    <CardDescription>{dept.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>

        {filteredDepartments.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No departments found matching your search.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
