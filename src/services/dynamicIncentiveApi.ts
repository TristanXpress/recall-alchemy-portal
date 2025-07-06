
import { supabase } from "@/integrations/supabase/client";

export class DynamicIncentiveApiService {
  
  // Get all active dynamic incentives
  static async getAllActiveDynamicIncentives() {
    console.log("API: Fetching all active dynamic incentives");
    
    const now = new Date();
    const bufferedNow = new Date(now.getTime() - 60000); // 1 minute buffer
    
    const { data, error } = await supabase
      .from("dynamic_incentives")
      .select("*")
      .eq("is_active", true)
      .gte("end_date", bufferedNow.toISOString()) // Use buffered time for end date check
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
    
    const now = new Date();
    const bufferedNow = new Date(now.getTime() - 60000); // 1 minute buffer
    
    const { data, error } = await supabase
      .from("dynamic_incentives")
      .select("*")
      .eq("is_active", true)
      .eq("location", location)
      .gte("end_date", bufferedNow.toISOString()) // Use buffered time for end date check
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Dynamic Incentive API Error:", error);
      throw new Error(`Failed to fetch dynamic incentives by location: ${error.message}`);
    }

    return data;
  }

  // Get dynamic incentives by coordinates (within radius)
  static async getDynamicIncentivesByCoordinates(
    lat: number, 
    lng: number, 
    radiusKm: number = 5
  ) {
    console.log("API: Fetching dynamic incentives by coordinates", { lat, lng, radiusKm });
    
    // Note: This is a simplified approach. For production, you'd want to use PostGIS for proper geospatial queries
    const { data, error } = await supabase
      .from("dynamic_incentives")
      .select("*")
      .eq("is_active", true)
      .lte("start_date", new Date().toISOString())
      .gte("end_date", new Date().toISOString())
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Dynamic Incentive API Error:", error);
      throw new Error(`Failed to fetch dynamic incentives by coordinates: ${error.message}`);
    }

    // Filter by coordinates in JavaScript (for production, use database-level geospatial queries)
    const filteredData = data?.filter(incentive => {
      if (!incentive.coordinates || !Array.isArray(incentive.coordinates)) return false;
      
      return incentive.coordinates.some((coord: any) => {
        const distance = this.calculateDistance(lat, lng, coord.lat, coord.lng);
        return distance <= radiusKm;
      });
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

  // Helper: Check if coordinates are within dynamic incentive area
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

  // Helper: Get nearby dynamic incentives for mobile map view
  static async getNearbyDynamicIncentives(
    userLat: number,
    userLng: number,
    radiusKm: number = 10
  ) {
    console.log("API: Fetching nearby dynamic incentives", { userLat, userLng, radiusKm });
    
    const allIncentives = await this.getAllActiveDynamicIncentives();
    
    return allIncentives.filter(incentive => {
      if (!incentive.coordinates || !Array.isArray(incentive.coordinates)) return false;
      
      return incentive.coordinates.some((coord: any) => {
        const distance = this.calculateDistance(userLat, userLng, coord.lat, coord.lng);
        return distance <= radiusKm;
      });
    });
  }
}
