"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "../../lib/language";
import { useAuth } from "../../lib/auth";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Package,
  FolderTree,
  BookOpen,
  FileText,
  ClipboardList,
  AlertOctagon,
  Star,
  MessageSquare,
  MapPin,
  Settings,
  History,
  LogOut,
  ArrowLeft,
  Sun,
  Moon,
  Bell,
  Search,
  Download,
  Printer,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  X,
  ExternalLink,
  Shield,
  Eye,
  CheckCircle2,
  Lock
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { toast } from "sonner";
import { ConfirmDialog, FormDialog } from "../../components/dialogs";
import { formatCurrency } from "../../lib/localization";
import { AdminReportsSection } from "./components/AdminReportsSection";
import { AdminUsersSection } from "./components/AdminUsersSection";
import { AdminListingsSection } from "./components/AdminListingsSection";
import { AdminCategoriesSection } from "./components/AdminCategoriesSection";
import { AdminProductsSection } from "./components/AdminProductsSection";
import { AdminContractsSection } from "./components/AdminContractsSection";
import { AdminOrdersSection } from "./components/AdminOrdersSection";
import { AdminComplaintsSection } from "./components/AdminComplaintsSection";
import { AdminRatingsSection } from "./components/AdminRatingsSection";
import { AdminTicketsSection } from "./components/AdminTicketsSection";
import { AdminRegionsSection } from "./components/AdminRegionsSection";
import { AdminSettingsSection } from "./components/AdminSettingsSection";
import { AdminAuditSection } from "./components/AdminAuditSection";

