
import { supabase } from "@/integrations/supabase/client";

// API endpoints for mobile apps to consume
export class IncentiveApiService {
  
  // Get all active incentives for a specific user type and location
  static async getIncentivesByLocation(params: {
    userType: "customer" | "driver";
    location?: string;
  }) {
    console.log("API: Fetching incentives by location", params);
    
    const { data, error } = await supabase.rpc("get_incentives_by_location", {
      p_location: params.location || null,
      p_user_type: params.userType,
    });

    if (error) {
      console.error("API Error:", error);
      throw new Error(`Failed to fetch incentives: ${error.message}`);
    }

    return data;
  }

  // Get dynamic incentives for specific cities
  static async getDynamicIncentivesByCities(cities: string[]) {
    console.log("API: Fetching dynamic incentives by cities", cities);
    
    const { data, error } = await supabase.rpc("get_dynamic_incentives_by_cities", {
      p_cities: cities,
    });

    if (error) {
      console.error("API Error:", error);
      throw new Error(`Failed to fetch dynamic incentives: ${error.message}`);
    }

    return data;
  }

  // Get all active incentives (no strict date filtering)
  static async getAllActiveIncentives() {
    console.log("API: Fetching all active incentives");
    
    const { data, error } = await supabase
      .from("incentives")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("API Error:", error);
      throw new Error(`Failed to fetch incentives: ${error.message}`);
    }

    return data;
  }

  // Get all active dynamic incentives (no strict date filtering)
  static async getAllActiveDynamicIncentives() {
    console.log("API: Fetching all active dynamic incentives");
    
    const { data, error } = await supabase
      .from("dynamic_incentives")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("API Error:", error);
      throw new Error(`Failed to fetch dynamic incentives: ${error.message}`);
    }

    return data;
  }

  // Real-time subscription for incentive updates
  static subscribeToIncentiveUpdates(
    callback: (payload: any) => void,
    userType?: "customer" | "driver"
  ) {
    console.log("API: Setting up real-time subscription for incentives");
    
    const channel = supabase
      .channel("incentive-updates")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all changes (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "incentives",
          filter: userType ? `user_type=eq.${userType}` : undefined,
        },
        callback
      )
      .subscribe();

    return channel;
  }

  // Real-time subscription for dynamic incentive updates
  static subscribeToDynamicIncentiveUpdates(callback: (payload: any) => void) {
    console.log("API: Setting up real-time subscription for dynamic incentives");
    
    const channel = supabase
      .channel("dynamic-incentive-updates")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all changes (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "dynamic_incentives",
        },
        callback
      )
      .subscribe();

    return channel;
  }
}

// Helper functions for mobile app integration
export const MobileAppHelpers = {
  // Format currency for Philippine Peso
  formatCurrency: (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  },

  // Check if incentive is currently active (more lenient check)
  isIncentiveActive: (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
  },

  // Calculate incentive value based on type
  calculateIncentiveValue: (
    baseAmount: number,
    incentiveAmount: number,
    incentiveType: "percentage" | "fixed"
  ) => {
    if (incentiveType === "percentage") {
      return (baseAmount * incentiveAmount) / 100;
    }
    return incentiveAmount;
  },

  // Filter incentives by location match
  filterByLocation: (incentives: any[], userLocation: string) => {
    return incentives.filter(
      (incentive) =>
        !incentive.location || 
        incentive.location.toLowerCase() === userLocation.toLowerCase()
    );
  },

  // Filter dynamic incentives by cities
  filterByCities: (dynamicIncentives: any[], userCities: string[]) => {
    return dynamicIncentives.filter((incentive) =>
      incentive.target_cities.some((city: string) =>
        userCities.some((userCity) =>
          city.toLowerCase() === userCity.toLowerCase()
        )
      )
    );
  },
};
