import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const userRole = session?.user?.role;

    if (userId && userRole) {
      return NextResponse.json({ isAuthenticated: true, userId, userRole });
    } else {
      return NextResponse.json({ isAuthenticated: false });
    }
  } catch (error) {
    console.error("Auth status API hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
