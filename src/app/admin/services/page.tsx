"use client";

import { useState, useEffect } from "react";
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

export default function AdminServicesPage() {
  const router = useRouter();
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load service packages for the admin page
    const loadPackages = async () => {
      try {
        const response = await fetch("/api/admin/services");
        const data = await response.json();
        setPackages(data);
      } catch (error) {
        console.error("Error loading packages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPackages();
  }, []);

  const handlePackageChange = (index: number, field: keyof ServicePackage, value: any) => {
    setPackages((prev) => {
      const newPackages = [...prev];
      newPackages[index] = { ...newPackages[index], [field]: value };
      return newPackages;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch("/api/admin/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ packages }),
      });

      if (response.ok) {
        alert("Paketler başarıyla güncellendi!");
        router.refresh();
      } else {
        throw new Error("Güncelleme başarısız oldu");
      }
    } catch (error) {
      console.error("Error saving packages:", error);
      alert("Paketler güncellenirken bir hata oluştu!");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Yükleniyor...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Hizmet Paketleri Yönetimi</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {packages.map((pkg, index) => (
            <div key={pkg.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Paket {index + 1}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Paket Adı
                  </label>
                  <input
                    type="text"
                    value={pkg.name}
                    onChange={(e) => handlePackageChange(index, "name", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fiyat
                  </label>
                  <input
                    type="text"
                    value={pkg.price}
                    onChange={(e) => handlePackageChange(index, "price", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    İkon
                  </label>
                  <input
                    type="text"
                    value={pkg.icon}
                    onChange={(e) => handlePackageChange(index, "icon", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CTA
                  </label>
                  <input
                    type="text"
                    value={pkg.cta}
                    onChange={(e) => handlePackageChange(index, "cta", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Açıklama
                  </label>
                  <textarea
                    value={pkg.description}
                    onChange={(e) => handlePackageChange(index, "description", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={2}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Özellikler (virgülle ayırın)
                  </label>
                  <input
                    type="text"
                    value={pkg.features}
                    onChange={(e) => handlePackageChange(index, "features", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}