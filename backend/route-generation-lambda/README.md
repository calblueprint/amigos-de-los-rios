# Route Generation Lambda

AWS Lambda function that generates optimized watering routes. Work in progress.

## Security Model

**Authentication:** Validates Supabase JWT tokens to prevent unauthorized access.  
**CORS:** Restricts requests to frontend domain.  
**Secrets:** All sensitive values stored as Lambda environment variables.

## How It Works

```
Frontend (logged in) → Gets JWT from Supabase → Calls Lambda with JWT → Lambda validates → Returns routes
```

## Response Format

```json
{
  "routes": [
    {
      "vehicle_id": "A-1",
      "team_type": "A",
      "totals": { "travel_min": 45, "service_min": 120, "route_min": 165 },
      "stops": [
        { "property_id": "p1", "address": "123 Oak St", "est_service_min": 30, "travel_time_min": 10 }
      ],
      "maps_urls": ["https://www.google.com/maps/dir/..."]
    }
  ],
  "dropped": []
}
```

## Deployment

### Environment Variables (Already Set)

```
SUPABASE_JWT_SECRET = your-jwt-secret-from-supabase-dashboard
ALLOWED_ORIGIN = http://localhost:3000 (dev) or https://yourdomain.com (prod)
```

### Deploying Code

```bash
cd backend/route-generation-lambda
pnpm run zip
aws lambda update-function-code --function-name route-generation --zip-file fileb://function.zip
```

## Frontend Integration

Call from frontend:
```typescript
const { data: { session } } = await supabase.auth.getSession();

const response = await fetch(process.env.NEXT_PUBLIC_LAMBDA_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.access_token}`
  },
  body: JSON.stringify({ /* route params */ })
});

const routes = await response.json();
```