import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Tüm alanlar zorunludur." }, { status: 400 });
    }

    // Email benzersiz mi?
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Bu e-posta ile zaten bir kullanıcı var." }, { status: 409 });
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Kullanıcıyı oluştur
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        // rol: varsayılan olarak USER (enum)
      },
    });

    // Sadece başarılı mesajı dön, yönlendirmeyi frontend yapsın
    return NextResponse.json({ success: true, message: "Kayıt başarılı! Lütfen giriş yapın." }, { status: 201 });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}