
// API Response Types for Mobile App Integration

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  error: string;
  code?: string;
  details?: any;
  timestamp: string;
}

// Incentive API Types
export interface IncentiveApiParams {
  userType: "customer" | "driver";
  location?: string;
  limit?: number;
  offset?: number;
}

export interface DynamicIncentiveApiParams {
  cities: string[];
  limit?: number;
  offset?: number;
}

// Real-time Update Types
export interface RealtimeUpdate {
  eventType: "INSERT" | "UPDATE" | "DELETE";
  table: "incentives" | "dynamic_incentives";
  old?: any;
  new?: any;
  timestamp: string;
}

// Mobile App Configuration
export interface MobileAppConfig {
  apiBaseUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  realtimeEnabled: boolean;
  locationTracking: boolean;
}

// Location Data Types
export interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  region?: string;
  country?: string;
  accuracy?: number;
  timestamp: string;
}

// User Context for Mobile Apps
export interface MobileUserContext {
  userId?: string;
  userType: "customer" | "driver";
  location?: LocationData;
  preferredCities?: string[];
  deviceId: string;
  appVersion: string;
}
