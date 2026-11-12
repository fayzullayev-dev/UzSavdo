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
  AlertCircle
} from "lucide-react";

export default function AppPage() {
  const { locale } = useLanguage();
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [deviceType, setDeviceType] = useState<"android" | "ios" | "desktop">("desktop");

  useEffect(() => {
    // Generate QR code pointing to current /app URL
    if (typeof window !== "undefined") {
      const currentUrl = window.location.href;
      QRCode.toDataURL(currentUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: "#14532d", // UzSavdo primary green
          light: "#ffffff"
        }
      })
        .then((url) => setQrCodeDataUrl(url))
        .catch(console.error);

      // Detect User Agent
      const ua = navigator.userAgent.toLowerCase();
      if (/android/i.test(ua)) {
        setDeviceType("android");
      } else if (/iphone|ipad|ipod/i.test(ua)) {
        setDeviceType("ios");
      } else {
        setDeviceType("desktop");
      }
    }
  }, []);

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
              ? "UzSavdo mobil ilovasini yuklab oling"
              : "Скачайте мобильное приложение UzSavdo"}
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary max-w-xl mx-auto leading-relaxed">
            {locale === "uz"
              ? "Oʻzbekiston boʻylab ulgurji savdo, buyurtmalar, shartnomalar va lahzali bildirishnomalar barchasi choʻntagingizda."
              : "Оптовая торговля, заказы, договоры и мгновенные уведомления по всему Узбекистану в вашем кармане."}
          </p>
        </div>

        {/* Action Grid: QR Code + Download Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Card 1: Direct Download (Android / iOS) */}
          <div className="bg-surface rounded-[24px] border border-border p-6 sm:p-8 flex flex-col justify-between shadow-sm space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-[16px] bg-primary text-white flex items-center justify-center font-bold text-xl shadow-md">
                  UZ
                </div>
                <div>
                  <h3 className="font-bold text-base text-text">UzSavdo Android APK</h3>
                  <p className="text-xs text-text-muted">Versiya: 1.2.0 · Hajmi: 28 MB</p>
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
                    {locale === "uz" ? "Oflayn rejimda eʼlonlarni koʻrish" : "Просмотр объявлений офлайн"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span>
                    {locale === "uz" ? "Toʻliq oʻzbek va rus tillarida" : "На узбекском и русском языках"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {/* Android APK Download Button */}
              <a
                href="/downloads/uzsavdo-v1.2.apk"
                download="uzsavdo-v1.2.apk"
                className="w-full h-13 py-3.5 px-6 rounded-[16px] bg-primary text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 hover:bg-primary-hover active:scale-98 transition-all"
              >
                <Download className="w-5 h-5" />
                <span>
                  {locale === "uz"
                    ? "Android uchun yuklab olish (APK)"
                    : "Скачать для Android (APK)"}
                </span>
              </a>

              {/* iOS Note */}
              <div className="p-3 rounded-[12px] bg-surface-muted/60 border border-border/70 flex items-center gap-2 text-[11px] text-text-muted">
                <AlertCircle className="w-4 h-4 text-accent shrink-0" />
                <span>
                  {locale === "uz"
                    ? "Tez orada App Store’da"
                    : "Скоро в App Store"}
                </span>
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
                  ? "Kamerani QR-kodga qarating va toʻgʻridan-toʻgʻri telefoningizga yuklab oling."
                  : "Наведите камеру на QR-код для быстрой загрузки приложения на телефон."}
              </p>
            </div>
          </div>
        </div>

        {/* Installation Instructions (Section 7.2) */}
        <div className="bg-surface rounded-[24px] border border-border p-6 sm:p-8 space-y-4 shadow-sm">
          <h3 className="font-bold text-base text-text">
            {locale === "uz" ? "Oʻrnatish boʻyicha qoʻllanma" : "Инструкция по установке"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-text-secondary">
            <div className="p-4 rounded-[16px] bg-surface-muted/50 border border-border/60 space-y-2">
              <div className="w-7 h-7 rounded-full bg-primary text-white font-bold flex items-center justify-center text-xs">
                1
              </div>
              <h5 className="font-semibold text-text">
                {locale === "uz" ? "APK faylni yuklang" : "Скачайте файл APK"}
              </h5>
              <p className="text-text-muted leading-relaxed">
                {locale === "uz"
                  ? "Tugmani bosib oʻrnatish faylini telefoningizga yuklab oling."
                  : "Нажмите кнопку загрузки и сохраните установочный файл."}
              </p>
            </div>

            <div className="p-4 rounded-[16px] bg-surface-muted/50 border border-border/60 space-y-2">
              <div className="w-7 h-7 rounded-full bg-primary text-white font-bold flex items-center justify-center text-xs">
                2
              </div>
              <h5 className="font-semibold text-text">
                {locale === "uz" ? "Ruxsat bering" : "Разрешите установку"}
              </h5>
              <p className="text-text-muted leading-relaxed">
                {locale === "uz"
                  ? "«Noma'lum manbalardan oʻrnatishga ruxsat bering» oynasida ruxsatni yoqing."
                  : "В настройках безопасности разрешите установку из этого источника."}
              </p>
            </div>

            <div className="p-4 rounded-[16px] bg-surface-muted/50 border border-border/60 space-y-2">
              <div className="w-7 h-7 rounded-full bg-primary text-white font-bold flex items-center justify-center text-xs">
                3
              </div>
              <h5 className="font-semibold text-text">
                {locale === "uz" ? "Savdoni boshlang" : "Начните торговлю"}
              </h5>
              <p className="text-text-muted leading-relaxed">
                {locale === "uz"
                  ? "Ilovani oching, login va parolingiz orqali tizimga kiring."
                  : "Откройте приложение и авторизуйтесь с вашим логином и паролем."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </NavigationLayout>
  );
}
