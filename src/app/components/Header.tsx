"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ id: number; role: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const fetchUserStatus = async () => {
      setIsLoadingUser(true);
      try {
        const res = await fetch("/api/auth-status");
        if (res.ok) {
          const data = await res.json();
          if (data.isAuthenticated) {
            setUser({ id: data.userId, role: data.userRole });
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth status fetch error:", error);
        setUser(null);
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUserStatus();
  }, [pathname]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50 border-b border-blue-50">
      <nav className="max-w-5xl mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-3xl font-extrabold text-blue-950 no-underline hover:no-underline">
          <Image src="/3C_logo.png" alt="3C Dijital Logo" width={40} height={40} className="rounded-full" />
          3C Dijital
        </Link>
        <div className="flex gap-6 items-center">
          <Link href="/" className="hover:text-blue-700 font-bold text-blue-900 transition-colors">Ana Sayfa</Link>
          <Link href="/services" className="hover:text-blue-700 font-bold text-blue-900 transition-colors">Paketler</Link>
          <Link href="/about" className="hover:text-blue-700 font-bold text-blue-900 transition-colors">Hakkımızda</Link>
          <Link href="/contact" className="hover:text-blue-700 font-bold text-blue-900 transition-colors">Bize Ulaşın</Link>
          <div
            className="relative"
            ref={menuRef}
          >
            <button
              ref={buttonRef}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg hover:bg-blue-100 border border-blue-200 text-blue-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors shadow-sm"
              type="button"
              aria-haspopup="true"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className="text-lg">💻</span> Hesabım
            </button>
            {menuOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white border border-blue-200 rounded-lg shadow-lg py-2 z-50"
                tabIndex={-1}
              >
                {isLoadingUser ? (
                  <div className="px-4 py-2 text-blue-900">Yükleniyor...</div>
                ) : (
                  <>
                    {!user && (
                      <>
                        <Link href="/login" className="block px-4 py-2 text-blue-900 font-semibold hover:bg-blue-50 transition-colors">Giriş Yap</Link>
                        <Link href="/register" className="block px-4 py-2 text-blue-900 font-semibold hover:bg-blue-50 transition-colors">Kayıt Ol</Link>
                      </>
                    )}
                    {user && (
                      <>
                        {user.role === "ADMIN" && (
                          <Link href="/admin" className="block px-4 py-2 text-blue-900 font-semibold hover:bg-blue-50 transition-colors">Admin Paneli</Link>
                        )}
                        {user.role === "USER" && (
                          <Link href="/profile" className="block px-4 py-2 text-blue-900 font-semibold hover:bg-blue-50 transition-colors">Profilim</Link>
                        )}
                        <Link href="/logout" className="block px-4 py-2 text-blue-900 font-semibold hover:bg-blue-50 transition-colors">Çıkış Yap</Link>
                      </>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
} 