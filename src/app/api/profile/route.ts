import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const userId = (await cookieStore).get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
    }

    const { name, email } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: "Ad ve e-posta zorunludur." }, { status: 400 });
    }

    // E-posta benzersiz mi kontrol et
    const existingUserWithEmail = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUserWithEmail && existingUserWithEmail.id !== Number(userId)) {
      return NextResponse.json({ error: "Bu e-posta başka bir kullanıcı tarafından kullanılıyor." }, { status: 409 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(userId) },
      data: { name, email },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    return NextResponse.json({ user: updatedUser, message: "Profil başarıyla güncellendi!" }, { status: 200 });
  } catch (error) {
    console.error("Profil güncelleme hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
} 