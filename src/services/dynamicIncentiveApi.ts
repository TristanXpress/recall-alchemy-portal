
import { supabase } from "@/integrations/supabase/client";

// Type guard to check if coordinates contain geofence data
const hasGeofence = (coordinates: any): coordinates is { geofence: { type: 'polygon' | 'circle'; coordinates: { lat: number; lng: number }[]; radius?: number } } => {
  return coordinates && 
         typeof coordinates === 'object' && 
         coordinates.geofence && 
         typeof coordinates.geofence === 'object' &&
         coordinates.geofence.type &&
         Array.isArray(coordinates.geofence.coordinates);
};

// Type guard to check if coordinates is legacy array format
const isLegacyCoordinates = (coordinates: any): coordinates is { lat: number; lng: number }[] => {
  return Array.isArray(coordinates) && 
         coordinates.length > 0 && 
         coordinates[0] && 
         typeof coordinates[0].lat === 'number' && 
         typeof coordinates[0].lng === 'number';
};

export class DynamicIncentiveApiService {
  
  // Get all active dynamic incentives
  static async getAllActiveDynamicIncentives() {
    console.log("API: Fetching all active dynamic incentives");
    
    const { data, error } = await supabase
      .from("dynamic_incentives")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Dynamic Incentive API Error:", error);
      throw new Error(`Failed to fetch dynamic incentives: ${error.message}`);
    }

    console.log("API: Retrieved active dynamic incentives:", data);
    return data;
  }

  // Get dynamic incentives by cities
  static async getDynamicIncentivesByCities(cities: string[]) {
    console.log("API: Fetching dynamic incentives by cities", cities);
    
    const { data, error } = await supabase.rpc("get_dynamic_incentives_by_cities", {
      p_cities: cities,
    });

    if (error) {
      console.error("Dynamic Incentive API Error:", error);
      throw new Error(`Failed to fetch dynamic incentives by cities: ${error.message}`);
    }

    return data;
  }

  // Get dynamic incentives by location (city)
  static async getDynamicIncentivesByLocation(location: string) {
    console.log("API: Fetching dynamic incentives by location", { location });
    
    const { data, error } = await supabase
      .from("dynamic_incentives")
      .select("*")
      .eq("is_active", true)
      .eq("location", location)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Dynamic Incentive API Error:", error);
      throw new Error(`Failed to fetch dynamic incentives by location: ${error.message}`);
    }

    return data;
  }

  // Get dynamic incentives by coordinates with geofencing support
  static async getDynamicIncentivesByCoordinates(
    lat: number, 
    lng: number, 
    radiusKm: number = 5
  ) {
    console.log("API: Fetching dynamic incentives by coordinates with geofencing", { lat, lng, radiusKm });
    
    const { data, error } = await supabase
      .from("dynamic_incentives")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Dynamic Incentive API Error:", error);
      throw new Error(`Failed to fetch dynamic incentives by coordinates: ${error.message}`);
    }

    // Filter by geofencing or legacy coordinate system
    const filteredData = data?.filter(incentive => {
      // Check if the incentive has geofence data
      if (incentive.coordinates && hasGeofence(incentive.coordinates)) {
        const geofence = incentive.coordinates.geofence;
        
        if (geofence.type === 'polygon') {
          return this.isPointInPolygon(lat, lng, geofence.coordinates);
        } else if (geofence.type === 'circle') {
          const center = geofence.coordinates[0];
          const radius = geofence.radius || radiusKm;
          const distance = this.calculateDistance(lat, lng, center.lat, center.lng);
          return distance <= radius;
        }
      }

      // Fallback to legacy coordinate system
      if (incentive.coordinates && isLegacyCoordinates(incentive.coordinates)) {
        return incentive.coordinates.some((coord: any) => {
          const distance = this.calculateDistance(lat, lng, coord.lat, coord.lng);
          return distance <= radiusKm;
        });
      }

      return false;
    });

    return filteredData || [];
  }

  // Real-time subscription for dynamic incentive updates
  static subscribeToDynamicIncentiveUpdates(callback: (payload: any) => void) {
    console.log("API: Setting up real-time subscription for dynamic incentives");
    
    const channel = supabase
      .channel("dynamic-incentive-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "dynamic_incentives",
        },
        callback
      )
      .subscribe();

    return channel;
  }

  // Helper: Point-in-polygon algorithm for geofencing
  static isPointInPolygon(lat: number, lng: number, polygon: { lat: number; lng: number }[]): boolean {
    let inside = false;
    
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].lat, yi = polygon[i].lng;
      const xj = polygon[j].lat, yj = polygon[j].lng;
      
      if (((yi > lng) !== (yj > lng)) && (lat < (xj - xi) * (lng - yi) / (yj - yi) + xi)) {
        inside = !inside;
      }
    }
    
    return inside;
  }

  // Helper: Calculate distance between two coordinates (Haversine formula)
  static calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Helper: Calculate dynamic incentive value
  static calculateDynamicIncentiveValue(
    baseAmount: number,
    incentiveAmount: number,
    incentiveType: "percentage" | "fixed"
  ) {
    if (incentiveType === "percentage") {
      return (baseAmount * incentiveAmount) / 100;
    }
    return incentiveAmount;
  }

  // Helper: Check if coordinates are within geofenced area
  static isWithinGeofencedArea(
    userLat: number,
    userLng: number,
    geofence: { type: 'polygon' | 'circle'; coordinates: { lat: number; lng: number }[]; radius?: number }
  ): boolean {
    if (geofence.type === 'polygon') {
      return this.isPointInPolygon(userLat, userLng, geofence.coordinates);
    } else if (geofence.type === 'circle') {
      const center = geofence.coordinates[0];
      const distance = this.calculateDistance(userLat, userLng, center.lat, center.lng);
      return distance <= (geofence.radius || 1);
    }
    return false;
  }

  // Helper: Legacy support - Check if coordinates are within dynamic incentive area
  static isWithinIncentiveArea(
    userLat: number,
    userLng: number,
    incentiveCoordinates: { lat: number; lng: number }[],
    radiusKm: number = 1
  ): boolean {
    return incentiveCoordinates.some(coord => {
      const distance = this.calculateDistance(userLat, userLng, coord.lat, coord.lng);
      return distance <= radiusKm;
    });
  }

  // Helper: Format currency for display
  static formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  }

  // Helper: Get nearby geofenced dynamic incentives for mobile map view
  static async getNearbyDynamicIncentives(
    userLat: number,
    userLng: number,
    radiusKm: number = 10
  ) {
    console.log("API: Fetching nearby geofenced dynamic incentives", { userLat, userLng, radiusKm });
    
    const allIncentives = await this.getAllActiveDynamicIncentives();
    
    return allIncentives.filter(incentive => {
      // Check geofenced areas first
      if (incentive.coordinates && hasGeofence(incentive.coordinates)) {
        return this.isWithinGeofencedArea(userLat, userLng, incentive.coordinates.geofence);
      }

      // Fallback to legacy coordinate system
      if (incentive.coordinates && isLegacyCoordinates(incentive.coordinates)) {
        return incentive.coordinates.some((coord: any) => {
          const distance = this.calculateDistance(userLat, userLng, coord.lat, coord.lng);
          return distance <= radiusKm;
        });
      }

      return false;
    });
  }
}
