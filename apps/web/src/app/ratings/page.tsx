"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "../../lib/language";
import { apiFetch } from "../../lib/api";
import { NavigationLayout } from "../../components/navigation";
import {
  Star,
  MessageSquare,
  Award,
  TrendingUp,
  MapPin,
  CheckCircle2,
  ChevronRight,
  Filter,
  User,
  Building2,
  ExternalLink
} from "lucide-react";
import { ReviewDialog } from "../../components/review-dialog";
import { FormDialog } from "../../components/dialogs";
import { toast } from "sonner";
import { formatListingDate } from "../../lib/localization";

export default function RatingsPage() {
  const { locale, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<
    "my" | "about_me" | "my_reviews" | "pending" | "top_sellers"
  >("my");

  const [loading, setLoading] = useState(false);
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [selectedOrderForReview, setSelectedOrderForReview] = useState<any | null>(null);

  // Reply dialog state
  const [replyReviewId, setReplyReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);

  // Filter for Top Sellers
  const [topRegionFilter, setTopRegionFilter] = useState("all");

  useEffect(() => {
    // Fetch pending completed orders
    apiFetch("/orders?role=buyer")
      .then((data) => {
        const completed = (data || []).filter(
          (o: any) => (o.status === "COMPLETED" || o.status === "YAKUNLANDI") && !o.hasReview
        );
        setPendingOrders(completed);
      })
      .catch(() => {});
  }, []);

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    setReplyLoading(true);
    setTimeout(() => {
      setReplyLoading(false);
      setReplyReviewId(null);
      setReplyText("");
      toast.success(
        locale === "uz" ? "Javobingiz muvaffaqiyatli saqlandi!" : "Ваш ответ успешно сохранён!"
      );
    }, 400);
  };

  const topSellersList = [
    {
      company: "OOO «Samarqand Agro Fayz»",
      regionUz: "Samarqand viloyati",
      regionRu: "Самаркандская область",
      rating: 4.95,
      reviewsCount: 84,
      dealsCount: 142,
      categoryUz: "Meva va sabzavotlar",
      categoryRu: "Фрукты и овощи"
    },
    {
      company: "«Bekobod Metallsanoat» MChJ",
      regionUz: "Toshkent viloyati",
      regionRu: "Ташкентская область",
      rating: 4.92,
      reviewsCount: 65,
      dealsCount: 118,
      categoryUz: "Qurilish materiallari",
      categoryRu: "Строительные материалы"
    },
    {
      company: "XK «Andijon Don Hosili»",
      regionUz: "Andijon viloyati",
      regionRu: "Андижанская область",
      rating: 4.88,
      reviewsCount: 52,
      dealsCount: 96,
      categoryUz: "Don va dukkaklilar",
      categoryRu: "Зерновые и бобовые"
    },
    {
      company: "OOO «Buxoro Baraka Tekstil»",
      regionUz: "Buxoro viloyati",
      regionRu: "Бухарская область",
      rating: 4.85,
      reviewsCount: 47,
      dealsCount: 89,
      categoryUz: "Toʻqimachilik",
      categoryRu: "Текстиль"
    },
    {
      company: "«Surxon Agro Eksport» XK",
      regionUz: "Surxondaryo viloyati",
      regionRu: "Сурхандарьинская область",
      rating: 4.82,
      reviewsCount: 39,
      dealsCount: 74,
      categoryUz: "Sabzavotlar",
      categoryRu: "Овощи"
    }
  ];

  return (
    <NavigationLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text mb-1">
            {locale === "uz" ? "Reyting va baholar" : "Рейтинг и отзывы"}
          </h1>
          <p className="text-xs text-text-secondary">
            {locale === "uz"
              ? "Tadbirkorlik faoliyatingiz nufuzi, mijozlar baholari va eng yaxshi sotuvchilar"
              : "Репутация бизнеса, отзывы клиентов и лучшие продавцы платформы"}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-border overflow-x-auto gap-2">
          {[
            { id: "my", nameUz: "Mening reytingim", nameRu: "Мой рейтинг" },
            { id: "about_me", nameUz: "Menga qoldirilgan baholar", nameRu: "Отзывы обо мне" },
            { id: "my_reviews", nameUz: "Men qoldirgan baholar", nameRu: "Мои отзывы" },
            {
              id: "pending",
              nameUz: `Kutilayotgan baholar ${pendingOrders.length > 0 ? `(${pendingOrders.length})` : ""}`,
              nameRu: `Ожидают оценки ${pendingOrders.length > 0 ? `(${pendingOrders.length})` : ""}`
            },
            { id: "top_sellers", nameUz: "Eng yaxshi sotuvchilar", nameRu: "Лучшие продавцы" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-text-secondary hover:text-text"
              }`}
            >
              {locale === "uz" ? tab.nameUz : tab.nameRu}
            </button>
          ))}
        </div>

        {/* Tab 1: Mening reytingim */}
        {activeTab === "my" && (
          <div className="space-y-6">
            <div className="bg-surface rounded-card border border-border p-6 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left Score Box */}
              <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-border">
                <div className="text-5xl font-extrabold text-accent mb-2">4.8</div>
                <div className="flex text-accent mb-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-5 h-5 fill-accent" />
                  ))}
                </div>
                <div className="text-xs text-text-muted">
                  23 {locale === "uz" ? "ta haqiqiy xaridor bahosi" : "оценки покупателей"}
                </div>
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                  <Award className="w-4 h-4" />
                  <span>
                    {locale === "uz"
                      ? "Samarqand viloyatida 12-oʻrin"
                      : "12-е место в Самаркандской области"}
                  </span>
                </div>
              </div>

              {/* Middle Breakdown */}
              <div className="md:col-span-5 space-y-2 text-xs">
                {[
                  { star: 5, count: 18, pct: 78 },
                  { star: 4, count: 4, pct: 17 },
                  { star: 3, count: 1, pct: 5 },
                  { star: 2, count: 0, pct: 0 },
                  { star: 1, count: 0, pct: 0 }
                ].map((item) => (
                  <div key={item.star} className="flex items-center gap-2">
                    <span className="w-6 font-bold text-text-secondary flex items-center gap-0.5">
                      {item.star} <Star className="w-3 h-3 fill-accent text-accent" />
                    </span>
                    <div className="flex-1 h-2.5 bg-surface-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all duration-500"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-text-muted text-[11px]">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>

              {/* Right Stats */}
              <div className="md:col-span-3 space-y-4 text-xs">
                <div className="p-3 bg-surface-muted rounded-btn border border-border">
                  <div className="text-text-secondary mb-1">
                    {locale === "uz" ? "Javob berish darajasi" : "Уровень ответов"}
                  </div>
                  <div className="text-lg font-bold text-success">98.5%</div>
                </div>
                <div className="p-3 bg-surface-muted rounded-btn border border-border">
                  <div className="text-text-secondary mb-1">
                    {locale === "uz" ? "Muvaffaqiyatli bitimlar" : "Завершённые сделки"}
                  </div>
                  <div className="text-lg font-bold text-primary">34 ta</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Menga qoldirilgan baholar */}
        {activeTab === "about_me" && (
          <div className="space-y-4">
            {[
              {
                id: "rev-1",
                company: "OOO «Toshkent Baraka Savdo»",
                rating: 5,
                tags: ["Sifatli mahsulot", "Vaqtida yetkazdi"],
                date: "10.11.2026",
                product: "Gala navli sara kartoshka, Samarqand 2026",
                text:
                  locale === "uz"
                    ? "Mahsulot sifati aʼlo darajada. Toʻliq hajmda oʻz vaqtida yetkazib berildi. Rahmat!"
                    : "Отличное качество товара. Поставили точно в срок в полном объеме. Спасибо!",
                reply: null
              },
              {
                id: "rev-2",
                company: "XK «Samarqand Eksport»",
                rating: 5,
                tags: ["Narxi mos", "Tez javob berdi"],
                date: "04.11.2026",
                product: "Eksportbop qizil va sariq piyoz, sifat kafolati",
                text:
                  locale === "uz"
                    ? "Shartnoma tez rasmiylashtirildi, narxlari bozorga nisbatan qulay."
                    : "Быстро оформили договор, цены очень выгодные по сравнению с рынком.",
                reply:
                  locale === "uz"
                    ? "Hamkorlik uchun tashakkur! Har doim xizmatingizdamiz."
                    : "Спасибо за сотрудничество! Всегда рады помочь."
              }
            ].map((rev) => (
              <div key={rev.id} className="bg-surface rounded-card border border-border p-5 space-y-3 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-text text-sm">{rev.company}</span>
                    <span className="text-[11px] text-text-muted">· {rev.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-accent">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${s <= rev.rating ? "fill-accent text-accent" : "text-border"}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="text-xs text-text-muted">
                  {locale === "uz" ? "Tovar" : "Товар"}: <span className="font-semibold text-text">{rev.product}</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {rev.tags.map((tg) => (
                    <span
                      key={tg}
                      className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-accent/10 text-accent"
                    >
                      {tg}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-text leading-relaxed">{rev.text}</p>

                {rev.reply ? (
                  <div className="p-3 bg-surface-muted rounded-btn border-l-4 border-primary text-xs space-y-1">
                    <div className="font-bold text-primary">
                      {locale === "uz" ? "Sizning javobingiz:" : "Ваш ответ:"}
                    </div>
                    <div className="text-text-secondary">{rev.reply}</div>
                  </div>
                ) : (
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setReplyReviewId(rev.id)}
                      className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{locale === "uz" ? "Javob berish" : "Ответить"}</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Men qoldirgan baholar */}
        {activeTab === "my_reviews" && (
          <div className="space-y-4">
            <div className="bg-surface rounded-card border border-border p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-text">«Bekobod Sement Zavodi» AJ</h4>
                  <p className="text-xs text-text-muted">M-500 sementi, 50 kg qoplarda · 01.11.2026</p>
                </div>
                <div className="flex items-center gap-1 text-accent">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-accent" />
                  ))}
                </div>
              </div>
              <div className="flex gap-1.5">
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                  Sifatli mahsulot
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                  Tavsifga mos
                </span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Zavod mahsuloti, sifati standartga mos. Yetkazib berish xizmati qulay boʻldi.
              </p>
            </div>
          </div>
        )}

        {/* Tab 4: Kutilayotgan baholar */}
        {activeTab === "pending" && (
          <div className="space-y-3">
            {pendingOrders.length === 0 ? (
              <div className="bg-surface rounded-card border border-border p-12 text-center">
                <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-3 opacity-60" />
                <h3 className="font-bold text-base text-text mb-1">
                  {locale === "uz" ? "Barcha xaridlar baholangan!" : "Все покупки оценены!"}
                </h3>
                <p className="text-xs text-text-secondary">
                  {locale === "uz"
                    ? "Baholanmagan yakunlangan bitimlar yoʻq."
                    : "Нет неоценённых завершённых сделок."}
                </p>
              </div>
            ) : (
              pendingOrders.map((o) => (
                <div
                  key={o.id}
                  className="bg-surface rounded-card border border-border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
                >
                  <div>
                    <span className="text-xs font-bold text-primary">{o.contract?.number}</span>
                    <h4 className="font-bold text-sm text-text mt-0.5">{o.listing?.title}</h4>
                    <p className="text-xs text-text-secondary mt-1">
                      {o.seller?.companyName} · {Number(o.quantity)} {o.listing?.unit}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedOrderForReview({
                        id: o.id,
                        contractNumber: o.contract?.number,
                        listingTitle: o.listing?.title,
                        sellerCompany: o.seller?.companyName,
                        quantity: Number(o.quantity),
                        unit: o.listing?.unit,
                        imageUrl: o.listing?.images?.[0]?.url
                      })
                    }
                    className="h-10 px-4 bg-accent text-white font-semibold text-xs rounded-btn hover:bg-accent-hover flex items-center gap-1.5 self-start sm:self-center cursor-pointer shadow-sm"
                  >
                    <Star className="w-3.5 h-3.5" />
                    <span>{locale === "uz" ? "Baho berish" : "Оценить"}</span>
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 5: Eng yaxshi sotuvchilar */}
        {activeTab === "top_sellers" && (
          <div className="space-y-4">
            <div className="bg-surface rounded-card border border-border overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-muted text-text-secondary border-b border-border">
                    <tr>
                      <th className="py-3 px-4 font-bold">#</th>
                      <th className="py-3 px-4 font-bold">
                        {locale === "uz" ? "Korxona" : "Предприятие"}
                      </th>
                      <th className="py-3 px-4 font-bold">
                        {locale === "uz" ? "Viloyat" : "Регион"}
                      </th>
                      <th className="py-3 px-4 font-bold">
                        {locale === "uz" ? "Kategoriya" : "Категория"}
                      </th>
                      <th className="py-3 px-4 font-bold">
                        {locale === "uz" ? "Reyting" : "Рейтинг"}
                      </th>
                      <th className="py-3 px-4 font-bold text-right">
                        {locale === "uz" ? "Bitimlar" : "Сделки"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {topSellersList.map((seller, idx) => (
                      <tr key={idx} className="hover:bg-surface-muted/50 transition-colors">
                        <td className="py-3 px-4 font-extrabold text-primary">{idx + 1}</td>
                        <td className="py-3 px-4 font-bold text-text">{seller.company}</td>
                        <td className="py-3 px-4 text-text-secondary">
                          {locale === "uz" ? seller.regionUz : seller.regionRu}
                        </td>
                        <td className="py-3 px-4 text-text-secondary">
                          {locale === "uz" ? seller.categoryUz : seller.categoryRu}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 font-bold text-accent">
                            <Star className="w-3.5 h-3.5 fill-accent" />
                            {seller.rating.toFixed(2)}
                            <span className="text-[10px] text-text-muted font-normal">
                              ({seller.reviewsCount})
                            </span>
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-text">
                          {seller.dealsCount} ta
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
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
              locale === "uz" ? "Rahmat! Bahoyingiz qabul qilindi" : "Спасибо! Ваша оценка принята"
            );
            setPendingOrders((prev) => prev.filter((o) => o.id !== selectedOrderForReview.id));
            setSelectedOrderForReview(null);
          }}
        />
      )}

      {/* FormDialog for reply */}
      <FormDialog
        isOpen={!!replyReviewId}
        onClose={() => {
          setReplyReviewId(null);
          setReplyText("");
        }}
        title={locale === "uz" ? "Xaridor fikriga javob berish" : "Ответ на отзыв покупателя"}
      >
        <div className="space-y-4">
          <p className="text-xs text-text-secondary leading-relaxed">
            {locale === "uz"
              ? "Siz xaridorga bir marta rasmiy javob yozishingiz mumkin. Bu javob eʼlonlaringizda barcha mijozlarga koʻrinadi."
              : "Вы можете оставить один официальный ответ покупателю. Он будет отображаться под отзывом."}
          </p>
          <div>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={4}
              placeholder={
                locale === "uz"
                  ? "Javobingizni shu yerga yozing..."
                  : "Напишите ваш ответ здесь..."
              }
              className="w-full p-3 rounded-btn bg-surface-muted border border-border text-xs text-text focus:outline-none focus:border-primary resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setReplyReviewId(null);
                setReplyText("");
              }}
              className="flex-1 h-11 border border-border rounded-btn text-xs font-semibold hover:bg-surface-muted text-text-secondary"
            >
              {locale === "uz" ? "Bekor qilish" : "Отмена"}
            </button>
            <button
              type="button"
              disabled={replyLoading || !replyText.trim()}
              onClick={handleSendReply}
              className="flex-1 h-11 bg-primary text-white rounded-btn text-xs font-bold hover:bg-primary-hover disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {replyLoading && (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              <span>{locale === "uz" ? "Javobni yuborish" : "Отправить ответ"}</span>
            </button>
          </div>
        </div>
      </FormDialog>
    </NavigationLayout>
  );
}
