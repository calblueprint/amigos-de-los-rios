import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { token } = body;

  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const lambdaRes = await fetch(process.env.LAMBDA_FUNCTION_URL!, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const lambdaBody = await lambdaRes.text();
  return NextResponse.json(
    { message: lambdaBody },
    { status: lambdaRes.status },
  );
}
