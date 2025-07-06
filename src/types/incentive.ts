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
  geofence?: {
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

// Keep the original coordinates for backward compatibility
export const PHILIPPINE_CITY_COORDINATES: Record<string, { lat: number; lng: number }[]> = {
  "Manila": [
    { lat: 14.5995, lng: 120.9842 }, // City Center
    { lat: 14.5896, lng: 120.9790 }, // Ermita
    { lat: 14.6042, lng: 120.9822 }, // Quiapo
    { lat: 14.6118, lng: 120.9794 }, // Binondo
    { lat: 14.5932, lng: 120.9739 }, // Malate
    { lat: 14.5836, lng: 120.9754 }, // Port Area
    { lat: 14.6090, lng: 120.9947 }, // Sampaloc
    { lat: 14.5764, lng: 120.9851 }  // Paco
  ],
  "Quezon City": [
    { lat: 14.6760, lng: 121.0437 }, // City Center
    { lat: 14.6349, lng: 121.0332 }, // Diliman
    { lat: 14.6488, lng: 121.0509 }, // Cubao
    { lat: 14.6890, lng: 121.0583 }, // Fairview
    { lat: 14.6274, lng: 121.0658 }, // UP Campus
    { lat: 14.6760, lng: 121.0300 }, // Commonwealth
    { lat: 14.6198, lng: 121.0441 }, // Timog
    { lat: 14.7010, lng: 121.0417 }  // Novaliches
  ],
  "Makati": [
    { lat: 14.5547, lng: 121.0244 }, // CBD Center
    { lat: 14.5570, lng: 121.0278 }, // Ayala Avenue
    { lat: 14.5498, lng: 121.0346 }, // Poblacion
    { lat: 14.5640, lng: 121.0180 }, // Salcedo Village
    { lat: 14.5459, lng: 121.0298 }, // Legazpi Village
    { lat: 14.5415, lng: 121.0139 }, // Dasmarinas Village
    { lat: 14.5688, lng: 121.0334 }, // Rockwell
    { lat: 14.5326, lng: 121.0458 }  // Magallanes
  ],
  "Cebu City": [
    { lat: 10.3157, lng: 123.8854 }, // City Center
    { lat: 10.3181, lng: 123.9015 }, // Lahug
    { lat: 10.2967, lng: 123.8906 }, // Capitol Site
    { lat: 10.3046, lng: 123.8939 }, // Colon
    { lat: 10.3294, lng: 123.9047 }, // IT Park
    { lat: 10.3369, lng: 123.9165 }, // Banilad
    { lat: 10.2889, lng: 123.8462 }, // South Road Properties
    { lat: 10.3419, lng: 123.9271 }  // Talamban
  ],
  "Davao City": [
    { lat: 7.0731, lng: 125.6128 }, // City Center
    { lat: 7.0644, lng: 125.6078 }, // Poblacion
    { lat: 7.0947, lng: 125.6186 }, // Buhangin
    { lat: 7.0517, lng: 125.5847 }, // Talomo
    { lat: 7.1067, lng: 125.6289 }, // Agdao
    { lat: 7.0389, lng: 125.5736 }, // Toril
    { lat: 7.1186, lng: 125.6342 }, // Tugbok
    { lat: 7.0858, lng: 125.5958 }  // Matina
  ],
  "Caloocan": [
    { lat: 14.6507, lng: 120.9668 }, // City Center
    { lat: 14.6889, lng: 120.9642 }, // North Caloocan
    { lat: 14.6294, lng: 120.9719 }, // South Caloocan
    { lat: 14.6758, lng: 120.9583 }, // Bagumbong
    { lat: 14.6346, lng: 120.9564 }, // Grace Park
    { lat: 14.6642, lng: 120.9786 }, // Camarin
    { lat: 14.6156, lng: 120.9639 }, // Maypajo
    { lat: 14.6889, lng: 120.9508 }  // Deparo
  ],
  "Las Piñas": [
    { lat: 14.4350, lng: 120.9822 }, // City Center
    { lat: 14.4528, lng: 120.9758 }, // BF Homes
    { lat: 14.4194, lng: 120.9889 }, // Almanza
    { lat: 14.4467, lng: 120.9906 }, // Pilar Village
    { lat: 14.4289, lng: 120.9736 }, // CAA
    { lat: 14.4583, lng: 120.9831 }, // Talon
    { lat: 14.4111, lng: 120.9764 }, // Pulang Lupa
    { lat: 14.4239, lng: 120.9972 }  // Zapote
  ],
  "Malabon": [
    { lat: 14.6650, lng: 120.9594 }, // City Center
    { lat: 14.6567, lng: 120.9528 }, // Longos
    { lat: 14.6733, lng: 120.9639 }, // Flores
    { lat: 14.6594, lng: 120.9647 }, // Acacia
    { lat: 14.6706, lng: 120.9556 }, // Potrero
    { lat: 14.6528, lng: 120.9583 }, // Tinajeros
    { lat: 14.6781, lng: 120.9500 }, // Dampalit
    { lat: 14.6611, lng: 120.9472 }  // Tonsuya
  ],
  "Mandaluyong": [
    { lat: 14.5794, lng: 121.0359 }, // City Center
    { lat: 14.5833, lng: 121.0347 }, // Poblacion
    { lat: 14.5756, lng: 121.0417 }, // Addition Hills
    { lat: 14.5806, lng: 121.0306 }, // Wack Wack
    { lat: 14.5739, lng: 121.0389 }, // Highway Hills
    { lat: 14.5889, lng: 121.0378 }, // Barangka
    { lat: 14.5722, lng: 121.0333 }, // Plainview
    { lat: 14.5861, lng: 121.0417 }  // Hulo
  ],
  "Marikina": [
    { lat: 14.6507, lng: 121.1029 }, // City Center
    { lat: 14.6333, lng: 121.1056 }, // Marikina Heights
    { lat: 14.6681, lng: 121.1067 }, // Parang
    { lat: 14.6447, lng: 121.0958 }, // Concepcion
    { lat: 14.6594, lng: 121.1167 }, // Tumana
    { lat: 14.6389, lng: 121.1139 }, // Nangka
    { lat: 14.6731, lng: 121.0933 }, // Industrial Valley
    { lat: 14.6269, lng: 121.0889 }  // Sta. Elena
  ],
  "Muntinlupa": [
    { lat: 14.4037, lng: 121.0454 }, // City Center
    { lat: 14.4289, lng: 121.0375 }, // Alabang
    { lat: 14.3836, lng: 121.0511 }, // Putatan
    { lat: 14.4167, lng: 121.0528 }, // Sucat
    { lat: 14.3944, lng: 121.0389 }, // Ayala Alabang
    { lat: 14.4122, lng: 121.0611 }, // Buli
    { lat: 14.3728, lng: 121.0417 }, // Cupang
    { lat: 14.4194, lng: 121.0306 }  // Filinvest
  ],
  "Navotas": [
    { lat: 14.6574, lng: 120.9470 }, // City Center
    { lat: 14.6667, lng: 120.9444 }, // Bagumbayan North
    { lat: 14.6481, lng: 120.9500 }, // Bagumbayan South
    { lat: 14.6631, lng: 120.9389 }, // Daanghari
    { lat: 14.6517, lng: 120.9417 }, // Navotas East
    { lat: 14.6519, lng: 120.9528 }, // Navotas West
    { lat: 14.6611, lng: 120.9556 }, // North Bay Boulevard
    { lat: 14.6486, lng: 120.9361 }  // San Roque
  ],
  "Parañaque": [
    { lat: 14.4793, lng: 121.0198 }, // City Center
    { lat: 14.5047, lng: 121.0139 }, // BF Homes
    { lat: 14.4583, lng: 121.0167 }, // San Antonio
    { lat: 14.4944, lng: 121.0306 }, // Don Galo
    { lat: 14.4639, lng: 121.0306 }, // Tambo
    { lat: 14.5083, lng: 121.0056 }, // La Huerta
    { lat: 14.4722, lng: 121.0056 }, // Baclaran
    { lat: 14.4889, lng: 121.0250 }  // Sun Valley
  ],
  "Pasay": [
    { lat: 14.5378, lng: 120.9896 }, // City Center
    { lat: 14.5486, lng: 120.9931 }, // Malibay
    { lat: 14.5333, lng: 120.9944 }, // Pasay Rotonda
    { lat: 14.5194, lng: 120.9889 }, // NAIA Complex
    { lat: 14.5444, lng: 120.9806 }, // San Rafael
    { lat: 14.5556, lng: 120.9861 }, // San Isidro
    { lat: 14.5306, lng: 120.9806 }, // Maricaban
    { lat: 14.5417, lng: 121.0028 }  // Tramo
  ],
  "Pasig": [
    { lat: 14.5764, lng: 121.0851 }, // City Center
    { lat: 14.5681, lng: 121.0639 }, // Ortigas Center
    { lat: 14.5944, lng: 121.0972 }, // Kapitolyo
    { lat: 14.5583, lng: 121.0778 }, // San Miguel
    { lat: 14.5833, lng: 121.0889 }, // Rosario
    { lat: 14.5722, lng: 121.0556 }, // Ugong
    { lat: 14.5597, lng: 121.0944 }, // Pinagbuhatan
    { lat: 14.5889, lng: 121.0667 }  // Malinao
  ],
  "San Juan": [
    { lat: 14.6019, lng: 121.0355 }, // City Center
    { lat: 14.6075, lng: 121.0306 }, // Greenhills
    { lat: 14.5964, lng: 121.0389 }, // Little Baguio
    { lat: 14.6056, lng: 121.0417 }, // Addition Hills
    { lat: 14.5986, lng: 121.0278 }, // West Crame
    { lat: 14.6131, lng: 121.0333 }, // Tibagan
    { lat: 14.5931, lng: 121.0333 }, // Maytunas
    { lat: 14.6103, lng: 121.0389 }  // Corazon de Jesus
  ],
  "Taguig": [
    { lat: 14.5176, lng: 121.0509 }, // City Center
    { lat: 14.5478, lng: 121.0456 }, // Bonifacio Global City
    { lat: 14.4983, lng: 121.0556 }, // Fort Bonifacio
    { lat: 14.5283, lng: 121.0639 }, // Signal Village
    { lat: 14.5364, lng: 121.0361 }, // McKinley Hill
    { lat: 14.4889, lng: 121.0667 }, // Laguna de Bay
    { lat: 14.5139, lng: 121.0361 }, // JUSMAG
    { lat: 14.5056, lng: 121.0417 }  // Western Bicutan
  ],
  "Valenzuela": [
    { lat: 14.7000, lng: 120.9830 }, // City Center
    { lat: 14.7133, lng: 120.9806 }, // Malinta
    { lat: 14.6867, lng: 120.9889 }, // Maysan
    { lat: 14.7056, lng: 120.9750 }, // Karuhatan
    { lat: 14.6944, lng: 120.9694 }, // Paso de Blas
    { lat: 14.7181, lng: 120.9917 }, // Gen. T. de Leon
    { lat: 14.6806, lng: 120.9861 }, // Dalandanan
    { lat: 14.7222, lng: 120.9750 }  // Arkong Bato
  ],
  "Antipolo": [
    { lat: 14.5878, lng: 121.1760 }, // City Center
    { lat: 14.6167, lng: 121.1722 }, // Dela Paz
    { lat: 14.5694, lng: 121.1833 }, // San Roque
    { lat: 14.5992, lng: 121.1611 }, // Mambugan
    { lat: 14.5756, lng: 121.1944 }, // Hinulugang Taktak
    { lat: 14.6056, lng: 121.1889 }, // Santa Cruz
    { lat: 14.5639, lng: 121.1667 }, // San Jose
    { lat: 14.6139, lng: 121.1556 }  // Bagong Nayon
  ],
  "Tarlac City": [
    { lat: 15.4817, lng: 120.5979 }, // City Center
    { lat: 15.4944, lng: 120.5889 }, // San Sebastian
    { lat: 15.4689, lng: 120.6056 }, // Binauganan
    { lat: 15.4756, lng: 120.5833 }, // San Vicente
    { lat: 15.4889, lng: 120.6111 }, // Balingcanaway
    { lat: 15.4653, lng: 120.5917 }, // San Carlos
    { lat: 15.4972, lng: 120.5750 }, // San Manuel
    { lat: 15.4583, lng: 120.6000 }  // Maliwalo
  ],
  "Zamboanga City": [
    { lat: 6.9214, lng: 122.0790 }, // City Center
    { lat: 6.9167, lng: 122.0722 }, // Canelar
    { lat: 6.9306, lng: 122.0833 }, // Tetuan
    { lat: 6.9083, lng: 122.0889 }, // Tumaga
    { lat: 6.9361, lng: 122.0694 }, // Zone I
    { lat: 6.9056, lng: 122.0639 }, // Pasonanca
    { lat: 6.9472, lng: 122.0806 }, // Baliwasan
    { lat: 6.8944, lng: 122.0750 }  // Ayala
  ],
  "Cagayan de Oro": [
    { lat: 8.4542, lng: 124.6319 }, // City Center
    { lat: 8.4667, lng: 124.6417 }, // Carmen
    { lat: 8.4417, lng: 124.6222 }, // Nazareth
    { lat: 8.4778, lng: 124.6472 }, // Lapasan
    { lat: 8.4361, lng: 124.6389 }, // Poblacion
    { lat: 8.4639, lng: 124.6139 }, // Gusa
    { lat: 8.4833, lng: 124.6361 }, // Kauswagan
    { lat: 8.4278, lng: 124.6167 }  // Balulang
  ],
  "Bacoor": [
    { lat: 14.4586, lng: 120.9374 }, // City Center
    { lat: 14.4639, lng: 120.9306 }, // Molino
    { lat: 14.4533, lng: 120.9444 }, // Queens Row
    { lat: 14.4694, lng: 120.9417 }, // Habay
    { lat: 14.4472, lng: 120.9333 }, // Panapaan
    { lat: 14.4556, lng: 120.9500 }, // Talaba
    { lat: 14.4611, lng: 120.9250 }, // Ligas
    { lat: 14.4417, lng: 120.9389 }  // Niog
  ],
  "General Santos": [
    { lat: 6.1164, lng: 125.1716 }, // City Center
    { lat: 6.1306, lng: 125.1639 }, // Poblacion
    { lat: 6.1028, lng: 125.1778 }, // Lagao
    { lat: 6.1361, lng: 125.1833 }, // Upper Labay
    { lat: 6.0944, lng: 125.1667 }, // Fatima
    { lat: 6.1222, lng: 125.1944 }, // City Heights
    { lat: 6.1083, lng: 125.1583 }, // Dadiangas Heights
    { lat: 6.1417, lng: 125.1556 }  // Olympog
  ],
  "Butuan": [
    { lat: 8.9470, lng: 125.5403 }, // City Center
    { lat: 8.9583, lng: 125.5472 }, // Langihan
    { lat: 8.9361, lng: 125.5333 }, // Guingona
    { lat: 8.9639, lng: 125.5556 }, // Los Angeles
    { lat: 8.9306, lng: 125.5472 }, // Villa Kananga
    { lat: 8.9694, lng: 125.5389 }, // Lemon
    { lat: 8.9250, lng: 125.5556 }, // Bancasi
    { lat: 8.9528, lng: 125.5278 }  // Golden Ribbon
  ],
  "Angeles": [
    { lat: 15.1445, lng: 120.5950 }, // City Center
    { lat: 15.1528, lng: 120.5889 }, // Balibago
    { lat: 15.1361, lng: 120.6000 }, // Malabanias
    { lat: 15.1583, lng: 120.6028 }, // Cutcut
    { lat: 15.1306, lng: 120.5861 }, // Pampang
    { lat: 15.1667, lng: 120.5806 }, // Sapangbato
    { lat: 15.1250, lng: 120.5806 }, // Salapungan
    { lat: 15.1194, lng: 120.6056 }  // Santo Domingo
  ],
  "Olongapo": [
    { lat: 14.8294, lng: 120.2824 }, // City Center
    { lat: 14.8361, lng: 120.2750 }, // East Bajac-Bajac
    { lat: 14.8222, lng: 120.2889 }, // West Bajac-Bajac
    { lat: 14.8444, lng: 120.2778 }, // New Cabalan
    { lat: 14.8167, lng: 120.2806 }, // Old Cabalan
    { lat: 14.8389, lng: 120.2694 }, // Santa Rita
    { lat: 14.8083, lng: 120.2861 }, // Kalaklan
    { lat: 14.8500, lng: 120.2833 }  // New Kababae
  ],
  "Tarlac": [
    { lat: 15.4900, lng: 120.5969 }, // Province Center
    { lat: 15.5056, lng: 120.5833 }, // San Miguel
    { lat: 15.4744, lng: 120.6083 }, // San Isidro
    { lat: 15.5139, lng: 120.5694 }, // Sta. Maria
    { lat: 15.4639, lng: 120.5806 }, // San Jose
    { lat: 15.5222, lng: 120.6000 }, // Paniqui
    { lat: 15.4583, lng: 120.6139 }, // La Paz
    { lat: 15.5306, lng: 120.5889 }  // Victoria
  ],
  "Imus": [
    { lat: 14.4297, lng: 120.9370 }, // City Center
    { lat: 14.4389, lng: 120.9306 }, // Poblacion
    { lat: 14.4206, lng: 120.9444 }, // Bayan Luma
    { lat: 14.4444, lng: 120.9417 }, // Tanzang Luma
    { lat: 14.4167, lng: 120.9333 }, // Malagasang
    { lat: 14.4361, lng: 120.9500 }, // Bucandala
    { lat: 14.4500, lng: 120.9278 }, // Toclong
    { lat: 14.4139, lng: 120.9389 }  // Alapan
  ],
  "Naga": [
    { lat: 13.6218, lng: 123.1948 }, // City Center
    { lat: 13.6306, lng: 123.1889 }, // Poblacion
    { lat: 13.6139, lng: 123.2000 }, // Triangulo
    { lat: 13.6361, lng: 123.2028 }, // Bagumbayan Norte
    { lat: 13.6083, lng: 123.1861 }, // Bagumbayan Sur
    { lat: 13.6444, lng: 123.1944 }, // Lerma
    { lat: 13.6000, lng: 123.1944 }, // Carolina
    { lat: 13.6500, lng: 123.1806 }  // Pacol
  ],
  "San Jose del Monte": [
    { lat: 14.8136, lng: 121.0453 }, // City Center
    { lat: 14.8222, lng: 121.0389 }, // Poblacion
    { lat: 14.8056, lng: 121.0528 }, // Tungkong Mangga
    { lat: 14.8306, lng: 121.0500 }, // San Isidro
    { lat: 14.7972, lng: 121.0417 }, // Ciudad Real
    { lat: 14.8389, lng: 121.0444 }, // San Rafael
    { lat: 14.7889, lng: 121.0500 }, // Dulong Bayan
    { lat: 14.8472, lng: 121.0361 }  // Fatima
  ],
  "Iloilo City": [
    { lat: 10.7202, lng: 122.5621 }, // City Center
    { lat: 10.7306, lng: 122.5556 }, // Jaro
    { lat: 10.7139, lng: 122.5694 }, // La Paz
    { lat: 10.7361, lng: 122.5750 }, // Mandurriao
    { lat: 10.7056, lng: 122.5583 }, // Molo
    { lat: 10.7444, lng: 122.5639 }, // Arevalo
    { lat: 10.6972, lng: 122.5528 }, // Villa
    { lat: 10.7500, lng: 122.5472 }  // Lapuz
  ],
  "Lapu-Lapu": [
    { lat: 10.3103, lng: 123.9494 }, // City Center
    { lat: 10.3194, lng: 123.9556 }, // Poblacion
    { lat: 10.3028, lng: 123.9417 }, // Gun-ob
    { lat: 10.3250, lng: 123.9583 }, // Babag
    { lat: 10.2972, lng: 123.9528 }, // Agus
    { lat: 10.3167, lng: 123.9361 }, // Mactan Economic Zone
    { lat: 10.3056, lng: 123.9639 }, // Buaya
    { lat: 10.3333, lng: 123.9472 }  // Canjulao
  ]
};
