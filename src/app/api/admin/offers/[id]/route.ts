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
  { params }: { params: { id: string } } // Parametreleri burada doğrudan tiplendirin
) {
  try {
    const data = await request.json();
    const { status } = data; // İstek gövdesinden 'status' bilgisini al

    // Prisma kullanarak teklifi güncelle
    const offer = await prisma.offer.update({
      where: {
        id: params.id, // URL parametresinden gelen ID'yi kullan
      },
      data: {
        status, // 'status' alanını güncelle
      },
    });

    console.log(`Teklif ID'si için PUT isteği alındı: ${params.id} veriyle birlikte:`, data); // Konsol çıktısı Türkçe

    // Güncellenmiş teklifi JSON olarak döndür
    return NextResponse.json(offer);
  } catch (error) {
    console.error("Teklif güncellenirken bir hata oluştu:", error); // Hata konsol çıktısı Türkçe
    return NextResponse.json(
      { error: "Teklif güncellenirken bir hata oluştu" }, // Hata mesajı Türkçe
      { status: 500 } // HTTP 500 status kodu
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
