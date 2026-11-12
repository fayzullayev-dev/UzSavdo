"use client";

import React, { useState } from "react";
import { BookOpen, Search, CheckCircle2, ShieldCheck, Tag } from "lucide-react";
import adminData from "../../../lib/adminData.json";

interface Props {
  locale: "uz" | "ru";
}

export function AdminProductsSection({ locale }: Props) {
  const [search, setSearch] = useState("");

  const filtered = adminData.products.filter((p) => {
    const name = locale === "ru" && p.nameRu ? p.nameRu : p.nameUz;
    return name.toLowerCase().includes(search.toLowerCase()) || 
      (p.category?.nameUz || "").toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-text tracking-tight">
            {locale === "uz" ? "Yagona Mahsulotlar Spravochnigi (Klassifikator)" : "Единый справочник товаров (Классификатор)"}
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            {locale === "uz" 
              ? `Standartlashtirilgan ${adminData.products.length} ta rasmiy tovar turlari roʻyxati` 
              : `Стандартизированный каталог из ${adminData.products.length} утверждённых наименований`}
          </p>
        </div>
      </div>

      <div className="bg-surface rounded-card border border-border p-4 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={locale === "uz" ? "Mahsulot nomi yoki kategoriyasi boʻyicha qidirish..." : "Поиск по наименованию или категории..."}
            className="w-full h-10 pl-9 pr-4 bg-surface-muted border border-border rounded-btn text-xs text-text focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="bg-surface rounded-card border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-muted border-b border-border text-text-secondary font-bold uppercase text-[11px]">
                <th className="p-3.5">№</th>
                <th className="p-3.5">{locale === "uz" ? "Mahsulot nomi (Oʻzbekcha / Ruscha)" : "Наименование (Узбекский / Русский)"}</th>
                <th className="p-3.5">{locale === "uz" ? "Biriktirilgan kategoriya" : "Категория"}</th>
                <th className="p-3.5">{locale === "uz" ? "Moderatsiya holati" : "Статус модерации"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.slice(0, 40).map((prod, idx) => (
                <tr key={prod.id} className="hover:bg-surface-muted/60 transition-colors">
                  <td className="p-3.5 text-text-muted font-bold">{idx + 1}</td>
                  <td className="p-3.5">
                    <div className="font-bold text-text">{prod.nameUz}</div>
                    <div className="text-[11px] text-text-secondary">{prod.nameRu || "—"}</div>
                  </td>
                  <td className="p-3.5 text-text-secondary font-medium">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-muted border border-border text-[11px]">
                      <Tag className="w-3 h-3 text-primary" />
                      {prod.category?.nameUz || "Umumiy"}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-success/15 text-success">
                      <ShieldCheck className="w-3 h-3" />
                      {locale === "uz" ? "Tasdiqlangan" : "Утверждено"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
