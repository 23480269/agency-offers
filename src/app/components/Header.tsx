"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { data: session, status } = useSession();
  console.log('HEADER SESSION:', session, status);

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
        <Link href="/" className="flex items-center gap-2 group">
          <Image src="/3C_logo.png" alt="3C Dijital Logo" width={40} height={40} className="rounded-full" />
          <span className="font-bold text-xl text-blue-900 group-hover:text-blue-700 transition-colors">3C Dijital</span>
        </Link>
        <div className="flex gap-6 items-center">
          <Link href="/" className="hover:text-blue-700 font-bold text-blue-900 transition-colors">Ana Sayfa</Link>
          <Link href="/services" className="hover:text-blue-700 font-bold text-blue-900 transition-colors">Paketler</Link>
          <Link href="/about" className="hover:text-blue-700 font-bold text-blue-900 transition-colors">Hakkımızda</Link>
          <Link href="/contact" className="hover:text-blue-700 font-bold text-blue-900 transition-colors">Bize Ulaşın</Link>
          <div className="relative" ref={menuRef}>
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
              <div className="absolute right-0 mt-2 w-48 bg-white border border-blue-200 rounded-lg shadow-lg py-2 z-50" tabIndex={-1}>
                {status === "loading" ? (
                  <div className="px-4 py-2 text-blue-900">Yükleniyor...</div>
                ) : session?.user ? (
                  <>
                    {session.user.role === "ADMIN" && (
                      <Link href="/admin" className="block px-4 py-2 text-blue-900 font-semibold hover:bg-blue-50 transition-colors">Admin Paneli</Link>
                    )}
                    {session.user.role === "USER" && (
                      <Link href="/profile" className="block px-4 py-2 text-blue-900 font-semibold hover:bg-blue-50 transition-colors">Profilim</Link>
                    )}
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="block w-full text-left px-4 py-2 text-blue-900 font-semibold hover:bg-blue-50 transition-colors"
                    >
                      Çıkış Yap
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block px-4 py-2 text-blue-900 font-semibold hover:bg-blue-50 transition-colors">Giriş Yap</Link>
                    <Link href="/register" className="block px-4 py-2 text-blue-900 font-semibold hover:bg-blue-50 transition-colors">Kayıt Ol</Link>
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