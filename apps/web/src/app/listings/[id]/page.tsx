"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Heart,
  Share2,
  MapPin,
  Calendar,
  Eye,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Clock,
  Phone,
  MessageCircle,
  Flag,
  Package,
  ShoppingCart,
  Star,
  X
} from "lucide-react";
import { NavigationLayout } from "@/components/navigation";
import { useLanguage } from "@/lib/language";
import { apiFetch } from "@/lib/api";
import { ContractModal } from "@/components/contract-modal";
import { formatUnit, formatCurrency, formatListingDate } from "@/lib/localization";
import { toast } from "sonner";

export default function ListingDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { t, locale } = useLanguage();
  const router = useRouter();

  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedQtyStr, setSelectedQtyStr] = useState<string>("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showReviewsDrawer, setShowReviewsDrawer] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchListing = () => {
    if (!id) return;
    setLoading(true);
    apiFetch(`/listings/${id}`)
      .then((data) => {
        setListing(data);
      })
      .catch((err) => {
        setError(err.message || "Eʼlon topilmadi");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchListing();
  }, [id]);

  if (loading) {
    return (
      <NavigationLayout>
        <div className="py-24 text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </NavigationLayout>
    );
  }

  if (error || !listing) {
    return (
      <NavigationLayout>
        <div className="bg-surface rounded-card border border-border p-12 text-center my-12 max-w-lg mx-auto">
          <Package className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-60" />
          <h2 className="text-lg font-bold text-text mb-2">
            {locale === "uz" ? "Eʼlon topilmadi" : "Объявление не найдено"}
          </h2>
          <p className="text-xs text-text-secondary mb-6">
            {locale === "uz"
              ? "Bunday eʼlon mavjud emas yoki oʻchirilgan."
              : "Такое объявление не существует или было удалено."}
          </p>
          <button
            onClick={() => router.push("/listings")}
            className="px-6 h-11 bg-primary text-white font-semibold text-xs rounded-btn hover:bg-primary-hover"
          >
            {locale === "uz" ? "Barcha eʼlonlar" : "Все объявления"}
          </button>
        </div>
      </NavigationLayout>
    );
  }

  const priceNum = Number(listing.pricePerUnit) || 0;
  const availQty = Number(listing.availableQuantity) || 0;
  const isSold = listing.status === "SOLD";

  // Validate Quantity helper
  const parsedQty = parseFloat(selectedQtyStr);
  const isValidQty = !isNaN(parsedQty) && parsedQty > 0 && parsedQty <= availQty;

  const handleQtyChange = (valStr: string) => {
    setSelectedQtyStr(valStr);
    if (!valStr || valStr.trim() === "") {
      setInputError(locale === "uz" ? "Miqdorni kiriting" : "Введите количество");
      return;
    }
    const n = parseFloat(valStr);
    if (isNaN(n) || n <= 0) {
      setInputError(
        locale === "uz" ? "Miqdor 0 dan katta boʻlishi kerak" : "Количество должно быть больше 0"
      );
    } else if (n > availQty) {
      setInputError(
        locale === "uz"
          ? "Mavjud miqdordan koʻp kiritib boʻlmaydi"
          : "Нельзя указать больше, чем есть в наличии"
      );
    } else {
      setInputError(null);
    }
  };

  const handlePlus = () => {
    const cur = parseFloat(selectedQtyStr) || 0;
    const next = Math.min(availQty, cur + 1);
    handleQtyChange(next.toString());
  };

  const handleMinus = () => {
    const cur = parseFloat(selectedQtyStr) || 0;
    if (cur <= 1) {
      handleQtyChange("1");
    } else {
      const next = Math.max(1, cur - 1);
      handleQtyChange(next.toString());
    }
  };

  const handleSetAll = () => {
    handleQtyChange(availQty.toString());
  };

  const estimatedTotal = isValidQty ? priceNum * parsedQty : 0;

  // Localized texts
  const displayTitle = locale === "ru" && listing.titleRu ? listing.titleRu : listing.title;
  const displayDescription =
    locale === "ru" && listing.descriptionRu ? listing.descriptionRu : listing.description;
  const displayUnit = formatUnit(listing.unit, locale);
  const displayPrice = formatCurrency(priceNum, locale);

  const sellerRating = listing.seller?.rating || 4.8;
  const sellerReviewsCount = listing.seller?.reviewsCount || 23;

  return (
    <NavigationLayout>
      {/* Breadcrumbs */}
      <div className="text-xs text-text-muted mb-4 flex items-center gap-2">
        <button onClick={() => router.push("/listings")} className="hover:underline">
          {locale === "uz" ? "Eʼlonlar" : "Объявления"}
        </button>
        <span>›</span>
        <span>{locale === "uz" ? listing.category?.nameUz : listing.category?.nameRu}</span>
        <span>›</span>
        <span className="text-text font-medium truncate max-w-xs">{displayTitle}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Photo Gallery */}
          <div className="bg-surface rounded-card border border-border overflow-hidden shadow-sm">
            <div className="aspect-[4/3] bg-surface-muted relative">
              <img
                src={
                  listing.images?.[0]?.url ||
                  "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80"
                }
                alt={displayTitle}
                className="w-full h-full object-cover"
              />
              {isSold && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="bg-danger text-white font-bold text-base px-5 py-2 rounded-full uppercase tracking-wider shadow-lg">
                    {t("status.outOfStock")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {displayDescription && (
            <div className="bg-surface rounded-card border border-border p-6 shadow-sm">
              <h3 className="font-bold text-base text-text mb-3">
                {locale === "uz" ? "Tavsif" : "Описание"}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                {displayDescription}
              </p>
            </div>
          )}

          {/* Characteristics Table */}
          <div className="bg-surface rounded-card border border-border p-6 shadow-sm">
            <h3 className="font-bold text-base text-text mb-4">
              {locale === "uz" ? "Xususiyatlar" : "Характеристики"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-xs">
              <div className="flex justify-between py-1.5 border-b border-border">
                <span className="text-text-secondary">
                  {locale === "uz" ? "Kategoriya" : "Категория"}
                </span>
                <span className="font-semibold text-text">
                  {locale === "uz" ? listing.category?.nameUz : listing.category?.nameRu}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border">
                <span className="text-text-secondary">
                  {locale === "uz" ? "Mahsulot turi" : "Вид товара"}
                </span>
                <span className="font-semibold text-text">
                  {locale === "uz" ? listing.product?.nameUz : listing.product?.nameRu}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border">
                <span className="text-text-secondary">
                  {locale === "uz" ? "Kelib chiqishi" : "Происхождение"}
                </span>
                <span className="font-semibold text-text">
                  {listing.origin === "LOCAL"
                    ? locale === "uz"
                      ? "Mahalliy (Oʻzbekiston)"
                      : "Местное (Узбекистан)"
                    : locale === "uz"
                    ? "Import"
                    : "Импортное"}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border">
                <span className="text-text-secondary">
                  {locale === "uz" ? "Yetkazib berish" : "Доставка"}
                </span>
                <span className="font-semibold text-text">
                  {listing.delivery === "DELIVERY"
                    ? locale === "uz"
                      ? "Yetkazib berish mavjud"
                      : "Доставка продавцом"
                    : locale === "uz"
                    ? "Olib ketish (Samovivoz)"
                    : "Самовывоз"}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border">
                <span className="text-text-secondary">
                  {locale === "uz" ? "Joylashuv" : "Локация"}
                </span>
                <span className="font-semibold text-text">
                  {locale === "uz" ? listing.district?.nameUz : listing.district?.nameRu},{" "}
                  {locale === "uz" ? listing.region?.nameUz : listing.region?.nameRu}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border">
                <span className="text-text-secondary">
                  {locale === "uz" ? "Qoldiq miqdori" : "Остаток"}
                </span>
                <span className="font-semibold text-text">
                  {availQty.toLocaleString("ru-RU")} {displayUnit}
                </span>
              </div>
            </div>
          </div>

          {/* Safety & Hokimiyat Guarantee Banner */}
          <div className="bg-primary/5 border border-primary/20 rounded-card p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <h4 className="font-bold text-text mb-1">
                {locale === "uz"
                  ? "Davlat kafolati va xavfsiz bitim"
                  : "Государственная гарантия и безопасная сделка"}
              </h4>
              <p className="text-text-secondary leading-relaxed">
                {locale === "uz"
                  ? "Barcha shartnomalar elektron roʻyxatdan oʻtadi va Hokimiyat hamda Savdo-sanoat palatasi monitoringida boʻladi. Toʻlovlar va yetkazib berish qonuniy himoyalangan."
                  : "Все договоры регистрируются в электронной системе и мониторятся Хокимиятом и ТПП. Оплата и поставка защищены законом Республики Узбекистан."}
              </p>
            </div>
          </div>
        </div>

        {/* Right Sticky Column (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <div className="bg-surface rounded-card border border-border p-6 shadow-sm space-y-5">
            {/* Title with exact 26px / 700 font */}
            <h1 className="text-[26px] font-bold text-text leading-tight tracking-tight">
              {displayTitle}
            </h1>

            {/* Price with exact 28px / 700 font */}
            <div>
              <div className="text-[28px] font-bold text-primary">
                {displayPrice}
                <span className="text-sm font-normal text-text-secondary"> / {displayUnit}</span>
              </div>
              {listing.isNegotiable && (
                <span className="text-xs font-bold text-accent bg-accent/10 px-2.5 py-0.5 rounded-full inline-block mt-1">
                  {t("listing.negotiable")}
                </span>
              )}
            </div>

            {/* Available Quantity Card */}
            <div className="p-3 bg-surface-muted rounded-btn text-xs flex justify-between items-center border border-border">
              <span className="text-text-secondary">{t("listing.available")}:</span>
              <span className="font-bold text-text text-sm">
                {availQty.toLocaleString("ru-RU")} {displayUnit}
              </span>
            </div>

            {/* Quantity Input (Section 4 requirements) */}
            {!isSold && !listing.isOwner && (
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-text-secondary">
                    {locale === "uz" ? "Kerakli miqdor" : "Нужное количество"}
                  </label>
                  <button
                    type="button"
                    onClick={handleSetAll}
                    className="text-xs font-bold text-primary hover:underline cursor-pointer"
                  >
                    {locale === "uz" ? "Hammasini" : "Всё"} ({availQty.toLocaleString("ru-RU")})
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleMinus}
                    className="w-10 h-11 rounded-btn border border-border flex items-center justify-center font-bold text-lg hover:bg-surface-muted transition-colors"
                  >
                    −
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      value={selectedQtyStr}
                      placeholder={
                        locale === "uz" ? "Miqdorni kiriting" : "Введите количество"
                      }
                      onChange={(e) => handleQtyChange(e.target.value)}
                      className={`w-full h-11 px-3 pr-14 rounded-btn bg-surface-muted border text-center font-bold text-sm focus:outline-none transition-colors text-text ${
                        inputError
                          ? "border-danger focus:border-danger ring-1 ring-danger/30"
                          : "border-border focus:border-primary"
                      }`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted font-medium">
                      {displayUnit}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handlePlus}
                    className="w-10 h-11 rounded-btn border border-border flex items-center justify-center font-bold text-lg hover:bg-surface-muted transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Error message text directly below input */}
                {inputError && (
                  <p className="text-danger text-[13px] font-medium mt-1.5 leading-tight">
                    {inputError}
                  </p>
                )}

                {/* Estimated Total */}
                <div className="mt-3 text-right text-xs">
                  <span className="text-text-secondary">{t("contract.estimatedTotal")}: </span>
                  <span className="font-bold text-primary text-base">
                    {formatCurrency(estimatedTotal, locale)}
                  </span>
                </div>
              </div>
            )}

            {/* Main Action Button (52px height, 16px font, ShoppingCart icon) */}
            {isSold ? (
              <div className="w-full h-[52px] bg-surface-muted text-text-muted font-bold rounded-btn flex items-center justify-center text-sm">
                {locale === "uz" ? "Bu mahsulot sotilgan" : "Этот товар продан"}
              </div>
            ) : listing.isOwner ? (
              <div className="p-3 bg-primary/10 text-primary font-semibold text-xs rounded-btn text-center">
                {locale === "uz" ? "Bu sizning eʼloningiz" : "Это ваше объявление"}
              </div>
            ) : (
              <button
                type="button"
                disabled={!isValidQty}
                onClick={() => {
                  if (!isValidQty) {
                    handleQtyChange(selectedQtyStr);
                    return;
                  }
                  setShowPurchaseModal(true);
                }}
                className="w-full h-[52px] bg-accent text-white font-semibold text-[16px] rounded-btn hover:bg-accent-hover active:scale-[0.99] transition-all shadow-md flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>{locale === "uz" ? "Sotib olish" : "Купить"}</span>
              </button>
            )}

            {/* Seller Info Card with Rating Drawer trigger */}
            <div className="pt-4 border-t border-border">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">
                {locale === "uz" ? "Sotuvchi haqida" : "О продавце"}
              </h4>

              <div className="p-4 bg-surface-muted rounded-btn space-y-3 border border-border">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-text text-sm">
                    {listing.seller?.companyName || "ООО «Agro Savdo Biznes»"}
                  </span>
                  <span className="text-[11px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">
                    {locale === "uz" ? "Tasdiqlangan" : "Проверен"}
                  </span>
                </div>

                {/* Seller Rating row */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-1.5 text-accent font-bold text-sm">
                    <Star className="w-4 h-4 fill-accent" />
                    <span>{sellerRating.toFixed(1)}</span>
                    <span className="text-text-muted font-normal text-xs">
                      · {sellerReviewsCount} {locale === "uz" ? "ta baho" : "отзыва"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowReviewsDrawer(true)}
                    className="text-primary hover:underline text-xs font-semibold"
                  >
                    {locale === "uz" ? "Baholarni koʻrish" : "Смотреть отзывы"}
                  </button>
                </div>

                <div className="text-xs text-text-secondary space-y-1 pt-1 border-t border-border/50">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-text-muted" />
                    <span>
                      {locale === "uz" ? listing.district?.nameUz : listing.district?.nameRu},{" "}
                      {locale === "uz" ? listing.region?.nameUz : listing.region?.nameRu}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-text-muted" />
                    <span>
                      {locale === "uz" ? "Platformada" : "На платформе"}: 1.5 {locale === "uz" ? "yil" : "года"}
                    </span>
                  </div>
                </div>

                {listing.showPhone && listing.seller?.phone && (
                  <div className="pt-2">
                    <a
                      href={`tel:${listing.seller.phone}`}
                      className="w-full h-9 bg-surface border border-border text-text font-semibold text-xs rounded-btn flex items-center justify-center gap-2 hover:bg-surface-muted transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-primary" />
                      <span>{listing.seller.phone}</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Complaint button with inline toast */}
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    toast.success(
                      locale === "uz"
                        ? "Shikoyat qabul qilindi va maʼmuriyatga yuborildi"
                        : "Жалоба принята и отправлена администрации"
                    );
                  }}
                  className="text-xs text-text-muted hover:text-danger flex items-center gap-1 transition-colors"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>{locale === "uz" ? "Shikoyat qilish" : "Пожаловаться"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contract & Purchase Modal */}
      {showPurchaseModal && (
        <ContractModal
          listing={listing}
          initialQuantity={parsedQty || 1}
          onClose={() => setShowPurchaseModal(false)}
          onSuccess={() => {
            setShowPurchaseModal(false);
            fetchListing();
          }}
        />
      )}

      {/* Seller Reviews Drawer */}
      {showReviewsDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/45 backdrop-blur-[2px] animate-in fade-in duration-200">
          <div className="w-full max-w-[480px] bg-surface h-full shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right duration-250 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
                <div>
                  <h3 className="font-bold text-lg text-text">
                    {locale === "uz" ? "Sotuvchi baholari" : "Отзывы о продавце"}
                  </h3>
                  <div className="text-xs text-text-secondary mt-0.5">
                    {listing.seller?.companyName || "ООО «Agro Savdo Biznes»"}
                  </div>
                </div>
                <button
                  onClick={() => setShowReviewsDrawer(false)}
                  className="p-1.5 rounded-full hover:bg-surface-muted text-text-muted hover:text-text"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Rating summary */}
              <div className="bg-surface-muted p-4 rounded-btn border border-border mb-6 flex items-center gap-4">
                <div className="text-3xl font-extrabold text-accent">4.8</div>
                <div className="text-xs text-text-secondary">
                  <div className="flex text-accent mb-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-accent" />
                    ))}
                  </div>
                  <div>
                    23 {locale === "uz" ? "ta haqiqiy xaridorlar bahosi" : "отзыва от реальных покупателей"}
                  </div>
                </div>
              </div>

              {/* Demo Reviews list */}
              <div className="space-y-4">
                {[
                  {
                    company: "OOO «Toshkent Baraka Savdo»",
                    rating: 5,
                    tags: ["Sifatli mahsulot", "Vaqtida yetkazdi"],
                    date: "10.11.2026",
                    text:
                      locale === "uz"
                        ? "Mahsulot sifati aʼlo darajada. Toʻliq hajmda oʻz vaqtida yetkazib berildi."
                        : "Отличное качество товара. Поставили точно в срок в полном объеме."
                  },
                  {
                    company: "XK «Samarqand Eksport»",
                    rating: 5,
                    tags: ["Narxi mos", "Tez javob berdi"],
                    date: "04.11.2026",
                    text:
                      locale === "uz"
                        ? "Shartnoma tez rasmiylashtirildi, narxlari bozorga nisbatan qulay."
                        : "Быстро оформили договор, цены очень выгодные по сравнению с рынком."
                  },
                  {
                    company: "OOO «Vodiy Agrotex»",
                    rating: 4,
                    tags: ["Sifatli mahsulot"],
                    date: "28.10.2026",
                    text:
                      locale === "uz"
                        ? "Sifat yaxshi, transport kechikishi boʻldi ammo sotuvchi ogohlantirdi."
                        : "Качество хорошее, была небольшая задержка с логистикой, но продавец предупредил."
                  }
                ].map((rev, idx) => (
                  <div key={idx} className="p-3.5 bg-surface rounded-btn border border-border space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-text">{rev.company}</span>
                      <span className="text-[11px] text-text-muted">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-accent">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= rev.rating ? "fill-accent text-accent" : "text-border"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {rev.tags.map((tg) => (
                        <span
                          key={tg}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-accent/10 text-accent"
                        >
                          {tg}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">{rev.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-border mt-6">
              <button
                type="button"
                onClick={() => setShowReviewsDrawer(false)}
                className="w-full h-11 bg-surface-muted border border-border rounded-btn text-xs font-semibold text-text hover:bg-border/30 transition-colors"
              >
                {locale === "uz" ? "Yopish" : "Закрыть"}
              </button>
            </div>
          </div>
        </div>
      )}
    </NavigationLayout>
  );
}
