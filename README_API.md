
# Incentive Manager API Documentation

This document provides comprehensive API documentation for mobile app developers to integrate with the Incentive Manager backend.

## Base Configuration

### Supabase Configuration
```typescript
const supabaseUrl = "https://nqulgfktatzbtzicskqk.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xdWxnZmt0YXR6YnR6aWNza3FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MDY5NzAsImV4cCI6MjA2NzI4Mjk3MH0.jdnzUkw1l27cvviTSLQIE_rIVM8S2aR8fCNjA_ro6i0"
```

## API Endpoints

### 1. Get Incentives by Location and User Type

**Function:** `get_incentives_by_location`

**Parameters:**
- `p_location` (TEXT, optional): Location filter
- `p_user_type` (TEXT, optional): "customer" or "driver"

**Usage:**
```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Get driver incentives for Manila
const { data, error } = await supabase.rpc('get_incentives_by_location', {
  p_location: 'Manila',
  p_user_type: 'driver'
})
```

**Response Structure:**
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
}
```

### 2. Get Dynamic Incentives by Cities

**Function:** `get_dynamic_incentives_by_cities`

**Parameters:**
- `p_cities` (TEXT[], optional): Array of city names

**Usage:**
```typescript
// Get dynamic incentives for multiple cities
const { data, error } = await supabase.rpc('get_dynamic_incentives_by_cities', {
  p_cities: ['Manila', 'Quezon City', 'Makati']
})
```

**Response Structure:**
```typescript
interface DynamicIncentiveResponse {
  id: string
  title: string
  description: string
  amount: number
  type: 'percentage' | 'fixed'
  start_date: string
  end_date: string
  target_cities: string[]
  coordinates: any // JSONB coordinates data
  conditions: string[]
}
```

### 3. Direct Table Access

#### Get All Active Incentives
```typescript
const { data, error } = await supabase
  .from('incentives')
  .select('*')
  .eq('is_active', true)
  .lte('start_date', new Date().toISOString())
  .gte('end_date', new Date().toISOString())
```

#### Get All Active Dynamic Incentives
```typescript
const { data, error } = await supabase
  .from('dynamic_incentives')
  .select('*')
  .eq('is_active', true)
  .lte('start_date', new Date().toISOString())
  .gte('end_date', new Date().toISOString())
```

## Real-time Subscriptions

### Listen to Incentive Updates
```typescript
const channel = supabase
  .channel('incentive-updates')
  .on(
    'postgres_changes',
    {
      event: '*', // INSERT, UPDATE, DELETE
      schema: 'public',
      table: 'incentives'
    },
    (payload) => {
      console.log('Incentive updated:', payload)
      // Handle real-time updates in your app
    }
  )
  .subscribe()
```

### Listen to Dynamic Incentive Updates
```typescript
const channel = supabase
  .channel('dynamic-incentive-updates')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'dynamic_incentives'
    },
    (payload) => {
      console.log('Dynamic incentive updated:', payload)
    }
  )
  .subscribe()
```

## Mobile App Integration Examples

### React Native Example
```typescript
import { createClient } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const useIncentives = (userType: 'customer' | 'driver', location?: string) => {
  const [incentives, setIncentives] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchIncentives()
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('incentives')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'incentives' 
      }, () => {
        fetchIncentives() // Refetch on changes
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [userType, location])

  const fetchIncentives = async () => {
    setLoading(true)
    const { data, error } = await supabase.rpc('get_incentives_by_location', {
      p_location: location,
      p_user_type: userType
    })
    
    if (!error) {
      setIncentives(data || [])
    }
    setLoading(false)
  }

  return { incentives, loading, refetch: fetchIncentives }
}
```

### Flutter/Dart Example
```dart
import 'package:supabase_flutter/supabase_flutter.dart';

class IncentiveService {
  final SupabaseClient _client = Supabase.instance.client;

  Future<List<Map<String, dynamic>>> getIncentivesByLocation({
    required String userType,
    String? location,
  }) async {
    final response = await _client.rpc('get_incentives_by_location', params: {
      'p_location': location,
      'p_user_type': userType,
    });
    
    return List<Map<String, dynamic>>.from(response);
  }

  Stream<List<Map<String, dynamic>>> watchIncentives() {
    return _client
        .from('incentives')
        .stream(primaryKey: ['id'])
        .eq('is_active', true);
  }
}
```

## Helper Functions

### Currency Formatting
```typescript
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(amount)
}
```

### Incentive Value Calculation
```typescript
export const calculateIncentiveValue = (
  baseAmount: number,
  incentiveAmount: number,
  incentiveType: 'percentage' | 'fixed'
) => {
  if (incentiveType === 'percentage') {
    return (baseAmount * incentiveAmount) / 100
  }
  return incentiveAmount
}
```

### Location Matching
```typescript
export const filterByLocation = (incentives: any[], userLocation: string) => {
  return incentives.filter(
    incentive => 
      !incentive.location || 
      incentive.location.toLowerCase() === userLocation.toLowerCase()
  )
}
```

## Security Considerations

1. **Row Level Security (RLS)** is enabled on all tables
2. **Anonymous access** is allowed for reading active incentives
3. **Authentication required** for creating/updating incentives
4. **Data validation** is enforced at the database level

## Error Handling

Always check for errors in your API calls:

```typescript
const { data, error } = await supabase.rpc('get_incentives_by_location', params)

if (error) {
  console.error('API Error:', error.message)
  throw new Error(`Failed to fetch incentives: ${error.message}`)
}

return data
```

## Rate Limiting

Supabase has built-in rate limiting. For production apps, consider:
- Implementing client-side caching
- Using pagination for large datasets
- Batch requests when possible

## Testing

Test your integration using the Supabase dashboard or directly via the REST API:

```bash
curl -X POST 'https://nqulgfktatzbtzicskqk.supabase.co/rest/v1/rpc/get_incentives_by_location' \
-H "apikey: YOUR_ANON_KEY" \
-H "Authorization: Bearer YOUR_ANON_KEY" \
-H "Content-Type: application/json" \
-d '{"p_location": "Manila", "p_user_type": "driver"}'
```

For questions or support, refer to the Supabase documentation or contact the development team.
