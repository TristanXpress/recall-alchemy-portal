import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Incentive, PHILIPPINE_CITIES } from "@/types/incentive";

interface IncentiveFormProps {
  incentive?: Incentive | null;
  onSubmit: (incentive: Omit<Incentive, 'id'> | Incentive) => void;
  onCancel: () => void;
  userType: 'customer' | 'driver';
  isLoading?: boolean;
}

const IncentiveForm = ({ incentive, onSubmit, onCancel, userType, isLoading = false }: IncentiveFormProps) => {
  const [formData, setFormData] = useState<Omit<Incentive, 'id'>>({
    title: '',
    description: '',
    amount: 0,
    type: 'fixed',
    startDate: '',
    endDate: '',
    location: '',
    isActive: true,
    conditions: []
  });

  useEffect(() => {
    if (incentive) {
      setFormData(incentive);
    }
  }, [incentive]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (incentive) {
      onSubmit({ ...formData, id: incentive.id } as Incentive);
    } else {
      onSubmit(formData);
    }
  };

  const addCondition = () => {
    setFormData({
      ...formData,
      conditions: [...(formData.conditions || []), '']
    });
  };

  const updateCondition = (index: number, value: string) => {
    const newConditions = [...(formData.conditions || [])];
    newConditions[index] = value;
    setFormData({
      ...formData,
      conditions: newConditions
    });
  };

  const removeCondition = (index: number) => {
    const newConditions = formData.conditions?.filter((_, i) => i !== index) || [];
    setFormData({
      ...formData,
      conditions: newConditions
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {incentive ? 'Edit' : 'Create'} {userType.charAt(0).toUpperCase() + userType.slice(1)} Incentive
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Welcome Bonus"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₱)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the incentive..."
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value: 'percentage' | 'fixed') => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Amount (₱)</SelectItem>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                  <SelectContent>
                    {PHILIPPINE_CITIES.map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Conditions</Label>
                <Button type="button" variant="outline" size="sm" onClick={addCondition}>
                  Add Condition
                </Button>
              </div>
              {formData.conditions?.map((condition, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={condition}
                    onChange={(e) => updateCondition(index, e.target.value)}
                    placeholder="Enter condition..."
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeCondition(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? 'Processing...' : (incentive ? 'Update' : 'Create')} Incentive
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1" disabled={isLoading}>
                Cancel
              </Button>
            </div>
          </form>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default IncentiveForm;
