"use client";

import React, { useState } from "react";
import { Star, MessageSquare, CheckCircle2, EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import adminData from "../../../lib/adminData.json";

interface Props {
  locale: "uz" | "ru";
}

export function AdminRatingsSection({ locale }: Props) {
  const [reviews, setReviews] = useState(adminData.reviews);

  const toggleHide = (id: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, isHidden: !r.isHidden } : r));
    toast.success(locale === "uz" ? "Sharh koʻrinishi oʻzgartirildi" : "Видимость отзыва изменена");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-text tracking-tight">
            {locale === "uz" ? "Baholar va Xaridorlar Fikrlari" : "Оценки и отзывы покупателей"}
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            {locale === "uz" 
              ? "Bitim yakunlangach berilgan baholarni moderatsiya qilish" 
              : "Модерация отзывов и рейтингов после завершения сделок"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((rev) => (
          <div key={rev.id} className="p-5 bg-surface rounded-card border border-border shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${s <= rev.rating ? "text-accent fill-accent" : "text-border"}`}
                    />
                  ))}
                  <span className="text-xs font-bold text-text ml-1.5">{rev.rating}.0 / 5.0</span>
                </div>
                <span className="text-[11px] text-text-muted">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className="text-xs text-text font-medium leading-relaxed">
                «{rev.text}»
              </p>

              <div className="text-[11px] text-text-secondary pt-1 border-t border-border">
                {locale === "uz" ? "Xaridor: " : "Покупатель: "}
                <strong className="text-text">{rev.buyer?.companyName || rev.buyer?.firstName}</strong>
                {" ➔ "}
                {locale === "uz" ? "Sotuvchi: " : "Продавец: "}
                <strong className="text-text">{rev.seller?.companyName}</strong>
              </div>

              {rev.sellerReply && (
                <div className="p-2.5 bg-surface-muted rounded-btn text-[11px] text-text border border-border">
                  <div className="font-bold text-primary mb-0.5">{locale === "uz" ? "Sotuvchi javobi:" : "Ответ продавца:"}</div>
                  <div>{rev.sellerReply}</div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <span className={`text-[11px] font-bold ${rev.isHidden ? "text-danger" : "text-success"}`}>
                {rev.isHidden ? (locale === "uz" ? "Yashirilgan" : "Скрыт") : (locale === "uz" ? "Ochiq koʻrinadi" : "Опубликован")}
              </span>
              <button
                onClick={() => toggleHide(rev.id)}
                className="px-3 py-1 bg-surface-muted hover:bg-border text-text font-semibold text-xs rounded-btn transition-colors cursor-pointer"
              >
                {rev.isHidden ? (locale === "uz" ? "Koʻrsatish" : "Показать") : (locale === "uz" ? "Yashirish" : "Скрыть")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
