import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Providers } from "./providers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "3C Dijital - Sosyal Medya Yönetimi",
  description: "Profesyonel sosyal medya yönetim paketleri ile markanızı büyütün",
  icons: {
    icon: '/3C_logo.png',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="tr">
      <body
        className={`${inter.variable} antialiased`}
      >
        <Providers session={session}>
          <Header />
          <main className="min-h-screen">
          {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
