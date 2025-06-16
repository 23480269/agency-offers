"use client";
import React, { useEffect, useState } from "react";

interface OfferListProps {
  userId: string;
}

export default function OfferList({ userId }: OfferListProps) {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      console.log("OfferList fetchOffers for userId=", userId);
      const res = await fetch(`/api/offers?userId=${userId}`);
      const data = await res.json();
      setOffers(data);
    } catch (err) {
      setError("Teklifler alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  if (loading) return <div>Teklifler yükleniyor...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold mb-2">Verdiğiniz Teklifler</h2>
      {offers.length === 0 ? (
        <div>Henüz teklif vermediniz.</div>
      ) : (
        <ul className="space-y-2">
          {offers.map((offer) => (
            <li key={offer.id} className="border rounded p-3 bg-gray-50">
              <div className="text-sm text-gray-700 mb-1">Mesaj: {offer.message}</div>
              <div className="text-xs text-gray-500">Durum: {offer.status} | {new Date(offer.createdAt).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}