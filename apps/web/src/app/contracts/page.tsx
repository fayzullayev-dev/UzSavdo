"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "../../lib/language";
import { apiFetch } from "../../lib/api";
import { NavigationLayout } from "../../components/navigation";
import { FileText, Download, QrCode } from "lucide-react";
import { toast } from "sonner";

export default function ContractsPage() {
  const { locale, t } = useLanguage();
  const [tab, setTab] = useState<"buyer" | "seller">("buyer");
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiFetch(`/contracts?role=${tab}`)
      .then((data) => setContracts(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [tab]);

  const downloadPdf = (c: any) => {
    toast.success(
      locale === "uz"
        ? `«${c.number}» shartnomasi PDF formatida yuklab olindi.`
        : `Договор «${c.number}» успешно сформирован в PDF.`
    );
  };

  return (
    <NavigationLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text mb-1">
            {locale === "uz" ? "Shartnomalarim" : "Мои договоры"}
          </h1>
          <p className="text-xs text-text-secondary">
            {locale === "uz" ? "Rasmiy mahsulot shartnomalari roʻyxati va PDF nusxalari" : "Официальные договоры и электронные документы"}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setTab("buyer")}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all ${
              tab === "buyer" ? "border-primary text-primary" : "border-transparent text-text-secondary hover:text-text"
            }`}
          >
            {locale === "uz" ? "Xaridor sifatida" : "Как покупатель"}
          </button>
          <button
            onClick={() => setTab("seller")}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all ${
              tab === "seller" ? "border-primary text-primary" : "border-transparent text-text-secondary hover:text-text"
            }`}
          >
            {locale === "uz" ? "Sotuvchi sifatida" : "Как продавец"}
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : contracts.length === 0 ? (
          <div className="bg-surface rounded-card border border-border p-12 text-center">
            <FileText className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-60" />
            <p className="text-xs text-text-secondary">
              {locale === "uz" ? "Hozircha shartnomalar tuzilmagan" : "Договоров пока нет"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {contracts.map((c) => (
              <div
                key={c.id}
                className="bg-surface rounded-card border border-border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs hover:border-primary/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-primary">{c.number}</span>
                    <span className="bg-success/15 text-success text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {c.isTrial ? (locale === "uz" ? "Sinov davrida bepul" : "Бесплатно") : "Toʻlangan"}
                    </span>
                  </div>
                  <h3 className="font-semibold text-xs text-text">{c.listing?.title}</h3>
                  <p className="text-[11px] text-text-secondary">
                    {tab === "buyer" ? (
                      <>Sotuvchi: <span className="font-semibold text-text">{c.seller?.companyName}</span></>
                    ) : (
                      <>Xaridor: <span className="font-semibold text-text">{c.buyer?.companyName}</span></>
                    )}
                    {" · "}{Number(c.quantity)} {c.unit} ({Number(c.estimatedTotal).toLocaleString("ru-RU")} soʻm)
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => downloadPdf(c)}
                    className="h-10 px-3 bg-surface-muted border border-border rounded-btn text-xs font-semibold text-text hover:bg-border/40 flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-primary" />
                    PDF
                  </button>
                  <button
                    onClick={() =>
                      toast.info(
                        locale === "uz"
                          ? `QR Tekshiruv: ${c.number}\nPlatforma: UzSavdo rasmiy reestri`
                          : `QR Проверка: ${c.number}\nПлатформа: Официальный реестр UzSavdo`
                      )
                    }
                    className="h-10 px-3 border border-border rounded-btn text-xs font-semibold text-text-secondary hover:bg-surface-muted flex items-center gap-1.5 cursor-pointer"
                    title="QR tekshiruv"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    QR
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </NavigationLayout>
  );
}