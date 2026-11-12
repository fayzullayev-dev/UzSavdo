"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import { useLanguage } from "../../lib/language";
import { NavigationLayout } from "../../components/navigation";
import {
  Smartphone,
  Download,
  QrCode,
  ShieldCheck,
  Zap,
  Bell,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  PlusSquare,
  Share2
} from "lucide-react";

export default function AppPage() {
  const { locale } = useLanguage();
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentUrl = window.location.href;
      QRCode.toDataURL(currentUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: "#14532d",
          light: "#ffffff"
        }
      })
        .then((url) => setQrCodeDataUrl(url))
        .catch(console.error);

      // PWA install prompt handler
      const handleBeforeInstall = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstall);

      if (window.matchMedia("(display-mode: standalone)").matches) {
        setIsInstalled(true);
      }

      return () => {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      };
    }
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback: download app package
      const link = document.createElement("a");
      link.href = "/downloads/uzsavdo-v1.2.apk";
      link.download = "uzsavdo-v1.2.apk";
      link.click();
    }
  };

  return (
    <NavigationLayout>
      <div className="max-w-4xl mx-auto py-4 sm:py-8 space-y-10">
        {/* Header Hero Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-1">
            <Smartphone className="w-4 h-4" />
            <span>UzSavdo Mobile v1.2</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-text tracking-tight">
            {locale === "uz"
              ? "UzSavdo mobil ilovasini oʻrnating"
              : "Установите мобильное приложение UzSavdo"}
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary max-w-xl mx-auto leading-relaxed">
            {locale === "uz"
              ? "Oʻzbekiston boʻylab ulgurji savdo, buyurtmalar, shartnomalar va lahzali bildirishnomalar barchasi choʻntagingizda."
              : "Оптовая торговля, заказы, договоры и мгновенные уведомления по всему Узбекистану в вашем кармане."}
          </p>
        </div>

        {/* Action Grid: QR Code + Install Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Card 1: 1-Click Install Application on Phone */}
          <div className="bg-surface rounded-[24px] border border-border p-6 sm:p-8 flex flex-col justify-between shadow-sm space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-[16px] bg-primary text-white flex items-center justify-center font-bold text-xl shadow-md">
                  UZ
                </div>
                <div>
                  <h3 className="font-bold text-base text-text">UzSavdo Mobil Ilova</h3>
                  <p className="text-xs text-text-muted">Android & iOS · Rasmiy talqin</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-text-secondary">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span>
                    {locale === "uz" ? "Tezkor buyurtma bildirishnomalari" : "Быстрые push-уведомления"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span>
                    {locale === "uz" ? "Toʻliq ekranli qulay interfeys" : "Полноэкранный удобный интерфейс"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span>
                    {locale === "uz" ? "Oʻzbek va rus tillarida" : "На узбекском и русском языках"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {/* Install Button */}
              <button
                type="button"
                onClick={handleInstallApp}
                className="w-full h-13 py-3.5 px-6 rounded-[16px] bg-primary text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 hover:bg-primary-hover active:scale-98 transition-all"
              >
                <Download className="w-5 h-5" />
                <span>
                  {isInstalled
                    ? locale === "uz" ? "Ilova oʻrnatilgan ✓" : "Приложение установлено ✓"
                    : locale === "uz" ? "Telefonga oʻrnatish (1-klik)" : "Установить на телефон (в 1 клик)"}
                </span>
              </button>

              {/* Instant Instruction for Chrome/Safari */}
              <div className="p-3 rounded-[14px] bg-surface-muted/60 border border-border/70 text-[11px] text-text-secondary leading-normal space-y-1">
                <div className="font-semibold text-text flex items-center gap-1.5">
                  <PlusSquare className="w-3.5 h-3.5 text-primary" />
                  <span>
                    {locale === "uz"
                      ? "Toʻgʻridan-toʻgʻri brauzerdan qoʻshish:"
                      : "Прямая установка из браузера:"}
                  </span>
                </div>
                <p>
                  {locale === "uz"
                    ? "Brauzer menyusidan (⋮ yoki Поделиться) «Ilovani oʻrnatish» yoki «Bosh ekranga qoʻshish» (Добавить на главный экран) tugmasini bosing."
                    : "В меню браузера (⋮ или Поделиться) нажмите «Установить приложение» или «Добавить на главный экран»."}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: QR Code Scan */}
          <div className="bg-surface rounded-[24px] border border-border p-6 sm:p-8 flex flex-col items-center justify-center text-center shadow-sm space-y-4">
            <div className="p-3 bg-white rounded-[20px] shadow-md border border-border/80">
              {qrCodeDataUrl ? (
                <img
                  src={qrCodeDataUrl}
                  alt="QR Code"
                  className="w-44 h-44 sm:w-48 sm:h-48 rounded-[12px]"
                />
              ) : (
                <div className="w-44 h-44 flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-text-muted animate-pulse" />
                </div>
              )}
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-sm text-text">
                {locale === "uz"
                  ? "Telefoningiz kamerasi bilan skanerlang"
                  : "Отсканируйте камерой телефона"}
              </h4>
              <p className="text-xs text-text-muted max-w-xs">
                {locale === "uz"
                  ? "Kamerani QR-kodga qarating va darhol ilovani telefoningizga oʻrnating."
                  : "Наведите камеру на QR-код для быстрой установки приложения на телефон."}
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-surface rounded-[24px] border border-border p-6 sm:p-8 space-y-4 shadow-sm">
          <h3 className="font-bold text-base text-text">
            {locale === "uz" ? "Telefoningizga qanday oʻrnatiladi?" : "Как установить приложение?"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-text-secondary">
            <div className="p-4 rounded-[16px] bg-surface-muted/50 border border-border/60 space-y-2">
              <div className="w-7 h-7 rounded-full bg-primary text-white font-bold flex items-center justify-center text-xs">
                1
              </div>
              <h5 className="font-semibold text-text">
                {locale === "uz" ? "Tugmani bosing" : "Нажмите кнопку"}
              </h5>
              <p className="text-text-muted leading-relaxed">
                {locale === "uz"
                  ? "Yuqoridagi «Telefonga oʻrnatish» tugmasini bosing."
                  : "Нажмите «Установить на телефон» выше."}
              </p>
            </div>

            <div className="p-4 rounded-[16px] bg-surface-muted/50 border border-border/60 space-y-2">
              <div className="w-7 h-7 rounded-full bg-primary text-white font-bold flex items-center justify-center text-xs">
                2
              </div>
              <h5 className="font-semibold text-text">
                {locale === "uz" ? "Tasdiqlang" : "Подтвердите"}
              </h5>
              <p className="text-text-muted leading-relaxed">
                {locale === "uz"
                  ? "Ekranda chiqqan «Oʻrnatish» (Установить) oynasini tasdiqlang."
                  : "В появившемся окне нажмите «Установить»."}
              </p>
            </div>

            <div className="p-4 rounded-[16px] bg-surface-muted/50 border border-border/60 space-y-2">
              <div className="w-7 h-7 rounded-full bg-primary text-white font-bold flex items-center justify-center text-xs">
                3
              </div>
              <h5 className="font-semibold text-text">
                {locale === "uz" ? "Ekrandan kiring" : "Открывайте с экрана"}
              </h5>
              <p className="text-text-muted leading-relaxed">
                {locale === "uz"
                  ? "Telefoningiz ishchi stolida UzSavdo belgisi paydo boʻladi."
                  : "Иконка UzSavdo появится на рабочем столе телефона как отдельное приложение."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </NavigationLayout>
  );
}
