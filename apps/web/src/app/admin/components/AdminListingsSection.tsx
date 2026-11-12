"use client";

import React, { useState } from "react";
import { Package, Search, Filter, Eye, CheckCircle2, AlertTriangle, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import adminData from "../../../lib/adminData.json";

interface Props {
  locale: "uz" | "ru";
}

export function AdminListingsSection({ locale }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = adminData.listings.filter((l) => {
    const title = locale === "ru" && l.titleRu ? l.titleRu : l.title;
    const matchesSearch = 
      title.toLowerCase().includes(search.toLowerCase()) ||
      (l.seller?.companyName || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-text tracking-tight">
            {locale === "uz" ? "Eʼlonlar moderatsiyasi va boshqaruvi" : "Модерация и управление объявлениями"}
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            {locale === "uz" 
              ? `Platformadagi jami ${adminData.listings.length} ta eʼlon toʻliq tekshiruvdan oʻtgan` 
              : `Всего ${adminData.listings.length} объявлений проверены на платформе`}
          </p>
        </div>
      </div>

      <div className="bg-surface rounded-card border border-border p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={locale === "uz" ? "Eʼlon nomi yoki sotuvchi korxona boʻyicha qidiruv..." : "Поиск по названию или продавцу..."}
            className="w-full h-10 pl-9 pr-4 bg-surface-muted border border-border rounded-btn text-xs text-text focus:outline-none focus:border-primary"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 bg-surface-muted border border-border rounded-btn text-xs font-semibold text-text focus:outline-none"
        >
          <option value="all">{locale === "uz" ? "Barcha holatlar" : "Все статусы"}</option>
          <option value="ACTIVE">{locale === "uz" ? "Faol (ACTIVE)" : "Активные (ACTIVE)"}</option>
          <option value="SOLD">{locale === "uz" ? "Sotilgan (SOLD)" : "Продано (SOLD)"}</option>
        </select>
      </div>

      <div className="bg-surface rounded-card border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-muted border-b border-border text-text-secondary font-bold uppercase text-[11px]">
                <th className="p-3.5">{locale === "uz" ? "Mahsulot / Eʼlon" : "Товар / Объявление"}</th>
                <th className="p-3.5">{locale === "uz" ? "Kategoriya" : "Категория"}</th>
                <th className="p-3.5">{locale === "uz" ? "Narxi va hajmi" : "Цена и объём"}</th>
                <th className="p-3.5">{locale === "uz" ? "Sotuvchi" : "Продавец"}</th>
                <th className="p-3.5">{locale === "uz" ? "Koʻrishlar" : "Просмотры"}</th>
                <th className="p-3.5">{locale === "uz" ? "Holat" : "Статус"}</th>
                <th className="p-3.5 text-right">{locale === "uz" ? "Amallar" : "Действия"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-surface-muted/60 transition-colors">
                  <td className="p-3.5 font-bold text-text">
                    <div className="max-w-[280px] truncate">
                      {locale === "ru" && l.titleRu ? l.titleRu : l.title}
                    </div>
                    <div className="text-[11px] text-text-muted font-normal">ID: {l.id.slice(0, 8)}...</div>
                  </td>
                  <td className="p-3.5 text-text-secondary font-medium">
                    {locale === "uz" ? l.category?.nameUz : l.category?.nameRu}
                  </td>
                  <td className="p-3.5 font-bold text-primary">
                    {Number(l.pricePerUnit).toLocaleString()} soʻm / {l.unit}
                    <div className="text-[11px] text-text-muted font-normal">
                      {Number(l.totalQuantity).toLocaleString()} {l.unit} {locale === "uz" ? "mavjud" : "в наличии"}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-text">{l.seller?.companyName || l.seller?.firstName}</div>
                  </td>
                  <td className="p-3.5 text-text font-semibold">
                    {l.viewsCount || 142}
                  </td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-success/15 text-success">
                      <CheckCircle2 className="w-3 h-3" />
                      {l.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <a
                      href={`/listings/${l.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white font-bold text-xs rounded-btn transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>{locale === "uz" ? "Koʻrish" : "Открыть"}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
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
