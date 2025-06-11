import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// GET: Belirli iki kullanıcı arasındaki mesajlar
export async function GET(req: NextRequest) {
  const userId = Number(req.nextUrl.searchParams.get("userId"));
  const otherUserId = Number(req.nextUrl.searchParams.get("otherUserId"));

  if (!userId || !otherUserId) {
    return NextResponse.json({ error: "Kullanıcı ID'leri gerekli." }, { status: 400 });
  }

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    },
    orderBy: { createdAt: "asc" }, // Mesajları kronolojik sıraya göre sırala
  });

  return NextResponse.json(messages);
}

// POST: Mesaj gönderme
export async function POST(req: NextRequest) {
  const { senderId, receiverId, content } = await req.json();
  if (!senderId || !receiverId || !content) {
    return NextResponse.json({ error: "Gönderen, alıcı ve mesaj içeriği gerekli." }, { status: 400 });
  }
  const message = await prisma.message.create({
    data: { senderId: Number(senderId), receiverId: Number(receiverId), content },
  });
  return NextResponse.json({ message, messageText: "Mesaj gönderildi." });
} 