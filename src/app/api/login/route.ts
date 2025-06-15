import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Tüm alanlar zorunludur." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json({ error: "Şifre hatalı." }, { status: 401 });
    }

    console.log("Login successful for user:", user.id, user.email, "Role:", user.role);
    console.log("User ID before setting cookie:", user.id);

    const response = NextResponse.json({ 
      success: true,
      message: "Giriş başarılı!", 
      user: { id: user.id, name: user.name, email: user.email, role: user.role } 
    });

    // Next.js 13+ için cookie'leri bu şekilde ayarlayın
    response.cookies.set("userId", user.id, { path: "/", httpOnly: true, sameSite: "lax", maxAge: 604800 });
    response.cookies.set("userRole", user.role, { path: "/", httpOnly: true, sameSite: "lax", maxAge: 604800 });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
