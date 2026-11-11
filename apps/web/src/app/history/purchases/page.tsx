"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "../../../lib/language";
import { apiFetch } from "../../../lib/api";
import { NavigationLayout } from "../../../components/navigation";
import { ShoppingBag, Star, CheckCircle2 } from "lucide-react";
import { ReviewDialog } from "../../../components/review-dialog";
import { formatCurrency, formatUnit } from "../../../lib/localization";
import { toast } from "sonner";

export default function PurchasesHistoryPage() {
  const { locale } = useLanguage();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderForReview, setSelectedOrderForReview] = useState<any | null>(null);

  const fetchPurchases = () => {
    setLoading(true);
    apiFetch("/orders?role=buyer")
      .then((data) => {
        // Section 5.2: Only Yakunlandi (COMPLETED) orders in Xaridlar tarixi
        const completed = (data || []).filter(
          (o: any) => o.status === "COMPLETED" || o.status === "YAKUNLANDI"
        );
        setOrders(completed);
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  return (
    <NavigationLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text mb-1">
            {locale === "uz" ? "Xaridlar tarixi" : "История покупок"}
          </h1>
          <p className="text-xs text-text-secondary">
            {locale === "uz"
              ? "Yakunlangan xaridlar va muvaffaqiyatli bitimlar roʻyxati"
              : "Список завершенных покупок и успешно закрытых сделок"}
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-surface rounded-card border border-border p-12 text-center">
            <ShoppingBag className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-60" />
            <p className="text-xs text-text-secondary">
              {locale === "uz"
                ? "Hozircha yakunlangan xaridlar mavjud emas"
                : "Завершенных покупок пока нет"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => {
              const displayTitle =
                locale === "ru" && o.listing?.titleRu ? o.listing.titleRu : o.listing?.title;
              const unit = formatUnit(o.listing?.unit, locale);
              const hasReview = o.hasReview || o.review;

              return (
                <div
                  key={o.id}
                  className="bg-surface rounded-card border border-border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
                >
                  <div className="flex gap-4 items-center">
                    <img
                      src={
                        o.listing?.images?.[0]?.url ||
                        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=120&auto=format&fit=crop&q=80"
                      }
                      alt={displayTitle}
                      className="w-16 h-16 object-cover rounded-btn shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-xs text-primary">
                          {o.contract?.number || "№ 0001"}
                        </span>
                        <span className="text-[10px] bg-success/15 text-success font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {locale === "uz" ? "Yakunlandi" : "Завершён"}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-text">{displayTitle}</h3>
                      <p className="text-xs text-text-secondary mt-1">
                        {locale === "uz" ? "Sotuvchi:" : "Продавец:"}{" "}
                        <span className="font-semibold text-text">
                          {o.seller?.companyName || "Agro Biznes"}
                        </span>{" "}
                        · {Number(o.quantity).toLocaleString("ru-RU")} {unit}
                      </p>
                    </div>
                  </div>

                  {hasReview ? (
                    <div className="flex items-center gap-1.5 text-accent font-semibold text-xs px-3 py-2 bg-accent/10 rounded-btn">
                      <Star className="w-4 h-4 fill-accent" />
                      <span>{locale === "uz" ? "Baholandi" : "Оценено"}</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedOrderForReview({
                          id: o.id,
                          contractNumber: o.contract?.number,
                          listingTitle: displayTitle,
                          sellerCompany: o.seller?.companyName,
                          quantity: Number(o.quantity),
                          unit,
                          imageUrl: o.listing?.images?.[0]?.url
                        })
                      }
                      className="h-10 px-4 bg-accent text-white font-semibold text-xs rounded-btn hover:bg-accent-hover flex items-center gap-1.5 self-start sm:self-center shadow-sm cursor-pointer transition-colors"
                    >
                      <Star className="w-3.5 h-3.5" />
                      <span>{locale === "uz" ? "Baho berish" : "Оценить"}</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Review Dialog modal */}
      {selectedOrderForReview && (
        <ReviewDialog
          isOpen={true}
          order={selectedOrderForReview}
          onClose={() => setSelectedOrderForReview(null)}
          onSuccess={() => {
            toast.success(
              locale === "uz"
                ? "Rahmat! Bahoyingiz qabul qilindi"
                : "Спасибо! Ваша оценка принята"
            );
            fetchPurchases();
          }}
        />
      )}
    </NavigationLayout>
  );
}
