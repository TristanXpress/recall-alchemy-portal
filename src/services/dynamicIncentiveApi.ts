
import { supabase } from "@/integrations/supabase/client";
import { GeofencingUtils } from "@/utils/geofencing";
import { DynamicIncentiveHelpers } from "@/utils/dynamicIncentiveHelpers";
import { DynamicIncentiveQueries } from "./dynamicIncentiveQueries";

// Type guard to check if coordinates contain geofence data
const hasGeofence = (coordinates: any): coordinates is { geofence: { type: 'polygon' | 'circle'; coordinates: { lat: number; lng: number }[]; radius?: number } } => {
  return coordinates && 
         typeof coordinates === 'object' && 
         coordinates.geofence && 
         typeof coordinates.geofence === 'object' &&
         coordinates.geofence.type &&
         Array.isArray(coordinates.geofence.coordinates);
};

export class DynamicIncentiveApiService {
  
  // Re-export query methods
  static getAllActiveDynamicIncentives = DynamicIncentiveQueries.getAllActiveDynamicIncentives;
  static getDynamicIncentivesByCities = DynamicIncentiveQueries.getDynamicIncentivesByCities;
  static getDynamicIncentivesByLocation = DynamicIncentiveQueries.getDynamicIncentivesByLocation;
  static subscribeToDynamicIncentiveUpdates = DynamicIncentiveQueries.subscribeToDynamicIncentiveUpdates;

  // Get dynamic incentives by coordinates with geofencing support
  static async getDynamicIncentivesByCoordinates(
    lat: number, 
    lng: number, 
    radiusKm: number = 5
  ) {
    console.log("API: Fetching dynamic incentives by coordinates with geofencing", { lat, lng, radiusKm });
    
    const data = await this.getAllActiveDynamicIncentives();

    // Filter by geofencing only
    const filteredData = data?.filter(incentive => {
      // Check if the incentive has geofence data
      if (incentive.coordinates && hasGeofence(incentive.coordinates)) {
        const geofence = incentive.coordinates.geofence;
        
        if (geofence.type === 'polygon') {
          return GeofencingUtils.isPointInPolygon(lat, lng, geofence.coordinates);
        } else if (geofence.type === 'circle') {
          const center = geofence.coordinates[0];
          const radius = geofence.radius || radiusKm;
          const distance = GeofencingUtils.calculateDistance(lat, lng, center.lat, center.lng);
          return distance <= radius;
        }
      }

      return false;
    });

    return filteredData || [];
  }

  // Get nearby geofenced dynamic incentives for mobile map view
  static async getNearbyDynamicIncentives(
    userLat: number,
    userLng: number,
    radiusKm: number = 10
  ) {
    console.log("API: Fetching nearby geofenced dynamic incentives", { userLat, userLng, radiusKm });
    
    const allIncentives = await this.getAllActiveDynamicIncentives();
    
    return allIncentives.filter(incentive => {
      // Check geofenced areas only
      if (incentive.coordinates && hasGeofence(incentive.coordinates)) {
        return GeofencingUtils.isWithinGeofencedArea(userLat, userLng, incentive.coordinates.geofence);
      }

      return false;
    });
  }

  // Re-export helper methods
  static calculateDynamicIncentiveValue = DynamicIncentiveHelpers.calculateDynamicIncentiveValue;
  static formatCurrency = DynamicIncentiveHelpers.formatCurrency;
  static isWithinGeofencedArea = GeofencingUtils.isWithinGeofencedArea;
  static calculateDistance = GeofencingUtils.calculateDistance;
  static isPointInPolygon = GeofencingUtils.isPointInPolygon;
}
