
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
  coordinates?: {
    lat: number;
    lng: number;
  }[];
}

export const PHILIPPINE_CITIES = [
  "Manila", "Quezon City", "Caloocan", "Las Piñas", "Makati", "Malabon",
  "Mandaluyong", "Marikina", "Muntinlupa", "Navotas", "Parañaque", "Pasay",
  "Pasig", "San Juan", "Taguig", "Valenzuela", "Cebu City", "Davao City",
  "Antipolo", "Tarlac City", "Zamboanga City", "Cagayan de Oro",
  "Bacoor", "General Santos", "Butuan", "Angeles", "Olongapo",
  "Tarlac", "Imus", "Naga", "San Jose del Monte", "Iloilo City", "Lapu-Lapu"
];

export const PHILIPPINE_CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "Manila": { lat: 14.5995, lng: 120.9842 },
  "Quezon City": { lat: 14.6760, lng: 121.0437 },
  "Caloocan": { lat: 14.6507, lng: 120.9668 },
  "Las Piñas": { lat: 14.4350, lng: 120.9822 },
  "Makati": { lat: 14.5547, lng: 121.0244 },
  "Malabon": { lat: 14.6650, lng: 120.9594 },
  "Mandaluyong": { lat: 14.5794, lng: 121.0359 },
  "Marikina": { lat: 14.6507, lng: 121.1029 },
  "Muntinlupa": { lat: 14.4037, lng: 121.0454 },
  "Navotas": { lat: 14.6574, lng: 120.9470 },
  "Parañaque": { lat: 14.4793, lng: 121.0198 },
  "Pasay": { lat: 14.5378, lng: 120.9896 },
  "Pasig": { lat: 14.5764, lng: 121.0851 },
  "San Juan": { lat: 14.6019, lng: 121.0355 },
  "Taguig": { lat: 14.5176, lng: 121.0509 },
  "Valenzuela": { lat: 14.7000, lng: 120.9830 },
  "Cebu City": { lat: 10.3157, lng: 123.8854 },
  "Davao City": { lat: 7.0731, lng: 125.6128 },
  "Antipolo": { lat: 14.5878, lng: 121.1760 },
  "Tarlac City": { lat: 15.4817, lng: 120.5979 },
  "Zamboanga City": { lat: 6.9214, lng: 122.0790 },
  "Cagayan de Oro": { lat: 8.4542, lng: 124.6319 },
  "Bacoor": { lat: 14.4586, lng: 120.9374 },
  "General Santos": { lat: 6.1164, lng: 125.1716 },
  "Butuan": { lat: 8.9470, lng: 125.5403 },
  "Angeles": { lat: 15.1445, lng: 120.5950 },
  "Olongapo": { lat: 14.8294, lng: 120.2824 },
  "Tarlac": { lat: 15.4900, lng: 120.5969 },
  "Imus": { lat: 14.4297, lng: 120.9370 },
  "Naga": { lat: 13.6218, lng: 123.1948 },
  "San Jose del Monte": { lat: 14.8136, lng: 121.0453 },
  "Iloilo City": { lat: 10.7202, lng: 122.5621 },
  "Lapu-Lapu": { lat: 10.3103, lng: 123.9494 }
};
