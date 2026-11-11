"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "../lib/language";

export default function NotFound() {
  const { locale } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="bg-surface rounded-modal border border-border p-8 max-w-md w-full text-center shadow-lg">
        <span className="text-5xl font-extrabold text-primary mb-2 block">404</span>
        <h2 className="text-lg font-bold text-text mb-2">
          {locale === "uz" ? "Sahifa topilmadi" : "Страница не найдена"}
        </h2>
        <p className="text-xs text-text-secondary mb-6 leading-relaxed">
          {locale === "uz"
            ? "Siz qidirayotgan sahifa mavjud emas yoki boshqa manzilga koʻchirilgan."
            : "Запрашиваемая страница не существует или была перемещена."}
        </p>
        <Link
          href="/"
          className="inline-flex px-6 h-11 bg-primary text-white text-xs font-semibold rounded-btn hover:bg-primary-hover items-center justify-center shadow-sm"
        >
          {locale === "uz" ? "Bosh sahifaga qaytish" : "На главную"}
        </Link>
      </div>
    </div>
  );
}