
# Incentive Manager API Documentation

This document provides comprehensive API documentation for mobile app developers to integrate with the Incentive Manager backend.

## Base Configuration

### Supabase Configuration
```typescript
const supabaseUrl = "https://nqulgfktatzbtzicskqk.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xdWxnZmt0YXR6YnR6aWNza3FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MDY5NzAsImV4cCI6MjA2NzI4Mjk3MH0.jdnzUkw1l27cvviTSLQIE_rIVM8S2aR8fCNjA_ro6i0"
```

## API Services Overview

### 1. Customer Incentive API (`CustomerIncentiveApiService`)

**Purpose:** Manage incentives specifically for customers/riders

#### Methods:

##### `getCustomerIncentives(location?: string)`
Get all active customer incentives, optionally filtered by location.

```typescript
import { CustomerIncentiveApiService } from './customerIncentiveApi'

// Get all customer incentives in Manila
const incentives = await CustomerIncentiveApiService.getCustomerIncentives('Manila')

// Get all customer incentives (no location filter)
const allIncentives = await CustomerIncentiveApiService.getCustomerIncentives()
```

##### `getAllActiveCustomerIncentives()`
Get all active customer incentives without any filters.

##### `subscribeToCustomerIncentiveUpdates(callback)`
Real-time subscription for customer incentive updates.

```typescript
const channel = CustomerIncentiveApiService.subscribeToCustomerIncentiveUpdates((payload) => {
  console.log('Customer incentive updated:', payload)
})
```

##### Helper Methods:
- `calculateCustomerIncentiveValue(orderAmount, incentiveAmount, incentiveType)`
- `isCustomerEligible(customerLocation, incentiveLocation)`
- `formatCurrency(amount)`

### 2. Driver Incentive API (`DriverIncentiveApiService`)

**Purpose:** Manage incentives specifically for drivers

#### Methods:

##### `getDriverIncentives(location?: string)`
Get all active driver incentives, optionally filtered by location.

```typescript
import { DriverIncentiveApiService } from './driverIncentiveApi'

// Get driver incentives in Quezon City
const incentives = await DriverIncentiveApiService.getDriverIncentives('Quezon City')
```

##### `getDriverIncentivesByMultipleLocations(locations: string[])`
Get driver incentives for multiple locations (useful for drivers operating in multiple areas).

```typescript
const incentives = await DriverIncentiveApiService.getDriverIncentivesByMultipleLocations([
  'Manila', 'Makati', 'Quezon City'
])
```

##### `getDriverShiftIncentives(driverLocation, shiftStartTime)`
Get incentives relevant to a driver's current shift.

```typescript
const shiftIncentives = await DriverIncentiveApiService.getDriverShiftIncentives(
  'Manila',
  '2024-01-15T08:00:00Z'
)
```

##### `subscribeToDriverIncentiveUpdates(callback)`
Real-time subscription for driver incentive updates.

### 3. Dynamic Incentive API (`DynamicIncentiveApiService`)

**Purpose:** Manage location-based dynamic incentives with Google Maps coordinates

#### Methods:

##### `getAllActiveDynamicIncentives()`
Get all active dynamic incentives.

```typescript
import { DynamicIncentiveApiService } from './dynamicIncentiveApi'

const dynamicIncentives = await DynamicIncentiveApiService.getAllActiveDynamicIncentives()
```

##### `getDynamicIncentivesByCities(cities: string[])`
Get dynamic incentives for specific cities.

```typescript
const incentives = await DynamicIncentiveApiService.getDynamicIncentivesByCities([
  'Manila', 'Cebu City', 'Davao City'
])
```

##### `getDynamicIncentivesByCoordinates(lat, lng, radiusKm)`
Get dynamic incentives within a specific radius of coordinates.

```typescript
const nearbyIncentives = await DynamicIncentiveApiService.getDynamicIncentivesByCoordinates(
  14.5995, // Manila latitude
  120.9842, // Manila longitude
  5 // 5km radius
)
```

##### `getNearbyDynamicIncentives(userLat, userLng, radiusKm)`
Get nearby dynamic incentives for mobile map view.

```typescript
const nearbyIncentives = await DynamicIncentiveApiService.getNearbyDynamicIncentives(
  14.5995,
  120.9842,
  10 // 10km radius
)
```

##### Helper Methods:
- `calculateDistance(lat1, lng1, lat2, lng2)` - Haversine distance calculation
- `isWithinIncentiveArea(userLat, userLng, incentiveCoordinates, radiusKm)`
- `calculateDynamicIncentiveValue(baseAmount, incentiveAmount, incentiveType)`

## Direct Database Access (RPC Functions)

### 1. Get Incentives by Location and User Type

```typescript
const { data, error } = await supabase.rpc('get_incentives_by_location', {
  p_location: 'Manila',
  p_user_type: 'driver'
})
```

### 2. Get Dynamic Incentives by Cities

```typescript
const { data, error } = await supabase.rpc('get_dynamic_incentives_by_cities', {
  p_cities: ['Manila', 'Quezon City', 'Makati']
})
```

