import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const offer = await prisma.offer.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        message: data.message,
        packageName: data.packageName,
        status: "PENDING",
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
      whereClause.orderId = parseInt(userId, 10);
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