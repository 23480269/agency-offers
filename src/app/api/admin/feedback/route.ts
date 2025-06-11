import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Oturum açmanız gerekiyor" },
        { status: 401 }
      );
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Bu işlem için yetkiniz yok" },
        { status: 403 }
      );
    }

    const messages = await prisma.contactMessage.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(messages);
  } catch (error: any) {
    console.error("Geri bildirimleri alma hatası:", error);
    return NextResponse.json(
      { error: "Geri bildirimler alınırken bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Oturum açmanız gerekiyor" },
        { status: 401 }
      );
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Bu işlem için yetkiniz yok" },
        { status: 403 }
      );
    }

    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json(
        { error: "Geri bildirim ID gerekli." },
        { status: 400 }
      );
    }

    await prisma.contactMessage.delete({
      where: { id: Number(id) }
    });

    return NextResponse.json({ message: "Geri bildirim silindi." });
  } catch (error: any) {
    console.error("Geri bildirim silme hatası:", error);
    return NextResponse.json(
      { error: "Geri bildirim silinirken bir hata oluştu." },
      { status: 500 }
    );
  }
} 