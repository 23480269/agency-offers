"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(true);
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
        
        setIsLoading(false);
      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Paneli</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/services"
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:border-blue-500 transition-colors"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Hizmetler</h2>
            <p className="text-gray-600">Hizmet paketlerini yönetin</p>
          </Link>

          <Link
            href="/admin/offers"
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:border-blue-500 transition-colors"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Siparişler</h2>
            <p className="text-gray-600">Siparişleri görüntüleyin ve yönetin</p>
          </Link>

          <Link
            href="/admin/users"
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:border-blue-500 transition-colors"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Kullanıcılar</h2>
            <p className="text-gray-600">Kullanıcı hesaplarını yönetin</p>
          </Link>

          <Link
            href="/admin/feedback"
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:border-blue-500 transition-colors"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Geri Bildirimler</h2>
            <p className="text-gray-600">İletişim formundan gelen mesajları görüntüleyin</p>
          </Link>
        </div>
      </div>
    </div>
  );
} 