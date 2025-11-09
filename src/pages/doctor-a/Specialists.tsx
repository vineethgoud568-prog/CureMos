import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Search } from "lucide-react";
import { useSpecialists } from "@/hooks/useSpecialists";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function Specialists() {
  const { departmentId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const { specialists, loading } = useSpecialists(departmentId);

  const filteredSpecialists = specialists.filter((specialist) => {
    const matchesSearch =
      specialist.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      specialist.specialization?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <MainLayout title="Select Specialist" userType="doctor-a">
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Select Specialist" userType="doctor-a">
      <div className="container max-w-4xl mx-auto p-4 space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="search"
              placeholder="Search specialists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

        </div>

        <div className="space-y-4">
          {filteredSpecialists.map((specialist) => (
            <Card key={specialist.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={specialist.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-lg">
                      {specialist.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{specialist.full_name}</h3>
                        <p className="text-sm text-muted-foreground">{specialist.specialization || "Specialist"}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {specialist.hospital_affiliation || "Not specified"}
                        </p>
                      </div>
                      <Badge variant="default" className="bg-accent text-accent-foreground">
                        Available
                      </Badge>
                    </div>

                    {specialist.phone && (
                      <p className="text-sm text-muted-foreground">
                        Phone: {specialist.phone}
                      </p>
                    )}

                    <Button
                      asChild
                      className="w-full"
                    >
                      <Link to={`/doctor-a/consultation/${specialist.id}`}>
                        Consult Now
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSpecialists.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No specialists found matching your criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
