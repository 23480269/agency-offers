import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
export const dynamic = "force-dynamic";


export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;
    const userRole = cookieStore.get("userRole")?.value;

    console.log("Auth Status Check: userId=", userId, "userRole=", userRole);

    if (userId && userRole) {
      return NextResponse.json({ isAuthenticated: true, userId: userId, userRole });
    } else {
      return NextResponse.json({ isAuthenticated: false });
    }
  } catch (error) {
    console.error("Auth status API hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
} 