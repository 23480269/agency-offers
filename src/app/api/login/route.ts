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

    const response = NextResponse.json({ 
      success: true,
      message: "Giriş başarılı!", 
      user: { id: user.id, name: user.name, email: user.email, role: user.role } 
    });

    // Cookie ayarları (Set-Cookie header üzerinden)
    const cookieHeader = [
      `userId=${user.id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`,
      `userRole=${user.role}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`
    ].join(", ");

    response.headers.set("Set-Cookie", cookieHeader);

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
