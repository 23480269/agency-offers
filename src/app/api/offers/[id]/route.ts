import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();
    const id = params.id;

    if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'Geçersiz durum değeri' },
        { status: 400 }
      );
    }

    const offer = await prisma.offer.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(offer);
  } catch (error) {
    console.error('Teklif güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Teklif güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}