"use client";

import React, { useState } from "react";
import { ClipboardList, Clock, CheckCircle2, Search, AlertCircle } from "lucide-react";
import adminData from "../../../lib/adminData.json";

interface Props {
  locale: "uz" | "ru";
}

export function AdminOrdersSection({ locale }: Props) {
  const [search, setSearch] = useState("");

  const filtered = adminData.orders.filter((o) => {
    return (
      (o.seller?.companyName || "").toLowerCase().includes(search.toLowerCase()) ||
      (o.buyer?.companyName || "").toLowerCase().includes(search.toLowerCase()) ||
      (o.listing?.title || "").toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-text tracking-tight">
            {locale === "uz" ? "Buyurtmalar va 72 Soatlik Taymer Nazorati" : "Заказы и контроль 72-часового таймера"}
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            {locale === "uz" 
              ? `Tizimda sotuvchi va xaridor oʻrtasidagi faol buyurtmalar nazorati` 
              : `Контроль за исполнением заказов и своевременными ответами продавцов`}
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
            placeholder={locale === "uz" ? "Sotuvchi, xaridor yoki tovar boʻyicha qidirish..." : "Поиск по продавцу, покупателю или товару..."}
            className="w-full h-10 pl-9 pr-4 bg-surface-muted border border-border rounded-btn text-xs text-text focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="bg-surface rounded-card border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-muted border-b border-border text-text-secondary font-bold uppercase text-[11px]">
                <th className="p-3.5">ID / Sana</th>
                <th className="p-3.5">{locale === "uz" ? "Mahsulot" : "Товар"}</th>
                <th className="p-3.5">{locale === "uz" ? "Hajmi va Narxi" : "Объём и Цена"}</th>
                <th className="p-3.5">{locale === "uz" ? "Ishtirokchilar" : "Участники"}</th>
                <th className="p-3.5">{locale === "uz" ? "72 soatlik taymer" : "72-часовой таймер"}</th>
                <th className="p-3.5">{locale === "uz" ? "Holat" : "Статус"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((ord, idx) => (
                <tr key={ord.id} className="hover:bg-surface-muted/60 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold text-text">#{ord.id.slice(0, 8)}</div>
                    <div className="text-[11px] text-text-muted">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-3.5 font-bold text-text">
                    <div className="truncate max-w-[220px]">{ord.listing?.title || "Mahsulot"}</div>
                  </td>
                  <td className="p-3.5 font-bold text-primary">
                    {Number(ord.quantity).toLocaleString()} {ord.listing?.unit || "kg"}
                    <div className="text-[11px] text-text-muted font-normal">
                      {Number(ord.listing?.pricePerUnit || 12000).toLocaleString()} soʻm / {ord.listing?.unit || "kg"}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-text">{ord.seller?.companyName || "Sotuvchi"}</div>
                    <div className="text-[11px] text-text-secondary">➔ {ord.buyer?.companyName || "Xaridor"}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="inline-flex items-center gap-1 text-[11px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                      <Clock className="w-3 h-3" />
                      {idx % 2 === 0 ? "54 soat qoldi" : "41 soat qoldi"}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-success/15 text-success">
                      <CheckCircle2 className="w-3 h-3" />
                      {ord.status}
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
