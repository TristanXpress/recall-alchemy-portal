
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Delete, MapPin, Navigation } from "lucide-react";
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

  const openGeofenceMap = (geofence: { coordinates: { lat: number; lng: number }[] }) => {
    // Open map centered on the geofence area
    const center = geofence.coordinates[Math.floor(geofence.coordinates.length / 2)];
    const url = `https://www.google.com/maps/search/?api=1&query=${center.lat},${center.lng}`;
    window.open(url, '_blank');
  };

  const openInGoogleMaps = (coordinates: { lat: number; lng: number }) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`;
    window.open(url, '_blank');
  };

  if (incentives.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <p className="text-muted-foreground">No geofenced dynamic incentives created yet.</p>
          <p className="text-sm text-muted-foreground">Click "Create Dynamic Incentive" to get started with geofencing.</p>
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
              {incentive.geofence && (
                <Badge variant="default" className="bg-green-600">
                  🗺️ Geofenced Area
                </Badge>
              )}
              {/* Fallback for old point-based coordinates */}
              {!incentive.geofence && incentive.coordinates && (
                <Badge variant="secondary">
                  📍 {incentive.coordinates.length} Points
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">{incentive.description}</p>
            
            {incentive.location && (
              <div className="flex items-center gap-1 text-sm">
                <MapPin className="h-4 w-4" />
                <span>Location: {incentive.location}</span>
              </div>
            )}

            {/* Display geofence information */}
            {incentive.geofence && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Navigation className="h-4 w-4" />
                  <span>Geofenced Boundary ({incentive.geofence.type})</span>
                </div>
                <div className="bg-muted p-3 rounded text-xs space-y-3">
                  <div className="bg-background p-2 rounded border space-y-1">
                    <div className="flex items-center justify-between">
                      <Badge variant="default" className="text-xs h-4 bg-green-600">
                        Polygon Geofence
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0 text-xs"
                        onClick={() => openGeofenceMap(incentive.geofence!)}
                        title="View Geofenced Area"
                      >
                        🗺️
                      </Button>
                    </div>
                    <div className="text-xs space-y-0.5">
                      <div>Boundary Points: {incentive.geofence.coordinates.length}</div>
                      <div>Coverage: Complete {incentive.location} area</div>
                      <div>Type: Area-based boundary detection</div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-6 text-xs"
                    onClick={() => openGeofenceMap(incentive.geofence!)}
                  >
                    View Geofenced Area on Map
                  </Button>
                </div>
              </div>
            )}

            {/* Fallback display for legacy point-based coordinates */}
            {!incentive.geofence && incentive.coordinates && incentive.coordinates.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Navigation className="h-4 w-4" />
                  <span>Legacy Points ({incentive.coordinates.length} locations):</span>
                </div>
                <div className="bg-muted p-3 rounded text-xs space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {incentive.coordinates.slice(0, 4).map((coord, index) => (
                      <div key={index} className="bg-background p-2 rounded border space-y-1">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs h-4">
                            Point {index + 1}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 text-xs"
                            onClick={() => openInGoogleMaps(coord)}
                            title="View on Google Maps"
                          >
                            📍
                          </Button>
                        </div>
                        <div className="text-xs space-y-0.5">
                          <div>Lat: {coord.lat.toFixed(4)}</div>
                          <div>Lng: {coord.lng.toFixed(4)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {incentive.coordinates.length > 4 && (
                    <div className="text-center text-muted-foreground">
                      +{incentive.coordinates.length - 4} more precise locations
                    </div>
                  )}
                </div>
              </div>
            )}

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

