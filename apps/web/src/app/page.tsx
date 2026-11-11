"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "../lib/language";
import { useAuth } from "../lib/auth";
import { apiFetch } from "../lib/api";
import { NavigationLayout } from "../components/navigation";
import { ListingCard } from "../components/listing-card";
import {
  Package,
  ClipboardList,
  MessageCircle,
  FileText,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  Sparkles,
  X,
  Carrot,
  Apple,
  Wheat,
  Beef,
  Milk,
  Sprout,
  Home as HomeIcon,
  SprayCan,
  FlaskConical,
  Leaf,
  BrickWall,
  Shirt,
  Nut,
  Citrus
} from "lucide-react";

const CATEGORY_ICON_MAP: Record<string, any> = {
  Carrot,
  Apple,
  Citrus,
  Wheat,
  Nut,
  Beef,
  Milk,
  Sprout,
  Home: HomeIcon,
  SprayCan,
  FlaskConical,
  Leaf,
  BrickWall,
  Shirt
};

export default function HomePage() {
  const { locale, t } = useLanguage();
  const { user, loading } = useAuth();

  const [categories, setCategories] = useState<any[]>([]);
  const [recentListings, setRecentListings] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [showTrialBanner, setShowTrialBanner] = useState(true);

  const [stats, setStats] = useState({
    activeListings: 4,
    newOrders: 1,
    unreadMessages: 1,
    contracts: 2
  });

  useEffect(() => {
    Promise.all([
      apiFetch("/categories"),
      apiFetch("/listings?limit=10"),
      apiFetch("/orders?role=seller").catch(() => [])
    ])
      .then(([cats, listingsData, ordersData]) => {
        setCategories(cats || []);
        setRecentListings(listingsData.items || []);
        setRecentOrders(ordersData?.slice(0, 3) || []);
      })
      .catch(console.error);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Trial ends in 60 days from launch
  const trialEndDate = new Date();
  trialEndDate.setDate(trialEndDate.getDate() + 60);
  const formattedTrialDate = trialEndDate.toLocaleDateString("ru-RU");

  return (
    <NavigationLayout>
      {/* 1. Trial Period Banner */}
      {showTrialBanner && (
        <div className="mb-6 p-4 rounded-card bg-accent-soft border border-accent/25 flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-accent shrink-0" />
            <p className="text-xs sm:text-sm font-semibold text-text">
              {locale === "uz"
                ? `Sinov davri: mahsulot shartnomalari ${formattedTrialDate} gacha bepul`
                : `Пробный период: договоры на товары бесплатны до ${formattedTrialDate}`}
            </p>
          </div>
          <button
            onClick={() => setShowTrialBanner(false)}
            className="p-1 rounded-btn hover:bg-black/5 text-text-secondary"
            title="Yopish"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Hero Welcome Card */}
      <div className="rounded-card p-6 sm:p-8 mb-6 bg-gradient-to-r from-[#1F5F4A] to-[#2C7A5F] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md relative overflow-hidden">
        {/* Subtle decorative background icon */}
        <div className="absolute right-4 bottom-[-20px] opacity-15 pointer-events-none">
          <Package className="w-48 h-48 text-white" />
        </div>

        <div className="z-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            {locale === "uz"
              ? `Xush kelibsiz, ${user?.firstName || "Alisher"}!`
              : `Добро пожаловать, ${user?.firstName || "Алишер"}!`}
          </h1>
          <p className="text-xs sm:text-sm text-white/90 font-medium">
            {user?.companyName
              ? `“${user.companyName}” · Samarqand viloyati`
              : "“Sharq Agro Fayz” MChJ · Samarqand viloyati"}
          </p>
        </div>

        <div className="flex gap-3 w-full md:w-auto z-10">
          <Link
            href="/listings/new"
            className="flex-1 md:flex-initial h-12 px-6 bg-accent text-white font-bold rounded-btn hover:bg-accent-hover active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md text-xs sm:text-sm"
          >
            <PlusCircle className="w-4 h-4" />
            {locale === "uz" ? "Eʼlon joylash" : "Разместить объявление"}
          </Link>
          <Link
            href="/listings"
            className="flex-1 md:flex-initial h-12 px-5 border-2 border-white text-white font-bold rounded-btn hover:bg-white/10 transition-colors flex items-center justify-center text-xs sm:text-sm"
          >
            {locale === "uz" ? "Eʼlonlarni koʻrish" : "Смотреть объявления"}
          </Link>
        </div>
      </div>

      {/* 3. Four KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link
          href="/my-listings"
          className="bg-surface p-5 rounded-card border border-border hover:shadow-lg hover:-translate-y-0.5 transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-text-secondary">
              {locale === "uz" ? "Faol eʼlonlarim" : "Мои активные объявления"}
            </span>
            <div className="w-11 h-11 rounded-full bg-primary-soft text-primary flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-text">{stats.activeListings}</span>
            <span className="text-xs text-primary font-semibold block mt-1 group-hover:underline">
              {locale === "uz" ? "Koʻrish →" : "Смотреть →"}
            </span>
          </div>
        </Link>

        <Link
          href="/orders"
          className="bg-surface p-5 rounded-card border border-border hover:shadow-lg hover:-translate-y-0.5 transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-text-secondary">
              {locale === "uz" ? "Yangi buyurtmalar" : "Новые заказы"}
            </span>
            <div className="w-11 h-11 rounded-full bg-accent-soft text-accent flex items-center justify-center">
              <ClipboardList className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-accent">{stats.newOrders}</span>
            <span className="text-xs text-accent font-semibold block mt-1 group-hover:underline">
              {locale === "uz" ? "Koʻrish →" : "Смотреть →"}
            </span>
          </div>
        </Link>

        <Link
          href="/messages"
          className="bg-surface p-5 rounded-card border border-border hover:shadow-lg hover:-translate-y-0.5 transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-text-secondary">
              {locale === "uz" ? "Oʻqilmagan xabarlar" : "Непрочитанные сообщения"}
            </span>
            <div className="w-11 h-11 rounded-full bg-primary-soft text-primary flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-text">{stats.unreadMessages}</span>
            <span className="text-xs text-primary font-semibold block mt-1 group-hover:underline">
              {locale === "uz" ? "Koʻrish →" : "Смотреть →"}
            </span>
          </div>
        </Link>

        <Link
          href="/contracts"
          className="bg-surface p-5 rounded-card border border-border hover:shadow-lg hover:-translate-y-0.5 transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-text-secondary">
              {locale === "uz" ? "Shartnomalarim" : "Мои договоры"}
            </span>
            <div className="w-11 h-11 rounded-full bg-primary-soft text-primary flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-text">{stats.contracts}</span>
            <span className="text-xs text-primary font-semibold block mt-1 group-hover:underline">
              {locale === "uz" ? "Koʻrish →" : "Смотреть →"}
            </span>
          </div>
        </Link>
      </div>

      {/* 4. Categories Grid (Real Lucide Icons) */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-text">
            {locale === "uz" ? "Kategoriyalar" : "Категории"}
          </h2>
          <Link href="/listings" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
            <span>{locale === "uz" ? "Barcha kategoriyalar →" : "Все категории →"}</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {categories.map((c) => {
            const Icon = CATEGORY_ICON_MAP[c.icon] || Package;
            return (
              <Link
                key={c.id}
                href={`/listings?categoryId=${c.id}`}
                className="bg-surface border border-border rounded-card p-4 hover:border-primary hover:shadow-md transition-all flex flex-col items-center text-center group"
              >
                <div className="w-14 h-14 rounded-full bg-primary-soft text-primary group-hover:bg-primary group-hover:text-white flex items-center justify-center mb-2.5 transition-all duration-300">
                  <Icon className="w-7 h-7" />
                </div>
                <span className="text-xs font-semibold text-text group-hover:text-primary transition-colors line-clamp-2 h-8 leading-tight">
                  {locale === "uz" ? c.nameUz : c.nameRu}
                </span>
                <span className="text-[11px] text-text-muted mt-1">
                  {c.activeListingsCount || 0} {locale === "uz" ? "ta eʼlon" : "объявл."}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 5. Recent 10 Listings */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-text">
            {locale === "uz" ? "Soʻnggi eʼlonlar" : "Последние объявления"}
          </h2>
          <Link href="/listings" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
            <span>{locale === "uz" ? "Barchasi →" : "Все →"}</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {recentListings.map((item) => (
            <ListingCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* 6. Recent Orders if available */}
      {recentOrders.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text">
              {locale === "uz" ? "Mening oxirgi buyurtmalarim" : "Мои последние заказы"}
            </h2>
            <Link href="/orders" className="text-xs font-semibold text-primary hover:underline">
              {locale === "uz" ? "Barcha buyurtmalar →" : "Все заказы →"}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentOrders.map((o) => (
              <div key={o.id} className="bg-surface rounded-card border border-border p-4 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-primary">{o.contract?.number}</span>
                  <span className="bg-warning/15 text-warning font-bold px-2 py-0.5 rounded-full">
                    {t(`status.${o.status.toLowerCase()}`)}
                  </span>
                </div>
                <p className="font-semibold text-text truncate">{o.listing?.title}</p>
                <div className="flex justify-between text-text-secondary">
                  <span>{locale === "uz" ? "Hajm" : "Объём"}:</span>
                  <span className="font-bold text-text">{Number(o.quantity)} {o.listing?.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </NavigationLayout>
  );
}