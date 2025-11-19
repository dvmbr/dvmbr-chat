import {clearSession} from "@/lib/auth";
import {NextResponse} from "next/server";

// POST /api/logout
export async function POST() {
  try {
    await clearSession();

    return NextResponse.json({ok: true}, {status: 200});
  } catch (error) {
    console.error("POST /api/logout error:", error);
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
