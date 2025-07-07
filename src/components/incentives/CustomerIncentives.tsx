
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import IncentiveForm from "./IncentiveForm";
import IncentiveList from "./IncentiveList";
import { Incentive } from "@/types/incentive";
import { useIncentives } from "@/hooks/useIncentives";

const CustomerIncentives = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingIncentive, setEditingIncentive] = useState<Incentive | null>(null);
  
  const {
    incentives: allIncentives,
    isLoading,
    createIncentive,
    updateIncentive,
    deleteIncentive,
    isCreating,
    isUpdating,
    isDeleting,
  } = useIncentives();

  // Filter for customer incentives only
  const customerIncentives = allIncentives.filter(incentive => incentive.userType === "customer");

  const handleCreateIncentive = (incentive: Omit<Incentive, 'id'>) => {
    console.log("Creating customer incentive:", incentive);
    const customerIncentive = { ...incentive, userType: "customer" as const };
    createIncentive(customerIncentive);
    setShowForm(false);
  };

  const handleEditIncentive = (updatedIncentive: Incentive) => {
    console.log("Updating customer incentive:", updatedIncentive);
    updateIncentive(updatedIncentive);
    setEditingIncentive(null);
    setShowForm(false);
  };

  const handleDeleteIncentive = (id: string) => {
    console.log("Deleting customer incentive:", id);
    deleteIncentive(id);
  };

  const startEdit = (incentive: Incentive) => {
    setEditingIncentive(incentive);
    setShowForm(true);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading customer incentives...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Customer Incentives ({customerIncentives.length})</h3>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2" disabled={isCreating}>
          <Plus className="h-4 w-4" />
          {isCreating ? "Creating..." : "Create Incentive"}
        </Button>
      </div>

      {showForm && (
        <IncentiveForm
          incentive={editingIncentive}
          onSubmit={editingIncentive ? handleEditIncentive : handleCreateIncentive}
          onCancel={() => {
            setShowForm(false);
            setEditingIncentive(null);
          }}
          userType="customer"
          isLoading={isCreating || isUpdating}
        />
      )}

      <IncentiveList
        incentives={customerIncentives}
        onEdit={startEdit}
        onDelete={handleDeleteIncentive}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default CustomerIncentives;
