
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DynamicIncentiveForm from "./DynamicIncentiveForm";
import DynamicIncentiveList from "./DynamicIncentiveList";
import { DynamicIncentive } from "@/types/incentive";

const DynamicIncentives = () => {
  const [incentives, setIncentives] = useState<DynamicIncentive[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingIncentive, setEditingIncentive] = useState<DynamicIncentive | null>(null);

  const handleCreateIncentive = (incentive: Omit<DynamicIncentive, 'id'>) => {
    const newIncentive: DynamicIncentive = {
      ...incentive,
      id: Date.now().toString(),
    };
    setIncentives([...incentives, newIncentive]);
    setShowForm(false);
  };

  const handleEditIncentive = (updatedIncentive: DynamicIncentive) => {
    setIncentives(incentives.map(inc => 
      inc.id === updatedIncentive.id ? updatedIncentive : inc
    ));
    setEditingIncentive(null);
    setShowForm(false);
  };

  const handleDeleteIncentive = (id: string) => {
    setIncentives(incentives.filter(inc => inc.id !== id));
  };

  const startEdit = (incentive: DynamicIncentive) => {
    setEditingIncentive(incentive);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Dynamic Location-Based Incentives ({incentives.length})</h3>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Dynamic Incentive
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
        />
      )}

      <DynamicIncentiveList
        incentives={incentives}
        onEdit={startEdit}
        onDelete={handleDeleteIncentive}
      />
    </div>
  );
};

export default DynamicIncentives;
