"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export default function AdminContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth-status");
        const data = await res.json();
        
        if (!data.isAuthenticated || data.userRole !== "ADMIN") {
          router.push("/login");
          return;
        }
        
        fetchMessages();
      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/admin/feedback", {
        credentials: "include"
      });
      if (!response.ok) {
        throw new Error("İletişim mesajları yüklenemedi");
      }
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      setError("İletişim mesajları yüklenirken bir hata oluştu");
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu iletişim mesajını silmek istediğinizden emin misiniz?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/feedback?id=${id}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error("İletişim mesajı silinemedi");
      }

      setMessages(messages.filter(message => message.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
      alert("İletişim mesajı silinirken bir hata oluştu");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-red-600 text-center">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">İletişim Mesajları</h1>
          
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Henüz iletişim mesajı bulunmuyor
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="bg-gray-50 rounded-lg p-6 border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {message.subject}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(message.createdAt).toLocaleString("tr-TR")}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(message.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      Sil
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Gönderen</p>
                      <p className="text-gray-900">{message.name}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700">E-posta</p>
                      <p className="text-gray-900">{message.email}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700">Mesaj</p>
                      <p className="text-gray-900 whitespace-pre-wrap">{message.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}