"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
  categoryId: string;
  category?: { name: string };
}

export default function AdminServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load services for the admin page
    const loadServices = async () => {
      try {
        const response = await fetch("/api/admin/services");
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error("Error loading services:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadServices();
  }, []);

  const handleServiceChange = (index: number, field: keyof Service, value: any) => {
    const newServices = [...services];
    if (field === "price") {
      newServices[index][field] = parseFloat(value);
    } else {
      newServices[index][field] = value;
    }
    setServices(newServices);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch("/api/admin/services", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ services }),
      });

      if (response.ok) {
        alert("Hizmetler başarıyla güncellendi!");
        router.refresh();
      } else {
        throw new Error("Güncelleme başarısız oldu");
      }
    } catch (error) {
      console.error("Error saving services:", error);
      alert("Hizmetler güncellenirken bir hata oluştu!");
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Hizmetler Yönetimi</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {services.map((service, index) => (
            <div key={service.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Hizmet {index + 1}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hizmet Adı
                  </label>
                  <input
                    type="text"
                    value={service.name}
                    onChange={(e) => handleServiceChange(index, "name", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fiyat
                  </label>
                  <input
                    type="number"
                    value={service.price}
                    onChange={(e) => handleServiceChange(index, "price", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori
                  </label>
                  <input
                    type="text"
                    value={service.category?.name || service.categoryId}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Açıklama
                  </label>
                  <textarea
                    value={service.description}
                    onChange={(e) => handleServiceChange(index, "description", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={2}
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