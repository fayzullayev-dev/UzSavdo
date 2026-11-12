"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, MapPin, Package, Star, ImageOff } from "lucide-react";
import { useLanguage } from "@/lib/language";
import { apiFetch } from "@/lib/api";
import { formatUnit, formatCurrency, formatListingDate } from "@/lib/localization";

export interface ListingCardProps {
  item: {
    id: string;
    title: string;
    titleRu?: string | null;
    pricePerUnit: number | string;
    unit: string;
    availableQuantity: number | string;
    publishedAt: string;
    status: string;
    isNegotiable?: boolean;
    rating?: number | null;
    reviewsCount?: number | null;
    isFavorite?: boolean;
    images?: Array<{ url: string; thumbUrl?: string }>;
    category?: { nameUz: string; nameRu: string };
    district?: { nameUz: string; nameRu: string };
    region?: { nameUz: string; nameRu: string };
    seller?: {
      id?: string;
      companyName?: string;
      rating?: number | null;
      reviewsCount?: number | null;
    };
  };
  variant?: "card" | "row";
  onFavoriteToggle?: (id: string, isFav: boolean) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ item, variant = "card", onFavoriteToggle }) => {
  const { t, locale } = useLanguage();
  const [fav, setFav] = useState(item.isFavorite || false);
  const [imgError, setImgError] = useState(false);

  const priceNum = Number(item.pricePerUnit) || 0;
  const availNum = Number(item.availableQuantity) || 0;
  const isSold = item.status === "SOLD";

  // Check if published within 3 days
  const isNew = (() => {
    if (!item.publishedAt) return false;
    const diffDays = (new Date().getTime() - new Date(item.publishedAt).getTime()) / (1000 * 3600 * 24);
    return diffDays <= 3;
  })();

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !fav;
    setFav(next);
    if (next) {
      apiFetch(`/favorites/${item.id}`, { method: "POST" });
    } else {
      apiFetch(`/favorites/${item.id}`, { method: "DELETE" });
    }
    if (onFavoriteToggle) onFavoriteToggle(item.id, next);
  };

  const rawImgUrl = item.images?.[0]?.url || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80";

  // Title localization
  const displayTitle = locale === "ru" && item.titleRu ? item.titleRu : item.title;
  const displayUnit = formatUnit(item.unit, locale);
  const displayPrice = formatCurrency(priceNum, locale);
  const displayDate = formatListingDate(item.publishedAt, locale);

  const ratingVal = item.rating || item.seller?.rating || 4.8;
  const reviewsCountVal = item.reviewsCount ?? item.seller?.reviewsCount ?? 12;
  const categoryName = locale === "uz" ? item.category?.nameUz : item.category?.nameRu;
  const locationName = `${locale === "uz" ? item.district?.nameUz : item.district?.nameRu || ""}, ${locale === "uz" ? item.region?.nameUz : item.region?.nameRu || ""}`;

  // ROW VARIANT (Mobile Section 1.1)
  if (variant === "row") {
    return (
      <Link
        href={`/listings/${item.id}`}
        className="bg-surface rounded-[18px] border border-border p-3 flex gap-3 relative transition-all duration-200 active:scale-[0.98] active:bg-surface-muted/50 w-full"
      >
        {/* Photo Left (104x104, 112x112 on >= 400px) */}
        <div className="relative w-[104px] h-[104px] min-[400px]:w-[112px] min-[400px]:h-[112px] rounded-[14px] bg-surface-muted overflow-hidden shrink-0">
          {!imgError ? (
            <img
              src={rawImgUrl}
              alt=""
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-text-muted bg-surface-muted">
              <ImageOff className="w-6 h-6" />
              <span className="text-[10px] mt-1 font-medium text-center px-1 truncate max-w-full">
                {categoryName || "Mahsulot"}
              </span>
            </div>
          )}

          {/* Yangi Badge */}
          {isNew && !isSold && (
            <div className="absolute bottom-1.5 left-1.5 bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
              {t("listing.new")}
            </div>
          )}

          {/* Sold overlay */}
          {isSold && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="bg-danger text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                {t("status.outOfStock")}
              </span>
            </div>
          )}
        </div>

        {/* Content Right */}
        <div className="flex-1 min-w-0 flex flex-col justify-between pr-7">
          <div>
            {/* Title (max 2 lines) */}
            <h3 className="font-semibold text-[15px] leading-tight text-text line-clamp-2">
              {displayTitle}
            </h3>

            {/* Price & Unit */}
            <div className="mt-1 flex items-baseline gap-1 flex-wrap">
              {item.isNegotiable ? (
                <span className="text-[11px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded">
                  {locale === "uz" ? "Kelishiladi" : "Договорная"}
                </span>
              ) : (
                <>
                  <span className="text-[16px] min-[400px]:text-[17px] font-bold text-primary">
                    {displayPrice}
                  </span>
                  <span className="text-[12px] text-text-secondary">
                    / {displayUnit}
                  </span>
                </>
              )}
            </div>

            {/* Available Quantity */}
            <div className="text-[12px] text-text-secondary mt-0.5">
              {t("listing.available")}: {availNum.toLocaleString("ru-RU")} {displayUnit}
            </div>
          </div>

          <div className="space-y-0.5 pt-1">
            {/* Rating · Category */}
            <div className="text-[12px] text-text-muted flex items-center gap-1 truncate">
              <span className="flex items-center gap-0.5 text-accent font-semibold">
                <Star className="w-3 h-3 fill-accent shrink-0" />
                <span>{ratingVal.toFixed(1)}</span>
                <span className="text-text-muted text-[11px] font-normal">({reviewsCountVal})</span>
              </span>
              <span>·</span>
              <span className="truncate">{categoryName}</span>
            </div>

            {/* MapPin + District, Region · Date */}
            <div className="text-[12px] text-text-muted flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 shrink-0 text-text-muted" />
              <span className="truncate">{locationName}</span>
              <span>·</span>
              <span className="shrink-0">{displayDate}</span>
            </div>
          </div>
        </div>

        {/* Heart Favorite Button (Top-Right, 36x36 touch target) */}
        <button
          type="button"
          onClick={toggleFavorite}
          aria-label="Favorite"
          className="absolute top-2 right-2 w-9 h-9 rounded-full flex items-center justify-center text-text-secondary hover:text-accent transition-colors z-10"
        >
          <Heart className={`w-4 h-4 ${fav ? "fill-accent text-accent" : ""}`} />
        </button>
      </Link>
    );
  }

  // CARD VARIANT (Default Desktop / Grid)
  return (
    <Link
      href={`/listings/${item.id}`}
      className="bg-surface rounded-card border border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col group relative"
    >
      {/* Photo Block (4:3) */}
      <div className="relative aspect-[4/3] bg-surface-muted overflow-hidden">
        {!imgError ? (
          <img
            src={rawImgUrl}
            alt=""
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-text-muted bg-surface-muted">
            <ImageOff className="w-8 h-8" />
            <span className="text-xs mt-1 font-medium">{categoryName}</span>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-primary text-[11px] font-bold px-3 py-1 rounded-full shadow-sm z-10">
          {categoryName}
        </div>

        {/* Heart Favorite Button */}
        <button
          type="button"
          onClick={toggleFavorite}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm shadow-md flex items-center justify-center text-text-secondary hover:text-accent transition-colors z-10"
        >
          <Heart className={`w-4 h-4 ${fav ? "fill-accent text-accent" : ""}`} />
        </button>

        {/* "Yangi" Badge */}
        {isNew && !isSold && (
          <div className="absolute bottom-3 left-3 bg-accent text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm z-10">
            {t("listing.new")}
          </div>
        )}

        {/* Sold overlay */}
        {isSold && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
            <span className="bg-danger text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow">
              {t("status.outOfStock")}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Title (max 2 lines) */}
          <h3 className="font-semibold text-sm text-text group-hover:text-primary transition-colors line-clamp-2 h-10 leading-snug">
            {displayTitle}
          </h3>

          {/* Price */}
          <div className="mt-1">
            <span className="text-lg font-bold text-primary">
              {displayPrice}
            </span>
            <span className="text-xs text-text-secondary font-medium ml-1">
              / {displayUnit}
            </span>
          </div>

          {/* Available Quantity */}
          <div className="text-xs text-text-secondary flex items-center gap-1.5 mt-1.5">
            <Package className="w-3.5 h-3.5 text-text-muted shrink-0" />
            <span>
              {t("listing.available")}: {availNum.toLocaleString("ru-RU")} {displayUnit}
            </span>
          </div>
        </div>

        {/* Rating row */}
        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-1 text-accent font-semibold">
            <Star className="w-3.5 h-3.5 fill-accent" />
            <span>{ratingVal.toFixed(1)}</span>
            <span className="text-text-muted text-[11px]">({reviewsCountVal})</span>
          </div>
        </div>

        {/* Footer: District, City + Relative Date */}
        <div className="pt-2.5 border-t border-border flex items-center justify-between text-[11px] text-text-muted">
          <span className="flex items-center gap-1 truncate max-w-[150px]">
            <MapPin className="w-3.5 h-3.5 text-text-muted shrink-0" />
            <span className="truncate">{locationName}</span>
          </span>
          <span className="shrink-0">{displayDate}</span>
        </div>
      </div>
    </Link>
  );
};
