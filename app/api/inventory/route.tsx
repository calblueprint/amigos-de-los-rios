import { NextResponse } from "next/server";

export async function GET() {
  // 🔹 This should be your Postman mock URL:
  const mockUrl =
    "https://427414de-ffb2-41cf-94ec-94ddd9db79e2.mock.pstmn.io/api/tpdemo/inventories";

  try {
    const res = await fetch(mockUrl);
    const data = await res.json();

    return NextResponse.json(data);
  } catch (err) {
    console.error("Mock fetch failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch mock data" },
      { status: 500 },
    );
  }
}
