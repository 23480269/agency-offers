const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.servicePackage.createMany({
    data: [
      {
        name: 'Starter Paket',
        price: 'Teklif Alın!',
        description: 'Büyüme aşamasındaki B2B marka ve işletmeler için uygun abonelik paketi.',
        features: 'Instagram & Facebook yönetimi,8 özel post tasarımı,Paylaşım onay sistemi,Instagram reklam yönetimi,Otomatik raporlama (PDF),Telefon ve e-posta desteği',
        icon: '🚀',
        cta: 'Teklif Al',
      },
      {
        name: 'Premium Paket',
        price: 'Teklif  Alın!',
        description: 'Fark yaratmak isteyen B2B marka ve işletmeler için uygun abonelik paketi.',
        features: 'Instagram, Facebook, Linkedin yönetimi,12 görsel & video post,Anlık raporlama (Pro),Google ve Instagram reklamları,Gelen mesaj & yorum takibi,Trello/Asana desteği,Aylık online toplantı',
        icon: '💎',
        cta: 'Teklif Al',
      },
      {
        name: 'Enterprise Paket',
        price: 'Teklif Alın!',
        description: 'Enterprise ölçeğindeki B2B markaların taleplerine özel efektif çözümler.',
        features: 'Tüm sosyal medya hesapları yönetimi,15+ paylaşım,Dijital strateji oluşturma,Pro+ reklam yönetimi,Animasyon & video edit,Haftalık online toplantı',
        icon: '🏆',
        cta: 'Teklif Al',
      },
    ],
    skipDuplicates: true,
  });
  console.log('Servicestaki paketler ServicePackage tablosuna eklendi!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
