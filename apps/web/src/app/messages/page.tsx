"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "../../lib/language";
import { useAuth } from "../../lib/auth";
import { apiFetch } from "../../lib/api";
import { NavigationLayout } from "../../components/navigation";
import { MessageCircle, Send, User } from "lucide-react";

export default function MessagesPage() {
  const { locale } = useLanguage();
  const { user } = useAuth();

  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConv, setSelectedConv] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/conversations")
      .then((data) => {
        setConversations(data || []);
        if (data && data.length > 0) {
          setSelectedConv(data[0]);
          loadMessages(data[0].id);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const loadMessages = (convId: string) => {
    apiFetch(`/conversations/${convId}/messages`)
      .then((msgs) => setMessages(msgs || []))
      .catch(console.error);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedConv) return;
    const textToSend = inputText.trim();
    setInputText("");

    try {
      const newMsg = await apiFetch(`/conversations/${selectedConv.id}/messages`, {
        method: "POST",
        body: JSON.stringify({ text: textToSend })
      });
      setMessages((prev) => [...prev, newMsg]);
    } catch {}
  };

  return (
    <NavigationLayout>
      <div className="h-[calc(100vh-140px)] bg-surface rounded-card border border-border shadow-sm flex overflow-hidden">
        {/* Dialogs List */}
        <div className="w-80 border-r border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <h2 className="font-bold text-sm text-text">
              {locale === "uz" ? "Suhbatlar" : "Сообщения"}
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-xs text-text-muted">
                {locale === "uz" ? "Hozircha xabarlar yoʻq" : "Сообщений пока нет"}
              </div>
            ) : (
              conversations.map((c) => {
                const other = c.buyerId === user?.id ? c.seller : c.buyer;
                const isSelected = selectedConv?.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedConv(c);
                      loadMessages(c.id);
                    }}
                    className={`p-3.5 cursor-pointer hover:bg-surface-muted transition-colors ${
                      isSelected ? "bg-primary-soft/60" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-text truncate max-w-[170px]">
                        {other?.companyName || "Hamkor"}
                      </span>
                      <span className="text-[10px] text-text-muted">
                        {new Date(c.lastMessageAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-secondary truncate">
                      {c.contract?.listing?.title || "Mahsulot shartnomasi"}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-surface-muted/30">
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-surface border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-text">
                    {(selectedConv.buyerId === user?.id ? selectedConv.seller : selectedConv.buyer)?.companyName}
                  </h3>
                  <span className="text-[11px] text-text-muted">
                    {selectedConv.contract?.listing?.title}
                  </span>
                </div>
              </div>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m) => {
                  const isMine = m.senderId === user?.id;
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-md p-3 rounded-card text-xs leading-relaxed ${
                          isMine
                            ? "bg-primary text-white rounded-br-xs"
                            : "bg-surface border border-border text-text rounded-bl-xs shadow-xs"
                        }`}
                      >
                        {m.text}
                      </div>
                      <span className="text-[10px] text-text-muted mt-1 px-1">
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-3 bg-surface border-t border-border flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={locale === "uz" ? "Xabar yozing..." : "Напишите сообщение..."}
                  className="flex-1 h-11 px-4 rounded-btn bg-surface-muted border border-border text-xs focus:outline-none focus:border-primary text-text"
                />
                <button
                  type="submit"
                  className="w-11 h-11 bg-primary text-white rounded-btn hover:bg-primary-hover flex items-center justify-center shrink-0 shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-text-muted">
              {locale === "uz" ? "Suhbatni tanlang" : "Выберите диалог"}
            </div>
          )}
        </div>
      </div>
    </NavigationLayout>
  );
}