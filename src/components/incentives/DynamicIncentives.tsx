
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DynamicIncentiveForm from "./DynamicIncentiveForm";
import DynamicIncentiveList from "./DynamicIncentiveList";
import { DynamicIncentive } from "@/types/incentive";
import { useDynamicIncentives } from "@/hooks/useDynamicIncentives";

const DynamicIncentives = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingIncentive, setEditingIncentive] = useState<DynamicIncentive | null>(null);
  
  const {
    dynamicIncentives,
    isLoading,
    createDynamicIncentive,
    updateDynamicIncentive,
    deleteDynamicIncentive,
    isCreating,
    isUpdating,
    isDeleting,
  } = useDynamicIncentives();

  const handleCreateIncentive = (incentive: Omit<DynamicIncentive, 'id'>) => {
    console.log("Creating dynamic incentive:", incentive);
    createDynamicIncentive(incentive);
    setShowForm(false);
  };

  const handleEditIncentive = (updatedIncentive: DynamicIncentive) => {
    console.log("Updating dynamic incentive:", updatedIncentive);
    updateDynamicIncentive(updatedIncentive);
    setEditingIncentive(null);
    setShowForm(false);
  };

  const handleDeleteIncentive = (id: string) => {
    console.log("Deleting dynamic incentive:", id);
    deleteDynamicIncentive(id);
  };

  const startEdit = (incentive: DynamicIncentive) => {
    setEditingIncentive(incentive);
    setShowForm(true);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading dynamic incentives...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Dynamic Location-Based Incentives ({dynamicIncentives.length})</h3>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2" disabled={isCreating}>
          <Plus className="h-4 w-4" />
          {isCreating ? "Creating..." : "Create Dynamic Incentive"}
        </Button>
      </div>

      {showForm && (
        <DynamicIncentiveForm
          incentive={editingIncentive}
          onSubmit={editingIncentive ? handleEditIncentive : handleCreateIncentive}
          onCancel={() => {
            setShowForm(false);
            setEditingIncentive(null);
          }}
          isLoading={isCreating || isUpdating}
        />
      )}

      <DynamicIncentiveList
        incentives={dynamicIncentives}
        onEdit={startEdit}
        onDelete={handleDeleteIncentive}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default DynamicIncentives;
