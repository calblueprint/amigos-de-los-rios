# Route Generation Lambda

AWS Lambda function that generates optimized watering routes using Google's Route Optimization API.

## Features

- OAuth2 authentication with Google Cloud service account
- Single vehicle route optimization
- Time budget constraints
- Real-time travel time calculations
- Google Maps navigation URLs

## Setup

### Prerequisites

1. AWS Lambda function deployed with Function URL
2. Google Cloud Project with Route Optimization API enabled
3. Google Cloud service account with Route Optimization Editor role

### Environment Variables

These variables are configured in AWS Lambda:

- `GOOGLE_CLOUD_PROJECT_ID`: Google Cloud project ID
- `GOOGLE_SERVICE_ACCOUNT_KEY`: Base64-encoded service account JSON key

### Installation

```bash
npm install
```

## Deployment

1. Package the function:
```bash
npm run zip
```

2. Deploy to AWS Lambda:
```bash
aws lambda update-function-code \
  --function-name route-generation \
  --zip-file fileb://function.zip \
  --region us-west-2
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