## Mobile App Integration Examples

### React Native Example

```typescript
import { createClient } from '@supabase/supabase-js'
import { CustomerIncentiveApiService, DriverIncentiveApiService } from './incentiveApi'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const useCustomerIncentives = (location?: string) => {
  const [incentives, setIncentives] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchIncentives = async () => {
      try {
        const data = await CustomerIncentiveApiService.getCustomerIncentives(location)
        setIncentives(data)
      } catch (error) {
        console.error('Error fetching customer incentives:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchIncentives()

    // Set up real-time subscription
    const subscription = CustomerIncentiveApiService.subscribeToCustomerIncentiveUpdates(() => {
      fetchIncentives()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [location])

  return { incentives, loading }
}
```

### Flutter/Dart Example

```dart
import 'package:supabase_flutter/supabase_flutter.dart';

class CustomerIncentiveService {
  final SupabaseClient _client = Supabase.instance.client;

  Future<List<Map<String, dynamic>>> getCustomerIncentives({String? location}) async {
    final response = await _client.rpc('get_incentives_by_location', params: {
      'p_location': location,
      'p_user_type': 'customer',
    });
    
    return List<Map<String, dynamic>>.from(response);
  }

  Stream<List<Map<String, dynamic>>> watchCustomerIncentives() {
    return _client
        .from('incentives')
        .stream(primaryKey: ['id'])
        .eq('is_active', true)
        .eq('user_type', 'customer');
  }
}
```

## Common Use Cases

### 1. Customer App Integration
```typescript
// Get available discounts for customer in specific location
const customerDiscounts = await CustomerIncentiveApiService.getCustomerIncentives('Manila')

// Calculate discount value for order
const discountValue = CustomerIncentiveApiService.calculateCustomerIncentiveValue(
  500, // order amount
  15,  // 15% discount
  'percentage'
)
```

### 2. Driver App Integration
```typescript
// Get available incentives for driver
const driverIncentives = await DriverIncentiveApiService.getDriverIncentives('Quezon City')

// Get incentives for driver operating in multiple areas
const multiAreaIncentives = await DriverIncentiveApiService.getDriverIncentivesByMultipleLocations([
  'Manila', 'Makati', 'Quezon City'
])
```

### 3. Dynamic Location-Based Incentives
```typescript
// Get dynamic incentives near user's location
const nearbyIncentives = await DynamicIncentiveApiService.getNearbyDynamicIncentives(
  userLatitude,
  userLongitude,
  5 // 5km radius
)

// Check if user is within incentive area
const isEligible = DynamicIncentiveApiService.isWithinIncentiveArea(
  userLat,
  userLng,
  incentive.coordinates,
  1 // 1km radius
)
```

## Response Data Structures

### Standard Incentive Response
```typescript
interface IncentiveResponse {
  id: string
  title: string
  description: string
  amount: number
  type: 'percentage' | 'fixed'
  start_date: string
  end_date: string
  location: string
  conditions: string[]
  user_type: 'customer' | 'driver'
  is_active: boolean
}
```

### Dynamic Incentive Response
```typescript
interface DynamicIncentiveResponse {
  id: string
  title: string
  description: string
  amount: number
  type: 'percentage' | 'fixed'
  start_date: string
  end_date: string
  location: string
  coordinates: { lat: number; lng: number }[]
  conditions: string[]
  is_active: boolean
}
```

## Error Handling

Always implement proper error handling:

```typescript
try {
  const incentives = await CustomerIncentiveApiService.getCustomerIncentives('Manila')
  // Process incentives
} catch (error) {
  console.error('Failed to fetch incentives:', error.message)
  // Handle error appropriately
}
```

## Rate Limiting & Best Practices

1. **Caching:** Implement client-side caching for incentive data
2. **Real-time Updates:** Use subscriptions instead of polling
3. **Batch Requests:** Combine multiple location requests when possible
4. **Error Handling:** Always handle API errors gracefully
5. **Offline Support:** Cache incentive data for offline access

## Testing

Test your integration using the Supabase dashboard or REST API:

```bash
# Test customer incentives
curl -X POST 'https://nqulgfktatzbtzicskqk.supabase.co/rest/v1/rpc/get_incentives_by_location' \
-H "apikey: YOUR_ANON_KEY" \
-H "Authorization: Bearer YOUR_ANON_KEY" \
-H "Content-Type: application/json" \
-d '{"p_location": "Manila", "p_user_type": "customer"}'

# Test dynamic incentives
curl -X POST 'https://nqulgfktatzbtzicskqk.supabase.co/rest/v1/rpc/get_dynamic_incentives_by_cities' \
-H "apikey: YOUR_ANON_KEY" \
-H "Authorization: Bearer YOUR_ANON_KEY" \
-H "Content-Type: application/json" \
-d '{"p_cities": ["Manila", "Quezon City"]}'
```

For questions or support, refer to the Supabase documentation or contact the development team.
