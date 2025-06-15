// .next/types/app/api/admin/offers/[id]/route.ts
// Bu dosya, Next.js API rotasının [id] gibi dinamik parametreleri doğru bir şekilde
// işlemesi ve karşılaştığınız tip hatasını önlemesi için doğru yapıyı gösterir.

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma"; // Prisma import'u eklendi

// Rota parametrelerinizin şeklini tanımlayın.
// Buradaki 'id', klasör adındaki dinamik segment [id] ile eşleşir.
// Bu interface hala kullanılabilir ancak parametre tiplendirmesi doğrudan fonksiyon imzasında yapılacaktır.
interface RouteParams {
  id: string;
}

// API rotası için GET işleyicisi.
// İşleyici fonksiyonunun ikinci argümanını, 'params' nesnesi doğrudan alınacak şekilde güncelledik.
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } } // Parametreleri burada doğrudan tiplendirin
) {
  const { id } = params; // 'id'yi doğrudan parametrelerden ayırın

  console.log(`Teklif ID'si için GET isteği alındı: ${id}`); // Konsol çıktısı Türkçe

  // Örnek: ID'ye göre veri çekme
  // Gerçek bir uygulamada, bir veritabanından veya servisten veri çekersiniz.
  const offerData = {
    id: id,
    name: `Teklif ${id}`, // Display öğesi Türkçe
    description: `Teklif numarası ${id} için detaylar.`, // Display öğesi Türkçe
    status: 'aktif', // Display öğesi Türkçe
  };

  // JSON yanıtı döndür
  return NextResponse.json(offerData);
}

// API rotası için PUT işleyicisi.
// İşleyici fonksiyonunun ikinci argümanını, 'params' nesnesi doğrudan alınacak şekilde güncelledik.
export async function PUT(
  request: NextRequest,
  context: Promise<{ params: { id: string } }>
) {
  try {
    const { params } = await context;
    const data = await request.json();
    const { status } = data;

    const offer = await prisma.offer.update({
      where: {
        id: params.id,
      },
      data: {
        status,
      },
    });

    return NextResponse.json(offer);
  } catch (error) {
    console.error("Error updating offer:", error);
    return NextResponse.json(
      { error: "Teklif güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// İhtiyaca göre diğer HTTP metotlarını (DELETE veya POST) ekleyebilirsiniz.
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } } // Parametreleri burada doğrudan tiplendirin
) {
  const { id } = params;
  console.log(`Teklif ID'si için DELETE isteği alındı: ${id}`); // Konsol çıktısı Türkçe

  // Örnek: ID'ye göre veriyi silme
  // Gerçek bir uygulamada, veritabanınızdaki bir kaydı silersiniz.
  const isDeleted = true; // Silme başarısını simüle edin

  if (isDeleted) {
    return NextResponse.json({ message: `Teklif ${id} başarıyla silindi` }); // Display öğesi Türkçe
  } else {
    return NextResponse.json({ message: `Teklif ${id} silinemedi` }, { status: 500 }); // Display öğesi Türkçe
  }
}
