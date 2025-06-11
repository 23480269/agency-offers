"use client";
import React, { useEffect, useState } from "react";

export default function MessageForm({ senderId }: { senderId: number }) {
  const [users, setUsers] = useState<any[]>([]);
  const [form, setForm] = useState({ receiverId: "", content: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId, receiverId: Number(form.receiverId), content: form.content }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Mesaj gönderildi!");
        setForm({ receiverId: "", content: "" });
        window.dispatchEvent(new Event("message-sent"));
      } else {
        setError(data.error || "Bir hata oluştu.");
      }
    } catch {
      setError("Sunucu hatası.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 p-6 bg-white/90 rounded-xl shadow-lg border border-blue-100">
      <h2 className="text-xl font-bold mb-5 text-blue-900">Mesaj Gönder</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <select name="receiverId" className="border border-blue-200 p-2.5 rounded shadow-sm focus:ring-2 focus:ring-blue-300" required value={form.receiverId} onChange={handleChange}>
          <option value="">Alıcı Seçin</option>
          {users.filter((u) => u.id !== senderId).map((user) => (
            <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
          ))}
        </select>
        <textarea name="content" placeholder="Mesajınız" className="border border-blue-200 p-2.5 rounded shadow-sm focus:ring-2 focus:ring-blue-300" required value={form.content} onChange={handleChange} />
        <button type="submit" className="bg-blue-700 text-white py-3 rounded font-semibold hover:bg-blue-800 transition shadow-md" disabled={loading}>
          {loading ? "Gönderiliyor..." : "Mesaj Gönder"}
        </button>
        {message && <div className="mt-4 text-green-700 font-semibold p-3 rounded-md shadow-sm">{message}</div>}
        {error && <div className="mt-4 text-red-600 font-semibold p-3 rounded-md shadow-sm">{error}</div>}
      </form>
    </div>
  );
} 