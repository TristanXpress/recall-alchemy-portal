
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Incentive } from "@/types/incentive";
import { useToast } from "@/hooks/use-toast";

// Transform database row to frontend type
const transformDbToIncentive = (dbRow: any): Incentive => ({
  id: dbRow.id,
  title: dbRow.title,
  description: dbRow.description,
  amount: dbRow.amount,
  type: dbRow.type,
  startDate: dbRow.start_date,
  endDate: dbRow.end_date,
  location: dbRow.location,
  isActive: dbRow.is_active,
  conditions: dbRow.conditions || [],
  userType: dbRow.user_type,
});

export const useIncentives = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: incentives = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["incentives"],
    queryFn: async () => {
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
    },
  });

  const createIncentive = useMutation({
    mutationFn: async (incentive: Omit<Incentive, "id">) => {
      console.log("Creating incentive:", incentive);
      const { data, error } = await supabase
        .from("incentives")
        .insert([
          {
            title: incentive.title,
            description: incentive.description,
            amount: incentive.amount,
            type: incentive.type,
            start_date: incentive.startDate,
            end_date: incentive.endDate,
            location: incentive.location,
            is_active: incentive.isActive,
            conditions: incentive.conditions,
            user_type: "driver", // Default to driver, can be updated
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating incentive:", error);
        throw error;
      }

      console.log("Created incentive:", data);
      return transformDbToIncentive(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incentives"] });
      toast({
        title: "Success",
        description: "Incentive created successfully",
      });
    },
    onError: (error) => {
      console.error("Create incentive error:", error);
      toast({
        title: "Error",
        description: "Failed to create incentive",
        variant: "destructive",
      });
    },
  });

  const updateIncentive = useMutation({
    mutationFn: async (incentive: Incentive) => {
      console.log("Updating incentive:", incentive);
      const { data, error } = await supabase
        .from("incentives")
        .update({
          title: incentive.title,
          description: incentive.description,
          amount: incentive.amount,
          type: incentive.type,
          start_date: incentive.startDate,
          end_date: incentive.endDate,
          location: incentive.location,
          is_active: incentive.isActive,
          conditions: incentive.conditions,
          updated_at: new Date().toISOString(),
        })
        .eq("id", incentive.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating incentive:", error);
        throw error;
      }

      console.log("Updated incentive:", data);
      return transformDbToIncentive(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incentives"] });
      toast({
        title: "Success",
        description: "Incentive updated successfully",
      });
    },
    onError: (error) => {
      console.error("Update incentive error:", error);
      toast({
        title: "Error",
        description: "Failed to update incentive",
        variant: "destructive",
      });
    },
  });

  const deleteIncentive = useMutation({
    mutationFn: async (id: string) => {
      console.log("Deleting incentive:", id);
      const { error } = await supabase.from("incentives").delete().eq("id", id);

      if (error) {
        console.error("Error deleting incentive:", error);
        throw error;
      }

      console.log("Deleted incentive:", id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incentives"] });
      toast({
        title: "Success",
        description: "Incentive deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Delete incentive error:", error);
      toast({
        title: "Error",
        description: "Failed to delete incentive",
        variant: "destructive",
      });
    },
  });

  return {
    incentives,
    isLoading,
    error,
    createIncentive: createIncentive.mutate,
    updateIncentive: updateIncentive.mutate,
    deleteIncentive: deleteIncentive.mutate,
    isCreating: createIncentive.isPending,
    isUpdating: updateIncentive.isPending,
    isDeleting: deleteIncentive.isPending,
  };
};

// Hook for fetching incentives by location and user type (for mobile apps)
export const useIncentivesByLocation = (location?: string, userType?: "customer" | "driver") => {
  return useQuery({
    queryKey: ["incentives", "location", location, userType],
    queryFn: async () => {
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
    },
    enabled: !!userType, // Only run query if userType is provided
  });
};
