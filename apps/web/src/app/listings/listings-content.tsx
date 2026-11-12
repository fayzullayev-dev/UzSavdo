"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "../../lib/language";
import { apiFetch } from "../../lib/api";
import { NavigationLayout } from "../../components/navigation";
import { ListingFilter } from "../../components/listing-filter";
import { ListingCard } from "../../components/listing-card";
import { Package, List, LayoutGrid } from "lucide-react";

export default function ListingsContent() {
  const { locale, t } = useLanguage();
  const searchParams = useSearchParams();

  const [listings, setListings] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // View Mode: 'row' (list) or 'card' (grid)
  // Default to 'row' on mobile as requested in Section 1.1 / 1.2
  const [viewMode, setViewMode] = useState<"row" | "card">("row");

  useEffect(() => {
    // If desktop (>= 1024px), can default to grid, but user can switch
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setViewMode("card");
    }
  }, []);

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
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text mb-0.5">
            {locale === "uz" ? "Barcha eʼlonlar" : "Все объявления"}
          </h1>
          <p className="text-xs text-text-secondary">
            {t("listing.foundCount", { count: total })}
          </p>
        </div>

        {/* View Mode Switcher (Section 1.2: List vs LayoutGrid) */}
        <div className="flex items-center bg-surface p-1 rounded-[12px] border border-border shadow-xs">
          <button
            type="button"
            onClick={() => setViewMode("row")}
            className={`p-2 rounded-[8px] transition-all flex items-center gap-1.5 text-xs font-semibold ${
              viewMode === "row"
                ? "bg-primary text-white shadow-xs"
                : "text-text-secondary hover:text-text hover:bg-surface-muted"
            }`}
            title={locale === "uz" ? "Roʻyxat" : "Список"}
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">{locale === "uz" ? "Roʻyxat" : "Список"}</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("card")}
            className={`p-2 rounded-[8px] transition-all flex items-center gap-1.5 text-xs font-semibold ${
              viewMode === "card"
                ? "bg-primary text-white shadow-xs"
                : "text-text-secondary hover:text-text hover:bg-surface-muted"
            }`}
            title={locale === "uz" ? "Jadval" : "Плитка"}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">{locale === "uz" ? "Jadval" : "Плитка"}</span>
          </button>
        </div>
      </div>

      {/* Flyout Filter Component */}
      <ListingFilter onApply={(filters) => fetchListings(filters)} />

      {/* Content Listings */}
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
      ) : viewMode === "row" ? (
        /* Vertical List of Compact Rows (Section 1.1) */
        <div className="flex flex-col gap-2.5 max-w-full">
          {listings.map((item) => (
            <ListingCard key={item.id} item={item} variant="row" />
          ))}
        </div>
      ) : (
        /* Grid (2 columns on mobile, up to 5 on wide screens) */
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-5">
          {listings.map((item) => (
            <ListingCard key={item.id} item={item} variant="card" />
          ))}
        </div>
      )}
    </NavigationLayout>
  );
}
