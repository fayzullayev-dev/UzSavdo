"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "../../lib/language";
import { useAuth } from "../../lib/auth";
import { apiFetch } from "../../lib/api";
import { NavigationLayout } from "../../components/navigation";
import { Package, MoreVertical, Edit, CheckCircle2, Archive, Trash2, Eye } from "lucide-react";
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

  const fetchMyListings = () => {
    setLoading(true);
    apiFetch("/listings?limit=50")
      .then((data) => {
        // Filter for demo seller listings
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
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text mb-1">
              {locale === "uz" ? "Mening eʼlonlarim" : "Мои объявления"}
            </h1>
            <p className="text-xs text-text-secondary">
              {locale === "uz" ? "Barcha joylashtirgan tovarlaringiz va ularning holati" : "Управление вашими размещёнными товарами"}
            </p>
          </div>
          <Link
            href="/listings/new"
            className="h-11 px-5 bg-accent text-white font-bold text-xs rounded-btn hover:bg-accent-hover flex items-center justify-center gap-2 shadow-sm self-start sm:self-center"
          >
            + {locale === "uz" ? "Yangi eʼlon" : "Новое объявление"}
          </Link>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-border">
          {(["ACTIVE", "SOLD", "ARCHIVED", "EXPIRED"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setTab(s)}
              className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all ${
                tab === s ? "border-primary text-primary" : "border-transparent text-text-secondary hover:text-text"
              }`}
            >
              {s === "ACTIVE" && (locale === "uz" ? "Faol" : "Активные")}
              {s === "SOLD" && (locale === "uz" ? "Sotilgan" : "Проданные")}
              {s === "ARCHIVED" && (locale === "uz" ? "Arxiv" : "Архив")}
              {s === "EXPIRED" && (locale === "uz" ? "Muddati tugagan" : "Истёк срок")}
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
            {listings.map((item) => (
              <div
                key={item.id}
                className="bg-surface rounded-card border border-border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={item.images?.[0]?.url || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80"}
                    alt=""
                    className="w-16 h-14 object-cover rounded-btn shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-xs text-text truncate max-w-sm">{item.title}</h3>
                    <div className="text-primary font-bold text-xs mt-0.5">
                      {Number(item.pricePerUnit).toLocaleString("ru-RU")} soʻm / {item.unit}
                    </div>
                    <div className="text-[11px] text-text-muted mt-0.5">
                      {locale === "uz" ? "Qoldiq" : "Остаток"}: {Number(item.availableQuantity).toLocaleString("ru-RU")} {item.unit} (Jami: {Number(item.totalQuantity)} {item.unit})
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/listings/${item.id}`}
                    className="h-9 px-3 rounded-btn border border-border text-xs font-semibold hover:bg-surface-muted flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    {locale === "uz" ? "Koʻrish" : "Просмотр"}
                  </Link>

                  {tab === "ACTIVE" && (
                    <button
                      onClick={() => setSaleModalListing(item)}
                      className="h-9 px-3 bg-accent text-white rounded-btn text-xs font-semibold hover:bg-accent-hover shadow-xs"
                    >
                      {locale === "uz" ? "Sotuvni belgilash" : "Отметить продажу"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Mark Sale */}
        {saleModalListing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-surface rounded-modal border border-border p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95">
              <h3 className="font-bold text-base text-text mb-2">
                {locale === "uz" ? "Sotuvni belgilash" : "Отметить продажу"}
              </h3>
              <p className="text-xs text-text-secondary mb-4">
                {saleModalListing.title} · {locale === "uz" ? "Mavjud" : "В наличии"}: {Number(saleModalListing.availableQuantity)} {saleModalListing.unit}
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
                    className="w-full h-11 px-3 rounded-btn bg-surface-muted border border-border text-sm focus:outline-none focus:border-primary text-text font-bold"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSaleQty(String(saleModalListing.availableQuantity));
                    }}
                    className="px-3 h-10 border border-border rounded-btn text-xs font-semibold hover:bg-surface-muted"
                  >
                    {locale === "uz" ? "Hammasi sotildi" : "Продано всё"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSaleModalListing(null)}
                    className="px-4 h-10 rounded-btn text-xs font-semibold text-text-secondary hover:bg-surface-muted"
                  >
                    {t("auth.cancel")}
                  </button>
                  <button
                    type="submit"
                    className="px-5 h-10 bg-primary text-white text-xs font-bold rounded-btn hover:bg-primary-hover shadow-xs"
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