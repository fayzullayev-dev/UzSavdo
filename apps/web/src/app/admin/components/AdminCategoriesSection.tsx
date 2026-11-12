"use client";

import React, { useState } from "react";
import { FolderTree, Plus, CheckCircle2, Package, Layers } from "lucide-react";
import { toast } from "sonner";
import adminData from "../../../lib/adminData.json";

interface Props {
  locale: "uz" | "ru";
}

export function AdminCategoriesSection({ locale }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-text tracking-tight">
            {locale === "uz" ? "Tovarlar va Xizmatlar Kategoriyalari" : "Категории товаров и услуг"}
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            {locale === "uz" 
              ? `Tizimda rasmiy tasdiqlangan ${adminData.categories.length} ta asosiy yoʻnalish mavjud` 
              : `В системе официально утверждено ${adminData.categories.length} основных направлений`}
          </p>
        </div>
        <button
          onClick={() => toast.info(locale === "uz" ? "Yangi kategoriya qoʻshish faqat Bosh moderator huquqida" : "Добавление категорий доступно Главному модератору")}
          className="h-10 px-4 bg-primary text-white text-xs font-bold rounded-btn hover:bg-primary-hover flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{locale === "uz" ? "Kategoriya qoʻshish" : "Добавить категорию"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {adminData.categories.map((cat, idx) => (
          <div key={cat.id} className="p-4 bg-surface rounded-card border border-border shadow-xs hover:border-primary/50 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-btn bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                  {idx + 1}
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-success/15 text-success">
                  <CheckCircle2 className="w-3 h-3" />
                  {locale === "uz" ? "Faol" : "Активна"}
                </span>
              </div>
              <h3 className="font-bold text-sm text-text">
                {locale === "uz" ? cat.nameUz : cat.nameRu}
              </h3>
              <p className="text-xs text-text-secondary mt-1">
                {locale === "uz" ? cat.nameRu : cat.nameUz}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-border flex items-center justify-between text-xs text-text-muted">
              <span className="flex items-center gap-1">
                <Package className="w-3.5 h-3.5 text-primary" />
                <strong className="text-text font-bold">{cat._count?.products || 6}</strong> {locale === "uz" ? "tur mahsulot" : "наименований"}
              </span>
              <span>
                {locale === "uz" ? "Tartib raqami" : "Сортировка"}: #{cat.sortOrder || idx + 1}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
