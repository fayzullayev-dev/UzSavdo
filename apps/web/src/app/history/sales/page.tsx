"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "../../../lib/language";
import { apiFetch } from "../../../lib/api";
import { NavigationLayout } from "../../../components/navigation";
import { TrendingUp } from "lucide-react";

export default function SalesHistoryPage() {
  const { locale } = useLanguage();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/orders?role=seller")
      .then((data) => setOrders(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <NavigationLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text mb-1">
            {locale === "uz" ? "Sotuvlar tarixi" : "История продаж"}
          </h1>
          <p className="text-xs text-text-secondary">
            {locale === "uz" ? "Muvaffaqiyatli amalga oshirilgan barcha sotuvlar roʻyxati" : "История реализованных товаров"}
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-surface rounded-card border border-border p-12 text-center">
            <TrendingUp className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-60" />
            <p className="text-xs text-text-secondary">
              {locale === "uz" ? "Hozircha sotuvlar tarixi mavjud emas" : "История продаж пуста"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="bg-surface rounded-card border border-border p-5 flex justify-between items-center shadow-xs">
                <div>
                  <span className="font-bold text-xs text-primary">{o.contract?.number}</span>
                  <h3 className="font-bold text-sm text-text mt-0.5">{o.listing?.title}</h3>
                  <p className="text-xs text-text-secondary mt-1">
                    Xaridor: <span className="font-semibold text-text">{o.buyer?.companyName}</span> ({o.buyer?.phone})
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-primary block">
                    {(Number(o.quantity) * Number(o.listing?.pricePerUnit || 0)).toLocaleString("ru-RU")} soʻm
                  </span>
                  <span className="text-[11px] text-text-muted">{Number(o.quantity)} {o.listing?.unit}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </NavigationLayout>
  );
}