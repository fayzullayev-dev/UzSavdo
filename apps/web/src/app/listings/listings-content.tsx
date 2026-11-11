"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "../../lib/language";
import { apiFetch } from "../../lib/api";
import { NavigationLayout } from "../../components/navigation";
import { ListingFilter } from "../../components/listing-filter";
import { ListingCard } from "../../components/listing-card";
import { Package } from "lucide-react";

export default function ListingsContent() {
  const { locale, t } = useLanguage();
  const searchParams = useSearchParams();

  const [listings, setListings] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchListings = (filterParams: any = {}) => {
    setLoading(true);
    const query = new URLSearchParams();

    const q = searchParams.get("q");
    if (q) query.append("q", q);
    const cat = searchParams.get("categoryId");
    if (cat && !filterParams.categoryId) query.append("categoryId", cat);

    Object.entries(filterParams).forEach(([k, v]) => {
      if (v) query.append(k, String(v));
    });

    apiFetch(`/listings?${query.toString()}`)
      .then((data) => {
        setListings(data.items || []);
        setTotal(data.total || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchListings();
  }, [searchParams]);

  return (
    <NavigationLayout>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-text mb-1">
          {locale === "uz" ? "Barcha eʼlonlar" : "Все объявления"}
        </h1>
        <p className="text-xs text-text-secondary">
          {t("listing.foundCount", { count: total })}
        </p>
      </div>

      {/* Flyout Filter Component */}
      <ListingFilter onApply={(filters) => fetchListings(filters)} />

      {/* Grid: 5 columns on 1920px */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : listings.length === 0 ? (
        <div className="bg-surface rounded-card border border-border p-12 text-center my-6">
          <Package className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-60" />
          <h3 className="font-bold text-base text-text mb-1">{t("listing.empty")}</h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto">
            {locale === "uz"
              ? "Tanlangan filtrlarga mos keluvchi mahsulotlar topilmadi."
              : "По выбранным критериям поиска объявлений не найдено."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5">
          {listings.map((item) => (
            <ListingCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </NavigationLayout>
  );
}