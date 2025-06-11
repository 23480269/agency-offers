import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Form verilerini doğrula
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Tüm alanları doldurunuz" },
        { status: 400 }
      );
    }

    // E-posta formatını doğrula
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Geçerli bir e-posta adresi giriniz" },
        { status: 400 }
      );
    }

    // Mesajı veritabanına kaydet
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
      },
    });

    if (!contactMessage) {
      throw new Error("Mesaj kaydedilemedi");
    }

    return NextResponse.json(
      { message: "Mesajınız başarıyla gönderildi", data: contactMessage },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Contact form error:", error);
    
    // Veritabanı bağlantı hatası kontrolü
    if (error.code === "P1001") {
      return NextResponse.json(
        { error: "Veritabanı bağlantısı kurulamadı. Lütfen daha sonra tekrar deneyin." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Mesajınız gönderilemedi. Lütfen daha sonra tekrar deneyin." },
      { status: 500 }
    );
  }
} 