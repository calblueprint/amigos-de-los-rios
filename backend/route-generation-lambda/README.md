# Route Generation Lambda

Generates optimized watering routes using Google's Route Optimization API.

## Features

- JWT authentication via Supabase
- Single vehicle route optimization
- Time budget constraints
- Real-time travel time calculations
- Google Maps navigation URLs

## Setup

### Environment Variables

Configure in AWS Lambda:

- `GOOGLE_CLOUD_PROJECT_ID` - Google Cloud project ID
- `GOOGLE_SERVICE_ACCOUNT_KEY` - Base64-encoded service account JSON key
- `SUPABASE_JWT_SECRET` - JWT secret from Supabase dashboard (Settings → API → JWT Secret)

### Installation

```bash
npm install
```

### Deployment

```bash
npm run zip
aws lambda update-function-code \
  --function-name route-generation \
  --zip-file fileb://function.zip \
  --region us-west-2
```

## Authentication

All requests require a valid Supabase JWT token in the Authorization header. Unauthenticated requests return `401 Unauthorized`.

Frontend should include the token when calling the lambda:

```typescript
const { data: { session } } = await supabase.auth.getSession();

fetch(LAMBDA_URL, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ hub, properties, team_time_budget_minutes })
});
```

## API

### Request

```json
{
  "hub": {
    "lat": 34.0522,
    "lng": -118.2437
  },
  "properties": [
    {
      "id": "prop-1",
      "lat": 34.0622,
      "lng": -118.2537,
      "service_time_minutes": 15,
      "address": "123 Main St"
    }
  ],
  "team_time_budget_minutes": 120
}
```

### Response

```json
{
  "route": {
    "stops": [
      {
        "property_id": "prop-1",
        "address": "123 Main St",
        "lat": 34.0622,
        "lng": -118.2537,
        "service_time_min": 15,
        "arrival_time": "2025-11-22T00:12:34Z"
      }
    ],
    "totals": {
      "travel_min": 27,
      "service_min": 45,
      "total_min": 72
    },
    "maps_url": "https://www.google.com/maps/dir/..."
  },
  "dropped": []
}
```

## Pricing

The Route Optimization API offers 5,000 free single-vehicle optimizations per month.
