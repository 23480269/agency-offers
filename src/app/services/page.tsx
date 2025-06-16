"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ServicePackage {
  id: number;
  name: string;
  price: string;
  description: string;
  features: string;
  icon: string;
  cta: string;
}

export default function ServicesPage() {
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/services")
      .then((res) => res.json())
      .then((data) => setPackages(data))
      .catch(() => setPackages([]));
    // Kullanıcı oturum kontrolü
    fetch("/api/auth-status")
      .then((res) => res.json())
      .then((data) => setIsAuthenticated(data.isAuthenticated))
      .catch(() => setIsAuthenticated(false));
  }, []);

  const handleTeklifClick = (pkgName: string) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setFormData({ name: "", email: "", phone: "", company: "", message: "" });
    setSubmitStatus(null);
    setSelectedPackage(pkgName);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      const response = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, packageName: selectedPackage }),
      });
      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", phone: "", company: "", message: "" });
        setTimeout(() => {
          setSelectedPackage(null);
          setSubmitStatus(null);
        }, 2000);
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-100 via-white to-blue-50 min-h-screen py-12">
      <h1 className="text-3xl font-extrabold mb-8 text-center text-blue-900 drop-shadow">Sosyal Medya Yönetim Paketleri</h1>
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4">
        {packages.map((pkg, i) => (
          <div key={pkg.id} className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center border border-blue-200 hover:shadow-2xl transition">
            <div className="text-5xl mb-4">{pkg.icon}</div>
            <div className="text-xl font-bold mb-2 text-blue-800">{pkg.name}</div>
            <div className="text-lg font-semibold mb-2 text-blue-900">{pkg.price}</div>
            <div className="text-blue-700 mb-4 text-center">{pkg.description}</div>
            <ul className="text-sm text-blue-800 mb-6 list-disc list-inside text-left w-full max-w-xs mx-auto space-y-1">
              {pkg.features.split(",").map((f, idx) => (
                <li key={idx}>{f.trim()}</li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => handleTeklifClick(pkg.name)}
              className="bg-blue-700 text-white px-6 py-2 rounded-full font-semibold shadow transition w-full text-center hover:bg-blue-800"
            >
              {pkg.cta}
            </button>
          </div>
        ))}
      </div>
      {/* Offer Form Modal */}
      {selectedPackage && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full relative">
            <div className="flex flex-col items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center break-words">
                {packages.find((p) => p.name === selectedPackage)?.name || selectedPackage} için Teklif Al
              </h2>
              <button onClick={() => setSelectedPackage(null)} className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 text-2xl">✕</button>
            </div>
            {submitStatus === "success" ? (
              <div className="text-center py-8">
                <div className="text-green-500 text-5xl mb-4">✓</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Teklifiniz başarıyla gönderildi!</h3>
                <p className="text-gray-600">En kısa sürede sizinle iletişime geçeceğiz.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                  <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                  <input type="tel" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Şirket Adı</label>
                  <input type="text" required value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mesajınız</label>
                  <textarea value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                {submitStatus === "error" && (
                  <div className="text-red-500 text-sm">Bir hata oluştu. Lütfen tekrar deneyin.</div>
                )}
                <button type="submit" disabled={isSubmitting} className="w-full bg-blue-700 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-800 disabled:opacity-50">
                  {isSubmitting ? "Gönderiliyor..." : "Teklifi Gönder"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}