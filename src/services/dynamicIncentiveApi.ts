
import { supabase } from "@/integrations/supabase/client";
import { GeofencingUtils } from "@/utils/geofencing";
import { DynamicIncentiveHelpers } from "@/utils/dynamicIncentiveHelpers";
import { DynamicIncentiveQueries } from "./dynamicIncentiveQueries";

// Type guard to check if coordinates contain geofence data
const hasGeofence = (coordinates: any): coordinates is { geofence: { type: 'polygon'; coordinates: { lat: number; lng: number }[] } } => {
  return coordinates && 
         typeof coordinates === 'object' && 
         coordinates.geofence && 
         typeof coordinates.geofence === 'object' &&
         coordinates.geofence.type === 'polygon' &&
         Array.isArray(coordinates.geofence.coordinates) &&
         coordinates.geofence.coordinates.length > 0;
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
        return GeofencingUtils.isPointInPolygon(lat, lng, geofence.coordinates);
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

  // Get geofence bounds for map display
  static getGeofenceBounds(geofence: { coordinates: { lat: number; lng: number }[] }) {
    if (!geofence.coordinates || geofence.coordinates.length === 0) {
      return null;
    }

    const lats = geofence.coordinates.map(coord => coord.lat);
    const lngs = geofence.coordinates.map(coord => coord.lng);

    return {
      north: Math.max(...lats),
      south: Math.min(...lats),
      east: Math.max(...lngs),
      west: Math.min(...lngs),
      center: {
        lat: (Math.max(...lats) + Math.min(...lats)) / 2,
        lng: (Math.max(...lngs) + Math.min(...lngs)) / 2
      }
    };
  }

  // Generate Google Maps URL with polygon overlay
  static generateGeofenceMapUrl(geofence: { coordinates: { lat: number; lng: number }[] }) {
    const bounds = this.getGeofenceBounds(geofence);
    if (!bounds) {
      return null;
    }

    // Create a URL that shows the center of the geofenced area
    return `https://www.google.com/maps/search/?api=1&query=${bounds.center.lat},${bounds.center.lng}&zoom=12`;
  }

  // Re-export helper methods
  static calculateDynamicIncentiveValue = DynamicIncentiveHelpers.calculateDynamicIncentiveValue;
  static formatCurrency = DynamicIncentiveHelpers.formatCurrency;
  static isWithinGeofencedArea = GeofencingUtils.isWithinGeofencedArea;
  static calculateDistance = GeofencingUtils.calculateDistance;
  static isPointInPolygon = GeofencingUtils.isPointInPolygon;
}
