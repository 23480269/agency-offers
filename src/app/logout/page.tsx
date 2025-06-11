"use client";
import { useEffect } from "react";

export default function LogoutPage() {
  useEffect(() => {
    fetch("/api/logout", { method: "POST" }).then(() => {
      window.location.href = '/';
    });
  }, []);
  return <div className="text-center mt-16">Çıkış yapılıyor...</div>;
} 