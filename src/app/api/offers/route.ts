import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Oturum bulunamadı" }, { status: 401 });
    }
    const data = await request.json();
    const offer = await prisma.offer.create({
      data: {
        name: data.name || data.title || "", // frontendden gelen alanlara uyum
        email: data.email || "", // zorunlu değilse boş bırak
        phone: data.phone || "",
        company: data.company || "",
        message: data.message || data.description || "",
        packageName: data.packageName || "",
        status: "PENDING",
        userId: session.user.id,
      },
    });
    return NextResponse.json(offer);
  } catch (error) {
    console.error("Error creating offer:", error);
    return NextResponse.json(
      { error: "Teklif oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    let whereClause: any = {};
    if (userId) {
      whereClause.userId = userId;
    }
    const offers = await prisma.offer.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(offers);
  } catch (error) {
    console.error('Teklifleri getirme hatası:', error);
    return NextResponse.json(
      { error: 'Teklifler getirilirken bir hata oluştu' },
      { status: 500 }
    );
  }
}