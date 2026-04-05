const PLANITGEO_API_KEY = process.env.PLANITGEO_API_KEY;
const username = process.env.PLANITGEO_USERNAME!;
const password = process.env.PLANITGEO_PASSWORD!;

if (!PLANITGEO_API_KEY || !username || !password) {
  throw new Error("Missing PLANITGEO_API_KEY, username, or password.");
}

const credentials = Buffer.from(`${username}:${password}`).toString("base64");

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
