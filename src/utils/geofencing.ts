
// Geofencing utility functions
export class GeofencingUtils {
  // Point-in-polygon algorithm for geofencing
  static isPointInPolygon(lat: number, lng: number, polygon: { lat: number; lng: number }[]): boolean {
    let inside = false;
    
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].lat, yi = polygon[i].lng;
      const xj = polygon[j].lat, yj = polygon[j].lng;
      
      if (((yi > lng) !== (yj > lng)) && (lat < (xj - xi) * (lng - yi) / (yj - yi) + xi)) {
        inside = !inside;
      }
    }
    
    return inside;
  }

  // Calculate distance between two coordinates (Haversine formula)
  static calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Check if coordinates are within geofenced area
  static isWithinGeofencedArea(
    userLat: number,
    userLng: number,
    geofence: { type: 'polygon' | 'circle'; coordinates: { lat: number; lng: number }[]; radius?: number }
  ): boolean {
    if (geofence.type === 'polygon') {
      return this.isPointInPolygon(userLat, userLng, geofence.coordinates);
    } else if (geofence.type === 'circle') {
      const center = geofence.coordinates[0];
      const distance = this.calculateDistance(userLat, userLng, center.lat, center.lng);
      return distance <= (geofence.radius || 1);
    }
    return false;
  }
}