export default function AdminDashboardPage() {
  const { locale, setLocale, t } = useLanguage();
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const [activeMenu, setActiveMenu] = useState<string>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [period, setPeriod] = useState<"today" | "7d" | "30d" | "month" | "year">("30d");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [mapMetric, setMapMetric] = useState<"listings" | "contracts" | "volume">("volume");
  const [dynMetric, setDynMetric] = useState<"contracts" | "orders" | "listings" | "sales">("contracts");

  // User detail drawer
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [blockUserConfirm, setBlockUserConfirm] = useState(false);
  const [resetPassSuccess, setResetPassSuccess] = useState(false);

  // Demo Large KPI numbers
  const kpis = [
    {
      titleUz: "Foydalanuvchilar",
      titleRu: "Пользователи",
      value: "148",
      subUz: "+18 yangi",
      subRu: "+18 новых",
      change: "+13.8%",
      isUp: true,
      sparkline: [20, 28, 35, 42, 60, 95, 148]
    },
    {
      titleUz: "Faol eʼlonlar",
      titleRu: "Активные объявления",
      value: "426",
      subUz: "14 viloyatda",
      subRu: "в 14 регионах",
      change: "+8.4%",
      isUp: true,
      sparkline: [120, 180, 240, 310, 360, 426]
    },
    {
      titleUz: "Tuzilgan shartnomalar",
      titleRu: "Заключённые договоры",
      value: "312",
      subUz: "30 kun ichida",
      subRu: "за 30 дней",
      change: "+24.2%",
      isUp: true,
      sparkline: [40, 75, 120, 180, 250, 312]
    },
    {
      titleUz: "Buyurtmalar",
      titleRu: "Заказы",
      value: "284",
      subUz: "barcha hududlar",
      subRu: "все регионы",
      change: "+19.0%",
      isUp: true,
      sparkline: [30, 60, 110, 160, 220, 284]
    },
    {
      titleUz: "Yakunlangan savdolar",
      titleRu: "Завершённые сделки",
      value: "168",
      subUz: "muvaffaqiyatli",
      subRu: "успешно закрыто",
      change: "+31.5%",
      isUp: true,
      sparkline: [20, 45, 75, 105, 138, 168]
    },
    {
      titleUz: "Savdo hajmi (soʻm)",
      titleRu: "Объём торговли (сум)",
      value: "4.82 mlrd",
      subUz: "4 820 000 000 soʻm",
      subRu: "4 820 000 000 сум",
      change: "+22.7%",
      isUp: true,
      sparkline: [1.2, 1.8, 2.5, 3.4, 4.1, 4.82]
    },
    {
      titleUz: "Shartnomalardan tushum",
      titleRu: "Доход от договоров",
      value: "0 soʻm",
      subUz: "Sinov davri (0%)",
      subRu: "Пробный период (0%)",
      change: "0%",
      isUp: true,
      sparkline: [0, 0, 0, 0, 0, 0]
    },
    {
      titleUz: "Javob berish darajasi",
      titleRu: "Уровень ответов продавцов",
      value: "96.4%",
      subUz: "Muddati oʻtgan: 3 ta",
      subRu: "Просрочено: 3 шт.",
      change: "+2.1%",
      isUp: true,
      sparkline: [91, 92, 94, 95, 95.8, 96.4]
    }
  ];

  // Dynamics Line Chart Data (Last 6 Months)
  const dynamicsData = [
    { month: "Iyun", contracts: 42, orders: 38, listings: 65, sales: 24, volume: 580 },
    { month: "Iyul", contracts: 78, orders: 68, listings: 110, sales: 48, volume: 1120 },
    { month: "Avgust", contracts: 124, orders: 112, listings: 175, sales: 76, volume: 1940 },
    { month: "Sentabr", contracts: 195, orders: 174, listings: 260, sales: 114, volume: 2890 },
    { month: "Oktabr", contracts: 260, orders: 235, listings: 350, sales: 142, volume: 3950 },
    { month: "Noyabr", contracts: 312, orders: 284, listings: 426, sales: 168, volume: 4820 }
  ];

  // Category Distribution Data
  const categoryData = [
    { nameUz: "Sabzavotlar", nameRu: "Овощи", value: 124, color: "#1B5E3C" },
    { nameUz: "Mevalar", nameRu: "Фрукты", value: 92, color: "#2E7D32" },
    { nameUz: "Qurilish materiallari", nameRu: "Стройматериалы", value: 78, color: "#D97706" },
    { nameUz: "Don va dukkaklilar", nameRu: "Зерновые и бобовые", value: 54, color: "#4FB08A" },
    { nameUz: "Goʻsht va parranda", nameRu: "Мясо и птица", value: 38, color: "#2C7A5F" },
    { nameUz: "Boshqalar", nameRu: "Прочие", value: 40, color: "#A7D3C0" }
  ];

  // Regional ranking data
  const regionalRanking = [
    { regionUz: "Toshkent shahri", regionRu: "город Ташкент", listings: 85, volume: "1 250 mln", pct: 26 },
    { regionUz: "Samarqand viloyati", regionRu: "Самаркандская область", listings: 64, volume: "890 mln", pct: 18 },
    { regionUz: "Fargʻona viloyati", regionRu: "Ферганская область", listings: 52, volume: "680 mln", pct: 14 },
    { regionUz: "Andijon viloyati", regionRu: "Андижанская область", listings: 44, volume: "540 mln", pct: 11 },
    { regionUz: "Toshkent viloyati", regionRu: "Ташкентская область", listings: 39, volume: "480 mln", pct: 10 },
    { regionUz: "Buxoro viloyati", regionRu: "Бухарская область", listings: 34, volume: "390 mln", pct: 8 },
    { regionUz: "Surxondaryo viloyati", regionRu: "Сурхандарьинская область", listings: 28, volume: "310 mln", pct: 6 },
    { regionUz: "Namangan viloyati", regionRu: "Наманганская область", listings: 25, volume: "280 mln", pct: 5 },
    { regionUz: "Qashqadaryo viloyati", regionRu: "Кашкадарьинская область", listings: 22, volume: "240 mln", pct: 4 },
    { regionUz: "Xorazm viloyati", regionRu: "Хорезмская область", listings: 18, volume: "190 mln", pct: 4 },
    { regionUz: "Jizzax viloyati", regionRu: "Джизакская область", listings: 14, volume: "140 mln", pct: 3 },
    { regionUz: "Navoiy viloyati", regionRu: "Навоийская область", listings: 12, volume: "120 mln", pct: 2.5 },
    { regionUz: "Sirdaryo viloyati", regionRu: "Сырдарьинская область", listings: 10, volume: "95 mln", pct: 2 },
    { regionUz: "Qoraqalpogʻiston Resp.", regionRu: "Респ. Каракалпакстан", listings: 8, volume: "75 mln", pct: 1.5 }
  ];

  // Top 10 Entrepreneurs
  const topEntrepreneurs = [
    {
      id: "u-1",
      rank: 1,
      company: "OOO «Samarqand Agro Fayz»",
      name: "Usmonov Alisher",
      region: "Samarqand viloyati",
      rating: 4.95,
      listings: 18,
      deals: 42,
      volume: "680 000 000"
    },
    {
      id: "u-2",
      rank: 2,
      company: "«Bekobod Metallsanoat» MChJ",
      name: "Qodirov Baxtiyor",
      region: "Toshkent viloyati",
      rating: 4.92,
      listings: 14,
      deals: 35,
      volume: "540 000 000"
    },
    {
      id: "u-3",
      rank: 3,
      company: "XK «Andijon Don Hosili»",
      name: "Nazarov Dilshod",
      region: "Andijon viloyati",
      rating: 4.88,
      listings: 12,
      deals: 29,
      volume: "490 000 000"
    },
    {
      id: "u-4",
      rank: 4,
      company: "OOO «Buxoro Baraka Tekstil»",
      name: "Sobirov Ilhom",
      region: "Buxoro viloyati",
      rating: 4.85,
      listings: 15,
      deals: 26,
      volume: "420 000 000"
    },
    {
      id: "u-5",
      rank: 5,
      company: "«Surxon Agro Eksport» XK",
      name: "Rahimov Sherzod",
      region: "Surxondaryo viloyati",
      rating: 4.82,
      listings: 16,
      deals: 24,
      volume: "385 000 000"
    },
    {
      id: "u-6",
      rank: 6,
      company: "OOO «Quva Anor Bogʻlari»",
      name: "Yusupov Jamshid",
      region: "Fargʻona viloyati",
      rating: 4.8,
      listings: 10,
      deals: 21,
      volume: "320 000 000"
    },
    {
      id: "u-7",
      rank: 7,
      company: "«Toshkent Plastik Servis» MChJ",
      name: "Ergashev Bobur",
      region: "Toshkent shahri",
      rating: 4.78,
      listings: 9,
      deals: 19,
      volume: "290 000 000"
    },
    {
      id: "u-8",
      rank: 8,
      company: "Fermer xoʻjaligi «Mirzachoʻl Poliz»",
      name: "Karimov Shavkat",
      region: "Jizzax viloyati",
      rating: 4.75,
      listings: 8,
      deals: 17,
      volume: "260 000 000"
    },
    {
      id: "u-9",
      rank: 9,
      company: "«Navoiy Agro Kimyo» MChJ",
      name: "Mirzayev Farhod",
      region: "Navoiy viloyati",
      rating: 4.72,
      listings: 7,
      deals: 15,
      volume: "245 000 000"
    },
    {
      id: "u-10",
      rank: 10,
      company: "OOO «Chust Pichoq va Metall»",
      name: "Akromov Sarvar",
      region: "Namangan viloyati",
      rating: 4.7,
      listings: 6,
      deals: 13,
      volume: "210 000 000"
    }
  ];

  // Top 10 Goods
  const topGoods = [
    { nameUz: "Gala kartoshka", nameRu: "Картофель Гала", catUz: "Sabzavotlar", catRu: "Овощи", count: 28, deals: 36, avgPrice: "4 200 soʻm/kg", change: "+4.5%" },
    { nameUz: "Qizil piyoz", nameRu: "Красный лук", catUz: "Sabzavotlar", catRu: "Овощи", count: 22, deals: 31, avgPrice: "2 500 soʻm/kg", change: "-2.1%" },
    { nameUz: "M-500 sement", nameRu: "Цемент М-500", catUz: "Qurilish materiallari", catRu: "Стройматериалы", count: 19, deals: 28, avgPrice: "58 000 soʻm/qop", change: "+1.2%" },
    { nameUz: "Alanga guruch", nameRu: "Рис Аланга", catUz: "Don va dukkaklilar", catRu: "Зерновые и бобовые", count: 18, deals: 25, avgPrice: "19 500 soʻm/kg", change: "+6.0%" },
    { nameUz: "Golden olma", nameRu: "Яблоки Голден", catUz: "Mevalar", catRu: "Фрукты", count: 16, deals: 22, avgPrice: "8 500 soʻm/kg", change: "-1.5%" },
    { nameUz: "Quva anori", nameRu: "Кувинский гранат", catUz: "Mevalar", catRu: "Фрукты", count: 15, deals: 20, avgPrice: "22 000 soʻm/kg", change: "+3.8%" },
    { nameUz: "Metall armatura A500C", nameRu: "Арматура А500С", catUz: "Qurilish materiallari", catRu: "Стройматериалы", count: 14, deals: 19, avgPrice: "9 800 soʻm/kg", change: "+0.8%" },
    { nameUz: "Novvos goʻshti", nameRu: "Говядина молодая", catUz: "Goʻsht va parranda", catRu: "Мясо и птица", count: 13, deals: 18, avgPrice: "82 000 soʻm/kg", change: "+2.4%" },
    { nameUz: "Ammiakli selitra", nameRu: "Аммиачная селитра", catUz: "Oʻgʻitlar", catRu: "Удобрения", count: 12, deals: 16, avgPrice: "165 000 soʻm/qop", change: "0.0%" },
    { nameUz: "Suyuq sovun 5L", nameRu: "Жидкое мыло 5л", catUz: "Maishiy kimyo", catRu: "Бытовая химия", count: 11, deals: 14, avgPrice: "24 000 soʻm/dona", change: "-3.2%" }
  ];

  // Deal Funnel
  const funnelSteps = [
    { nameUz: "Eʼlonlar koʻrilishi", nameRu: "Просмотры объявлений", count: "48 600", pct: "100%" },
    { nameUz: "Tuzilgan shartnomalar", nameRu: "Заключённые договоры", count: "312", pct: "0.64%" },
    { nameUz: "Yuborilgan buyurtmalar", nameRu: "Отправленные заказы", count: "284", pct: "91.0%" },
    { nameUz: "Qabul qilingan", nameRu: "Принятые заказы", count: "215", pct: "75.7%" },
    { nameUz: "Yakunlangan bitimlar", nameRu: "Завершённые сделки", count: "168", pct: "78.1%" }
  ];

  // Trade flow matrix
  const flowMatrix = [
    { fromUz: "Samarqand", toUz: "Toshkent sh.", deals: 34, volume: "420 mln" },
    { fromUz: "Fargʻona", toUz: "Toshkent sh.", deals: 29, volume: "360 mln" },
    { fromUz: "Andijon", toUz: "Samarqand", deals: 18, volume: "210 mln" },
    { fromUz: "Surxondaryo", toUz: "Toshkent sh.", deals: 16, volume: "190 mln" },
    { fromUz: "Toshkent vil.", toUz: "Buxoro", deals: 14, volume: "175 mln" },
    { fromUz: "Buxoro", toUz: "Xorazm", deals: 12, volume: "140 mln" },
    { fromUz: "Jizzax", toUz: "Toshkent vil.", deals: 11, volume: "130 mln" },
    { fromUz: "Qashqadaryo", toUz: "Samarqand", deals: 9, volume: "115 mln" }
  ];

  // Sidebar navigation menu items
  const adminMenuItems = [
    { id: "dashboard", nameUz: "Boshqaruv paneli", nameRu: "Панель управления", icon: LayoutDashboard },
    { id: "reports", nameUz: "Hisobotlar", nameRu: "Отчёты", icon: BarChart3 },
    { id: "users", nameUz: "Foydalanuvchilar", nameRu: "Пользователи", icon: Users },
    { id: "listings", nameUz: "Eʼlonlar", nameRu: "Объявления", icon: Package },
    { id: "categories", nameUz: "Kategoriyalar", nameRu: "Категории", icon: FolderTree },
    { id: "products", nameUz: "Mahsulotlar spravochnigi", nameRu: "Справочник товаров", icon: BookOpen },
    { id: "contracts", nameUz: "Shartnomalar va toʻlovlar", nameRu: "Договоры и платежи", icon: FileText },
    { id: "orders", nameUz: "Buyurtmalar", nameRu: "Заказы", icon: ClipboardList },
    { id: "complaints", nameUz: "Shikoyatlar", nameRu: "Жалобы", icon: AlertOctagon },
    { id: "ratings", nameUz: "Baholar", nameRu: "Оценки и отзывы", icon: Star },
    { id: "tickets", nameUz: "Murojaatlar", nameRu: "Обращения", icon: MessageSquare },
    { id: "regions", nameUz: "Hududlar", nameRu: "Регионы (СОАТО)", icon: MapPin },
    { id: "settings", nameUz: "Sozlamalar", nameRu: "Настройки", icon: Settings },
    { id: "audit", nameUz: "Harakatlar jurnali", nameRu: "Журнал аудита", icon: History }
  ];

  const handleExportExcel = () => {
    toast.success(
      locale === "uz"
        ? "Excel hisoboti shakllantirildi va yuklab olindi (Svodka, Viloyatlar, Tumanlar, Tadbirkorlar)."
        : "Отчёт Excel сформирован и скачан (Сводка, По регионам, По туманам, По предпринимателям)."
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans text-text antialiased">
      {/* 2.1 Admin Header */}
      <header className="h-16 bg-surface border-b border-border sticky top-0 z-40 flex items-center justify-between px-3 sm:px-4 lg:px-8 shadow-xs">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile Admin Menu Burger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-btn hover:bg-surface-muted text-text"
            aria-label="Menyu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Shield className="w-5 h-5 text-primary" />}
          </button>

          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-btn bg-primary text-white flex items-center justify-center font-bold text-base sm:text-lg shadow-sm">
              UZ
            </div>
            <span className="font-bold text-lg sm:text-xl tracking-tight text-primary">UzSavdo</span>
          </Link>
          <div className="h-5 w-px bg-border hidden sm:block" />
          <span className="bg-primary/10 text-primary text-[11px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded-full border border-primary/20 truncate max-w-[130px] sm:max-w-none">
            {locale === "uz" ? "Boshqaruv paneli" : "Панель управления"}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Back to site (visible on BOTH mobile and desktop) */}
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-primary px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-btn border border-border hover:bg-surface-muted transition-colors shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{locale === "uz" ? "Saytga qaytish" : "Вернуться на сайт"}</span>
            <span className="sm:hidden">{locale === "uz" ? "Sayt" : "Сайт"}</span>
          </Link>

          {/* Lang toggle */}
          <div className="flex items-center bg-surface-muted p-0.5 rounded-btn border border-border text-xs font-bold">
            <button
              onClick={() => setLocale("uz")}
              className={`px-2 py-1 rounded-btn transition-colors cursor-pointer ${
                locale === "uz" ? "bg-primary text-white shadow-xs" : "text-text-secondary"
              }`}
            >
              UZ
            </button>
            <button
              onClick={() => setLocale("ru")}
              className={`px-2 py-1 rounded-btn transition-colors cursor-pointer ${
                locale === "ru" ? "bg-primary text-white shadow-xs" : "text-text-secondary"
              }`}
            >
              RU
            </button>
          </div>

          {/* Admin Avatar */}
          <div className="flex items-center gap-2 pl-1 sm:pl-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs border border-primary/30">
              A
            </div>
            <span className="text-xs font-bold text-text hidden md:inline">Admin Hokimiyat</span>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-[min(86vw,320px)] bg-surface h-full z-50 p-4 flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
              <span className="font-bold text-sm text-primary flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>{locale === "uz" ? "Boʻlimlar" : "Разделы"}</span>
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-text hover:bg-surface-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1">
              {adminMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeMenu === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveMenu(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[12px] text-xs font-semibold transition-all text-left ${
                      isActive
                        ? "bg-primary text-white shadow-sm font-bold"
                        : "text-text-secondary hover:bg-surface-muted hover:text-text"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-text-muted"}`} />
                    <span className="truncate">{locale === "uz" ? item.nameUz : item.nameRu}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-border mt-2">
              <Link
                href="/"
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-[12px] text-xs font-bold text-text-secondary hover:bg-surface-muted"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{locale === "uz" ? "Saytga qaytish" : "Вернуться на сайт"}</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex w-full relative">
        {/* 2.1 Left Menu - Sticky with independent scroll */}
        <aside className="w-64 bg-surface border-r border-border shrink-0 hidden lg:block p-4 space-y-1 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          {adminMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-btn text-xs font-semibold transition-all cursor-pointer text-left ${
                  isActive
                    ? "bg-primary text-white shadow-sm font-bold"
                    : "text-text-secondary hover:bg-surface-muted hover:text-text"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-text-muted"}`} />
                <span className="truncate">{locale === "uz" ? item.nameUz : item.nameRu}</span>
              </button>
            );
          })}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-8 space-y-6 overflow-x-hidden max-w-[1760px] mx-auto w-full">
          {activeMenu === "reports" && <AdminReportsSection locale={locale} />}
          {activeMenu === "users" && <AdminUsersSection locale={locale} onSelectUser={setSelectedUser} />}
          {activeMenu === "listings" && <AdminListingsSection locale={locale} />}
          {activeMenu === "categories" && <AdminCategoriesSection locale={locale} />}
          {activeMenu === "products" && <AdminProductsSection locale={locale} />}
          {activeMenu === "contracts" && <AdminContractsSection locale={locale} />}
          {activeMenu === "orders" && <AdminOrdersSection locale={locale} />}
          {activeMenu === "complaints" && <AdminComplaintsSection locale={locale} />}
          {activeMenu === "ratings" && <AdminRatingsSection locale={locale} />}
          {activeMenu === "tickets" && <AdminTicketsSection locale={locale} />}
          {activeMenu === "regions" && <AdminRegionsSection locale={locale} />}
          {activeMenu === "settings" && <AdminSettingsSection locale={locale} />}
          {activeMenu === "audit" && <AdminAuditSection locale={locale} />}

          {activeMenu === "dashboard" && (
            <>
              {/* Header Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-text tracking-tight">
                    {locale === "uz" ? "Boshqaruv paneli" : "Панель управления"}
                  </h1>
                  <p className="text-xs text-text-secondary mt-1">
                    {locale === "uz"
                      ? "Platformadagi savdo faoliyati statistikasi • Yangilandi: Bugun, 19:20"
                      : "Статистика торговой активности на платформе • Обновлено: Сегодня, 19:20"}
                  </p>
                </div>

                <div className="flex items-center gap-2.5 self-start sm:self-center">
                  <button
                    type="button"
                    onClick={handleExportExcel}
                    className="h-10 px-4 bg-primary text-white text-xs font-bold rounded-btn hover:bg-primary-hover flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{locale === "uz" ? "Excel hisobot" : "Отчёт Excel"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="h-10 px-4 border border-border bg-surface text-text text-xs font-semibold rounded-btn hover:bg-surface-muted flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-text-muted" />
                    <span>{locale === "uz" ? "Chop etish" : "Печать"}</span>
                  </button>
                </div>
              </div>

          {/* 2.2 Global Sticky Filter Panel */}
          <div className="bg-surface rounded-card border border-border p-5 shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {/* Period Quick Buttons */}
              <div className="col-span-1 sm:col-span-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary block mb-1.5">
                  {locale === "uz" ? "Davr / Vaqt" : "Период"}
                </label>
                <div className="flex items-center bg-surface-muted p-1 rounded-btn border border-border text-xs gap-1">
                  {[
                    { id: "today", uz: "Bugun", ru: "Сегодня" },
                    { id: "7d", uz: "7 kun", ru: "7 дней" },
                    { id: "30d", uz: "30 kun", ru: "30 дней" },
                    { id: "month", uz: "Bu oy", ru: "Этот месяц" },
                    { id: "year", uz: "Bu yil", ru: "Этот год" }
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPeriod(p.id as any)}
                      className={`flex-1 py-1 rounded-btn text-xs font-bold transition-colors cursor-pointer ${
                        period === p.id
                          ? "bg-primary text-white shadow-xs"
                          : "text-text-secondary hover:text-text"
                      }`}
                    >
                      {locale === "uz" ? p.uz : p.ru}
                    </button>
                  ))}
                </div>
              </div>

              {/* Region 2-level filter */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary block mb-1.5">
                  {locale === "uz" ? "Hudud / Viloyat" : "Регион"}
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full h-10 px-3 bg-surface-muted border border-border rounded-btn text-xs font-medium focus:outline-none text-text"
                >
                  <option value="all">
                    {locale === "uz" ? "Butun Oʻzbekiston (14 hudud)" : "Весь Узбекистан (14 регионов)"}
                  </option>
                  <option value="toshkent_sh">Toshkent shahri</option>
                  <option value="samarqand">Samarqand viloyati</option>
                  <option value="fargona">Fargʻona viloyati</option>
                  <option value="andijon">Andijon viloyati</option>
                  <option value="buxoro">Buxoro viloyati</option>
                </select>
              </div>

              {/* Category filter */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary block mb-1.5">
                  {locale === "uz" ? "Kategoriya" : "Категория"}
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full h-10 px-3 bg-surface-muted border border-border rounded-btn text-xs font-medium focus:outline-none text-text"
                >
                  <option value="all">
                    {locale === "uz" ? "Barcha kategoriyalar (14)" : "Все категории (14)"}
                  </option>
                  <option value="sabzavotlar">Sabzavotlar / Овощи</option>
                  <option value="mevalar">Mevalar / Фрукты</option>
                  <option value="qurilish">Qurilish materiallari / Стройматериалы</option>
                  <option value="don">Don va dukkaklilar / Зерновые</option>
                </select>
              </div>

              {/* Apply / Reset buttons */}
              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={() =>
                    toast.success(
                      locale === "uz"
                        ? "Barcha koʻrsatkichlar va grafiklar yangilandi!"
                        : "Все показатели и графики обновлены!"
                    )
                  }
                  className="flex-1 h-10 bg-primary text-white text-xs font-bold rounded-btn hover:bg-primary-hover transition-colors cursor-pointer"
                >
                  {locale === "uz" ? "Qoʻllash" : "Применить"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPeriod("30d");
                    setSelectedRegion("all");
                    setSelectedCategory("all");
                    toast.info(locale === "uz" ? "Filtrlar tozalandi" : "Фильтры сброшены");
                  }}
                  className="h-10 px-3 border border-border text-text-secondary hover:bg-surface-muted rounded-btn text-xs font-semibold cursor-pointer"
                >
                  {locale === "uz" ? "Tozalash" : "Сбросить"}
                </button>
              </div>
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60 text-xs">
              <span className="text-text-muted text-[11px]">
                {locale === "uz" ? "Faol filtrlar:" : "Активные фильтры:"}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold text-[11px]">
                {locale === "uz" ? "Davr: 30 kun" : "Период: 30 дней"}
                <X className="w-3 h-3 cursor-pointer" />
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold text-[11px]">
                {locale === "uz" ? "Hudud: Butun Oʻzbekiston" : "Регион: Весь Узбекистан"}
                <X className="w-3 h-3 cursor-pointer" />
              </span>
            </div>
          </div>

          {/* 2.3 KPI Row (8 cards, 4 in row on >=1280px) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {kpis.map((kpi, idx) => (
              <div
                key={idx}
                className="bg-surface rounded-card border border-border p-5 shadow-sm space-y-3 relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-text-secondary font-medium">
                    <span>{locale === "uz" ? kpi.titleUz : kpi.titleRu}</span>
                    <span
                      className={`inline-flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        kpi.isUp ? "bg-success/15 text-success" : "bg-danger/15 text-danger"
                      }`}
                    >
                      {kpi.isUp ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {kpi.change}
                    </span>
                  </div>

                  <div className="text-2xl sm:text-3xl font-extrabold text-text mt-2 tracking-tight">
                    {kpi.value}
                  </div>
                </div>

                <div className="flex items-end justify-between pt-2 border-t border-border/50">
                  <span className="text-[11px] text-text-muted">
                    {locale === "uz" ? kpi.subUz : kpi.subRu}
                  </span>

                  {/* Sparkline mini-graph */}
                  <div className="w-24 h-7">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={kpi.sparkline.map((val, i) => ({ i, val }))}>
                        <Line
                          type="monotone"
                          dataKey="val"
                          stroke="#2E7D32"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 2.4 Analytics Grid (12 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* 1. Uzbekistan Map by Regions (8 cols) */}
            <div className="lg:col-span-8 bg-surface rounded-card border border-border p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
                <div>
                  <h3 className="font-bold text-base text-text">
                    {locale === "uz"
                      ? "Oʻzbekiston xaritasi — Hududlar faolligi"
                      : "Карта Узбекистана — Торговая активность регионов"}
                  </h3>
                  <p className="text-xs text-text-muted">
                    {locale === "uz"
                      ? "14 ta viloyat va shahar boʻyicha taqsimot (geoBoundaries ADM1)"
                      : "Распределение по 14 областям и городам"}
                  </p>
                </div>

                {/* Metric toggle */}
                <div className="flex items-center bg-surface-muted p-1 rounded-btn border border-border text-xs">
                  <button
                    onClick={() => setMapMetric("volume")}
                    className={`px-3 py-1 rounded-btn font-bold cursor-pointer ${
                      mapMetric === "volume" ? "bg-primary text-white shadow-xs" : "text-text-secondary"
                    }`}
                  >
                    {locale === "uz" ? "Savdo hajmi" : "Объём"}
                  </button>
                  <button
                    onClick={() => setMapMetric("listings")}
                    className={`px-3 py-1 rounded-btn font-bold cursor-pointer ${
                      mapMetric === "listings" ? "bg-primary text-white shadow-xs" : "text-text-secondary"
                    }`}
                  >
                    {locale === "uz" ? "Eʼlonlar" : "Объявления"}
                  </button>
                  <button
                    onClick={() => setMapMetric("contracts")}
                    className={`px-3 py-1 rounded-btn font-bold cursor-pointer ${
                      mapMetric === "contracts" ? "bg-primary text-white shadow-xs" : "text-text-secondary"
                    }`}
                  >
                    {locale === "uz" ? "Shartnomalar" : "Договоры"}
                  </button>
                </div>
              </div>

              {/* Interactive SVG Map container */}
              <div className="relative aspect-[16/9] w-full bg-surface-muted/40 rounded-btn border border-border flex items-center justify-center p-4 overflow-hidden">
                <svg viewBox="0 0 900 500" className="w-full h-full">
                  {/* Stylized polygons for 14 regions */}
                  <g className="cursor-pointer">
                    {/* Karakalpakstan */}
                    <path
                      d="M 50,150 L 260,110 L 300,240 L 150,290 Z"
                      fill="#A7D3C0"
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="hover:opacity-80 transition-opacity"
                    >
                      <title>Qoraqalpogʻiston Resp. • 8 eʼlon • 75 mln soʻm</title>
                    </path>
                    {/* Khorezm */}
                    <path
                      d="M 230,240 L 285,230 L 295,280 L 235,280 Z"
                      fill="#4FB08A"
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="hover:opacity-80 transition-opacity"
                    >
                      <title>Xorazm viloyati • 18 eʼlon • 190 mln soʻm</title>
                    </path>
                    {/* Navoiy */}
                    <path
                      d="M 260,110 L 450,130 L 430,280 L 300,240 Z"
                      fill="#4FB08A"
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="hover:opacity-80 transition-opacity"
                    >
                      <title>Navoiy viloyati • 12 eʼlon • 120 mln soʻm</title>
                    </path>
                    {/* Bukhara */}
                    <path
                      d="M 295,280 L 420,280 L 440,360 L 320,350 Z"
                      fill="#2C7A5F"
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="hover:opacity-80 transition-opacity"
                    >
                      <title>Buxoro viloyati • 34 eʼlon • 390 mln soʻm</title>
                    </path>
                    {/* Samarqand */}
                    <path
                      d="M 430,280 L 530,280 L 520,360 L 440,360 Z"
                      fill="#1B5E3C"
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="hover:opacity-80 transition-opacity"
                    >
                      <title>Samarqand viloyati • 64 eʼlon • 890 mln soʻm</title>
                    </path>
                    {/* Qashqadaryo */}
                    <path
                      d="M 440,360 L 520,360 L 540,430 L 450,430 Z"
                      fill="#4FB08A"
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="hover:opacity-80 transition-opacity"
                    >
                      <title>Qashqadaryo viloyati • 22 eʼlon • 240 mln soʻm</title>
                    </path>
                    {/* Surxondaryo */}
                    <path
                      d="M 520,380 L 580,390 L 570,470 L 530,460 Z"
                      fill="#2C7A5F"
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="hover:opacity-80 transition-opacity"
                    >
                      <title>Surxondaryo viloyati • 28 eʼlon • 310 mln soʻm</title>
                    </path>
                    {/* Jizzakh */}
                    <path
                      d="M 530,270 L 600,270 L 590,340 L 530,340 Z"
                      fill="#A7D3C0"
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="hover:opacity-80 transition-opacity"
                    >
                      <title>Jizzax viloyati • 14 eʼlon • 140 mln soʻm</title>
                    </path>
                    {/* Sirdaryo */}
                    <path
                      d="M 600,270 L 640,270 L 635,330 L 590,330 Z"
                      fill="#A7D3C0"
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="hover:opacity-80 transition-opacity"
                    >
                      <title>Sirdaryo viloyati • 10 eʼlon • 95 mln soʻm</title>
                    </path>
                    {/* Tashkent Viloyati */}
                    <path
                      d="M 630,220 L 710,210 L 690,290 L 630,270 Z"
                      fill="#2C7A5F"
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="hover:opacity-80 transition-opacity"
                    >
                      <title>Toshkent viloyati • 39 eʼlon • 480 mln soʻm</title>
                    </path>
                    {/* Tashkent City */}
                    <circle
                      cx="670"
                      cy="245"
                      r="16"
                      fill="#1B5E3C"
                      stroke="#ffffff"
                      strokeWidth="3"
                      className="animate-pulse"
                    >
                      <title>Toshkent shahri (Markaz) • 85 eʼlon • 1 250 mln soʻm</title>
                    </circle>
                    {/* Fergana Valley: Namangan, Andijan, Fergana */}
                    <path
                      d="M 710,220 L 780,210 L 760,260 L 700,260 Z"
                      fill="#4FB08A"
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="hover:opacity-80 transition-opacity"
                    >
                      <title>Namangan viloyati • 25 eʼlon • 280 mln soʻm</title>
                    </path>
                    <path
                      d="M 780,210 L 840,220 L 830,270 L 760,260 Z"
                      fill="#2C7A5F"
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="hover:opacity-80 transition-opacity"
                    >
                      <title>Andijon viloyati • 44 eʼlon • 540 mln soʻm</title>
                    </path>
                    <path
                      d="M 700,260 L 830,270 L 800,320 L 710,310 Z"
                      fill="#1B5E3C"
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="hover:opacity-80 transition-opacity"
                    >
                      <title>Fargʻona viloyati • 52 eʼlon • 680 mln soʻm</title>
                    </path>
                  </g>
                </svg>

                {/* Legend indicator */}
                <div className="absolute bottom-3 left-4 bg-surface/90 backdrop-blur-xs p-2.5 rounded-btn border border-border text-[11px] space-y-1 shadow-xs">
                  <div className="font-bold text-text">
                    {locale === "uz" ? "Faollik darajasi:" : "Уровень активности:"}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#1B5E3C]" />
                    <span>{locale === "uz" ? "Yuqori (600+ mln)" : "Высокий (600+ млн)"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#2C7A5F]" />
                    <span>{locale === "uz" ? "Oʻrta (300-600 mln)" : "Средний (300-600 млн)"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#A7D3C0]" />
                    <span>{locale === "uz" ? "Boshlangʻich (<300 mln)" : "Начальный (<300 млн)"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Rating of Regions (4 cols) */}
            <div className="lg:col-span-4 bg-surface rounded-card border border-border p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-bold text-base text-text">
                  {locale === "uz" ? "Hududlar reytingi" : "Рейтинг регионов"}
                </h3>
                <span className="text-xs font-semibold text-text-muted">14 viloyat</span>
              </div>

              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 text-xs">
                {regionalRanking.map((r, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="font-bold text-text truncate max-w-[150px]">
                        {i + 1}. {locale === "uz" ? r.regionUz : r.regionRu}
                      </span>
                      <span className="text-primary font-bold">{r.volume}</span>
                    </div>
                    <div className="h-2 bg-surface-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${r.pct * 3.5}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Dynamics of Trading Activity (8 cols) */}
            <div className="lg:col-span-8 bg-surface rounded-card border border-border p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
                <div>
                  <h3 className="font-bold text-base text-text">
                    {locale === "uz" ? "Savdo dinamikasi" : "Динамика торговли"}
                  </h3>
                  <p className="text-xs text-text-muted">
                    {locale === "uz"
                      ? "Oylar kesimida tuzilgan shartnomalar, buyurtmalar va bitimlar oʻsishi"
                      : "Рост договоров, заказов и закрытых сделок по месяцам"}
                  </p>
                </div>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dynamicsData}>
                    <defs>
                      <linearGradient id="colorContracts" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1B5E3C" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#1B5E3C" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D97706" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#D97706" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="contracts"
                      name={locale === "uz" ? "Shartnomalar" : "Договоры"}
                      stroke="#1B5E3C"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorContracts)"
                    />
                    <Area
                      type="monotone"
                      dataKey="orders"
                      name={locale === "uz" ? "Buyurtmalar" : "Заказы"}
                      stroke="#D97706"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorOrders)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 4. Category Ring Chart (4 cols) */}
            <div className="lg:col-span-4 bg-surface rounded-card border border-border p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-bold text-base text-text">
                  {locale === "uz" ? "Kategoriyalar ulushi" : "Доли категорий"}
                </h3>
              </div>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                    >
                      {categoryData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-1.5 text-xs">
                {categoryData.map((cat, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-text-secondary">
                        {locale === "uz" ? cat.nameUz : cat.nameRu}
                      </span>
                    </div>
                    <span className="font-bold text-text">{cat.value} ta</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Trade Flow Matrix (12 cols) */}
            <div className="lg:col-span-12 bg-surface rounded-card border border-border p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <h3 className="font-bold text-base text-text">
                    {locale === "uz"
                      ? "Hududlararo tovar oqimlari «Qayerdan → Qayerga»"
                      : "Межрегиональные товарные потоки «Откуда → Куда»"}
                  </h3>
                  <p className="text-xs text-text-muted">
                    {locale === "uz"
                      ? "Viloyatlar oʻrtasida imzolangan shartnomalar va savdo hajmi matritsasi"
                      : "Матрица сделок и объёмов поставок между областями"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {flowMatrix.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-surface-muted rounded-btn border border-border space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-text">
                      <span>{item.fromUz}</span>
                      <span className="text-primary">→</span>
                      <span>{item.toUz}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-text-secondary pt-1 border-t border-border/50">
                      <span>{item.deals} ta shartnoma</span>
                      <span className="font-bold text-primary">{item.volume}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 7. TOP-10 Entrepreneurs (6 cols) */}
            <div className="lg:col-span-6 bg-surface rounded-card border border-border p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-bold text-base text-text">
                  {locale === "uz" ? "TOP-10 Tadbirkorlar" : "ТОП-10 Предпринимателей"}
                </h3>
                <span className="text-xs font-semibold text-text-muted">Faollik boʻyicha</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-text-muted border-b border-border">
                    <tr>
                      <th className="pb-2 font-bold">#</th>
                      <th className="pb-2 font-bold">{locale === "uz" ? "Korxona" : "Компания"}</th>
                      <th className="pb-2 font-bold">{locale === "uz" ? "Reyting" : "Рейтинг"}</th>
                      <th className="pb-2 font-bold text-right">{locale === "uz" ? "Hajm" : "Объём"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {topEntrepreneurs.map((u) => (
                      <tr
                        key={u.id}
                        onClick={() => setSelectedUser(u)}
                        className="hover:bg-surface-muted/60 cursor-pointer transition-colors"
                      >
                        <td className="py-2.5 font-bold text-primary">{u.rank}</td>
                        <td className="py-2.5">
                          <div className="font-bold text-text truncate max-w-[180px]">{u.company}</div>
                          <div className="text-[11px] text-text-muted">{u.region}</div>
                        </td>
                        <td className="py-2.5">
                          <span className="inline-flex items-center gap-1 font-bold text-accent">
                            <Star className="w-3.5 h-3.5 fill-accent" />
                            {u.rating}
                          </span>
                        </td>
                        <td className="py-2.5 text-right font-bold text-text">{u.volume} soʻm</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 8. TOP-10 Goods (6 cols) */}
            <div className="lg:col-span-6 bg-surface rounded-card border border-border p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-bold text-base text-text">
                  {locale === "uz" ? "TOP-10 Talabgir tovarlar" : "ТОП-10 Востребованных товаров"}
                </h3>
                <span className="text-xs font-semibold text-text-muted">Savdo soni</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-text-muted border-b border-border">
                    <tr>
                      <th className="pb-2 font-bold">{locale === "uz" ? "Mahsulot" : "Товар"}</th>
                      <th className="pb-2 font-bold">{locale === "uz" ? "Kategoriya" : "Категория"}</th>
                      <th className="pb-2 font-bold text-right">{locale === "uz" ? "Oʻrtacha narx" : "Ср. цена"}</th>
                      <th className="pb-2 font-bold text-right">{locale === "uz" ? "Oʻzgarish" : "Динамика"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {topGoods.map((g, idx) => (
                      <tr key={idx} className="hover:bg-surface-muted/60 transition-colors">
                        <td className="py-2.5 font-bold text-text">
                          {locale === "uz" ? g.nameUz : g.nameRu}
                        </td>
                        <td className="py-2.5 text-text-secondary">
                          {locale === "uz" ? g.catUz : g.catRu}
                        </td>
                        <td className="py-2.5 text-right font-semibold text-text">{g.avgPrice}</td>
                        <td className="py-2.5 text-right">
                          <span
                            className={`font-bold ${
                              g.change.startsWith("+")
                                ? "text-success"
                                : g.change.startsWith("-")
                                ? "text-danger"
                                : "text-text-muted"
                            }`}
                          >
                            {g.change}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 10. Deal Funnel (12 cols) */}
            <div className="lg:col-span-12 bg-surface rounded-card border border-border p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-bold text-base text-text">
                  {locale === "uz" ? "Bitimlar voronkasi" : "Воронка торговых сделок"}
                </h3>
                <span className="text-xs font-semibold text-text-muted">Konversiya monitoringi</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {funnelSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-surface-muted rounded-btn border border-border text-center space-y-1 relative"
                  >
                    <div className="text-xs text-text-secondary truncate">
                      {locale === "uz" ? step.nameUz : step.nameRu}
                    </div>
                    <div className="text-xl font-extrabold text-primary">{step.count}</div>
                    <div className="text-[11px] font-bold text-accent">{step.pct}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </>
          )}
        </main>
      </div>

      {/* 2.6 User Detail Drawer in Admin */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/45 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-[560px] bg-surface h-full shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right duration-250 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div>
                  <h3 className="font-bold text-lg text-text">{selectedUser.company}</h3>
                  <p className="text-xs text-text-muted">
                    ID: {selectedUser.id} • {selectedUser.region}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-1.5 rounded-full hover:bg-surface-muted text-text-muted hover:text-text cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Company Info Card */}
              <div className="bg-surface-muted p-4 rounded-btn border border-border space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Rahbar F.I.Sh:</span>
                  <span className="font-bold text-text">{selectedUser.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Telefon raqam:</span>
                  <span className="font-semibold text-primary">+998 90 123-45-67</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">STIR (ИНН):</span>
                  <span className="font-semibold text-text">308 192 841</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Roʻyxatdan oʻtgan sana:</span>
                  <span className="text-text">14.05.2026</span>
                </div>
              </div>

              {/* Activity stats */}
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-3 bg-surface-muted rounded-btn border border-border">
                  <div className="text-text-secondary mb-1">Eʼlonlar</div>
                  <div className="text-lg font-bold text-text">{selectedUser.listings} ta</div>
                </div>
                <div className="p-3 bg-surface-muted rounded-btn border border-border">
                  <div className="text-text-secondary mb-1">Bitimlar</div>
                  <div className="text-lg font-bold text-primary">{selectedUser.deals} ta</div>
                </div>
                <div className="p-3 bg-surface-muted rounded-btn border border-border">
                  <div className="text-text-secondary mb-1">Reyting</div>
                  <div className="text-lg font-bold text-accent flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 fill-accent" />
                    {selectedUser.rating}
                  </div>
                </div>
              </div>

              {/* Recent Deals */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-text-secondary mb-2">
                  Soʻnggi shartnomalar
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-surface rounded-btn border border-border flex justify-between items-center">
                    <div>
                      <div className="font-bold text-text">№ UZ-2026-0814</div>
                      <div className="text-text-muted text-[11px]">Gala kartoshka • 15 000 kg</div>
                    </div>
                    <span className="text-success font-bold">Yakunlandi</span>
                  </div>
                  <div className="p-3 bg-surface rounded-btn border border-border flex justify-between items-center">
                    <div>
                      <div className="font-bold text-text">№ UZ-2026-0792</div>
                      <div className="text-text-muted text-[11px]">Qizil piyoz • 25 000 kg</div>
                    </div>
                    <span className="text-success font-bold">Yakunlandi</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Actions */}
            <div className="pt-6 border-t border-border flex gap-3">
              <button
                type="button"
                onClick={() => setBlockUserConfirm(true)}
                className="flex-1 h-11 bg-danger/10 border border-danger/30 text-danger rounded-btn text-xs font-bold hover:bg-danger hover:text-white transition-colors cursor-pointer"
              >
                {locale === "uz" ? "Bloklash" : "Заблокировать"}
              </button>
              <button
                type="button"
                onClick={() => {
                  toast.success(
                    locale === "uz"
                      ? "Foydalanuvchi paroli tiklandi va SMS orqali yuborildi."
                      : "Пароль пользователя сброшен и отправлен по SMS."
                  );
                }}
                className="flex-1 h-11 bg-surface-muted border border-border text-text rounded-btn text-xs font-semibold hover:bg-border/30 transition-colors cursor-pointer"
              >
                {locale === "uz" ? "Parolni tiklash" : "Сбросить пароль"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Block Confirm Dialog */}
      <ConfirmDialog
        isOpen={blockUserConfirm}
        onClose={() => setBlockUserConfirm(false)}
        onConfirm={() => {
          setBlockUserConfirm(false);
          toast.success(
            locale === "uz"
              ? "Tadbirkor tizimda muvaffaqiyatli bloklandi."
              : "Предприниматель успешно заблокирован."
          );
        }}
        title={locale === "uz" ? "Tadbirkorni bloklash" : "Блокировка предпринимателя"}
        description={
          locale === "uz"
            ? "Haqiqatan ham ushbu tadbirkorni va uning barcha eʼlonlarini bloklamoqchimisiz? Bloklash sababi koʻrsatilishi shart."
            : "Вы уверены, что хотите заблокировать данного пользователя и все его объявления?"
        }
        confirmText={locale === "uz" ? "Bloklash" : "Заблокировать"}
        cancelText={locale === "uz" ? "Bekor qilish" : "Отмена"}
        variant="danger"
      />
    </div>
  );
}
