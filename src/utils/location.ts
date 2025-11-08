// Location-based services utilities

export interface Location {
  lat: number;
  lng: number;
}

export interface Doctor {
  id: string;
  location_lat: number | null;
  location_lng: number | null;
  specialization: string;
  full_name: string;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @returns distance in kilometers
 */
export const calculateDistance = (loc1: Location, loc2: Location): number => {
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

/**
 * Find doctors within a specified radius
 */
export const findDoctorsNearby = (
  userLocation: Location,
  doctors: Doctor[],
  radiusKm: number = 50
): Array<Doctor & { distance: number }> => {
  return doctors
    .filter((doc) => doc.location_lat !== null && doc.location_lng !== null)
    .map((doc) => ({
      ...doc,
      distance: calculateDistance(userLocation, {
        lat: doc.location_lat!,
        lng: doc.location_lng!,
      }),
    }))
    .filter((doc) => doc.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance);
};

/**
 * Get user's current location
 */
export const getCurrentLocation = (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  });
};

/**
 * Format distance for display
 */
export const formatDistance = (distanceKm: number): string => {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  }
  return `${distanceKm.toFixed(1)}km`;
};

/**
 * Match doctors based on specialty, location, and availability
 */
export const matchDoctors = (
  userLocation: Location,
  doctors: Doctor[],
  specialty: string,
  maxDistance: number = 50
): Array<Doctor & { distance: number; matchScore: number }> => {
  const nearby = findDoctorsNearby(userLocation, doctors, maxDistance);
  
  return nearby
    .map((doc) => {
      let matchScore = 100;
      
      // Reduce score based on distance
      matchScore -= (doc.distance / maxDistance) * 30;
      
      // Boost score for exact specialty match
      if (doc.specialization?.toLowerCase() === specialty.toLowerCase()) {
        matchScore += 20;
      }
      
      return {
        ...doc,
        matchScore: Math.max(0, Math.min(100, matchScore)),
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
};
