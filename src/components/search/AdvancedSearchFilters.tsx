import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { SearchFilters } from "@/hooks/useAdvancedSearch";
import { MapPin, SlidersHorizontal, X } from "lucide-react";

interface AdvancedSearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: Partial<SearchFilters>) => void;
  onClearFilters: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const AdvancedSearchFilters = ({
  filters,
  onFiltersChange,
  onClearFilters,
  searchQuery,
  onSearchChange,
}: AdvancedSearchFiltersProps) => {
  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-semibold">Advanced Filters</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onClearFilters}>
          <X className="w-4 h-4 mr-1" />
          Clear
        </Button>
      </div>

      {/* Search Input */}
      <div className="space-y-2">
        <Label htmlFor="search">Search</Label>
        <Input
          id="search"
          placeholder="Search doctors by name or specialty..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Specialty Filter */}
      <div className="space-y-2">
        <Label htmlFor="specialty">Specialty</Label>
        <Select
          value={filters.specialty || ""}
          onValueChange={(value) => onFiltersChange({ specialty: value || undefined })}
        >
          <SelectTrigger id="specialty">
            <SelectValue placeholder="All specialties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All specialties</SelectItem>
            <SelectItem value="cardiology">Cardiology</SelectItem>
            <SelectItem value="neurology">Neurology</SelectItem>
            <SelectItem value="orthopedics">Orthopedics</SelectItem>
            <SelectItem value="pediatrics">Pediatrics</SelectItem>
            <SelectItem value="dermatology">Dermatology</SelectItem>
            <SelectItem value="psychiatry">Psychiatry</SelectItem>
            <SelectItem value="general">General Medicine</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Availability Filter */}
      <div className="space-y-2">
        <Label htmlFor="availability">Availability</Label>
        <Select
          value={filters.availability || "all"}
          onValueChange={(value) => onFiltersChange({ availability: value as any })}
        >
          <SelectTrigger id="availability">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All doctors</SelectItem>
            <SelectItem value="online">Online only</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Distance Filter */}
      {filters.location && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Maximum Distance</Label>
            <span className="text-sm text-muted-foreground">
              {filters.maxDistance || 50} km
            </span>
          </div>
          <Slider
            value={[filters.maxDistance || 50]}
            onValueChange={([value]) => onFiltersChange({ maxDistance: value })}
            max={200}
            min={5}
            step={5}
          />
        </div>
      )}

      {/* Sort By */}
      <div className="space-y-2">
        <Label htmlFor="sortBy">Sort By</Label>
        <Select
          value={filters.sortBy || "rating"}
          onValueChange={(value) => onFiltersChange({ sortBy: value as any })}
        >
          <SelectTrigger id="sortBy">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Rating</SelectItem>
            <SelectItem value="distance">Distance</SelectItem>
            <SelectItem value="experience">Experience</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Location Button */}
      {!filters.location && (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  onFiltersChange({
                    location: {
                      lat: position.coords.latitude,
                      lng: position.coords.longitude,
                    },
                    maxDistance: 50,
                  });
                },
                (error) => {
                  console.error("Error getting location:", error);
                }
              );
            }
          }}
        >
          <MapPin className="w-4 h-4 mr-2" />
          Use My Location
        </Button>
      )}
    </div>
  );
};
