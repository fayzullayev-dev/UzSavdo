"use client";

import React, { useState } from "react";
import { FileText, Download, CheckCircle2, Clock, Search, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import adminData from "../../../lib/adminData.json";

interface Props {
  locale: "uz" | "ru";
}

export function AdminContractsSection({ locale }: Props) {
  const [search, setSearch] = useState("");

  const filtered = adminData.contracts.filter((c) => {
    return (
      c.number.toLowerCase().includes(search.toLowerCase()) ||
      (c.seller?.companyName || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.buyer?.companyName || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.listing?.title || "").toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleDownloadPdf = (number: string) => {
    toast.success(
      locale === "uz" 
        ? `Shartnoma № ${number} PDF formatida yuklab olindi.` 
        : `Договор № ${number} скачан в формате PDF.`
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-text tracking-tight">
            {locale === "uz" ? "Shartnomalar va Toʻlovlar Reyestri" : "Реестр договоров и платежей"}
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            {locale === "uz" 
              ? `Tizimda shakllantirilgan rasmiy shartnomalar • Sinov davri davomida 0% komissiya` 
              : `Официальные договоры в системе • 0% комиссии на период промо`}
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
            placeholder={locale === "uz" ? "Shartnoma raqami, sotuvchi yoki xaridor nomi boʻyicha qidirish..." : "Поиск по номеру договора, продавцу или покупателю..."}
            className="w-full h-10 pl-9 pr-4 bg-surface-muted border border-border rounded-btn text-xs text-text focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="bg-surface rounded-card border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-muted border-b border-border text-text-secondary font-bold uppercase text-[11px]">
                <th className="p-3.5">{locale === "uz" ? "Shartnoma №" : "Номер договора"}</th>
                <th className="p-3.5">{locale === "uz" ? "Sotuvchi va Xaridor" : "Продавец и Покупатель"}</th>
                <th className="p-3.5">{locale === "uz" ? "Mahsulot va Hajm" : "Товар и Объём"}</th>
                <th className="p-3.5">{locale === "uz" ? "Qiymati" : "Сумма"}</th>
                <th className="p-3.5">{locale === "uz" ? "Holat" : "Статус"}</th>
                <th className="p-3.5 text-right">{locale === "uz" ? "Amallar" : "Действия"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((con) => (
                <tr key={con.id} className="hover:bg-surface-muted/60 transition-colors">
                  <td className="p-3.5 font-bold text-text">
                    <div className="flex items-center gap-1.5 text-primary">
                      <FileText className="w-3.5 h-3.5" />
                      <span>{con.number}</span>
                    </div>
                    <div className="text-[11px] text-text-muted font-normal">
                      {new Date(con.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-text">{con.seller?.companyName || "Sotuvchi korxona"}</div>
                    <div className="text-[11px] text-text-secondary font-medium">➔ {con.buyer?.companyName || "Xaridor korxona"}</div>
                  </td>
                  <td className="p-3.5 text-text font-medium">
                    <div className="truncate max-w-[200px]">{con.listing?.title || "Mahsulot"}</div>
                    <div className="text-[11px] text-text-muted">
                      {Number(con.quantity).toLocaleString()} {con.unit}
                    </div>
                  </td>
                  <td className="p-3.5 font-extrabold text-text">
                    {Number(con.estimatedTotal).toLocaleString()} soʻm
                    <div className="text-[10px] text-success font-semibold">
                      {locale === "uz" ? "Sinov davri (bepul)" : "Пробный период (0%)"}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-success/15 text-success">
                      <CheckCircle2 className="w-3 h-3" />
                      {con.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleDownloadPdf(con.number)}
                      className="px-3 py-1.5 bg-surface-muted hover:bg-border text-text font-bold text-xs rounded-btn transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
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
