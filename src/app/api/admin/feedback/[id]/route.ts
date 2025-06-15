// src/app/admin/feedback/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // '@/lib/prisma' dosyanızda dışa aktardığınız PrismaClient instance'ı
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // '@/lib/auth' dosyanızda dışa aktardığınız NextAuth seçenekleri

// GET isteği: Tüm geri bildirim mesajlarını getirir
export async function GET(request: Request) {
  try {
    const session = await getServerSession({ req: request, ...authOptions });

    // Kullanıcının oturum açmış ve ADMIN rolüne sahip olup olmadığını kontrol et
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Bu işlemi yapmaya yetkiniz yok." },
        { status: 403 } // Forbidden
      );
    }

    // Yetkilendirme başarılıysa, veritabanından mesajları çek
    const messages = await prisma.contactMessage.findMany({
      orderBy: {
        createdAt: "desc", // En yeni mesajları en üstte göstermek için
      },
    });

    // Başarılı yanıt
    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    // Hata durumunda konsola yaz ve 500 yanıtı dön
    console.error("API /api/admin/feedback GET hatası:", error);
    return NextResponse.json(
      { error: "Geri bildirimler getirilemedi." },
      { status: 500 } // Internal Server Error
    );
  }
}

// DELETE isteği: Belirli bir geri bildirim mesajını siler
// NOT: Bu DELETE fonksiyonu, '/api/admin/feedback/[id]' şeklinde bir URL'den çağrılsa bile,
// Next.js App Router'da aynı route.ts dosyasında olduğunda 'params' otomatik olarak gelmez.
// ID'yi URL'den manuel olarak ayrıştırmanız gerekir.
// Eğer DELETE'i '/api/admin/feedback/[id]/route.ts' ayrı bir dosyada tutsaydınız, 'params' doğrudan gelirdi.
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession({ req: request, ...authOptions });

    // Kullanıcının ADMIN olup olmadığını kontrol et
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Bu işlem için yetkiniz yok." },
        { status: 403 } // Forbidden
      );
    }

    // URL'den ID'yi ayrıştırma (örneğin: /api/admin/feedback?id=123 veya /api/admin/feedback/123)
    const url = new URL(request.url);
    const lastPathSegment = url.pathname.split('/').pop(); // "/api/admin/feedback" ise 'feedback' veya "/api/admin/feedback/123" ise '123'
    let id: number | undefined;

    // Eğer son segment bir sayı ise onu ID olarak al
    if (lastPathSegment && !isNaN(parseInt(lastPathSegment))) {
        id = parseInt(lastPathSegment);
    } else {
        // Query parametresinden ID almayı da deneyebiliriz (örn: /api/admin/feedback?id=123)
        const queryId = url.searchParams.get('id');
        if (queryId && !isNaN(parseInt(queryId))) {
            id = parseInt(queryId);
        }
    }

    if (typeof id === 'undefined' || isNaN(id)) {
      return NextResponse.json(
        { error: "Geçersiz veya eksik geri bildirim ID'si." },
        { status: 400 } // Bad Request
      );
    }

    // Veritabanından mesajı sil
    await prisma.contactMessage.delete({
      where: { id },
    });

    // Başarılı silme yanıtı
    return new NextResponse(null, { status: 204 }); // 204 No Content, genellikle silme işlemleri için kullanılır
  } catch (error) {
    console.error("API /api/admin/feedback DELETE hatası:", error);
    // Hata durumunda, silinemediğini belirten yanıt dön
    return NextResponse.json(
      { error: "Geri bildirim silinemedi." },
      { status: 500 } // Internal Server Error
    );
  }
}