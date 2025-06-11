import Link from "next/link";
import Chat from "./components/Chat";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-blue-100 via-white to-blue-50 min-h-screen">
      <section className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 text-blue-900 drop-shadow-lg leading-tight">
          Markanızı Dijitalde Yükseltin: <span className="text-blue-600">Sosyal Medya ve Web Yönetimi</span>
        </h1>
        <p className="text-lg sm:text-xl text-blue-800 mb-8 max-w-2xl font-medium leading-relaxed">
          İşletmenizin çevrimiçi varlığını güçlendirmek için yenilikçi stratejiler ve profesyonel çözümler sunuyoruz. Hedef kitlenize ulaşın, markanızın hikayesini anlatın ve dijital dünyada fark yaratın.
        </p>
      </section>
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8 text-blue-900 text-center">Çalışma Sürecimiz</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center border border-blue-100 hover:shadow-2xl transition">
            <div className="text-4xl mb-3">📝</div>
            <div className="font-bold mb-2 text-blue-800">1. Üye Ol & Paketini Seç</div>
            <div className="text-blue-700 text-sm">Hesabını oluştur, sana en uygun sosyal medya paketini seç ve başvurunu tamamla.</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center border border-blue-100 hover:shadow-2xl transition">
            <div className="text-4xl mb-3">🤝</div>
            <div className="font-bold mb-2 text-blue-800">2. Online Toplantı</div>
            <div className="text-blue-700 text-sm">Ekibimizle online toplantı yap, markanı ve ihtiyaçlarını anlat, süreci başlat.</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center border border-blue-100 hover:shadow-2xl transition">
            <div className="text-4xl mb-3">🚀</div>
            <div className="font-bold mb-2 text-blue-800">3. Onayla & Paylaşalım</div>
            <div className="text-blue-700 text-sm">Hazırlanan içerikleri onayla, sosyal medya hesaplarında paylaşmaya başlayalım.</div>
          </div>
        </div>
      </section>
      <Chat />
    </div>
  );
}
