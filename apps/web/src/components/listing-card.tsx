"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, MapPin, Package, Star } from "lucide-react";
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
  onFavoriteToggle?: (id: string, isFav: boolean) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ item, onFavoriteToggle }) => {
  const { t, locale } = useLanguage();
  const [fav, setFav] = useState(item.isFavorite || false);

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

  const imgUrl = item.images?.[0]?.url || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80";

  // Title localization
  const displayTitle = locale === "ru" && item.titleRu ? item.titleRu : item.title;
  const displayUnit = formatUnit(item.unit, locale);
  const displayPrice = formatCurrency(priceNum, locale);
  const displayDate = formatListingDate(item.publishedAt, locale);

  const ratingVal = item.rating || item.seller?.rating || 4.8;
  const reviewsCountVal = item.reviewsCount ?? item.seller?.reviewsCount ?? 12;

  return (
    <Link
      href={`/listings/${item.id}`}
      className="bg-surface rounded-card border border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col group relative"
    >
      {/* Photo Block (4:3) */}
      <div className="relative aspect-[4/3] bg-surface-muted overflow-hidden">
        <img
          src={imgUrl}
          alt={displayTitle}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-primary text-[11px] font-bold px-3 py-1 rounded-full shadow-sm z-10">
          {locale === "uz" ? item.category?.nameUz : item.category?.nameRu}
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

        {/* Rating row (v3 requirement) */}
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
            <span className="truncate">
              {locale === "uz" ? item.district?.nameUz : item.district?.nameRu},{" "}
              {locale === "uz" ? item.region?.nameUz : item.region?.nameRu}
            </span>
          </span>
          <span className="shrink-0">{displayDate}</span>
        </div>
      </div>
    </Link>
  );
};
