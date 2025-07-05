import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Delete, MapPin } from "lucide-react";
import { DynamicIncentive } from "@/types/incentive";

interface DynamicIncentiveListProps {
  incentives: DynamicIncentive[];
  onEdit: (incentive: DynamicIncentive) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

const DynamicIncentiveList = ({ incentives, onEdit, onDelete, isDeleting }: DynamicIncentiveListProps) => {
  const formatAmount = (amount: number, type: string) => {
    if (type === 'percentage') {
      return `${amount}%`;
    }
    return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (incentives.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <p className="text-muted-foreground">No dynamic incentives created yet.</p>
          <p className="text-sm text-muted-foreground">Click "Create Dynamic Incentive" to get started.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {incentives.map((incentive) => (
        <Card key={incentive.id} className={`${!incentive.isActive ? 'opacity-60' : ''}`}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg">{incentive.title}</CardTitle>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(incentive)}
                  className="h-8 w-8 p-0"
                  disabled={isDeleting}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDelete(incentive.id)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  disabled={isDeleting}
                >
                  <Delete className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={incentive.isActive ? "default" : "secondary"}>
                {incentive.isActive ? "Active" : "Inactive"}
              </Badge>
              <Badge variant="outline">
                {formatAmount(incentive.amount, incentive.type)}
              </Badge>
              <Badge variant="secondary">
                {incentive.targetCities.length} Cities
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">{incentive.description}</p>
            
            {incentive.location && (
              <div className="flex items-center gap-1 text-sm">
                <MapPin className="h-4 w-4" />
                <span>Primary: {incentive.location}</span>
              </div>
            )}

            <div className="space-y-2">
              <span className="text-xs font-medium">Target Cities:</span>
              <div className="flex flex-wrap gap-1">
                {incentive.targetCities.slice(0, 6).map((city) => (
                  <Badge key={city} variant="outline" className="text-xs">
                    {city}
                  </Badge>
                ))}
                {incentive.targetCities.length > 6 && (
                  <Badge variant="outline" className="text-xs">
                    +{incentive.targetCities.length - 6} more
                  </Badge>
                )}
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              <div>Start: {formatDate(incentive.startDate)}</div>
              <div>End: {formatDate(incentive.endDate)}</div>
            </div>

            {incentive.conditions && incentive.conditions.length > 0 && (
              <div className="space-y-1">
                <span className="text-xs font-medium">Conditions:</span>
                {incentive.conditions.map((condition, index) => (
                  <div key={index} className="text-xs text-muted-foreground bg-muted p-2 rounded">
                    {condition}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DynamicIncentiveList;
