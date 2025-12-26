//"use client";

//import { NextResponse } from "next/server";

const PLANITGEO_API_KEY = process.env.PLANITGEO_API_KEY;
const username = process.env.PLANITGEO_USERNAME!;
const password = process.env.PLANITGEO_PASSWORD!;

if (!PLANITGEO_API_KEY || !username || !password) {
  throw new Error("Missing PLANITGEO_API_KEY, username, or password.");
}

const credentials = Buffer.from(`${username}:${password}`).toString("base64");

/*export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}*/

/*export async function fetchTrees() {
  const myHeader = new Headers();
  myHeader.append("Authorization", `Basic ${credentials}`);
  //myHeader.append("Accept", "application/json");

  const url = `https://pg-cloud.com/api/amigosdelosrios/inventories/trees?apiKey=${PLANITGEO_API_KEY}`;
  try {
    const response = await fetch(url, {
      headers: myHeader,
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching trees:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
    return [];
  }
}*/

export async function fetchTrees() {
  if (!PLANITGEO_API_KEY || !username || !password) {
    console.error("Missing PlanItGeo credentials or API key");
    return { features: [] }; // Safe fallback
  }

  const headers = new Headers();
  headers.append("Authorization", `Basic ${credentials}`);
  headers.append("Accept", "application/json");

  const filtersObj = {
    where: [{ field: "properties.organization", operator: "=", value: 999999 }],
  };

  const filters = encodeURIComponent(JSON.stringify(filtersObj));

  //const url = `https://pg-cloud.com/api/amigosdelosrios/inventories/trees?apiKey=${PLANITGEO_API_KEY}&filter[organization]=176&offset=50000&limit=10000`;

  const url = `https://pg-cloud.com/api/amigosdelosrios/inventories/trees?&apiKey=${PLANITGEO_API_KEY}&properties.organization=176`;
  //const url = `https://pg-cloud.com/api/amigosdelosrios/inventories/organization?apiKey=${PLANITGEO_API_KEY}`;

  try {
    const response = await fetch(url, { headers });

    if (!response.ok) {
      console.error(`PlanItGeo API returned status ${response.status}`);
      const text = await response.text(); // log response body
      console.error("Response body:", text.slice(0, 500));
      return { features: [] }; // Safe fallback
    }

    const data = await response.json();
    console.log(data);

    // Ensure the client always gets a `features` array
    return { features: data || [] };
  } catch (err) {
    console.error("Error fetching trees:", err);
    return { features: [] }; // Safe fallback
  }
}

export async function fetchTreesBatch(): Promise<unknown[]> {
  const headers = new Headers();
  headers.append("Authorization", `Basic ${credentials}`);
  headers.append("Accept", "application/json");

  const LIMIT = 5000;
  let offset = 0;
  const allTrees: unknown[] = [];

  while (true) {
    const url = `https://pg-cloud.com/api/amigosdelosrios/inventories/trees?apiKey=${PLANITGEO_API_KEY}&offset=${offset}&limit=${LIMIT}`;
    console.log(`Fetching trees offset=${offset} limit=${LIMIT}`);

    try {
      const res = await fetch(url, { headers });
      if (!res.ok) {
        const text = await res.text();
        console.error("API error:", res.status, text.slice(0, 500));
        break;
      }

      const json = await res.json();

      // Extract features: data > features
      const batchFeatures = json?.data?.features ?? [];
      console.log(`Fetched batch size: ${batchFeatures.length}`);

      allTrees.push(...batchFeatures);

      // Stop when fewer than LIMIT entries returned
      if (batchFeatures.length < LIMIT) {
        console.log("Reached last batch.");
        break;
      }

      offset += LIMIT;
    } catch (err) {
      console.error("Fetch error:", err);
      break;
    }
  }

  console.log(`Total trees fetched: ${allTrees.length}`);
  return allTrees;
}

export async function fetchTreesFake() {
  return {
    features: [
      { properties: { id: "1", species: "Oak", dbh: 12 } },
      { properties: { id: "2", species: "Maple", dbh: 8 } },
    ],
  };
}

/*export async function fetchTrees() {
  const res = await fetch("/api/planitgeo/trees");
  if (!res.ok) throw new Error("Failed to fetch trees");
  return res.json();
}*/

// export {};
