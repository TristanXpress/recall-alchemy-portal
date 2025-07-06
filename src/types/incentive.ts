
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
  geofence: {
    type: 'polygon' | 'circle';
    coordinates: {
      lat: number;
      lng: number;
    }[];
    radius?: number; // Only used for circle type
  };
}

export const PHILIPPINE_CITIES = [
  "Manila", "Quezon City", "Caloocan", "Las Piñas", "Makati", "Malabon",
  "Mandaluyong", "Marikina", "Muntinlupa", "Navotas", "Parañaque", "Pasay",
  "Pasig", "San Juan", "Taguig", "Valenzuela", "Cebu City", "Davao City",
  "Antipolo", "Tarlac City", "Zamboanga City", "Cagayan de Oro",
  "Bacoor", "General Santos", "Butuan", "Angeles", "Olongapo",
  "Tarlac", "Imus", "Naga", "San Jose del Monte", "Iloilo City", "Lapu-Lapu"
];

// Geofence polygon boundaries for major Philippine cities
export const PHILIPPINE_CITY_GEOFENCES: Record<string, { lat: number; lng: number }[]> = {
  "Manila": [
    { lat: 14.6118, lng: 120.9794 }, // North (Binondo)
    { lat: 14.6090, lng: 120.9947 }, // Northeast (Sampaloc)
    { lat: 14.5932, lng: 120.9739 }, // South (Malate)
    { lat: 14.5764, lng: 120.9851 }, // Southeast (Paco)
    { lat: 14.5836, lng: 120.9754 }, // Southwest (Port Area)
    { lat: 14.5896, lng: 120.9790 }, // West (Ermita)
    { lat: 14.6042, lng: 120.9822 }, // Center (Quiapo)
    { lat: 14.6118, lng: 120.9794 }  // Close the polygon
  ],
  "Quezon City": [
    { lat: 14.7010, lng: 121.0417 }, // North (Novaliches)
    { lat: 14.6890, lng: 121.0583 }, // Northeast (Fairview)
    { lat: 14.6274, lng: 121.0658 }, // East (UP Campus)
    { lat: 14.6198, lng: 121.0441 }, // Southeast (Timog)
    { lat: 14.6349, lng: 121.0332 }, // South (Diliman)
    { lat: 14.6760, lng: 121.0300 }, // Southwest (Commonwealth)
    { lat: 14.6944, lng: 120.9694 }, // West (Paso de Blas area)
    { lat: 14.7010, lng: 121.0417 }  // Close the polygon
  ],
  "Makati": [
    { lat: 14.5688, lng: 121.0334 }, // North (Rockwell)
    { lat: 14.5640, lng: 121.0180 }, // Northeast (Salcedo Village)
    { lat: 14.5570, lng: 121.0278 }, // East (Ayala Avenue)
    { lat: 14.5459, lng: 121.0298 }, // Southeast (Legazpi Village)
    { lat: 14.5326, lng: 121.0458 }, // South (Magallanes)
    { lat: 14.5415, lng: 121.0139 }, // Southwest (Dasmarinas Village)
    { lat: 14.5498, lng: 121.0346 }, // West (Poblacion)
    { lat: 14.5688, lng: 121.0334 }  // Close the polygon
  ],
  "Cebu City": [
    { lat: 10.3419, lng: 123.9271 }, // North (Talamban)
    { lat: 10.3369, lng: 123.9165 }, // Northeast (Banilad)
    { lat: 10.3294, lng: 123.9047 }, // East (IT Park)
    { lat: 10.3181, lng: 123.9015 }, // Southeast (Lahug)
    { lat: 10.2889, lng: 123.8462 }, // South (South Road Properties)
    { lat: 10.2967, lng: 123.8906 }, // Southwest (Capitol Site)
    { lat: 10.3046, lng: 123.8939 }, // West (Colon)
    { lat: 10.3419, lng: 123.9271 }  // Close the polygon
  ],
  "Davao City": [
    { lat: 7.1186, lng: 125.6342 }, // North (Tugbok)
    { lat: 7.1067, lng: 125.6289 }, // Northeast (Agdao)
    { lat: 7.0947, lng: 125.6186 }, // East (Buhangin)
    { lat: 7.0858, lng: 125.5958 }, // Southeast (Matina)
    { lat: 7.0389, lng: 125.5736 }, // South (Toril)
    { lat: 7.0517, lng: 125.5847 }, // Southwest (Talomo)
    { lat: 7.0644, lng: 125.6078 }, // West (Poblacion)
    { lat: 7.1186, lng: 125.6342 }  // Close the polygon
  ],
  "Caloocan": [
    { lat: 14.6889, lng: 120.9508 }, // North (Deparo)
    { lat: 14.6889, lng: 120.9642 }, // Northeast (North Caloocan)
    { lat: 14.6642, lng: 120.9786 }, // East (Camarin)
    { lat: 14.6294, lng: 120.9719 }, // Southeast (South Caloocan)
    { lat: 14.6156, lng: 120.9639 }, // South (Maypajo)
    { lat: 14.6346, lng: 120.9564 }, // Southwest (Grace Park)
    { lat: 14.6758, lng: 120.9583 }, // West (Bagumbong)
    { lat: 14.6889, lng: 120.9508 }  // Close the polygon
  ],
  "Las Piñas": [
    { lat: 14.4583, lng: 120.9831 }, // North (Talon)
    { lat: 14.4528, lng: 120.9758 }, // Northeast (BF Homes)
    { lat: 14.4467, lng: 120.9906 }, // East (Pilar Village)
    { lat: 14.4194, lng: 120.9889 }, // Southeast (Almanza)
    { lat: 14.4111, lng: 120.9764 }, // South (Pulang Lupa)
    { lat: 14.4239, lng: 120.9972 }, // Southwest (Zapote)
    { lat: 14.4289, lng: 120.9736 }, // West (CAA)
    { lat: 14.4583, lng: 120.9831 }  // Close the polygon
  ]
};
