"use client";
import React, { useEffect, useState } from "react";

export default function MessageList({ userId }: { userId: number }) {
  const [messages, setMessages] = useState<{ received: any[]; sent: any[] }>({ received: [], sent: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/messages?userId=${userId}`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      setError("Mesajlar alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line
  }, [userId]);

  useEffect(() => {
    const handler = () => fetchMessages();
    window.addEventListener("message-sent", handler);
    return () => window.removeEventListener("message-sent", handler);
  }, []);

  if (loading) return <div>Mesajlar yükleniyor...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold mb-2 text-blue-900">Gelen Mesajlar</h2>
      {messages.received.length === 0 ? (
        <div className="text-blue-700">Gelen mesaj yok.</div>
      ) : (
        <ul className="space-y-2">
          {messages.received.map((msg) => (
            <li key={msg.id} className="border border-blue-100 rounded-xl p-3 bg-blue-50">
              <div className="font-semibold text-blue-900">Kimden: {msg.sender?.name} ({msg.sender?.email})</div>
              <div className="text-sm text-blue-800 mb-1">{msg.content}</div>
              <div className="text-xs text-blue-700">{new Date(msg.createdAt).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
      <h2 className="text-lg font-bold mb-2 mt-8 text-blue-900">Gönderilen Mesajlar</h2>
      {messages.sent.length === 0 ? (
        <div className="text-blue-700">Gönderilen mesaj yok.</div>
      ) : (
        <ul className="space-y-2">
          {messages.sent.map((msg) => (
            <li key={msg.id} className="border border-blue-100 rounded-xl p-3 bg-blue-50">
              <div className="font-semibold text-blue-900">Kime: {msg.receiver?.name} ({msg.receiver?.email})</div>
              <div className="text-sm text-blue-800 mb-1">{msg.content}</div>
              <div className="text-xs text-blue-700">{new Date(msg.createdAt).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 