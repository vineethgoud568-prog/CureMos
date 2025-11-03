import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, MapPin, Clock, Search, SlidersHorizontal } from "lucide-react";

const specialists = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialization: "Senior Cardiologist",
    hospital: "City General Hospital",
    rating: 4.8,
    totalReviews: 245,
    availability: "online",
    distance: "2.5 km",
    consultationFee: "$50",
    avatar: "",
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialization: "Cardiology Specialist",
    hospital: "Metropolitan Medical Center",
    rating: 4.9,
    totalReviews: 312,
    availability: "online",
    distance: "3.8 km",
    consultationFee: "$65",
    avatar: "",
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    specialization: "Interventional Cardiologist",
    hospital: "St. Mary's Hospital",
    rating: 4.7,
    totalReviews: 198,
    availability: "offline",
    distance: "5.2 km",
    consultationFee: "$70",
    avatar: "",
  },
];

export default function Specialists() {
  const { departmentId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [filterAvailability, setFilterAvailability] = useState("all");

  const filteredSpecialists = specialists
    .filter((specialist) => {
      const matchesSearch =
        specialist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        specialist.specialization.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesAvailability =
        filterAvailability === "all" || specialist.availability === filterAvailability;
      return matchesSearch && matchesAvailability;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "distance") return parseFloat(a.distance) - parseFloat(b.distance);
      return 0;
    });

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

          <div className="flex gap-2 overflow-x-auto pb-2">
            <Select value={filterAvailability} onValueChange={setFilterAvailability}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="distance">Distance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredSpecialists.map((specialist) => (
            <Card key={specialist.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={specialist.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary text-lg">
                      {specialist.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{specialist.name}</h3>
                        <p className="text-sm text-muted-foreground">{specialist.specialization}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {specialist.hospital}
                        </p>
                      </div>
                      <Badge
                        variant={specialist.availability === "online" ? "default" : "secondary"}
                        className={
                          specialist.availability === "online"
                            ? "bg-accent text-accent-foreground"
                            : ""
                        }
                      >
                        {specialist.availability === "online" ? "Online" : "Offline"}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-warning text-warning" />
                        <span className="font-medium">{specialist.rating}</span>
                        <span className="text-muted-foreground">({specialist.totalReviews})</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {specialist.distance}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {specialist.consultationFee}
                      </div>
                    </div>

                    <Button
                      asChild
                      className="w-full"
                      disabled={specialist.availability === "offline"}
                    >
                      <Link to={`/doctor-a/consultation/${specialist.id}`}>
                        {specialist.availability === "online" ? "Consult Now" : "Unavailable"}
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
