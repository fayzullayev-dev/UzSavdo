"use client";

import React, { useState } from "react";
import { History, ShieldCheck, Search, User, Clock, Terminal } from "lucide-react";
import adminData from "../../../lib/adminData.json";

interface Props {
  locale: "uz" | "ru";
}

export function AdminAuditSection({ locale }: Props) {
  const [search, setSearch] = useState("");

  const filtered = adminData.audit.filter((a) => {
    return (
      a.action.toLowerCase().includes(search.toLowerCase()) ||
      a.entity.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-text tracking-tight">
            {locale === "uz" ? "Harakatlar va Xavfsizlik Jurnali (Audit Log)" : "Журнал аудита действий и безопасности"}
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            {locale === "uz" 
              ? "Tizim administratorlari va foydalanuvchilarning barcha muhim harakatlari tarixi" 
              : "Неизменяемый журнал всех критических операций в системе"}
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
            placeholder={locale === "uz" ? "Amal turi yoki obyekt boʻyicha qidiruv..." : "Поиск по действию или объекту..."}
            className="w-full h-10 pl-9 pr-4 bg-surface-muted border border-border rounded-btn text-xs text-text focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="bg-surface rounded-card border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-muted border-b border-border text-text-secondary font-bold uppercase text-[11px]">
                <th className="p-3.5">Vaqt / Sana</th>
                <th className="p-3.5">Amal (Action)</th>
                <th className="p-3.5">Obyekt (Entity)</th>
                <th className="p-3.5">Obyekt ID</th>
                <th className="p-3.5">Tafsilotlar (Payload)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-mono text-[11px]">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-surface-muted/60 transition-colors">
                  <td className="p-3.5 text-text-muted">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3.5 font-bold text-primary">
                    <span className="px-2 py-0.5 rounded-sm bg-primary/10 text-primary">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3.5 text-text font-bold">
                    {log.entity}
                  </td>
                  <td className="p-3.5 text-text-secondary truncate max-w-[120px]">
                    {log.entityId}
                  </td>
                  <td className="p-3.5 text-text max-w-[320px] truncate">
                    {log.after || log.before || "—"}
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
