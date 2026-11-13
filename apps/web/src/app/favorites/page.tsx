"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "../../lib/language";
import { useAuth } from "../../lib/auth";
import { apiFetch } from "../../lib/api";
import { NavigationLayout } from "../../components/navigation";
import { ListingCard } from "../../components/listing-card";
import { Heart, LogIn } from "lucide-react";

export default function FavoritesPage() {
  const { locale } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    apiFetch("/favorites")
      .then((data) => setItems(data || []))
      .catch((err) => {
        console.error("Favorites load error:", err);
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  return (
    <NavigationLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text mb-1">
            {locale === "uz" ? "Saralanganlar" : "Избранное"}
          </h1>
          <p className="text-xs text-text-secondary">
            {locale === "uz" ? "Siz saqlab qoʻygan eʼlonlar roʻyxati" : "Сохраненные вами объявления"}
          </p>
        </div>

        {authLoading || loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : !user ? (
          <div className="bg-surface rounded-card border border-border p-12 text-center my-6 max-w-md mx-auto shadow-xs">
            <Heart className="w-12 h-12 text-primary mx-auto mb-3 opacity-80" />
            <h3 className="text-sm font-bold text-text mb-1">
              {locale === "uz" ? "Tizimga kiring" : "Войдите в систему"}
            </h3>
            <p className="text-xs text-text-secondary mb-5 leading-relaxed">
              {locale === "uz"
                ? "Saralangan eʼlonlaringizni koʻrish va saqlab borish uchun hisobingizga kiring."
                : "Чтобы просматривать и сохранять избранные товары, войдите в свой аккаунт."}
            </p>
            <Link
              href="/auth"
              className="inline-flex items-center justify-center gap-2 px-6 h-11 bg-primary text-white text-xs font-semibold rounded-btn hover:bg-primary-hover shadow-sm transition-colors"
            >
              <LogIn className="w-4 h-4" />
              {locale === "uz" ? "Kirish" : "Войти"}
            </Link>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-surface rounded-card border border-border p-12 text-center my-6">
            <Heart className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-60" />
            <p className="text-sm font-semibold text-text">
              {locale === "uz" ? "Saralanganlar roʻyxati boʻsh" : "Список избранного пуст"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-5">
            {items.map((item) => (
              <ListingCard
                key={item.id}
                item={item}
                isFavorite={true}
                onFavoriteToggle={(id, isFav) => {
                  if (!isFav) setItems((prev) => prev.filter((i) => i.id !== id));
                }}
              />
            ))}
          </div>
        )}
      </div>
    </NavigationLayout>
  );
}