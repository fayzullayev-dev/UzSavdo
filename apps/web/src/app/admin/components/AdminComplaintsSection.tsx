"use client";

import React, { useState } from "react";
import { AlertOctagon, CheckCircle2, Clock, ShieldAlert, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import adminData from "../../../lib/adminData.json";

interface Props {
  locale: "uz" | "ru";
}

export function AdminComplaintsSection({ locale }: Props) {
  const [complaints, setComplaints] = useState(adminData.complaints);

  const handleResolve = (id: string) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: "RESOLVED" } : c));
    toast.success(
      locale === "uz" 
        ? "Shikoyat koʻrib chiqildi va hal qilindi deb belgilandi." 
        : "Жалоба успешно рассмотрена и закрыта."
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-text tracking-tight">
            {locale === "uz" ? "Shikoyatlar va Arbitraj Holatlari" : "Жалобы и Арбитраж"}
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            {locale === "uz" 
              ? "Tadbirkorlar tomonidan eʼlonlar yoki xizmat sifati boʻyicha yoʻllangan shikoyatlar" 
              : "Жалобы от участников торгов по поводу цен, качества и выполнения обязательств"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {complaints.map((comp) => (
          <div key={comp.id} className="p-5 bg-surface rounded-card border border-border shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-btn bg-danger/10 text-danger">
                  <AlertOctagon className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="font-bold text-sm text-text">
                    {locale === "uz" ? "Sabab: " : "Причина: "}
                    <span className="text-danger font-extrabold">{comp.reason}</span>
                  </h4>
                  <p className="text-[11px] text-text-muted">
                    {locale === "uz" ? "Ariza beruvchi: " : "Заявитель: "}
                    <strong className="text-text">{comp.reporter?.companyName || comp.reporter?.firstName}</strong> • {new Date(comp.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                {comp.status === "RESOLVED" ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-success/15 text-success">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {locale === "uz" ? "Hal qilingan" : "Решено"}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400">
                    <Clock className="w-3.5 h-3.5" />
                    {locale === "uz" ? "Koʻrib chiqilmoqda" : "В обработке"}
                  </span>
                )}
              </div>
            </div>

            <div className="p-3 bg-surface-muted rounded-btn text-xs text-text border border-border">
              {comp.comment}
            </div>

            {comp.status !== "RESOLVED" && (
              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => handleResolve(comp.id)}
                  className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-btn hover:bg-primary-hover transition-colors cursor-pointer"
                >
                  {locale === "uz" ? "Hal qilish va yopish" : "Рассмотрено и решено"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
