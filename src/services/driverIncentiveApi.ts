
import { supabase } from "@/integrations/supabase/client";

export class DriverIncentiveApiService {
  
  // Get all active driver incentives
  static async getDriverIncentives(location?: string) {
    console.log("API: Fetching driver incentives", { location });
    
    const { data, error } = await supabase.rpc("get_incentives_by_location", {
      p_location: location || null,
      p_user_type: "driver",
    });

    if (error) {
      console.error("Driver API Error:", error);
      throw new Error(`Failed to fetch driver incentives: ${error.message}`);
    }

    return data;
  }

  // Get driver incentives by specific location
  static async getDriverIncentivesByLocation(location: string) {
    console.log("API: Fetching driver incentives by location", { location });
    
    return this.getDriverIncentives(location);
  }

  // Get all driver incentives (no date filtering)
  static async getAllActiveDriverIncentives() {
    console.log("API: Fetching all driver incentives");
    
    const { data, error } = await supabase
      .from("incentives")
      .select("*")
      .eq("is_active", true)
      .eq("user_type", "driver")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Driver API Error:", error);
      throw new Error(`Failed to fetch driver incentives: ${error.message}`);
    }

    return data;
  }

  // Get driver incentives by multiple locations (for drivers operating in multiple areas)
  static async getDriverIncentivesByMultipleLocations(locations: string[]) {
    console.log("API: Fetching driver incentives by multiple locations", { locations });
    
    const { data, error } = await supabase
      .from("incentives")
      .select("*")
      .eq("is_active", true)
      .eq("user_type", "driver")
      .in("location", locations)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Driver API Error:", error);
      throw new Error(`Failed to fetch driver incentives by locations: ${error.message}`);
    }

    return data;
  }

  // Real-time subscription for driver incentive updates
  static subscribeToDriverIncentiveUpdates(callback: (payload: any) => void) {
    console.log("API: Setting up real-time subscription for driver incentives");
    
    const channel = supabase
      .channel("driver-incentive-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "incentives",
          filter: "user_type=eq.driver",
        },
        callback
      )
      .subscribe();

    return channel;
  }

  // Helper: Calculate driver incentive value
  static calculateDriverIncentiveValue(
    tripAmount: number,
    incentiveAmount: number,
    incentiveType: "percentage" | "fixed"
  ) {
    if (incentiveType === "percentage") {
      return (tripAmount * incentiveAmount) / 100;
    }
    return incentiveAmount;
  }

  // Helper: Check if driver is eligible for incentive
  static isDriverEligible(
    driverLocation: string,
    incentiveLocation?: string
  ) {
    if (!incentiveLocation) return true; // No location restriction
    return driverLocation.toLowerCase() === incentiveLocation.toLowerCase();
  }

  // Helper: Format currency for display
  static formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  }

  // Helper: Get incentives for driver's current shift (no strict date filtering)
  static async getDriverShiftIncentives(driverLocation: string, shiftStartTime: string) {
    console.log("API: Fetching driver shift incentives", { driverLocation, shiftStartTime });
    
    const { data, error } = await supabase
      .from("incentives")
      .select("*")
      .eq("is_active", true)
      .eq("user_type", "driver")
      .or(`location.is.null,location.eq.${driverLocation}`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Driver Shift API Error:", error);
      throw new Error(`Failed to fetch driver shift incentives: ${error.message}`);
    }

    return data;
  }
}
