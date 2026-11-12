"use client";

import React, { useState } from "react";
import { MapPin, Search, CheckCircle2, Building, Layers } from "lucide-react";
import adminData from "../../../lib/adminData.json";

interface Props {
  locale: "uz" | "ru";
}

export function AdminRegionsSection({ locale }: Props) {
  const [search, setSearch] = useState("");

  const filtered = adminData.regions.filter((r) => {
    const name = locale === "ru" && r.nameRu ? r.nameRu : r.nameUz;
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-text tracking-tight">
            {locale === "uz" ? "Hududlar va Tumanlar (СОАТО)" : "Регионы и Районы (СОАТО)"}
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            {locale === "uz" 
              ? "Oʻzbekiston Respublikasining 14 ta asosiy maʼmuriy hududi va 196 ta tumani" 
              : "14 административных регионов и 196 районов Республики Узбекистан"}
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
            placeholder={locale === "uz" ? "Viloyat yoki shahar nomi boʻyicha qidirish..." : "Поиск по названию региона или города..."}
            className="w-full h-10 pl-9 pr-4 bg-surface-muted border border-border rounded-btn text-xs text-text focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((reg, idx) => (
          <div key={reg.id} className="p-4 bg-surface rounded-card border border-border shadow-xs hover:border-primary/50 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-btn bg-primary/10 text-primary">
                  <MapPin className="w-4 h-4" />
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-success/15 text-success">
                  <CheckCircle2 className="w-3 h-3" />
                  {locale === "uz" ? "Faol hudud" : "Активен"}
                </span>
              </div>
              <h3 className="font-bold text-sm text-text">
                {locale === "uz" ? reg.nameUz : reg.nameRu}
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                {locale === "uz" ? reg.nameRu : reg.nameUz}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-border flex items-center justify-between text-xs text-text-muted">
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-primary" />
                <strong className="text-text font-bold">{reg._count?.districts || 14}</strong> {locale === "uz" ? "ta tuman" : "районов"}
              </span>
              <span className="font-semibold text-text">
                {reg.type || "VILOYAT"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
