"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Offer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string | null;
  packageName: string;
  status: string;
  createdAt: string;
}

export default function AdminOffersPage() {
  const router = useRouter();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      const response = await fetch("/api/admin/offers");
      const data = await response.json();
      setOffers(data);
    } catch (error) {
      console.error("Error loading offers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOfferStatus = async (offerId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/offers/${offerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        loadOffers();
      }
    } catch (error) {
      console.error("Error updating offer status:", error);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Teklifler</h1>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İsim
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paket
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Şirket
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İletişim
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {offers.map((offer) => (
                  <tr key={offer.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(offer.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {offer.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{offer.packageName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{offer.company}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{offer.email}</div>
                      <div className="text-sm text-gray-500">{offer.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          offer.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : offer.status === "APPROVED"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {offer.status === "PENDING"
                          ? "Beklemede"
                          : offer.status === "APPROVED"
                          ? "Onaylandı"
                          : "Reddedildi"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedOffer(offer)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Detay
                      </button>
                      <select
                        value={offer.status}
                        onChange={(e) => updateOfferStatus(offer.id, e.target.value)}
                        className="text-sm border-gray-300 rounded-md"
                      >
                        <option value="PENDING">Beklemede</option>
                        <option value="APPROVED">Onayla</option>
                        <option value="REJECTED">Reddet</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Offer Detail Modal */}
      {selectedOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Teklif Detayı
              </h2>
              <button
                onClick={() => setSelectedOffer(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">İsim</h3>
                <p className="mt-1 text-sm text-gray-900">{selectedOffer.name}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">E-posta</h3>
                <p className="mt-1 text-sm text-gray-900">{selectedOffer.email}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Telefon</h3>
                <p className="mt-1 text-sm text-gray-900">{selectedOffer.phone}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Şirket</h3>
                <p className="mt-1 text-sm text-gray-900">{selectedOffer.company}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Paket</h3>
                <p className="mt-1 text-sm text-gray-900">{selectedOffer.packageName}</p>
              </div>

              {selectedOffer.message && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Mesaj</h3>
                  <p className="mt-1 text-sm text-gray-900">{selectedOffer.message}</p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-gray-500">Durum</h3>
                <select
                  value={selectedOffer.status}
                  onChange={(e) => {
                    updateOfferStatus(selectedOffer.id, e.target.value);
                    setSelectedOffer({
                      ...selectedOffer,
                      status: e.target.value,
                    });
                  }}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="PENDING">Beklemede</option>
                  <option value="APPROVED">Onayla</option>
                  <option value="REJECTED">Reddet</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 