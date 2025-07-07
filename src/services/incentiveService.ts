
import { supabase } from "@/integrations/supabase/client";
import { Incentive } from "@/types/incentive";
import { transformDbToIncentive, transformIncentiveToDb, transformIncentiveForUpdate } from "@/utils/incentiveTransformers";

export class IncentiveService {
  static async fetchIncentives(): Promise<Incentive[]> {
    console.log("Fetching incentives...");
    const { data, error } = await supabase
      .from("incentives")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching incentives:", error);
      throw error;
    }

    console.log("Fetched incentives:", data);
    return data?.map(transformDbToIncentive) || [];
  }

  static async createIncentive(incentive: Omit<Incentive, "id">): Promise<Incentive> {
    console.log("Creating incentive:", incentive);

    const { data, error } = await supabase
      .from("incentives")
      .insert([{
        ...transformIncentiveToDb(incentive),
        user_type: incentive.userType || "driver", // Ensure user_type is set
      }])
      .select()
      .single();

    if (error) {
      console.error("Error creating incentive:", error);
      throw error;
    }

    console.log("Created incentive:", data);
    return transformDbToIncentive(data);
  }

  static async updateIncentive(incentive: Incentive): Promise<Incentive> {
    console.log("Updating incentive:", incentive);
    const { data, error } = await supabase
      .from("incentives")
      .update(transformIncentiveForUpdate(incentive))
      .eq("id", incentive.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating incentive:", error);
      throw error;
    }

    console.log("Updated incentive:", data);
    return transformDbToIncentive(data);
  }

  static async deleteIncentive(id: string): Promise<void> {
    console.log("Deleting incentive:", id);
    const { error } = await supabase.from("incentives").delete().eq("id", id);

    if (error) {
      console.error("Error deleting incentive:", error);
      throw error;
    }

    console.log("Deleted incentive:", id);
  }

  static async fetchIncentivesByLocation(location?: string, userType?: "customer" | "driver"): Promise<any[]> {
    console.log("Fetching incentives by location:", { location, userType });
    
    const { data, error } = await supabase.rpc("get_incentives_by_location", {
      p_location: location,
      p_user_type: userType,
    });

    if (error) {
      console.error("Error fetching incentives by location:", error);
      throw error;
    }

    console.log("Fetched incentives by location:", data);
    
    return data?.map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      amount: item.amount,
      type: item.type,
      startDate: item.start_date,
      endDate: item.end_date,
      location: item.location,
      conditions: item.conditions || [],
      userType: item.user_type,
    })) || [];
  }
}
