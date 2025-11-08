import { useState, useMemo } from "react";

export interface SearchFilters {
  specialty?: string;
  location?: { lat: number; lng: number };
  maxDistance?: number;
  availability?: "online" | "offline" | "all";
  minRating?: number;
  sortBy?: "distance" | "rating" | "experience";
}

export interface Doctor {
  id: string;
  full_name: string;
  specialization: string;
  location_lat: number | null;
  location_lng: number | null;
  hospital_affiliation?: string;
  rating?: number;
  experience?: number;
}

export const useAdvancedSearch = <T extends Doctor>(items: T[]) => {
  const [filters, setFilters] = useState<SearchFilters>({
    availability: "all",
    sortBy: "rating",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAndSortedItems = useMemo(() => {
    let result = [...items];

    // Text search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.full_name?.toLowerCase().includes(query) ||
          item.specialization?.toLowerCase().includes(query) ||
          item.hospital_affiliation?.toLowerCase().includes(query)
      );
    }

    // Specialty filter
    if (filters.specialty) {
      result = result.filter(
        (item) =>
          item.specialization?.toLowerCase() === filters.specialty?.toLowerCase()
      );
    }

    // Location filter
    if (filters.location && filters.maxDistance) {
      result = result.filter((item) => {
        if (!item.location_lat || !item.location_lng) return false;
        const distance = calculateDistance(
          filters.location!,
          { lat: item.location_lat, lng: item.location_lng }
        );
        return distance <= filters.maxDistance!;
      });
    }

    // Rating filter
    if (filters.minRating) {
      result = result.filter((item) => (item.rating || 0) >= filters.minRating!);
    }

    // Sorting
    if (filters.sortBy === "distance" && filters.location) {
      result.sort((a, b) => {
        if (!a.location_lat || !a.location_lng) return 1;
        if (!b.location_lat || !b.location_lng) return -1;
        
        const distA = calculateDistance(filters.location!, {
          lat: a.location_lat,
          lng: a.location_lng,
        });
        const distB = calculateDistance(filters.location!, {
          lat: b.location_lat,
          lng: b.location_lng,
        });
        return distA - distB;
      });
    } else if (filters.sortBy === "rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (filters.sortBy === "experience") {
      result.sort((a, b) => (b.experience || 0) - (a.experience || 0));
    }

    return result;
  }, [items, filters, searchQuery]);

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      availability: "all",
      sortBy: "rating",
    });
    setSearchQuery("");
  };

  return {
    filteredItems: filteredAndSortedItems,
    filters,
    searchQuery,
    setSearchQuery,
    updateFilters,
    clearFilters,
  };
};

// Helper function
const calculateDistance = (
  loc1: { lat: number; lng: number },
  loc2: { lat: number; lng: number }
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(loc2.lat - loc1.lat);
  const dLon = toRad(loc2.lng - loc1.lng);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(loc1.lat)) *
      Math.cos(toRad(loc2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};
