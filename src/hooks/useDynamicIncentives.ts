
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DynamicIncentive } from "@/types/incentive";
import { useToast } from "@/hooks/use-toast";

// Transform database row to frontend type
const transformDbToDynamicIncentive = (dbRow: any): DynamicIncentive => ({
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
  coordinates: dbRow.coordinates?.coordinates || dbRow.coordinates, // Legacy support
  geofence: dbRow.coordinates?.geofence || undefined, // New geofence support
  userType: 'driver' // Dynamic incentives are typically for drivers
});

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
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching dynamic incentives:", error);
        throw error;
      }

      console.log("Fetched dynamic incentives:", data);
      return data?.map(transformDbToDynamicIncentive) || [];
    },
  });

  const createDynamicIncentive = useMutation({
    mutationFn: async (incentive: Omit<DynamicIncentive, "id">) => {
      console.log("Creating dynamic incentive:", incentive);

      // Prepare coordinates data structure for database
      const coordinatesData = incentive.geofence ? {
        geofence: incentive.geofence,
        coordinates: incentive.coordinates || [] // Legacy support
      } : incentive.coordinates;

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
            coordinates: coordinatesData,
            target_cities: [], // Empty array to satisfy database schema
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating dynamic incentive:", error);
        throw error;
      }

      console.log("Created dynamic incentive:", data);
      return transformDbToDynamicIncentive(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dynamic-incentives"] });
      toast({
        title: "Success",
        description: "Geofenced dynamic incentive created successfully",
      });
    },
    onError: (error) => {
      console.error("Create dynamic incentive error:", error);
      toast({
        title: "Error",
        description: "Failed to create geofenced dynamic incentive",
        variant: "destructive",
      });
    },
  });

  const updateDynamicIncentive = useMutation({
    mutationFn: async (incentive: DynamicIncentive) => {
      console.log("Updating dynamic incentive:", incentive);
      
      // Prepare coordinates data structure for database
      const coordinatesData = incentive.geofence ? {
        geofence: incentive.geofence,
        coordinates: incentive.coordinates || [] // Legacy support
      } : incentive.coordinates;

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
          coordinates: coordinatesData,
          target_cities: [], // Empty array to satisfy database schema
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
      return transformDbToDynamicIncentive(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dynamic-incentives"] });
      toast({
        title: "Success",
        description: "Geofenced dynamic incentive updated successfully",
      });
    },
    onError: (error) => {
      console.error("Update dynamic incentive error:", error);
      toast({
        title: "Error",
        description: "Failed to update geofenced dynamic incentive",
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
        description: "Geofenced dynamic incentive deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Delete dynamic incentive error:", error);
      toast({
        title: "Error",
        description: "Failed to delete geofenced dynamic incentive",
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

// Hook for fetching dynamic incentives by location (for mobile apps)
export const useDynamicIncentivesByLocation = (location?: string) => {
  return useQuery({
    queryKey: ["dynamic-incentives", "location", location],
    queryFn: async () => {
      console.log("Fetching geofenced dynamic incentives by location:", location);
      
      let query = supabase
        .from("dynamic_incentives")
        .select("*")
        .eq("is_active", true);

      if (location) {
        query = query.eq("location", location);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching dynamic incentives by location:", error);
        throw error;
      }

      console.log("Fetched geofenced dynamic incentives by location:", data);
      return data?.map(transformDbToDynamicIncentive) || [];
    },
    enabled: !!location, // Only run query if location is provided
  });
};

