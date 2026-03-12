"use server";

const PLANITGEO_API_KEY = process.env.PLANITGEO_API_KEY;
const username = process.env.PLANITGEO_USERNAME!;
const password = process.env.PLANITGEO_PASSWORD!;

// Validate environment variables to fail fast rather than at request time
if (!PLANITGEO_API_KEY || !username || !password) {
  throw new Error("Missing PLANITGEO_API_KEY, username, or password.");
}

const credentials = Buffer.from(`${username}:${password}`).toString("base64");

// Headers required for all Planit-Geo calls, put in to a header to clean-up code basically
function getAuthHeaders(): Headers {
  const headers = new Headers();
  headers.append("Authorization", `Basic ${credentials}`);
  headers.append("Accept", "application/json");
  return headers;
}

// Fetches trees from only organization 176
export async function fetchTrees() {
  const url = `https://pg-cloud.com/api/amigosdelosrios/inventories/trees?&apiKey=${PLANITGEO_API_KEY}&properties.organization=176`;

  try {
    const res = await fetch(url, { headers: getAuthHeaders() });

    if (!res.ok) {
      const text = await res.text();
      console.error(`PlanItGeo API error ${res.status}:`, text.slice(0, 500));
      return { features: [] }; // Safe fallback
    }

    const data = await res.json();
    return { features: data || [] };
  } catch (err) {
    console.error("Error fetching trees:", err);
    return { features: [] };
  }
}

// Fetches ALL trees in batches of 5000
// Returns a flat array of all tree features across all pages
export async function fetchTreesBatch(): Promise<unknown[]> {
  const LIMIT = 5000;
  let offset = 0;
  const allTrees: unknown[] = [];

  while (true) {
    const url = `https://pg-cloud.com/api/amigosdelosrios/inventories/trees?apiKey=${PLANITGEO_API_KEY}&offset=${offset}&limit=${LIMIT}`;

    try {
      const res = await fetch(url, { headers: getAuthHeaders() });

      if (!res.ok) {
        const text = await res.text();
        console.error(`API error ${res.status}:`, text.slice(0, 500));
        break;
      }

      const json = await res.json();

      const batch = json?.data?.features ?? [];

      allTrees.push(...batch);

      // Stop when fewer than LIMIT entries returned
      if (batch.length < LIMIT) break;

      offset += LIMIT;
    } catch (err) {
      console.error("Fetch error:", err);
      break;
    }
  }

  return allTrees;
}
