"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "../../lib/language";
import { useAuth } from "../../lib/auth";
import { apiFetch } from "../../lib/api";
import { NavigationLayout } from "../../components/navigation";
import { MessageCircle, Send, ArrowLeft, Building2 } from "lucide-react";

export default function MessagesPage() {
  const { locale } = useLanguage();
  const { user } = useAuth();

  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConv, setSelectedConv] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);

  // Mobile view state: "list" | "chat"
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");

  useEffect(() => {
    apiFetch("/conversations")
      .then((data) => {
        setConversations(data || []);
        if (data && data.length > 0 && typeof window !== "undefined" && window.innerWidth >= 1024) {
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

  const handleSelectConv = (c: any) => {
    setSelectedConv(c);
    loadMessages(c.id);
    setMobileView("chat");
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

  const selectedOther = selectedConv
    ? selectedConv.buyerId === user?.id
      ? selectedConv.seller
      : selectedConv.buyer
    : null;

  return (
    <NavigationLayout>
      <div className="h-[calc(100vh-140px)] min-h-[500px] bg-surface rounded-[20px] border border-border shadow-sm flex overflow-hidden">
        {/* 
          ====================================================================
          DIALOGS LIST
          On Mobile: hidden when mobileView === "chat"
          ====================================================================
        */}
        <div
          className={`w-full lg:w-80 border-r border-border flex flex-col bg-surface ${
            mobileView === "chat" ? "hidden lg:flex" : "flex"
          }`}
        >
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-bold text-base text-text">
              {locale === "uz" ? "Xabarlar" : "Сообщения"}
            </h2>
            <span className="text-xs text-text-muted font-medium">
              {conversations.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-text-muted">
                <MessageCircle className="w-8 h-8 text-text-muted mx-auto mb-2 opacity-50" />
                {locale === "uz" ? "Hozircha xabarlar yoʻq" : "Сообщений пока нет"}
              </div>
            ) : (
              conversations.map((c) => {
                const other = c.buyerId === user?.id ? c.seller : c.buyer;
                const isSelected = selectedConv?.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => handleSelectConv(c)}
                    className={`p-3.5 cursor-pointer hover:bg-surface-muted transition-colors ${
                      isSelected ? "bg-primary-soft/60" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-text truncate max-w-[170px]">
                        {other?.companyName || "Hamkor"}
                      </span>
                      <span className="text-[10px] text-text-muted shrink-0">
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

        {/* 
          ====================================================================
          ACTIVE CHAT PANEL
          On Mobile: full screen with back arrow to return to list
          ====================================================================
        */}
        <div
          className={`flex-1 flex flex-col bg-surface-muted/20 ${
            mobileView === "list" ? "hidden lg:flex" : "flex"
          }`}
        >
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <div className="p-3.5 bg-surface border-b border-border flex items-center gap-3">
                {/* Back Button on Mobile */}
                <button
                  type="button"
                  onClick={() => setMobileView("list")}
                  className="lg:hidden p-1.5 -ml-1 rounded-btn hover:bg-surface-muted text-text-secondary hover:text-text active:scale-95"
                  aria-label="Orqaga"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="w-9 h-9 rounded-full bg-primary-soft text-primary flex items-center justify-center font-bold text-xs shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-xs text-text truncate">
                    {selectedOther?.companyName || "Hamkor"}
                  </h3>
                  <p className="text-[10px] text-text-muted truncate">
                    {selectedConv.contract?.listing?.title || "Shartnoma boʻyicha muloqot"}
                  </p>
                </div>
              </div>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="py-12 text-center text-xs text-text-muted">
                    {locale === "uz" ? "Muloqotni boshlang..." : "Начните диалог..."}
                  </div>
                ) : (
                  messages.map((m) => {
                    const isMine = m.senderId === user?.id;
                    return (
                      <div
                        key={m.id}
                        className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-md px-3.5 py-2.5 rounded-[16px] text-xs leading-relaxed shadow-xs ${
                            isMine
                              ? "bg-primary text-white rounded-br-xs"
                              : "bg-surface border border-border text-text rounded-bl-xs"
                          }`}
                        >
                          <p>{m.text}</p>
                          <span
                            className={`text-[9px] block text-right mt-1 ${
                              isMine ? "text-white/75" : "text-text-muted"
                            }`}
                          >
                            {new Date(m.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 bg-surface border-t border-border flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    locale === "uz" ? "Xabaringizni yozing..." : "Введите сообщение..."
                  }
                  className="flex-1 h-11 px-4 rounded-[14px] bg-surface-muted border border-border text-xs text-text focus:outline-none focus:border-primary placeholder:text-text-muted"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="h-11 px-4 rounded-[14px] bg-primary text-white font-bold text-xs flex items-center gap-1.5 hover:bg-primary-hover disabled:opacity-50 active:scale-95 transition-all shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {locale === "uz" ? "Yuborish" : "Отправить"}
                  </span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-text-muted">
              <MessageCircle className="w-12 h-12 mb-3 opacity-40 text-text-muted" />
              <p className="text-xs">
                {locale === "uz"
                  ? "Suhbatlashish uchun chap tomondan muloqotni tanlang"
                  : "Выберите диалог из списка слева для начала общения"}
              </p>
            </div>
          )}
        </div>
      </div>
    </NavigationLayout>
  );
}
