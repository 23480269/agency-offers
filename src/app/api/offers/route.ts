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

    const whereClause: { order?: { id?: number } } = {};
    // If userId is provided, filter offers by orders associated with that user.
    // Note: This assumes a relationship between User and Order, and Order and Offer.
    // For a direct filter by user, you might need a userId field on the Offer model,
    // or fetch orders first and then filter offers by those order IDs.
    // Given the current schema, filtering by order associated with a user would be complex here.
    // We will assume for now that if userId is passed, it's actually the orderId we want to filter by
    // This needs to be clarified by the user or schema adjusted.
    if (userId) {
      // This is a temporary assumption. userId in the query string is actually orderId from the previous context
      // as per `OfferList.tsx` trying to fetch `/api/offers?userId=${userId}` where userId is actually orderId in context of the offer.
      whereClause.order = { id: parseInt(userId, 10) };
    }

    const offers = await prisma.offer.findMany({
      where: whereClause,
      include: {
        order: true,
      },
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