import { NextResponse } from "next/server";
import { generateOpenAPIDocument } from "@/lib/openapi/generate";

export async function GET() {
  const document = generateOpenAPIDocument();
  return NextResponse.json(document);
}
