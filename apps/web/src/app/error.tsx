"use client";

import React from "react";
import { useLanguage } from "../lib/language";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { locale } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="bg-surface rounded-modal border border-border p-8 max-w-md w-full text-center shadow-lg">
        <h2 className="text-xl font-bold text-text mb-2">
          {locale === "uz" ? "Xatolik yuz berdi" : "Произошла ошибка"}
        </h2>
        <p className="text-xs text-text-secondary mb-6 leading-relaxed">
          {locale === "uz"
            ? "Iltimos, qayta urinib koʻring yoki bosh sahifaga qayting."
            : "Пожалуйста, попробуйте снова или вернитесь на главную страницу."}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-5 h-11 bg-primary text-white text-xs font-semibold rounded-btn hover:bg-primary-hover shadow-sm"
          >
            {locale === "uz" ? "Qayta urinish" : "Повторить"}
          </button>
          <a
            href="/"
            className="px-5 h-11 border border-border text-xs font-semibold rounded-btn hover:bg-surface-muted flex items-center justify-center text-text"
          >
            {locale === "uz" ? "Bosh sahifaga qaytish" : "Вернуться на главную"}
          </a>
        </div>
      </div>
    </div>
  );
}