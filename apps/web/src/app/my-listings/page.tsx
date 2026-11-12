"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "../../lib/language";
import { useAuth } from "../../lib/auth";
import { apiFetch } from "../../lib/api";
import { NavigationLayout } from "../../components/navigation";
import { Package, MoreVertical, Edit, Archive, Trash2, Eye, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function MyListingsPage() {
  const { locale, t } = useLanguage();
  const { user } = useAuth();

  const [tab, setTab] = useState<"ACTIVE" | "SOLD" | "ARCHIVED" | "EXPIRED">("ACTIVE");
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal for Mark Sale
  const [saleModalListing, setSaleModalListing] = useState<any | null>(null);
  const [saleQty, setSaleQty] = useState("");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const fetchMyListings = () => {
    setLoading(true);
    apiFetch("/listings?limit=50")
      .then((data) => {
        const filtered = (data.items || []).filter((item: any) => {
          if (tab === "ACTIVE") return item.status === "ACTIVE";
          if (tab === "SOLD") return item.status === "SOLD";
          return item.status === tab;
        });
        setListings(filtered);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMyListings();
  }, [tab]);

  const handleConfirmSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!saleModalListing || !saleQty) return;

    try {
      await apiFetch(`/listings/${saleModalListing.id}/sales`, {
        method: "POST",
        body: JSON.stringify({ quantity: parseFloat(saleQty) })
      });
      toast.success(locale === "uz" ? "Sotuv belgilandi!" : "Продажа отмечена!");
      setSaleModalListing(null);
      setSaleQty("");
      fetchMyListings();
    } catch (err: any) {
      toast.error(err.message || (locale === "uz" ? "Xatolik yuz berdi" : "Произошла ошибка"));
    }
  };

  return (
    <NavigationLayout>
      <div className="max-w-5xl mx-auto space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-text mb-0.5">
              {locale === "uz" ? "Mening eʼlonlarim" : "Мои объявления"}
            </h1>
            <p className="text-xs text-text-secondary">
              {locale === "uz" ? "Barcha joylashtirgan tovarlaringiz va ularning holati" : "Управление вашими размещёнными товарами"}
            </p>
          </div>
          <Link
            href="/listings/new"
            className="h-11 px-5 bg-primary text-white font-bold text-xs rounded-[14px] hover:bg-primary-hover flex items-center justify-center gap-2 shadow-sm self-start sm:self-center active:scale-95 transition-all"
          >
            + {locale === "uz" ? "Yangi eʼlon" : "Новое объявление"}
          </Link>
        </div>

        {/* Tab switcher: horizontally scrollable on mobile (Section 5.3) */}
        <div className="flex border-b border-border overflow-x-auto no-scrollbar gap-2">
          {(["ACTIVE", "SOLD", "ARCHIVED", "EXPIRED"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setTab(s)}
              className={`pb-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap shrink-0 ${
                tab === s ? "border-primary text-primary" : "border-transparent text-text-secondary hover:text-text"
              }`}
            >
              {s === "ACTIVE" && (locale === "uz" ? "Faol (4)" : "Активные (4)")}
              {s === "SOLD" && (locale === "uz" ? "Sotilgan (1)" : "Проданные (1)")}
              {s === "ARCHIVED" && (locale === "uz" ? "Arxiv (0)" : "Архив (0)")}
              {s === "EXPIRED" && (locale === "uz" ? "Muddati tugagan (0)" : "Истёк срок (0)")}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-surface rounded-card border border-border p-12 text-center">
            <Package className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-60" />
            <p className="text-xs text-text-secondary">
              {locale === "uz" ? "Bu boʻlimda eʼlonlar yoʻq" : "Объявлений в этом разделе нет"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {listings.map((item) => {
              const formattedPrice = Number(item.pricePerUnit).toLocaleString("ru-RU");
              const formattedAvail = Number(item.availableQuantity).toLocaleString("ru-RU");
              const formattedTotal = Number(item.totalQuantity).toLocaleString("ru-RU");

              return (
                <div
                  key={item.id}
                  className="bg-surface rounded-[18px] border border-border p-3.5 sm:p-4 flex flex-col justify-between gap-3 shadow-xs relative"
                >
                  {/* Top: Photo & Info */}
                  <div className="flex items-start gap-3.5 min-w-0 pr-8 sm:pr-0">
                    <img
                      src={item.images?.[0]?.url || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80"}
                      alt=""
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-[12px] bg-surface-muted shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-sm text-text line-clamp-2 leading-tight">
                        {item.title}
                      </h3>
                      <div className="text-primary font-bold text-sm sm:text-base mt-1">
                        {formattedPrice} soʻm / {item.unit}
                      </div>
                      <div className="text-xs text-text-muted mt-0.5">
                        {locale === "uz" ? "Qoldiq" : "Остаток"}: {formattedAvail} {item.unit} ({locale === "uz" ? "Jami" : "Всего"}: {formattedTotal} {item.unit})
                      </div>
                    </div>
                  </div>

                  {/* ⋯ Menu Top Right (Section 5.3) */}
                  <div className="absolute top-3 right-3">
                    <button
                      type="button"
                      onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-text-secondary hover:text-text hover:bg-surface-muted transition-colors"
                      aria-label="Qoʻshimcha amallar"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {activeMenuId === item.id && (
                      <div className="absolute right-0 mt-1 w-44 bg-surface border border-border rounded-[14px] shadow-xl z-20 p-1.5 space-y-1 text-xs">
                        <Link
                          href={`/listings/${item.id}/edit`}
                          onClick={() => setActiveMenuId(null)}
                          className="flex items-center gap-2 px-3 py-2 rounded-btn hover:bg-surface-muted text-text"
                        >
                          <Edit className="w-3.5 h-3.5 text-text-muted" />
                          <span>{locale === "uz" ? "Tahrirlash" : "Редактировать"}</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null);
                            toast.success(locale === "uz" ? "Arxivga oʻtkazildi" : "Перемещено в архив");
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-btn hover:bg-surface-muted text-text text-left"
                        >
                          <Archive className="w-3.5 h-3.5 text-text-muted" />
                          <span>{locale === "uz" ? "Arxivlash" : "Архивировать"}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Bottom: Action buttons (Section 5.3: 50% width on mobile, 44px height) */}
                  <div className="flex items-center gap-2 pt-1 border-t border-border/60">
                    <Link
                      href={`/listings/${item.id}`}
                      className="flex-1 h-11 px-3 rounded-[12px] border border-border text-xs font-semibold hover:bg-surface-muted flex items-center justify-center gap-1.5 text-text active:scale-98 transition-all"
                    >
                      <Eye className="w-4 h-4" />
                      <span>{locale === "uz" ? "Koʻrish" : "Просмотр"}</span>
                    </Link>

                    {tab === "ACTIVE" && (
                      <button
                        type="button"
                        onClick={() => setSaleModalListing(item)}
                        className="flex-1 h-11 px-3 bg-accent text-white rounded-[12px] text-xs font-bold hover:bg-accent-hover shadow-xs flex items-center justify-center gap-1.5 active:scale-98 transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{locale === "uz" ? "Sotuvni belgilash" : "Отметить продажу"}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Mark Sale */}
        {saleModalListing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-surface rounded-[20px] border border-border p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95">
              <h3 className="font-bold text-base text-text mb-2">
                {locale === "uz" ? "Sotuvni belgilash" : "Отметить продажу"}
              </h3>
              <p className="text-xs text-text-secondary mb-4">
                {saleModalListing.title} · {locale === "uz" ? "Mavjud" : "В наличии"}: {Number(saleModalListing.availableQuantity).toLocaleString("ru-RU")} {saleModalListing.unit}
              </p>

              <form onSubmit={handleConfirmSale} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-text-secondary block mb-1">
                    {locale === "uz" ? "Qancha sotildi?" : "Сколько продано?"} ({saleModalListing.unit})
                  </label>
                  <input
                    type="number"
                    required
                    max={Number(saleModalListing.availableQuantity)}
                    value={saleQty}
                    onChange={(e) => setSaleQty(e.target.value)}
                    placeholder="100"
                    className="w-full h-11 px-3 rounded-[12px] bg-surface-muted border border-border text-sm focus:outline-none focus:border-primary text-text font-bold"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSaleQty(String(saleModalListing.availableQuantity));
                    }}
                    className="px-3 h-10 border border-border rounded-[10px] text-xs font-semibold hover:bg-surface-muted"
                  >
                    {locale === "uz" ? "Hammasi sotildi" : "Продано всё"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSaleModalListing(null)}
                    className="px-4 h-10 rounded-[10px] text-xs font-semibold text-text-secondary hover:bg-surface-muted"
                  >
                    {t("auth.cancel")}
                  </button>
                  <button
                    type="submit"
                    className="px-5 h-10 bg-primary text-white text-xs font-bold rounded-[10px] hover:bg-primary-hover shadow-xs"
                  >
                    {locale === "uz" ? "Tasdiqlash" : "Подтвердить"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </NavigationLayout>
  );
}
