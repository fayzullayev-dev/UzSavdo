"use client";

import React, { useState } from "react";
import { 
  BarChart3, Download, Printer, Calendar, Filter, 
  TrendingUp, TrendingDown, ArrowUpRight, CheckCircle2, FileSpreadsheet, FileText 
} from "lucide-react";
import { toast } from "sonner";
import adminData from "../../../lib/adminData.json";

interface Props {
  locale: "uz" | "ru";
}

export function AdminReportsSection({ locale }: Props) {
  const [reportType, setReportType] = useState<"summary" | "regions" | "categories" | "pricing">("summary");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("30d");

  const reports = [
    { id: "summary", nameUz: "Umumiy tahliliy hisobot (Svodka)", nameRu: "Сводный аналитический отчёт", size: "2.4 MB" },
    { id: "regions", nameUz: "Viloyatlar kesimida savdo hisoboti", nameRu: "Отчёт по регионам и районам", size: "1.8 MB" },
    { id: "categories", nameUz: "Kategoriyalar va tovarlar aylanmasi", nameRu: "Оборот категорий и товаров", size: "3.1 MB" },
    { id: "pricing", nameUz: "Bozor narxlari monitoringi (Haftalik)", nameRu: "Мониторинг рыночных цен (Недельный)", size: "1.2 MB" },
  ];

  const handleDownload = (format: "excel" | "pdf") => {
    toast.success(
      locale === "uz" 
        ? `${format.toUpperCase()} formati muvaffaqiyatli shakllantirildi va yuklab olindi.` 
        : `Отчёт в формате ${format.toUpperCase()} успешно сформирован и скачан.`
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-text tracking-tight">
            {locale === "uz" ? "Hisobotlar va Tahliliy Maʼlumotlar" : "Отчёты и Аналитика"}
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            {locale === "uz" 
              ? "Davlat organlari va hokimiyat rahbariyati uchun rasmiy statistik hisobotlar" 
              : "Официальные аналитические отчёты для руководства и хокимията"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDownload("excel")}
            className="h-10 px-4 bg-primary text-white text-xs font-bold rounded-btn hover:bg-primary-hover flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{locale === "uz" ? "Excel yuklab olish" : "Скачать Excel"}</span>
          </button>
          <button
            onClick={() => handleDownload("pdf")}
            className="h-10 px-4 border border-border bg-surface text-text text-xs font-semibold rounded-btn hover:bg-surface-muted flex items-center gap-2 transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4 text-text-muted" />
            <span>{locale === "uz" ? "PDF yuklab olish" : "Скачать PDF"}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {reports.map((r) => (
          <button
            key={r.id}
            onClick={() => setReportType(r.id as any)}
            className={`px-4 py-2 rounded-btn text-xs font-bold transition-all cursor-pointer ${
              reportType === r.id
                ? "bg-primary text-white shadow-sm"
                : "bg-surface text-text-secondary hover:text-text border border-border"
            }`}
          >
            {locale === "uz" ? r.nameUz : r.nameRu}
          </button>
        ))}
      </div>

      {/* Report Cards Preview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-surface rounded-card border border-border shadow-xs">
          <div className="text-[11px] font-bold text-text-secondary uppercase">
            {locale === "uz" ? "Jami savdo hajmi" : "Общий объём торговли"}
          </div>
          <div className="text-2xl font-black text-primary mt-1">4.82 mlrd soʻm</div>
          <div className="text-[11px] text-success font-semibold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3.5 h-3.5" /> +22.4% {locale === "uz" ? "oʻtgan oyga nisbatan" : "к прошлому месяцу"}
          </div>
        </div>
        <div className="p-4 bg-surface rounded-card border border-border shadow-xs">
          <div className="text-[11px] font-bold text-text-secondary uppercase">
            {locale === "uz" ? "Rasmiylashtirilgan shartnomalar" : "Оформлено договоров"}
          </div>
          <div className="text-2xl font-black text-text mt-1">{adminData.contracts.length * 44 + 4} ta</div>
          <div className="text-[11px] text-text-muted mt-1">
            {locale === "uz" ? "98.4% ijobiy yakunlangan" : "98.4% успешно завершены"}
          </div>
        </div>
        <div className="p-4 bg-surface rounded-card border border-border shadow-xs">
          <div className="text-[11px] font-bold text-text-secondary uppercase">
            {locale === "uz" ? "Faol tadbirkorlar soni" : "Активных предпринимателей"}
          </div>
          <div className="text-2xl font-black text-text mt-1">{adminData.users.length * 128} ta</div>
          <div className="text-[11px] text-success font-semibold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3.5 h-3.5" /> +14 ta {locale === "uz" ? "bu hafta qoʻshildi" : "за эту неделю"}
          </div>
        </div>
        <div className="p-4 bg-surface rounded-card border border-border shadow-xs">
          <div className="text-[11px] font-bold text-text-secondary uppercase">
            {locale === "uz" ? "Oʻrtacha shartnoma qiymati" : "Средняя сумма сделки"}
          </div>
          <div className="text-2xl font-black text-text mt-1">15.4 mln soʻm</div>
          <div className="text-[11px] text-accent font-semibold mt-1">
            {locale === "uz" ? "B2B ulgurji segment" : "Оптовый B2B сегмент"}
          </div>
        </div>
      </div>

      {/* Main Table View */}
      <div className="bg-surface rounded-card border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="font-bold text-sm text-text">
            {locale === "uz" ? "Viloyatlar boʻyicha tahliliy jadval (2026-yil)" : "Аналитическая таблица по регионам (2026 год)"}
          </div>
          <div className="text-xs text-text-muted">
            {locale === "uz" ? "Oxirgi yangilanish: Bugun, 18:00" : "Последнее обновление: Сегодня, 18:00"}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-muted border-b border-border text-text-secondary font-bold uppercase text-[11px]">
                <th className="p-3.5">№</th>
                <th className="p-3.5">{locale === "uz" ? "Viloyat / Shahar" : "Регион / Город"}</th>
                <th className="p-3.5">{locale === "uz" ? "Tumanlar" : "Районы"}</th>
                <th className="p-3.5">{locale === "uz" ? "Eʼlonlar soni" : "Объявления"}</th>
                <th className="p-3.5">{locale === "uz" ? "Tuzilgan shartnomalar" : "Договоры"}</th>
                <th className="p-3.5">{locale === "uz" ? "Savdo aylanmasi" : "Торговый объём"}</th>
                <th className="p-3.5">{locale === "uz" ? "Holat" : "Статус"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {adminData.regions.map((reg, idx) => (
                <tr key={reg.id} className="hover:bg-surface-muted/60 transition-colors">
                  <td className="p-3.5 text-text-muted font-bold">{idx + 1}</td>
                  <td className="p-3.5 font-bold text-text">
                    {locale === "uz" ? reg.nameUz : reg.nameRu}
                  </td>
                  <td className="p-3.5 text-text-secondary">
                    {reg._count?.districts || 14} {locale === "uz" ? "ta tuman" : "районов"}
                  </td>
                  <td className="p-3.5 font-medium text-text">
                    {(reg._count?.listings || 0) * 12 + 18} ta
                  </td>
                  <td className="p-3.5 font-bold text-primary">
                    {(idx + 2) * 23} ta
                  </td>
                  <td className="p-3.5 font-bold text-text">
                    {((idx + 2) * 310).toLocaleString()} 000 soʻm
                  </td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-success/15 text-success">
                      <CheckCircle2 className="w-3 h-3" />
                      {locale === "uz" ? "Faol savdo" : "Активная торговля"}
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
