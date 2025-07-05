
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Incentive } from "@/types/incentive";
import { useToast } from "@/hooks/use-toast";
import { IncentiveService } from "@/services/incentiveService";

export const useIncentives = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: incentives = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["incentives"],
    queryFn: IncentiveService.fetchIncentives,
  });

  const createIncentive = useMutation({
    mutationFn: IncentiveService.createIncentive,
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
    mutationFn: IncentiveService.updateIncentive,
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
    mutationFn: IncentiveService.deleteIncentive,
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
    queryFn: () => IncentiveService.fetchIncentivesByLocation(location, userType),
    enabled: !!userType, // Only run query if userType is provided
  });
};
