"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });
    if (res?.ok) {
      setMessage("Başarıyla giriş yapıldı, yönlendiriliyorsunuz...");
      window.location.href = "/";
    } else {
      setError("Giriş başarısız");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 via-white to-blue-50">
      <div className="max-w-md w-full p-8 bg-white/90 rounded-xl shadow-lg border border-blue-100">
        <h1 className="text-2xl font-bold mb-6 text-blue-900">Giriş Yap</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="E-posta" className="border border-blue-200 p-2.5 rounded shadow-sm focus:ring-2 focus:ring-blue-300" required value={form.email} onChange={handleChange} />
          <input type="password" name="password" placeholder="Şifre" className="border border-blue-200 p-2.5 rounded shadow-sm focus:ring-2 focus:ring-blue-300" required value={form.password} onChange={handleChange} />
          <button type="submit" className="bg-blue-700 text-white py-3 rounded font-semibold hover:bg-blue-800 transition shadow-md" disabled={loading}>
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
        {message && <div className="mt-4 text-green-700 font-semibold p-3 rounded-md shadow-sm">{message}</div>}
        {error && <div className="mt-4 text-red-600 font-semibold p-3 rounded-md shadow-sm">{error}</div>}
        <div className="mt-6 text-center">
          <span className="text-gray-500">Hesabınız yok mu? </span>
          <a href="/register" className="text-blue-700 font-semibold hover:underline">Kayıt Ol</a>
        </div>
      </div>
    </div>
  );
}