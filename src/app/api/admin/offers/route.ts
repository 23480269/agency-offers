import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const offers = await prisma.offer.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(offers);
  } catch (error) {
    console.error("Error fetching offers:", error);
    return NextResponse.json(
      { error: "Teklifler alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json();
  if (!id || !status) {
    return NextResponse.json(
      { error: "Teklif ID ve durum gerekli." },
      { status: 400 }
    );
  }

  try {
    const offer = await prisma.offer.update({
      where: { id: id },
      data: { status },
    });
    return NextResponse.json(offer);
  } catch (error) {
    console.error("Teklif güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Teklif güncellenemedi." },
      { status: 500 }
    );
  }
} 