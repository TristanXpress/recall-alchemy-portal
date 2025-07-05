
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import IncentiveForm from "./IncentiveForm";
import IncentiveList from "./IncentiveList";
import { Incentive } from "@/types/incentive";

const CustomerIncentives = () => {
  const [incentives, setIncentives] = useState<Incentive[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingIncentive, setEditingIncentive] = useState<Incentive | null>(null);

  const handleCreateIncentive = (incentive: Omit<Incentive, 'id'>) => {
    const newIncentive: Incentive = {
      ...incentive,
      id: Date.now().toString(),
    };
    setIncentives([...incentives, newIncentive]);
    setShowForm(false);
  };

  const handleEditIncentive = (updatedIncentive: Incentive) => {
    setIncentives(incentives.map(inc => 
      inc.id === updatedIncentive.id ? updatedIncentive : inc
    ));
    setEditingIncentive(null);
    setShowForm(false);
  };

  const handleDeleteIncentive = (id: string) => {
    setIncentives(incentives.filter(inc => inc.id !== id));
  };

  const startEdit = (incentive: Incentive) => {
    setEditingIncentive(incentive);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Customer Incentives ({incentives.length})</h3>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Incentive
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
        />
      )}

      <IncentiveList
        incentives={incentives}
        onEdit={startEdit}
        onDelete={handleDeleteIncentive}
      />
    </div>
  );
};

export default CustomerIncentives;
