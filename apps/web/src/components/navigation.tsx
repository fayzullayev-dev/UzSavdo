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
  Menu,
  X,
  Check,
  Star
} from "lucide-react";
import { ConfirmDialog } from "./dialogs";

export const NavigationLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { locale, setLocale, t } = useLanguage();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Notification dropdown
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Profile dropdown
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

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

  const handleMarkAllRead = async () => {
    try {
      await apiFetch("/notifications/read-all", { method: "POST" });
      setUnreadNotifications(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, readAt: new Date() })));
    } catch {}
  };

  const navItems = [
    { name: t("nav.home"), href: "/", icon: Home },
    { name: t("nav.listings"), href: "/listings", icon: LayoutGrid },
    { name: t("nav.newListing"), href: "/listings/new", icon: PlusCircle },
    { name: t("nav.myListings"), href: "/my-listings", icon: Package },
    { name: t("nav.orders"), href: "/orders", icon: ClipboardList },
    { name: t("nav.contracts"), href: "/contracts", icon: FileText },
    { name: t("nav.messages"), href: "/messages", icon: MessageCircle },
    { name: t("nav.purchases"), href: "/history/purchases", icon: ShoppingBag },
    { name: t("nav.sales"), href: "/history/sales", icon: TrendingUp },
    { name: locale === "uz" ? "Reyting va baholar" : "Рейтинг и отзывы", href: "/ratings", icon: Star },
    { name: t("nav.favorites"), href: "/favorites", icon: Heart },
    { name: t("nav.notifications"), href: "/notifications", icon: Bell, badge: unreadNotifications },
    { name: t("nav.help"), href: "/help", icon: LifeBuoy },
  ];

  if (user?.role === "ADMIN" || user?.role === "MODERATOR") {
    navItems.push({ name: t("nav.admin"), href: "/admin", icon: Shield });
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/listings?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogoutAction = async () => {
    setShowLogoutConfirm(false);
    await logout();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Header */}
      <header className="h-16 bg-surface border-b border-border fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-btn hover:bg-surface-muted"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-text" /> : <Menu className="w-5 h-5 text-text" />}
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-btn bg-primary text-white flex items-center justify-center font-bold text-lg shadow-sm">
              UZ
            </div>
            <span className="font-bold text-xl tracking-tight text-primary">UzSavdo</span>
          </Link>
        </div>

        {/* Global Search (Desktop) */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8 relative">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={locale === "uz" ? "Mahsulot qidirish... (Enter bosing)" : "Поиск товаров... (нажмите Enter)"}
            className="w-full h-10 pl-10 pr-4 rounded-btn bg-surface-muted border border-border text-sm focus:outline-none focus:border-primary text-text placeholder:text-text-muted transition-colors"
          />
        </form>

        {/* Header Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3 relative">
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
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-btn hover:bg-surface-muted text-text-secondary hover:text-text transition-colors"
            title="Theme"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Messages Icon */}
          <Link
            href="/messages"
            className="p-2 rounded-btn hover:bg-surface-muted text-text-secondary hover:text-text transition-colors"
            title={t("nav.messages")}
          >
            <MessageCircle className="w-5 h-5" />
          </Link>

          {/* Notifications Dropdown */}
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
                          {locale === "uz" ? "Yangi buyurtma qabul qilindi!" : "Поступил новый заказ!"}
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

          {/* Profile Avatar & Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-1 rounded-btn hover:bg-surface-muted transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {user?.firstName?.[0] || "U"}
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-surface border border-border rounded-card shadow-xl z-50 p-2 space-y-1 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-border">
                  <p className="font-bold text-xs text-text truncate">{user?.companyName || "UzSavdo Foydalanuvchisi"}</p>
                  <p className="text-[11px] text-text-muted truncate">{user?.phone || ""}</p>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-btn text-xs font-medium text-text-secondary hover:bg-surface-muted hover:text-text"
                >
                  <UserCircle className="w-4 h-4 text-text-muted" />
                  <span>{t("nav.profile")}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-btn text-xs font-medium text-danger hover:bg-danger/10 text-left"
                >
                  <LogOut className="w-4 h-4 text-danger" />
                  <span>{t("nav.logout")}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex pt-16 flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-[260px] bg-surface border-r border-border fixed top-16 bottom-0 left-0 z-30 overflow-y-auto">
          <div className="p-3 space-y-1 flex-1">
            {navItems.map((item) => {
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
        <main className="flex-1 lg:ml-[260px] w-full px-4 sm:px-6 lg:px-8 2xl:px-12 py-6 max-w-[1760px] pb-24 md:pb-8 mx-auto">
          {children}
        </main>
      </div>

      {/* Bottom Nav on Mobile (<768px) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface border-t border-border z-40 flex items-center justify-around px-2">
        <Link
          href="/"
          className={`flex flex-col items-center gap-1 ${pathname === "/" ? "text-primary font-bold" : "text-text-secondary"}`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">{t("nav.home")}</span>
        </Link>
        <Link
          href="/listings"
          className={`flex flex-col items-center gap-1 ${
            pathname === "/listings" ? "text-primary font-bold" : "text-text-secondary"
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px]">{t("nav.listings")}</span>
        </Link>
        <Link
          href="/listings/new"
          className="w-12 h-12 -mt-5 bg-accent text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        >
          <PlusCircle className="w-6 h-6" />
        </Link>
        <Link
          href="/messages"
          className={`flex flex-col items-center gap-1 ${
            pathname === "/messages" ? "text-primary font-bold" : "text-text-secondary"
          }`}
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-[10px]">{t("nav.messages")}</span>
        </Link>
        <Link
          href="/profile"
          className={`flex flex-col items-center gap-1 ${
            pathname === "/profile" ? "text-primary font-bold" : "text-text-secondary"
          }`}
        >
          <UserCircle className="w-5 h-5" />
          <span className="text-[10px]">{t("nav.profile")}</span>
        </Link>
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