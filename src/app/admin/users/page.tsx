"use client";
import React, { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError("Kullanıcılar alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const res = await fetch("/api/auth-status");
        const data = await res.json();
        if (data.isAuthenticated) {
          setCurrentUserId(data.userId);
        }
      } catch (err) {
        console.error("Failed to fetch auth status:", err);
      }
    };
    fetchAuthStatus();
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (id === currentUserId) {
      alert("Kendi hesabınızı silemezsiniz.");
      return;
    }
    if (!confirm("Kullanıcıyı silmek istediğinize emin misiniz?")) return;
    try {
      await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setUsers(users.filter((u) => u.id !== id));
    } catch {
      alert("Silme işlemi başarısız oldu.");
    }
  };

  const handleRoleChange = async (id: string, newRole: string) => {
    if (id === currentUserId) {
      alert("Kendi rolünüzü değiştiremezsiniz.");
      return;
    }
    if (!confirm("Rolü değiştirmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, role: newRole, currentUserId }),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(users.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
      } else {
        alert(data.error || "Rol güncellenemedi.");
      }
    } catch {
      alert("Rol güncelleme işlemi başarısız oldu.");
    }
  };

  if (loading) return <div>Kullanıcılar yükleniyor...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Kullanıcılar</h1>
          <table className="w-full border border-blue-200 text-sm bg-white rounded-lg shadow-md overflow-hidden">
            <thead>
              <tr className="bg-blue-100 text-blue-900">
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Ad Soyad</th>
                <th className="py-3 px-4 text-left">E-posta</th>
                <th className="py-3 px-4 text-left">Rol</th>
                <th className="py-3 px-4 text-left">Kayıt Tarihi</th>
                <th className="py-3 px-4 text-left">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="even:bg-blue-50/50 hover:bg-blue-100/50 transition-colors">
                  <td className="py-2.5 px-4">{user.id}</td>
                  <td className="py-2.5 px-4">{user.name}</td>
                  <td className="py-2.5 px-4">{user.email}</td>
                  <td className="py-2.5 px-4 text-center">
                    {user.role}
                    {console.log("User ID:", user.id, "Current User ID:", currentUserId, "Match:", user.id === currentUserId)}
                    {user.id !== currentUserId && user.role !== "ADMIN" && (
                      <button
                        className="ml-2 bg-yellow-600 text-white px-3 py-1.5 rounded-md hover:bg-yellow-700 transition shadow-sm"
                        onClick={() => handleRoleChange(user.id, "ADMIN")}
                      >
                        Admin Yap
                      </button>
                    )}
                    {user.id !== currentUserId && user.role !== "USER" && (
                      <button
                        className="ml-2 bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition shadow-sm"
                        onClick={() => handleRoleChange(user.id, "USER")}
                      >
                        Kullanıcı Yap
                      </button>
                    )}
                  </td>
                  <td className="py-2.5 px-4">{new Date(user.createdAt).toLocaleString()}</td>
                  <td className="py-2.5 px-4 text-center">
                    {user.id !== currentUserId && (
                      <button
                        className="bg-red-700 text-white px-4 py-1.5 rounded-md hover:bg-red-800 transition shadow-sm"
                        onClick={() => handleDelete(user.id)}
                      >
                        Sil
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 