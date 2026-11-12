"use client";

import React, { useState } from "react";
import { MessageSquare, CheckCircle2, Clock, Send, User } from "lucide-react";
import { toast } from "sonner";
import adminData from "../../../lib/adminData.json";

interface Props {
  locale: "uz" | "ru";
}

export function AdminTicketsSection({ locale }: Props) {
  const [tickets, setTickets] = useState(adminData.tickets);
  const [replyText, setReplyText] = useState<{ [id: string]: string }>({});

  const handleSendReply = (id: string) => {
    const text = replyText[id];
    if (!text) {
      toast.error(locale === "uz" ? "Javob matnini kiriting" : "Введите текст ответа");
      return;
    }
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: "ANSWERED", adminReply: text } : t));
    toast.success(locale === "uz" ? "Javob muvaffaqiyatli yuborildi" : "Ответ успешно отправлен");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-text tracking-tight">
            {locale === "uz" ? "Foydalanuvchilar Murojaatlari (Yordam xizmati)" : "Обращения пользователей (Техподдержка)"}
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            {locale === "uz" 
              ? "Tadbirkorlar va fuqarolardan texnik hamda huquqiy yordam soʻrovlari" 
              : "Запросы от участников платформы по техническим и правовым вопросам"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tickets.map((tick) => (
          <div key={tick.id} className="p-5 bg-surface rounded-card border border-border shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border">
              <div>
                <h4 className="font-bold text-sm text-text">{tick.subject}</h4>
                <div className="text-[11px] text-text-muted mt-0.5">
                  {tick.user?.companyName || tick.user?.firstName} • {tick.user?.phone} • {new Date(tick.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div>
                {tick.status === "OPEN" ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400">
                    <Clock className="w-3.5 h-3.5" />
                    {locale === "uz" ? "Yangi murojaat" : "Новое"}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-success/15 text-success">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {locale === "uz" ? "Javob berilgan" : "Отвечено"}
                  </span>
                )}
              </div>
            </div>

            <div className="p-3 bg-surface-muted rounded-btn text-xs text-text">
              {tick.message}
            </div>

            {tick.adminReply ? (
              <div className="p-3 bg-primary/5 border border-primary/20 rounded-btn text-xs text-text space-y-1">
                <div className="font-bold text-primary flex items-center gap-1.5 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {locale === "uz" ? "Hokimiyat administratori javobi:" : "Ответ администратора:"}
                </div>
                <div className="text-text-secondary">{tick.adminReply}</div>
              </div>
            ) : (
              <div className="space-y-2 pt-2">
                <textarea
                  rows={2}
                  value={replyText[tick.id] || ""}
                  onChange={(e) => setReplyText({ ...replyText, [tick.id]: e.target.value })}
                  placeholder={locale === "uz" ? "Tadbirkorga rasmiy javob matnini yozing..." : "Напишите официальный ответ..."}
                  className="w-full p-2.5 bg-surface-muted border border-border rounded-btn text-xs text-text focus:outline-none focus:border-primary resize-none"
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => handleSendReply(tick.id)}
                    className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-btn hover:bg-primary-hover flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{locale === "uz" ? "Javob yuborish" : "Отправить ответ"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
