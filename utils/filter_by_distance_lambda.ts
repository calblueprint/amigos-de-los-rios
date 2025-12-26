/**
 * AWS Lambda function for filtering properties by distance
 * Supports both API Gateway proxy integration and direct Lambda invocation
 */

/**
 * Represents a property with location data
 */
export interface PropertyWithLocation {
  "Primary ID": string;
  Address: string;
  Latitude: number;
  Longitude: number;
  [key: string]: unknown; // Allow for additional fields
}

/**
 * Represents a property with calculated distance
 */
export interface PropertyWithDistance extends PropertyWithLocation {
  distance_miles: number;
}

/**
 * Lambda function input parameters
 */
export interface FilterByDistanceInput {
  properties: PropertyWithLocation[];
  centerLat: number;
  centerLon: number;
  radiusMiles: number;
  extractKeyFieldsOnly?: boolean; // Optional: return only key fields
}

/**
 * Lambda function output
 */
export interface FilterByDistanceOutput {
  success: boolean;
  count: number;
  radiusMiles: number;
  center: {
    latitude: number;
    longitude: number;
  };
  properties:
    | PropertyWithDistance[]
    | Array<{
        "Primary ID": string;
        Address: string;
        Latitude: number;
        Longitude: number;
        distance_miles: number;
      }>;
  message?: string;
  error?: string;
}

/**
 * Lambda Context
 */
export interface LambdaContext {
  functionName: string;
  functionVersion: string;
  invokedFunctionArn: string;
  memoryLimitInMB: string;
  awsRequestId: string;
  logGroupName: string;
  logStreamName: string;
  getRemainingTimeInMillis(): number;
  [key: string]: unknown;
}

/**
 * Compute the great-circle distance between two points on Earth in miles
 * using the Haversine formula.
 *
 * @param lat1 - Latitude of the first point in degrees
 * @param lon1 - Longitude of the first point in degrees
 * @param lat2 - Latitude of the second point in degrees
 * @param lon2 - Longitude of the second point in degrees
 * @returns Distance in miles
 */
export function haversine(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 3958.8; // Earth radius in miles

  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const dphi = ((lat2 - lat1) * Math.PI) / 180;
  const dlambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dphi / 2) ** 2 +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(dlambda / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Filter properties within a specified radius from a center point.
 *
 * @param properties - Array of properties with location data
 * @param centerLat - Latitude of the center point
 * @param centerLon - Longitude of the center point
 * @param radiusMiles - Radius in miles
 * @returns Array of properties within the radius, with distance calculated
 * @throws Error if properties don't have required Latitude/Longitude fields
 */
export function propertiesWithinRadius(
  properties: PropertyWithLocation[],
  centerLat: number,
  centerLon: number,
  radiusMiles: number,
): PropertyWithDistance[] {
  // Validate that properties have required fields
  if (properties.length > 0) {
    const firstProperty = properties[0];
    if (!("Latitude" in firstProperty) || !("Longitude" in firstProperty)) {
      throw new Error("Properties must have 'Latitude' and 'Longitude' fields");
    }
  }

  // Calculate distances and filter
  const propertiesWithDistances: PropertyWithDistance[] = properties.map(
    property => ({
      ...property,
      distance_miles: haversine(
        centerLat,
        centerLon,
        property.Latitude,
        property.Longitude,
      ),
    }),
  );

  const nearbyProperties = propertiesWithDistances.filter(
    property => property.distance_miles <= radiusMiles,
  );

  console.log(
    `Found ${nearbyProperties.length} properties within ${radiusMiles} miles.`,
  );

  return nearbyProperties;
}

/**
 * Extract only relevant fields from properties with distance
 *
 * @param properties - Array of properties with distance
 * @returns Array of properties with only key fields
 */
export function extractKeyFields(properties: PropertyWithDistance[]): Array<{
  "Primary ID": string;
  Address: string;
  Latitude: number;
  Longitude: number;
  distance_miles: number;
}> {
  return properties.map(property => ({
    "Primary ID": property["Primary ID"],
    Address: property.Address,
    Latitude: property.Latitude,
    Longitude: property.Longitude,
    distance_miles: property.distance_miles,
  }));
}

/**
 * Validate input parameters
 */
function validateInput(input: unknown): input is FilterByDistanceInput {
  if (!input || typeof input !== "object") {
    return false;
  }

  const typed = input as FilterByDistanceInput;

  if (!Array.isArray(typed.properties)) {
    return false;
  }

  if (
    typeof typed.centerLat !== "number" ||
    typeof typed.centerLon !== "number" ||
    typeof typed.radiusMiles !== "number"
  ) {
    return false;
  }

  if (
    isNaN(typed.centerLat) ||
    isNaN(typed.centerLon) ||
    isNaN(typed.radiusMiles)
  ) {
    return false;
  }

  if (typed.radiusMiles < 0) {
    return false;
  }

  return true;
}

/**
 * Process the filter by distance request
 */
function processRequest(input: FilterByDistanceInput): FilterByDistanceOutput {
  try {
    const nearbyProperties = propertiesWithinRadius(
      input.properties,
      input.centerLat,
      input.centerLon,
      input.radiusMiles,
    );

    const properties = input.extractKeyFieldsOnly
      ? extractKeyFields(nearbyProperties)
      : nearbyProperties;

    return {
      success: true,
      count: nearbyProperties.length,
      radiusMiles: input.radiusMiles,
      center: {
        latitude: input.centerLat,
        longitude: input.centerLon,
      },
      properties,
      message: `Found ${nearbyProperties.length} properties within ${input.radiusMiles} miles`,
    };
  } catch (error) {
    throw new Error(
      `Error processing request: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * AWS Lambda Handler
 * Supports direct Lambda invocation only
 */
export async function handler(
  event: FilterByDistanceInput,
  context: LambdaContext,
): Promise<FilterByDistanceOutput> {
  console.log("Lambda invoked:", {
    requestId: context.awsRequestId,
    functionName: context.functionName,
    propertiesCount: event.properties?.length || 0,
  });

  try {
    // Validate input
    if (!validateInput(event)) {
      return {
        success: false,
        count: 0,
        radiusMiles: 0,
        center: { latitude: 0, longitude: 0 },
        properties: [],
        error:
          "Invalid input. Required: properties (array), centerLat (number), centerLon (number), radiusMiles (number >= 0)",
      };
    }

    // Process the request
    const result = processRequest(event);

    console.log("Processing completed:", {
      propertiesFound: result.count,
      radius: result.radiusMiles,
    });

    return result;
  } catch (error) {
    console.error("Error processing request:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return {
      success: false,
      count: 0,
      radiusMiles: event.radiusMiles || 0,
      center: {
        latitude: event.centerLat || 0,
        longitude: event.centerLon || 0,
      },
      properties: [],
      error: errorMessage,
    };
  }
}

// Export for testing or standalone use
export { handler as lambdaHandler };
