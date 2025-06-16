"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface OfferFormProps {
  userId: string;
  defaultOpen?: boolean;
}

export default function OfferForm({ userId, defaultOpen = false }: OfferFormProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      userId,
    };

    try {
      console.log("Sending data to API:", data);
      const fetchOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };
      const response = await fetch("/api/offers", fetchOptions);

      if (!response.ok) {
        throw new Error("Teklif oluşturulurken bir hata oluştu");
      }

      router.refresh();
      setIsOpen(false);
      e.currentTarget.reset();
    } catch (error) {
      console.error("Teklif oluşturma hatası:", error);
      alert("Teklif oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-700 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-blue-800 transition"
      >
        {isOpen ? "Teklif Formunu Kapat" : "Yeni Teklif Oluştur"}
      </button>

      {isOpen && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-blue-900">
              Teklif Başlığı
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="mt-1 block w-full rounded-md border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-blue-900">
              Teklif Açıklaması
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              className="mt-1 block w-full rounded-md border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-blue-800 transition disabled:opacity-50"
          >
            {loading ? "Gönderiliyor..." : "Teklif Oluştur"}
          </button>
        </form>
      )}
    </div>
  );
}