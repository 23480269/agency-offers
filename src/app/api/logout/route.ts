import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const response = NextResponse.json({ message: "Çıkış başarılı." });
    response.cookies.set("userId", "", { httpOnly: true, path: "/", maxAge: 0 });
    response.cookies.set("userRole", "", { httpOnly: true, path: "/", maxAge: 0 });
    console.log("Logout API: Cookies cleared.");
    return response;
  } catch (error) {
    console.error("Logout API hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
} 