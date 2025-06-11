export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-8 text-blue-900 text-center">Hakkımızda</h1>
      
      <div className="bg-white rounded-xl shadow-lg p-8 mb-12 border border-blue-100">
        <h2 className="text-2xl font-bold mb-6 text-blue-800">Biz Kimiz?</h2>
        <p className="text-lg text-blue-700 mb-6">
          3C Dijital olarak, 2012 yılında dijital dünyada markaların başarıya ulaşması için yola çıktık. 
          Sosyal medya yönetimi, içerik üretimi ve dijital pazarlama alanlarında uzman ekibimizle, 
          işletmelerin dijital varlıklarını güçlendiriyor ve hedef kitlelerine ulaşmalarını sağlıyoruz.
        </p>
        <p className="text-lg text-blue-700">
          Müşteri odaklı yaklaşımımız ve yenilikçi stratejilerimizle, her markanın kendine özgü 
          dijital yolculuğunda güvenilir bir partner olmayı hedefliyoruz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
          <div className="text-4xl mb-4 text-center">🎯</div>
          <h3 className="text-xl font-bold mb-3 text-blue-800 text-center">Misyonumuz</h3>
          <p className="text-blue-700 text-center">
            İşletmelerin dijital dünyada öne çıkmasını sağlayarak, sürdürülebilir büyüme ve başarı elde etmelerine yardımcı olmak.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
          <div className="text-4xl mb-4 text-center">👀</div>
          <h3 className="text-xl font-bold mb-3 text-blue-800 text-center">Vizyonumuz</h3>
          <p className="text-blue-700 text-center">
            Dijital pazarlama alanında lider konuma gelerek, yenilikçi çözümlerle markaların dijital başarısına katkıda bulunmak.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
          <div className="text-4xl mb-4 text-center">💎</div>
          <h3 className="text-xl font-bold mb-3 text-blue-800 text-center">Değerlerimiz</h3>
          <p className="text-blue-700 text-center">
            Şeffaflık, yenilikçilik, müşteri memnuniyeti ve sürekli gelişim prensiplerini benimseyerek hizmet veriyoruz.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 border border-blue-100">
        <h2 className="text-2xl font-bold mb-6 text-blue-800">Neden Biz?</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="text-2xl">✨</div>
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Uzman Ekip</h3>
              <p className="text-blue-700">Alanında uzman ve deneyimli ekibimizle kaliteli hizmet sunuyoruz.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="text-2xl">📊</div>
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Veri Odaklı Yaklaşım</h3>
              <p className="text-blue-700">Analitik veriler ışığında stratejik kararlar alıyor ve ölçülebilir sonuçlar elde ediyoruz.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="text-2xl">🎨</div>
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Yaratıcı Çözümler</h3>
              <p className="text-blue-700">Her markaya özel, yaratıcı ve etkili dijital stratejiler geliştiriyoruz.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="text-2xl">🤝</div>
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Müşteri Odaklılık</h3>
              <p className="text-blue-700">Müşterilerimizin ihtiyaçlarını anlıyor ve beklentilerini aşan çözümler sunuyoruz.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 