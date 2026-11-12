"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "../lib/language";
import { useAuth } from "../lib/auth";
import { apiFetch } from "../lib/api";
import {
  Home,
  LayoutGrid,
  PlusCircle,
  Package,
  ClipboardList,
  FileText,
  MessageCircle,
  ShoppingBag,
  TrendingUp,
  Heart,
  Bell,
  LifeBuoy,
  UserCircle,
  LogOut,
  Shield,
  Search,
  Sun,
  Moon,
  Monitor,
  Menu,
  X,
  Star,
  Settings,
  ChevronRight,
  Smartphone
} from "lucide-react";
import { ConfirmDialog } from "./dialogs";

export const NavigationLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { locale, setLocale, t } = useLanguage();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [themeMode, setThemeMode] = useState<"light" | "dark" | "system">("light");
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [drawerSide, setDrawerSide] = useState<"left" | "right">("left");
  const [searchQuery, setSearchQuery] = useState("");

  // Notification dropdown (desktop)
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Profile dropdown card
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Unread messages count
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(2);

  useEffect(() => {
    const isDark =
      themeMode === "dark" ||
      (themeMode === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [themeMode]);

  const fetchNotifications = () => {
    apiFetch("/notifications")
      .then((data) => {
        setNotifications(data || []);
        const unread = (data || []).filter((n: any) => !n.readAt).length;
        setUnreadNotifications(unread);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileDrawerOpen]);

  // Close menus on navigation
  useEffect(() => {
    setMobileDrawerOpen(false);
    setShowProfileMenu(false);
    setShowNotifications(false);
  }, [pathname]);

  // Close profile menu on outside scroll or Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowProfileMenu(false);
        setMobileDrawerOpen(false);
      }
    };
    const handleScroll = () => {
      if (showProfileMenu) setShowProfileMenu(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showProfileMenu]);

  const handleMarkAllRead = async () => {
    try {
      await apiFetch("/notifications/read-all", { method: "POST" });
      setUnreadNotifications(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, readAt: new Date() })));
    } catch {}
  };

  // Navigation sections grouped (Section 4.2)
  const navSections = [
    {
      title: locale === "uz" ? "Savdo" : "Торговля",
      items: [
        { name: t("nav.home"), href: "/", icon: Home },
        { name: t("nav.listings"), href: "/listings", icon: LayoutGrid },
        { name: t("nav.newListing"), href: "/listings/new", icon: PlusCircle },
        { name: t("nav.myListings"), href: "/my-listings", icon: Package },
        { name: t("nav.orders"), href: "/orders", icon: ClipboardList, badge: 1 },
        { name: t("nav.contracts"), href: "/contracts", icon: FileText, badge: 2 },
      ]
    },
    {
      title: locale === "uz" ? "Muloqot" : "Общение",
      items: [
        { name: locale === "uz" ? "Xabarlar" : "Сообщения", href: "/messages", icon: MessageCircle, badge: unreadMessagesCount },
        { name: t("nav.notifications"), href: "/notifications", icon: Bell, badge: unreadNotifications },
      ]
    },
    {
      title: locale === "uz" ? "Tarix" : "История",
      items: [
        { name: t("nav.purchases"), href: "/history/purchases", icon: ShoppingBag },
        { name: t("nav.sales"), href: "/history/sales", icon: TrendingUp },
      ]
    },
    {
      title: locale === "uz" ? "Boshqa" : "Другое",
      items: [
        { name: t("nav.favorites"), href: "/favorites", icon: Heart },
        { name: locale === "uz" ? "Reyting va baholar" : "Рейтинг и отзывы", href: "/ratings", icon: Star },
        { name: locale === "uz" ? "Mobil ilova" : "Мобильное приложение", href: "/app", icon: Smartphone },
        { name: t("nav.help"), href: "/help", icon: LifeBuoy },
      ]
    }
  ];

  if (user?.role === "ADMIN" || user?.role === "MODERATOR") {
    navSections.push({
      title: locale === "uz" ? "Admin" : "Администрация",
      items: [
        { name: locale === "uz" ? "Boshqaruv paneli" : "Панель управления", href: "/admin", icon: Shield }
      ]
    });
  }

  // Flattened for desktop sidebar
  const allNavItems = navSections.flatMap((s) => s.items);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/listings?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    setShowProfileMenu(false);
    setShowLogoutConfirm(true);
  };

  const confirmLogoutAction = async () => {
    setShowLogoutConfirm(false);
    await logout();
  };

  const openDrawer = (side: "left" | "right") => {
    setDrawerSide(side);
    setMobileDrawerOpen(true);
    setShowProfileMenu(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* 
        ====================================================================
        HEADER
        Desktop (>= 1024px): Full controls (search, lang, theme, bell, avatar)
        Mobile (< 1024px): Exactly 3 elements:
          1. Left Burger Menu
          2. Center Logo
          3. Right User Avatar (with notification badge)
        ====================================================================
      */}
      <header className="h-14 lg:h-16 bg-surface border-b border-border fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 lg:px-8">
        {/* Left Side: Burger (mobile only) + Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Burger Button */}
          <button
            type="button"
            onClick={() => openDrawer("left")}
            className="lg:hidden w-11 h-11 -ml-2 rounded-btn flex items-center justify-center text-text hover:bg-surface-muted active:scale-95 transition-all"
            aria-label="Barcha boʻlimlar"
          >
            <Menu className="w-6 h-6 text-text" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <img
              src="/logo-app-icon.png"
              alt="UzSavdo"
              className="w-8 h-8 lg:w-9 lg:h-9 rounded-[10px] object-cover shadow-sm"
            />
            <span className="font-extrabold text-lg lg:text-xl tracking-tight text-primary">UzSavdo</span>
          </Link>
        </div>

        {/* Global Search (Desktop >= 1024px) */}
        <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-lg mx-8 relative">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={locale === "uz" ? "Mahsulot qidirish... (Enter bosing)" : "Поиск товаров... (нажмите Enter)"}
            className="w-full h-10 pl-10 pr-4 rounded-btn bg-surface-muted border border-border text-sm focus:outline-none focus:border-primary text-text placeholder:text-text-muted transition-colors"
          />
        </form>

        {/* Right Controls: Desktop vs Mobile */}
        <div className="flex items-center gap-2 sm:gap-3 relative">
          {/* DESKTOP-ONLY CONTROLS */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Language Toggle */}
            <div className="flex items-center bg-surface-muted p-1 rounded-btn border border-border text-xs font-semibold">
              <button
                onClick={() => setLocale("uz")}
                className={`px-2 py-1 rounded-md transition-all ${
                  locale === "uz" ? "bg-primary text-white shadow-xs" : "text-text-secondary hover:text-text"
                }`}
              >
                UZ
              </button>
              <button
                onClick={() => setLocale("ru")}
                className={`px-2 py-1 rounded-md transition-all ${
                  locale === "ru" ? "bg-primary text-white shadow-xs" : "text-text-secondary hover:text-text"
                }`}
              >
                RU
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setThemeMode(themeMode === "dark" ? "light" : "dark")}
              className="p-2 rounded-btn hover:bg-surface-muted text-text-secondary hover:text-text transition-colors"
              title="Theme"
            >
              {themeMode === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Messages Icon */}
            <Link
              href="/messages"
              className="relative p-2 rounded-btn hover:bg-surface-muted text-text-secondary hover:text-text transition-colors"
              title={locale === "uz" ? "Xabarlar" : "Сообщения"}
            >
              <MessageCircle className="w-5 h-5" />
              {unreadMessagesCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
              )}
            </Link>

            {/* Notifications Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="relative p-2 rounded-btn hover:bg-surface-muted text-text-secondary hover:text-text transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-accent rounded-full animate-pulse" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface border border-border rounded-card shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
                  <div className="p-3 border-b border-border flex items-center justify-between">
                    <span className="font-bold text-xs text-text">{t("nav.notifications")}</span>
                    {unreadNotifications > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[11px] text-primary hover:underline font-semibold"
                      >
                        {locale === "uz" ? "Barchasini oʻqilgan deb belgilash" : "Прочитать все"}
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-border text-xs">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-text-muted">
                        {locale === "uz" ? "Yangi bildirishnomalar yoʻq" : "Новых уведомлений нет"}
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <Link
                          key={n.id}
                          href={n.link || "/notifications"}
                          onClick={() => setShowNotifications(false)}
                          className={`p-3 block hover:bg-surface-muted transition-colors ${
                            !n.readAt ? "bg-primary-soft/40 font-medium" : ""
                          }`}
                        >
                          <p className="text-text leading-snug">
                            {locale === "uz" ? "Yangi bildirishnoma mavjud" : "Новое уведомление"}
                          </p>
                          <span className="text-[10px] text-text-muted mt-1 block">
                            {new Date(n.createdAt).toLocaleDateString()}
                          </span>
                        </Link>
                      ))
                    )}
                  </div>
                  <Link
                    href="/notifications"
                    onClick={() => setShowNotifications(false)}
                    className="p-2.5 block text-center text-xs font-semibold text-primary bg-surface-muted hover:bg-border/50 border-t border-border"
                  >
                    {locale === "uz" ? "Barchasini koʻrish →" : "Посмотреть все →"}
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* USER AVATAR BUTTON (Present on BOTH desktop and mobile) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="relative p-1 rounded-full hover:bg-surface-muted transition-all active:scale-95"
              aria-label="Profil menyusi"
            >
              <div className="w-10 h-10 rounded-full bg-primary-soft text-primary border-2 border-primary/20 flex items-center justify-center font-bold text-sm shadow-xs">
                {user?.firstName?.[0] || "U"}
              </div>
              {/* Notification Badge on Avatar */}
              {unreadNotifications > 0 && (
                <span className="absolute top-0 right-0 min-w-[18px] h-[18px] px-1 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-surface">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {/* BACKDROP FOR PROFILE MENU */}
            {showProfileMenu && (
              <div
                className="fixed inset-0 bg-black/25 z-40"
                onClick={() => setShowProfileMenu(false)}
              />
            )}

            {/* PROFILE MENU DROPDOWN CARD (Section 3.2) */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-[min(320px,calc(100vw-24px))] bg-surface border border-border rounded-[20px] shadow-2xl z-50 p-3 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* 1. User Info Card */}
                <Link
                  href="/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-3 p-2 rounded-[14px] hover:bg-surface-muted transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                    {user?.firstName?.[0] || "U"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm text-text truncate group-hover:text-primary transition-colors">
                      {user?.companyName || "Sharq Agro Fayz MCHJ"}
                    </p>
                    <p className="text-xs text-text-secondary truncate">
                      {user?.firstName || "Alisher"} {user?.lastName || "Usmonov"}
                    </p>
                    <p className="text-[11px] text-text-muted truncate mt-0.5">
                      {locale === "uz" ? "Samarqand viloyati" : "Самаркандская область"}
                    </p>
                  </div>
                </Link>

                <div className="h-px bg-border my-1" />

                {/* 2. Notifications */}
                <Link
                  href="/notifications"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-btn text-xs font-medium text-text-secondary hover:bg-surface-muted hover:text-text transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Bell className="w-4 h-4 text-text-muted" />
                    <span>{t("nav.notifications")}</span>
                  </div>
                  {unreadNotifications > 0 && (
                    <span className="bg-danger text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {unreadNotifications}
                    </span>
                  )}
                </Link>

                {/* 3. Language Segmented Switch */}
                <div className="px-3 py-1 flex items-center justify-between text-xs">
                  <span className="text-text-muted font-medium">{locale === "uz" ? "Til" : "Язык"}</span>
                  <div className="flex bg-surface-muted p-0.5 rounded-lg border border-border">
                    <button
                      type="button"
                      onClick={() => setLocale("uz")}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all ${
                        locale === "uz" ? "bg-primary text-white shadow-xs" : "text-text-secondary hover:text-text"
                      }`}
                    >
                      Oʻzbekcha
                    </button>
                    <button
                      type="button"
                      onClick={() => setLocale("ru")}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all ${
                        locale === "ru" ? "bg-primary text-white shadow-xs" : "text-text-secondary hover:text-text"
                      }`}
                    >
                      Русский
                    </button>
                  </div>
                </div>

                {/* 4. Theme 3-Segment Switch */}
                <div className="px-3 py-1 flex items-center justify-between text-xs">
                  <span className="text-text-muted font-medium">{locale === "uz" ? "Mavzu" : "Тема"}</span>
                  <div className="flex bg-surface-muted p-0.5 rounded-lg border border-border gap-0.5">
                    <button
                      type="button"
                      onClick={() => setThemeMode("light")}
                      className={`p-1.5 rounded-md text-xs flex items-center gap-1 transition-all ${
                        themeMode === "light" ? "bg-primary text-white shadow-xs" : "text-text-secondary hover:text-text"
                      }`}
                      title={locale === "uz" ? "Yorugʻ" : "Светлая"}
                    >
                      <Sun className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setThemeMode("dark")}
                      className={`p-1.5 rounded-md text-xs flex items-center gap-1 transition-all ${
                        themeMode === "dark" ? "bg-primary text-white shadow-xs" : "text-text-secondary hover:text-text"
                      }`}
                      title={locale === "uz" ? "Qorongʻi" : "Тёмная"}
                    >
                      <Moon className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setThemeMode("system")}
                      className={`p-1.5 rounded-md text-xs flex items-center gap-1 transition-all ${
                        themeMode === "system" ? "bg-primary text-white shadow-xs" : "text-text-secondary hover:text-text"
                      }`}
                      title={locale === "uz" ? "Tizim" : "Системная"}
                    >
                      <Monitor className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 5. Profil */}
                <Link
                  href="/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-btn text-xs font-medium text-text-secondary hover:bg-surface-muted hover:text-text transition-colors"
                >
                  <UserCircle className="w-4 h-4 text-text-muted" />
                  <span>{t("nav.profile")}</span>
                </Link>

                {/* 6. Sozlamalar */}
                <Link
                  href="/profile?tab=settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-btn text-xs font-medium text-text-secondary hover:bg-surface-muted hover:text-text transition-colors"
                >
                  <Settings className="w-4 h-4 text-text-muted" />
                  <span>{locale === "uz" ? "Sozlamalar" : "Настройки"}</span>
                </Link>

                {/* 7. Mobil ilova */}
                <Link
                  href="/app"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-btn text-xs font-medium text-text-secondary hover:bg-surface-muted hover:text-text transition-colors"
                >
                  <Smartphone className="w-4 h-4 text-text-muted" />
                  <span>{locale === "uz" ? "Mobil ilova" : "Мобильное приложение"}</span>
                </Link>

                <div className="h-px bg-border my-1" />

                {/* 8. Chiqish */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-btn text-xs font-semibold text-danger hover:bg-danger/10 text-left transition-colors"
                >
                  <LogOut className="w-4 h-4 text-danger" />
                  <span>{t("nav.logout")}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 
        ====================================================================
        MOBILE DRAWER (Section 4: Burger from Left, Menyu tab from Right)
        Width: min(86vw, 340px), sliding animation 250ms, backdrop rgba(0,0,0,0.4)
        ====================================================================
      */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer Content */}
          <div
            className={`relative w-[min(86vw,340px)] max-w-full bg-surface h-full z-50 flex flex-col shadow-2xl transition-transform duration-250 ease-out ${
              drawerSide === "left"
                ? "mr-auto rounded-r-[24px] animate-in slide-in-from-left"
                : "ml-auto rounded-l-[24px] animate-in slide-in-from-right"
            }`}
          >
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src="/logo-app-icon.png"
                  alt="UzSavdo"
                  className="w-8 h-8 rounded-[10px] object-cover shadow-sm"
                />
                <span className="font-extrabold text-base text-primary">UzSavdo</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-text hover:bg-surface-muted active:scale-95 transition-all"
                aria-label="Yopish"
              >
                <X className="w-5 h-5 text-text" />
              </button>
            </div>

            {/* User Quick Info */}
            <div className="p-4 bg-surface-muted/40 border-b border-border">
              <Link
                href="/profile"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-3 group"
              >
                <div className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center font-bold text-base shadow-xs">
                  {user?.firstName?.[0] || "U"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm text-text truncate group-hover:text-primary transition-colors">
                    {user?.companyName || "Sharq Agro Fayz MCHJ"}
                  </p>
                  <p className="text-xs text-text-secondary truncate">
                    ★ 5.0 · {user?.firstName || "Alisher"}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
              </Link>
            </div>

            {/* Categorized Nav Items */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {navSections.map((sec) => (
                <div key={sec.title} className="space-y-1">
                  <div className="px-3 text-[11px] font-bold text-text-muted uppercase tracking-wider">
                    {sec.title}
                  </div>
                  {sec.items.map((item) => {
                    const active = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileDrawerOpen(false)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-[12px] text-sm font-medium transition-all ${
                          active
                            ? "bg-primary-soft text-primary font-semibold"
                            : "text-text-secondary hover:bg-surface-muted hover:text-text"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                              active ? "bg-primary text-white" : "bg-surface-muted text-text-secondary"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <span>{item.name}</span>
                        </div>
                        {item.badge ? (
                          <span className="bg-accent text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        ) : null}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="p-3 border-t border-border space-y-1 bg-surface">
              <Link
                href="/profile"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-btn text-sm font-medium text-text-secondary hover:bg-surface-muted hover:text-text"
              >
                <UserCircle className="w-5 h-5 text-text-muted" />
                <span>{t("nav.profile")}</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-btn text-sm font-medium text-danger hover:bg-danger/10 text-left transition-colors"
              >
                <LogOut className="w-5 h-5 text-danger" />
                <span>{t("nav.logout")}</span>
              </button>
              <div className="text-[10px] text-text-muted text-center pt-1">
                UzSavdo v1.2.0 · 2026
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 
        ====================================================================
        MAIN CONTAINER
        ====================================================================
      */}
      <div className="flex pt-14 lg:pt-16 flex-1">
        {/* Desktop Sidebar (>= 1024px) */}
        <aside className="hidden lg:flex flex-col w-[260px] bg-surface border-r border-border fixed top-16 bottom-0 left-0 z-30 overflow-y-auto">
          <div className="p-3 space-y-1 flex-1">
            {allNavItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-btn text-sm font-medium transition-all ${
                    active
                      ? "bg-primary-soft text-primary font-semibold border-l-[3px] border-primary"
                      : "text-text-secondary hover:bg-surface-muted hover:text-text"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${active ? "text-primary" : "text-text-muted"}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge ? (
                    <span className="bg-accent text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>

          <div className="p-3 border-t border-border space-y-1">
            <Link
              href="/profile"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-btn text-sm font-medium text-text-secondary hover:bg-surface-muted hover:text-text"
            >
              <UserCircle className="w-5 h-5 text-text-muted" />
              <span>{t("nav.profile")}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-btn text-sm font-medium text-danger hover:bg-surface-muted transition-colors text-left"
            >
              <LogOut className="w-5 h-5 text-danger" />
              <span>{t("nav.logout")}</span>
            </button>
          </div>
        </aside>

        {/* Full-width Responsive Content Area */}
        <main className="flex-1 lg:ml-[260px] w-full px-4 sm:px-6 lg:px-8 2xl:px-12 py-5 max-w-[1760px] pb-28 lg:pb-8 mx-auto">
          {children}
        </main>
      </div>

      {/* 
        ====================================================================
        BOTTOM BAR (< 1024px)
        Items (Section 4.3):
          1. Bosh sahifa
          2. Eʼlonlar
          3. Big central '+' in primary green (Eʼlon joylash)
          4. Buyurtmalar (+ badge)
          5. Menyu (opens drawer from right)
        ====================================================================
      */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface/95 backdrop-blur-md border-t border-border z-40 flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {/* 1. Bosh sahifa */}
        <Link
          href="/"
          className={`flex flex-col items-center gap-1 ${pathname === "/" ? "text-primary font-bold" : "text-text-secondary"}`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">{t("nav.home")}</span>
        </Link>

        {/* 2. Eʼlonlar */}
        <Link
          href="/listings"
          className={`flex flex-col items-center gap-1 ${
            pathname === "/listings" ? "text-primary font-bold" : "text-text-secondary"
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px]">{t("nav.listings")}</span>
        </Link>

        {/* 3. Central Add Button (Primary green, not orange) */}
        <Link
          href="/listings/new"
          className="w-12 h-12 -mt-5 bg-primary text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform hover:bg-primary-hover"
          aria-label={t("nav.newListing")}
        >
          <PlusCircle className="w-7 h-7" />
        </Link>

        {/* 4. Buyurtmalar */}
        <Link
          href="/orders"
          className={`relative flex flex-col items-center gap-1 ${
            pathname === "/orders" ? "text-primary font-bold" : "text-text-secondary"
          }`}
        >
          <ClipboardList className="w-5 h-5" />
          <span className="text-[10px]">{t("nav.orders")}</span>
          <span className="absolute -top-1 right-2 min-w-[16px] h-4 px-1 bg-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            1
          </span>
        </Link>

        {/* 5. Menyu (opens drawer from right) */}
        <button
          type="button"
          onClick={() => openDrawer("right")}
          className="relative flex flex-col items-center gap-1 text-text-secondary hover:text-text active:scale-95"
          aria-label="Menyu"
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px]">{locale === "uz" ? "Menyu" : "Меню"}</span>
          {(unreadMessagesCount > 0 || unreadNotifications > 0) && (
            <span className="absolute -top-1 right-1 min-w-[16px] h-4 px-1 bg-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {unreadMessagesCount + unreadNotifications}
            </span>
          )}
        </button>
      </nav>

      {/* Logout Confirm Modal */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={confirmLogoutAction}
        title={t("auth.logout")}
        description={t("auth.logoutConfirm")}
        confirmText={locale === "uz" ? "Chiqish" : "Выйти"}
        cancelText={locale === "uz" ? "Bekor qilish" : "Отмена"}
        variant="danger"
      />
    </div>
  );
};
