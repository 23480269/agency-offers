"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function AdminPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user || session.user.role !== "ADMIN") {
      router.replace("/login");
    }
  }, [session, status, router]);

  if (status === "loading" || !session?.user || session.user.role !== "ADMIN") {
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