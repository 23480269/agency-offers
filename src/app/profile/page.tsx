import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import React from "react";
import { redirect } from "next/navigation";
import OfferForm from "./OfferForm";
import OfferList from "./OfferList";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const cookieStore = await cookies();
  const userIdFromCookie = cookieStore.get("userId")?.value;
  const showOfferForm = searchParams.showOfferForm === "true";

  console.log("ProfilePage server component: userIdFromCookie=", userIdFromCookie);

  const userId = userIdFromCookie;

  if (!userId) {
    console.error("Invalid userId from cookie, redirecting to login:", userIdFromCookie);
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-2xl mx-auto mt-16 p-10 bg-white/90 rounded-xl shadow-lg border border-blue-100">
      <h1 className="text-3xl font-bold mb-8 text-blue-900">Profilim</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-900 text-lg">
        <div><b>Ad Soyad:</b> {user.name}</div>
        <div><b>E-posta:</b> {user.email}</div>
        <div><b>Rol:</b> {user.role}</div>
        <div><b>Kayıt Tarihi:</b> {new Date(user.createdAt).toLocaleString()}</div>
      </div>
      <a href="/logout" className="inline-block mt-8 text-blue-700 font-semibold hover:underline transition-colors text-lg">Çıkış Yap</a>
      <hr className="my-10 border-blue-200" />
      <ProfileForm initialName={user.name} initialEmail={user.email} userId={user.id} />
      {/* <hr className="my-10 border-blue-200" />
      <OfferForm userId={user.id} defaultOpen={showOfferForm} />
      <OfferList userId={user.id} /> */}
    </div>
  );
} 