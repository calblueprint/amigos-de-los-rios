export async function fetchInventories() {
  const res = await fetch(
    "https://427414de-ffb2-41cf-94ec-94ddd9db79e2.mock.pstmn.io/api/tpdemo/inventories",
    { headers: { "Content-Type": "application/json" } },
  );

  if (!res.ok) throw new Error("Failed to fetch inventories");
  return res.json();
}
