import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      include: { category: true },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(services);
  } catch (error) {
    console.error("Error reading services:", error);
    return NextResponse.json({ error: "Hizmetler okunamadı" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { services } = await request.json();
    // Her bir servisi güncelle
    for (const service of services) {
      await prisma.service.update({
        where: { id: service.id },
        data: {
          name: service.name,
          description: service.description,
          price: parseFloat(service.price),
          categoryId: service.categoryId,
        },
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating services:", error);
    return NextResponse.json({ error: "Hizmetler güncellenemedi" }, { status: 500 });
  }
}