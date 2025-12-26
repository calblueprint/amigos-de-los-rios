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
