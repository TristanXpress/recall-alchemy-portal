
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DynamicIncentive } from "@/types/incentive";
import { useToast } from "@/hooks/use-toast";

export const useDynamicIncentives = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: dynamicIncentives = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dynamic-incentives"],
    queryFn: async () => {
      console.log("Fetching dynamic incentives...");
      const { data, error } = await supabase
        .from("dynamic_incentives")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching dynamic incentives:", error);
        throw error;
      }

      console.log("Fetched dynamic incentives:", data);
      return data as DynamicIncentive[];
    },
  });

  const createDynamicIncentive = useMutation({
    mutationFn: async (incentive: Omit<DynamicIncentive, "id">) => {
      console.log("Creating dynamic incentive:", incentive);
      const { data, error } = await supabase
        .from("dynamic_incentives")
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
            target_cities: incentive.targetCities,
            coordinates: incentive.coordinates,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating dynamic incentive:", error);
        throw error;
      }

      console.log("Created dynamic incentive:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dynamic-incentives"] });
      toast({
        title: "Success",
        description: "Dynamic incentive created successfully",
      });
    },
    onError: (error) => {
      console.error("Create dynamic incentive error:", error);
      toast({
        title: "Error",
        description: "Failed to create dynamic incentive",
        variant: "destructive",
      });
    },
  });

  const updateDynamicIncentive = useMutation({
    mutationFn: async (incentive: DynamicIncentive) => {
      console.log("Updating dynamic incentive:", incentive);
      const { data, error } = await supabase
        .from("dynamic_incentives")
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
          target_cities: incentive.targetCities,
          coordinates: incentive.coordinates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", incentive.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating dynamic incentive:", error);
        throw error;
      }

      console.log("Updated dynamic incentive:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dynamic-incentives"] });
      toast({
        title: "Success",
        description: "Dynamic incentive updated successfully",
      });
    },
    onError: (error) => {
      console.error("Update dynamic incentive error:", error);
      toast({
        title: "Error",
        description: "Failed to update dynamic incentive",
        variant: "destructive",
      });
    },
  });

  const deleteDynamicIncentive = useMutation({
    mutationFn: async (id: string) => {
      console.log("Deleting dynamic incentive:", id);
      const { error } = await supabase
        .from("dynamic_incentives")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting dynamic incentive:", error);
        throw error;
      }

      console.log("Deleted dynamic incentive:", id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dynamic-incentives"] });
      toast({
        title: "Success",
        description: "Dynamic incentive deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Delete dynamic incentive error:", error);
      toast({
        title: "Error",
        description: "Failed to delete dynamic incentive",
        variant: "destructive",
      });
    },
  });

  return {
    dynamicIncentives,
    isLoading,
    error,
    createDynamicIncentive: createDynamicIncentive.mutate,
    updateDynamicIncentive: updateDynamicIncentive.mutate,
    deleteDynamicIncentive: deleteDynamicIncentive.mutate,
    isCreating: createDynamicIncentive.isPending,
    isUpdating: updateDynamicIncentive.isPending,
    isDeleting: deleteDynamicIncentive.isPending,
  };
};

// Hook for fetching dynamic incentives by cities (for mobile apps)
export const useDynamicIncentivesByCities = (cities?: string[]) => {
  return useQuery({
    queryKey: ["dynamic-incentives", "cities", cities],
    queryFn: async () => {
      console.log("Fetching dynamic incentives by cities:", cities);
      
      const { data, error } = await supabase.rpc("get_dynamic_incentives_by_cities", {
        p_cities: cities,
      });

      if (error) {
        console.error("Error fetching dynamic incentives by cities:", error);
        throw error;
      }

      console.log("Fetched dynamic incentives by cities:", data);
      return data;
    },
    enabled: !!cities && cities.length > 0, // Only run query if cities are provided
  });
};
