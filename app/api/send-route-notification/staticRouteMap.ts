import crypto from "crypto";

/** Required server env: Maps Static API key (restrict to Static Maps only in GCP). */
/** Recommended: URL signing secret from Google Cloud (same key pair used for Static Maps signing). */

export type LatLng = { lat: number; lng: number };

const STATIC_MAP_ENDPOINT = "https://maps.googleapis.com/maps/api/staticmap";
/** Stay under Static API max URL length with margin; switch to encoded polyline when longer. */
const MAX_UNSIGNED_URL_LENGTH = 15360;

function parseLatLngPair(value: string): LatLng | null {
  const parts = value.split(",").map(s => s.trim());
  if (parts.length !== 2) return null;
  const lat = Number(parts[0]);
  const lng = Number(parts[1]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}

/**
 * Parses Google Maps dir URLs produced by route generation (`origin`, `destination`, `waypoints`).
 */
export function parseMapsDirLink(mapsLink: string | null): {
  hub: LatLng;
  waypoints: LatLng[];
} | null {
  if (!mapsLink?.trim()) return null;
  try {
    const u = new URL(mapsLink);
    const origin = u.searchParams.get("origin");
    const destination = u.searchParams.get("destination");
    const waypointsRaw = u.searchParams.get("waypoints");
    if (!origin || !destination) return null;
    const hub = parseLatLngPair(origin);
    if (!hub || !parseLatLngPair(destination)) return null;

    const waypoints: LatLng[] = [];
    if (waypointsRaw) {
      for (const part of waypointsRaw.split("|")) {
        const p = parseLatLngPair(part.trim());
        if (p) waypoints.push(p);
      }
    }

    return { hub, waypoints };
  } catch {
    return null;
  }
}

function encodeSignedNumber(num: number): string {
  let sgnNum = num << 1;
  if (num < 0) {
    sgnNum = ~sgnNum;
  }
  let encoded = "";
  while (sgnNum >= 0x20) {
    encoded += String.fromCharCode((0x20 | (sgnNum & 0x1f)) + 63);
    sgnNum >>= 5;
  }
  encoded += String.fromCharCode(sgnNum + 63);
  return encoded;
}

/** Encoded polyline (precision 5) for Maps Static `path=...|enc:...`. */
function encodePolyline(points: LatLng[]): string {
  let prevLat = 0;
  let prevLng = 0;
  let encoded = "";
  for (const point of points) {
    const lat = Math.round(point.lat * 1e5);
    const lng = Math.round(point.lng * 1e5);
    encoded += encodeSignedNumber(lat - prevLat);
    encoded += encodeSignedNumber(lng - prevLng);
    prevLat = lat;
    prevLng = lng;
  }
  return encoded;
}

function loopPathPoints(hub: LatLng, waypoints: LatLng[]): LatLng[] {
  return [hub, ...waypoints, hub];
}

function buildPathParamExplicit(points: LatLng[]): string {
  const body = points.map(p => `${p.lat},${p.lng}`).join("|");
  return `color:0x4285F4|weight:4|${body}`;
}

function buildPathParamEncoded(points: LatLng[]): string {
  return `color:0x4285F4|weight:4|enc:${encodePolyline(points)}`;
}

/**
 * Signs a Maps Static API URL per Google (HMAC-SHA1 over path + query, secret is URL-safe base64).
 */
export function signStaticMapUrl(
  unsignedHttpsUrl: string,
  secretBase64Url: string,
): string {
  const u = new URL(unsignedHttpsUrl);
  const pathAndQuery = `${u.pathname}${u.search}`;
  const decodedSecret = Uint8Array.from(
    Buffer.from(
      secretBase64Url.replace(/-/g, "+").replace(/_/g, "/"),
      "base64",
    ),
  );
  const signature = crypto
    .createHmac("sha1", decodedSecret)
    .update(pathAndQuery)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const sep = u.search ? "&" : "?";
  return `${unsignedHttpsUrl}${sep}signature=${signature}`;
}

function buildUnsignedUrl(params: URLSearchParams): string {
  return `${STATIC_MAP_ENDPOINT}?${params.toString()}`;
}

/**
 * Returns a fully qualified Static Maps image URL, optionally signed.
 * Uses explicit lat,lng path, or encoded polyline if the URL would exceed limits.
 */
export function buildRouteStaticMapUrl(mapsLink: string | null): string | null {
  const parsed = parseMapsDirLink(mapsLink);
  const apiKey = process.env.GOOGLE_MAPS_STATIC_API_KEY?.trim();
  if (!parsed || !apiKey) return null;

  const { hub, waypoints } = parsed;

  const params = new URLSearchParams();
  params.set("size", "640x360");
  params.set("scale", "2");
  params.set("maptype", "roadmap");
  params.set("key", apiKey);

  let unsignedUrl: string;

  if (waypoints.length === 0) {
    params.set("center", `${hub.lat},${hub.lng}`);
    params.set("zoom", "14");
    params.set("markers", `color:0xEA4335|${hub.lat},${hub.lng}`);
    unsignedUrl = buildUnsignedUrl(params);
  } else {
    const loop = loopPathPoints(hub, waypoints);
    params.set("path", buildPathParamExplicit(loop));
    unsignedUrl = buildUnsignedUrl(params);
    if (unsignedUrl.length > MAX_UNSIGNED_URL_LENGTH) {
      params.set("path", buildPathParamEncoded(loop));
      unsignedUrl = buildUnsignedUrl(params);
    }
    if (unsignedUrl.length > MAX_UNSIGNED_URL_LENGTH) {
      return null;
    }
  }

  const signingSecret =
    process.env.GOOGLE_MAPS_STATIC_URL_SIGNING_SECRET?.trim();
  if (signingSecret) {
    return signStaticMapUrl(unsignedUrl, signingSecret);
  }

  return unsignedUrl;
}
