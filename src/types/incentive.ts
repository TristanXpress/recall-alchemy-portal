
export interface Incentive {
  id: string;
  title: string;
  description: string;
  amount: number; // in Philippine Peso
  type: 'percentage' | 'fixed';
  startDate: string;
  endDate: string;
  location: string;
  isActive: boolean;
  conditions?: string[];
  userType: 'customer' | 'driver';
}

export interface DynamicIncentive extends Incentive {
  targetCities: string[];
  coordinates?: {
    lat: number;
    lng: number;
  }[];
}

export const PHILIPPINE_CITIES = [
  "Manila", "Quezon City", "Caloocan", "Las Piñas", "Makati", "Malabon",
  "Mandaluyong", "Marikina", "Muntinlupa", "Navotas", "Parañaque", "Pasay",
  "Pasig", "San Juan", "Taguig", "Valenzuela", "Cebu City", "Davao City",
  "Antipolo", "Tarlac City", "Zamboanga City", "Cagayan de Oro", "Parañaque",
  "Las Piñas", "Bacoor", "General Santos", "Butuan", "Angeles", "Olongapo",
  "Tarlac", "Imus", "Naga", "San Jose del Monte", "Iloilo City", "Lapu-Lapu"
];
