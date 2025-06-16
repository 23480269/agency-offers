import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const packages = await prisma.servicePackage.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(packages);
  } catch (error) {
    console.error("Error reading service packages:", error);
    return NextResponse.json({ error: "Paketler okunamadı" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { packages } = await request.json();
    for (const pkg of packages) {
      await prisma.servicePackage.update({
        where: { id: pkg.id },
        data: {
          name: pkg.name,
          description: pkg.description,
          price: pkg.price,
          features: pkg.features,
          icon: pkg.icon,
          cta: pkg.cta,
        },
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating service packages:", error);
    return NextResponse.json({ error: "Paketler güncellenemedi" }, { status: 500 });
  }
}