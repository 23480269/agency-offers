"use client";
import { useState, useRef, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Message {
  id?: number;
  text: string;
  isUser: boolean;
  senderId?: number;
  receiverId?: number;
  timestamp?: string;
}

export default function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Kullanıcı bilgilerini ve listesini yükle
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authRes = await fetch("/api/auth-status");
        const authData = await authRes.json();
        
        if (authData.isAuthenticated) {
          setCurrentUserId(authData.userId);
          
          // Kullanıcı listesini al
          const usersRes = await fetch("/api/admin/users");
          const usersData = await usersRes.json();
          
          // Mevcut kullanıcıyı listeden çıkar
          const filteredUsers = usersData.filter((user: User) => user.id !== authData.userId);
          setUsers(filteredUsers);
        }
      } catch (error) {
        console.error("Kullanıcı bilgileri yüklenirken hata:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Mesajları yükle
  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedUser && currentUserId) {
        try {
          const res = await fetch(`/api/messages?userId=${currentUserId}&otherUserId=${selectedUser.id}`);
          const data = await res.json();
          
          const formattedMessages = data.map((msg: any) => ({
            text: msg.content,
            isUser: msg.senderId === currentUserId,
            senderId: msg.senderId,
            receiverId: msg.receiverId,
            timestamp: msg.createdAt
          }));
          setMessages(formattedMessages);
        } catch (error) {
          console.error("Mesajlar yüklenirken hata:", error);
          setError("Mesajlar yüklenemedi.");
        }
      }
    };

    fetchMessages();
  }, [selectedUser, currentUserId]);

  // Otomatik kaydırma
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentUserId || !selectedUser) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: currentUserId,
          receiverId: selectedUser.id,
          content: message
        }),
      });

      const data = await res.json();
      
      if (res.ok) {
        // Yeni mesajı ekle
        setMessages(prev => [...prev, { 
          text: message,
          isUser: true,
          senderId: currentUserId,
          receiverId: selectedUser.id,
          timestamp: new Date().toISOString()
        }]);
        setMessage('');
      } else {
        setError(data.error || "Mesaj gönderilemedi.");
      }
    } catch (err) {
      setError("Sunucu hatası.");
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setMessages([]); // Mesajları temizle, useEffect ile yeniden yüklenecek
  };

  const handleBack = () => {
    setSelectedUser(null);
    setMessages([]);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center gap-2"
        >
          <span className="text-xl">💬</span>
          <span className="font-semibold">Mesajlar</span>
        </button>
      )}
      
      {isOpen && (
        <div 
          ref={chatRef}
          className="bg-white rounded-lg shadow-xl w-96 h-[600px] flex flex-col border border-blue-100"
        >
          {/* Chat Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-xl">💬</span>
              <span className="font-semibold">
                {selectedUser ? `${selectedUser.name} ile Sohbet` : '3C Dijital Mesajlar'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {selectedUser && (
                <button 
                  onClick={handleBack}
                  className="text-white hover:text-blue-100 transition-colors p-1"
                >
                  ←
                </button>
              )}
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-blue-100 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* User Selection */}
          {!selectedUser && (
            <div className="p-4 border-b border-blue-100">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Mesaj Göndermek İstediğiniz Kişiyi Seçin</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {users.map(user => (
                  <button
                    key={user.id}
                    onClick={() => handleUserSelect(user)}
                    className="w-full text-left p-2 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <div className="font-medium text-blue-900">{user.name}</div>
                    <div className="text-sm text-blue-600">{user.email}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-50 text-blue-900'
                  }`}
                >
                  <div>{msg.text}</div>
                  {msg.timestamp && (
                    <div className={`text-xs mt-1 ${msg.isUser ? 'text-blue-200' : 'text-blue-600'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          {selectedUser && (
            <form onSubmit={handleSubmit} className="p-4 border-t border-blue-100">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`${selectedUser.name}'e mesaj yazın...`}
                  className="flex-1 px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  disabled={loading}
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Gönderiliyor..." : "Gönder"}
                </button>
              </div>
              {error && (
                <div className="mt-2 text-red-600 text-sm">{error}</div>
              )}
            </form>
          )}
        </div>
      )}
    </div>
  );
} 