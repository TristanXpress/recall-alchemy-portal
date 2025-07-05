
import { supabase } from "@/integrations/supabase/client";

export class CustomerIncentiveApiService {
  
  // Get all active customer incentives
  static async getCustomerIncentives(location?: string) {
    console.log("API: Fetching customer incentives", { location });
    
    const { data, error } = await supabase.rpc("get_incentives_by_location", {
      p_location: location || null,
      p_user_type: "customer",
    });

    if (error) {
      console.error("Customer API Error:", error);
      throw new Error(`Failed to fetch customer incentives: ${error.message}`);
    }

    return data;
  }

  // Get customer incentives by specific location
  static async getCustomerIncentivesByLocation(location: string) {
    console.log("API: Fetching customer incentives by location", { location });
    
    return this.getCustomerIncentives(location);
  }

  // Get all active customer incentives (no location filter)
  static async getAllActiveCustomerIncentives() {
    console.log("API: Fetching all active customer incentives");
    
    const { data, error } = await supabase
      .from("incentives")
      .select("*")
      .eq("is_active", true)
      .eq("user_type", "customer")
      .lte("start_date", new Date().toISOString())
      .gte("end_date", new Date().toISOString())
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Customer API Error:", error);
      throw new Error(`Failed to fetch customer incentives: ${error.message}`);
    }

    return data;
  }

  // Real-time subscription for customer incentive updates
  static subscribeToCustomerIncentiveUpdates(callback: (payload: any) => void) {
    console.log("API: Setting up real-time subscription for customer incentives");
    
    const channel = supabase
      .channel("customer-incentive-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "incentives",
          filter: "user_type=eq.customer",
        },
        callback
      )
      .subscribe();

    return channel;
  }

  // Helper: Calculate customer incentive value
  static calculateCustomerIncentiveValue(
    orderAmount: number,
    incentiveAmount: number,
    incentiveType: "percentage" | "fixed"
  ) {
    if (incentiveType === "percentage") {
      return (orderAmount * incentiveAmount) / 100;
    }
    return incentiveAmount;
  }

  // Helper: Check if customer is eligible for incentive
  static isCustomerEligible(
    customerLocation: string,
    incentiveLocation?: string
  ) {
    if (!incentiveLocation) return true; // No location restriction
    return customerLocation.toLowerCase() === incentiveLocation.toLowerCase();
  }

  // Helper: Format currency for display
  static formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  }
}
