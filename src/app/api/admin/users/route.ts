import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  console.log("DATABASE_URL:", process.env.DATABASE_URL);
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(users);
  } catch (error: any) {
    console.error("Kullanıcıları alma hatası:", error.message || error);
    return NextResponse.json(
      { error: "Kullanıcılar alınırken bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "Kullanıcı ID gerekli." }, { status: 400 });
  }
  try {
    await prisma.user.delete({ where: { id: id } });
    return NextResponse.json({ message: "Kullanıcı silindi." });
  } catch (error: any) {
    console.error("Kullanıcı silme hatası:", error.message || error);
    return NextResponse.json(
      { error: "Kullanıcı silinirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const { id, role, currentUserId } = await req.json();
  if (!id || !role) {
    return NextResponse.json({ error: "Kullanıcı ID ve yeni rol gerekli." }, { status: 400 });
  }
  // Admin kendi rolünü değiştiremez
  if (id === currentUserId) {
    return NextResponse.json({ error: "Admin kendi rolünü değiştiremez." }, { status: 403 });
  }
  try {
    const updated = await prisma.user.update({
      where: { id: id },
      data: { role },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    return NextResponse.json({ user: updated, message: "Rol güncellendi." });
  } catch (error: any) {
    console.error("Rol güncelleme hatası:", error.message || error, "Hata ayrıntıları:", error);
    return NextResponse.json(
      { error: "Rol güncellenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}