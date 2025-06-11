"use client";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-8 text-blue-900 text-center">Bize Ulaşın</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-blue-100">
          <h2 className="text-2xl font-bold mb-6 text-blue-800">İletişim Bilgileri</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="text-2xl">📍</div>
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-1">Adres</h3>
                <p className="text-blue-700">İstanbul, Türkiye</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-2xl">📧</div>
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-1">E-posta</h3>
                <p className="text-blue-700">info@3cdijital.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-2xl">📱</div>
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-1">Telefon</h3>
                <p className="text-blue-700">+90 535 297 16 30</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-2xl">⏰</div>
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-1">Çalışma Saatleri</h3>
                <p className="text-blue-700">Pazartesi - Cuma: 09:00 - 18:00</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-blue-100">
          <h2 className="text-2xl font-bold mb-6 text-blue-800">İletişim Formu</h2>
          <form onSubmit={handleSubmit} className="space-y-4" suppressHydrationWarning>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-blue-700 mb-1">
                Adınız Soyadınız
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none transition-colors"
                placeholder="Adınız Soyadınız"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-blue-700 mb-1">
                E-posta Adresiniz
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none transition-colors"
                placeholder="ornek@email.com"
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-blue-700 mb-1">
                Konu
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none transition-colors"
                placeholder="Mesajınızın konusu"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-blue-700 mb-1">
                Mesajınız
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none transition-colors resize-none"
                placeholder="Mesajınızı buraya yazın..."
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Gönderiliyor..." : "Gönder"}
            </button>
            {submitStatus === "success" && (
              <p className="text-green-600 text-center">Mesajınız başarıyla gönderildi!</p>
            )}
            {submitStatus === "error" && (
              <p className="text-red-600 text-center">Bir hata oluştu. Lütfen tekrar deneyin.</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
} 