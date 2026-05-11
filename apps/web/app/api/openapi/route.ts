import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  return NextResponse.json({
    openapi: "3.0.0",
    info: {
      title: "DVMBR Chat API",
      version: "1.0.0",
    },
    servers: [
      {
        url,
      },
    ],
    paths: {},
  });
}
