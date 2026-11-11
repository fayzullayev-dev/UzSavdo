"use client";

import React, { useState } from "react";
import { Star, X } from "lucide-react";
import { useLanguage } from "@/lib/language";
import { apiFetch } from "@/lib/api";

interface ReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    id: string;
    contractNumber?: string;
    listingTitle?: string;
    sellerCompany?: string;
    quantity?: number;
    unit?: string;
    imageUrl?: string;
  };
  onSuccess?: (review: any) => void;
}

export const ReviewDialog: React.FC<ReviewDialogProps> = ({
  isOpen,
  onClose,
  order,
  onSuccess
}) => {
  const { locale } = useLanguage();
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const ratingLabels: Record<number, { uz: string; ru: string }> = {
    1: { uz: "Juda yomon", ru: "Очень плохо" },
    2: { uz: "Yomon", ru: "Плохо" },
    3: { uz: "Oʻrtacha", ru: "Нормально" },
    4: { uz: "Yaxshi", ru: "Хорошо" },
    5: { uz: "Aʼlo", ru: "Отлично" }
  };

  const tagOptions = [
    { uz: "Sifatli mahsulot", ru: "Качественный товар" },
    { uz: "Tez javob berdi", ru: "Быстро ответил" },
    { uz: "Narxi mos", ru: "Цена соответствует" },
    { uz: "Vaqtida yetkazdi", ru: "Доставил вовремя" },
    { uz: "Tavsifga mos", ru: "Соответствует описанию" }
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const activeRating = hoverRating || rating;

  const handleSubmit = async () => {
    if (!rating) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch("/reviews", {
        method: "POST",
        body: JSON.stringify({
          orderId: order.id,
          rating,
          tags: selectedTags,
          comment: comment.trim()
        })
      });
      if (onSuccess) onSuccess(res);
      onClose();
    } catch (err: any) {
      setError(err.message || (locale === "uz" ? "Xatolik yuz berdi" : "Произошла ошибка"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-[4px] animate-in fade-in duration-200 overflow-y-auto">
      <div
        className="bg-surface border border-border w-full max-w-[480px] rounded-[20px] p-6 shadow-2xl relative animate-in zoom-in-95 duration-180 my-8"
        role="dialog"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-text-muted hover:text-text rounded-full hover:bg-surface-muted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-text mb-4 text-center">
          {locale === "uz" ? "Sotuvchini baholang" : "Оцените продавца"}
        </h3>

        {/* Deal Card */}
        <div className="bg-surface-muted rounded-btn p-3 flex items-center gap-3 mb-5 border border-border">
          <img
            src={order.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=120&auto=format&fit=crop&q=80"}
            alt="Product"
            className="w-14 h-14 object-cover rounded-btn shrink-0"
          />
          <div className="min-w-0 flex-1 text-xs">
            <h4 className="font-bold text-text truncate">
              {order.listingTitle || (locale === "uz" ? "Mahsulot" : "Товар")}
            </h4>
            <div className="text-text-secondary truncate mt-0.5">
              {order.sellerCompany || (locale === "uz" ? "Sotuvchi" : "Продавец")}
            </div>
            {order.contractNumber && (
              <div className="text-text-muted text-[11px] mt-0.5">
                {locale === "uz" ? "Shartnoma" : "Договор"}: № {order.contractNumber}
                {order.quantity ? ` • ${order.quantity} ${order.unit || ""}` : ""}
              </div>
            )}
          </div>
        </div>

        {/* Stars */}
        <div className="flex flex-col items-center mb-5">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => {
              const filled = star <= activeRating;
              return (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 focus:outline-none transition-transform hover:scale-110 active:scale-95"
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${
                      filled
                        ? "fill-accent text-accent"
                        : "text-border hover:text-accent/50"
                    }`}
                  />
                </button>
              );
            })}
          </div>
          <div className="h-6 mt-2">
            {activeRating > 0 && (
              <span className="text-sm font-bold text-accent">
                {ratingLabels[activeRating]?.[locale as "uz" | "ru"]}
              </span>
            )}
          </div>
        </div>

        {/* Quick Tags */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-text-secondary block mb-2">
            {locale === "uz" ? "Tezkor fikrlar" : "Быстрые отзывы"}:
          </label>
          <div className="flex flex-wrap gap-2">
            {tagOptions.map((tag) => {
              const label = tag[locale as "uz" | "ru"];
              const selected = selectedTags.includes(label);
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => toggleTag(label)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    selected
                      ? "bg-accent/10 border-accent text-accent font-bold"
                      : "bg-surface border-border text-text-secondary hover:border-text-muted"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Textarea */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-text-secondary">
              {locale === "uz"
                ? "Fikringiz (ixtiyoriy)"
                : "Ваш отзыв (необязательно)"}
            </label>
            <span className="text-[11px] text-text-muted">
              {comment.length}/500
            </span>
          </div>
          <textarea
            value={comment}
            maxLength={500}
            rows={4}
            onChange={(e) => setComment(e.target.value)}
            placeholder={
              locale === "uz"
                ? "Sotuvchi va xizmat sifati haqida batafsil yozing..."
                : "Напишите подробнее о продавце и качестве обслуживания..."
            }
            className="w-full p-3 rounded-btn bg-surface-muted border border-border text-xs text-text focus:outline-none focus:border-primary resize-none"
          />
        </div>

        {error && (
          <div className="p-3 bg-danger/10 border border-danger/30 rounded-btn text-danger text-xs mb-4">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-11 border border-border rounded-btn text-text-secondary hover:bg-surface-muted font-semibold text-sm transition-colors"
          >
            {locale === "uz" ? "Bekor qilish" : "Отмена"}
          </button>
          <button
            type="button"
            disabled={!rating || loading}
            onClick={handleSubmit}
            className="flex-1 h-11 bg-accent text-white rounded-btn hover:bg-accent-hover font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            <span>
              {locale === "uz" ? "Bahoni yuborish" : "Отправить оценку"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
