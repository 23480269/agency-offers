"use client";

import React, { useState } from "react";

interface ProfileFormProps {
  initialName: string;
  initialEmail: string;
  userId: number;
}

export default function ProfileForm({ initialName, initialEmail, userId }: ProfileFormProps) {
  const [form, setForm] = useState({ name: initialName, email: initialEmail });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        // İsteğe bağlı: Profil sayfasını yeniden yükleyebilir veya state'i güncelleyebiliriz
        // window.location.reload(); 
      } else {
        setError(data.error || "Profil güncellenirken bir hata oluştu.");
      }
    } catch (err) {
      setError("Sunucu hatası veya ağ sorunu.");
      console.error("Profil güncelleme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 p-6 bg-white/90 rounded-xl shadow-lg border border-blue-100">
      <h2 className="text-xl font-bold mb-5 text-blue-900">Profil Bilgilerini Güncelle</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="name" className="block text-blue-900 text-sm font-semibold mb-1">Ad Soyad</label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="border border-blue-200 p-2.5 rounded w-full focus:ring-2 focus:ring-blue-300 shadow-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-blue-900 text-sm font-semibold mb-1">E-posta</label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="border border-blue-200 p-2.5 rounded w-full focus:ring-2 focus:ring-blue-300 shadow-sm"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-700 text-white py-3 rounded font-semibold hover:bg-blue-800 transition shadow-md"
          disabled={loading}
        >
          {loading ? "Güncelleniyor..." : "Bilgileri Güncelle"}
        </button>
      </form>
      {message && <div className="mt-4 text-green-700 font-semibold p-3 rounded-md shadow-sm">{message}</div>}
      {error && <div className="mt-4 text-red-600 font-semibold p-3 rounded-md shadow-sm">{error}</div>}
    </div>
  );
} 