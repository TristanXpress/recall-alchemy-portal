import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { DynamicIncentive, PHILIPPINE_CITIES, PHILIPPINE_CITY_GEOFENCES } from "@/types/incentive";
import { DynamicIncentiveApiService } from "@/services/dynamicIncentiveApi";
import { getCurrentGMT8DateTime } from "@/utils/dateHelpers";

interface DynamicIncentiveFormProps {
  incentive?: DynamicIncentive | null;
  onSubmit: (incentive: Omit<DynamicIncentive, 'id'> | DynamicIncentive) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const DynamicIncentiveForm = ({ incentive, onSubmit, onCancel, isLoading }: DynamicIncentiveFormProps) => {
  const [formData, setFormData] = useState<Omit<DynamicIncentive, 'id'>>({
    title: '',
    description: '',
    amount: 0,
    type: 'fixed',
    startDate: getCurrentGMT8DateTime(),
    endDate: getCurrentGMT8DateTime(),
    location: '',
    isActive: true,
    conditions: [],
    userType: 'driver',
    geofence: {
      type: 'polygon',
      coordinates: []
    }
  });

  useEffect(() => {
    if (incentive) {
      setFormData(incentive);
    } else {
      // Reset to current GMT+8 time when creating new incentive
      const currentTime = getCurrentGMT8DateTime();
      setFormData(prev => ({
        ...prev,
        startDate: currentTime,
        endDate: currentTime
      }));
    }
  }, [incentive]);

  const handleLocationChange = (selectedLocation: string) => {
    const geofenceCoordinates = PHILIPPINE_CITY_GEOFENCES[selectedLocation];
    setFormData({
      ...formData,
      location: selectedLocation,
      geofence: geofenceCoordinates ? {
        type: 'polygon',
        coordinates: geofenceCoordinates
      } : {
        type: 'polygon',
        coordinates: []
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (incentive) {
      onSubmit({ ...formData, id: incentive.id } as DynamicIncentive);
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

  const openGeofenceMap = () => {
    if (formData.geofence?.coordinates?.length > 0) {
      const mapUrl = DynamicIncentiveApiService.generateGeofenceMapUrl(formData.geofence);
      if (mapUrl) {
        window.open(mapUrl, '_blank');
      }
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {incentive ? 'Edit' : 'Create'} Dynamic Location-Based Incentive (Geofenced)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Metro Manila Geofenced Bonus"
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
                placeholder="Describe the geofenced dynamic incentive..."
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
                <Label htmlFor="location">Geofenced Location</Label>
                <Select value={formData.location} onValueChange={handleLocationChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select city for geofencing" />
                  </SelectTrigger>
                  <SelectContent>
                    {PHILIPPINE_CITIES.map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.geofence && formData.geofence.coordinates.length > 0 && (
              <div className="space-y-3">
                <Label>Geofence Boundary</Label>
                <div className="bg-muted p-4 rounded-md space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Badge variant="default" className="mr-2">
                        Polygon Geofence
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        {formData.location} city boundary with {formData.geofence.coordinates.length} boundary points
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={openGeofenceMap}
                    >
                      View Geofence Area
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground bg-background p-3 rounded border">
                    <div className="font-medium mb-2">Geofence Details:</div>
                    <div>• Type: Polygon boundary</div>
                    <div>• Coverage: Complete {formData.location} city area</div>
                    <div>• Boundary Points: {formData.geofence.coordinates.length}</div>
                    <div>• Activation: When user enters the bounded area</div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date (GMT+8)</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date (GMT+8)</Label>
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
                {isLoading ? 'Processing...' : (incentive ? 'Update' : 'Create')} Geofenced Incentive
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

export default DynamicIncentiveForm;
