// Centralized API exports for easy importing
export { CustomerIncentiveApiService } from './customerIncentiveApi';
export { DriverIncentiveApiService } from './driverIncentiveApi';
export { DynamicIncentiveApiService } from './dynamicIncentiveApi';

// Legacy API service (keeping for backward compatibility)
export { IncentiveApiService } from './incentiveApi';

// Common types and utilities
export const IncentiveApiHelpers = {
  // Format currency for Philippine Peso
  formatCurrency: (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  },

  // Check if incentive is currently active
  isIncentiveActive: (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
  },

  // Calculate incentive value based on type
  calculateIncentiveValue: (
    baseAmount: number,
    incentiveAmount: number,
    incentiveType: "percentage" | "fixed"
  ) => {
    if (incentiveType === "percentage") {
      return (baseAmount * incentiveAmount) / 100;
    }
    return incentiveAmount;
  },

  // Validate coordinates
  isValidCoordinates: (lat: number, lng: number) => {
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  },

  // Convert coordinates to string for display
  formatCoordinates: (lat: number, lng: number) => {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
};
