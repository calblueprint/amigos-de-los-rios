import { NextResponse } from "next/server";
import { fetchTreesBatch } from "@/actions/planitgeo/queries/query";

export async function GET() {
  console.log("GET /api/inventory called");
  try {
    const trees = await fetchTreesBatch();
    console.log("Fetched trees:", trees);
    return NextResponse.json(trees);
  } catch (error) {
    console.error("Error in GET /api/inventory:", error);
    return new Response("Failed to fetch trees", { status: 500 });
  }
}
