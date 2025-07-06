
import { supabase } from "@/integrations/supabase/client";

// Database query functions for dynamic incentives
export class DynamicIncentiveQueries {
  
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
}
