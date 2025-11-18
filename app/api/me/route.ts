import {NextResponse} from "next/server";
import {requireUser} from "@/lib/auth";

export async function GET() {
  try {
    const user = await requireUser();

    return NextResponse.json(
      {
        id: user.id,
        username: user.username,
      },
      {status: 200}
    );
  } catch (error) {
    console.error("GET /api/me error:", error);
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
