"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "../../lib/language";
import { apiFetch } from "../../lib/api";
import { NavigationLayout } from "../../components/navigation";
import { ClipboardList, Clock, Check, X, CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { FormDialog } from "../../components/dialogs";

export default function OrdersPage() {
  const { locale, t } = useLanguage();

  const [tab, setTab] = useState<"incoming" | "my">("incoming");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectOrderId, setRejectOrderId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectLoading, setRejectLoading] = useState(false);

  const fetchOrders = () => {
    setLoading(true);
    const role = tab === "incoming" ? "seller" : "buyer";
    apiFetch(`/orders?role=${role}`)
      .then((data) => setOrders(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, [tab]);

  const handleAccept = async (id: string) => {
    try {
      await apiFetch(`/orders/${id}/accept`, { method: "POST" });
      toast.success(locale === "uz" ? "Buyurtma qabul qilindi" : "Заказ принят");
      fetchOrders();
    } catch (err: any) {
      toast.error(err.message || (locale === "uz" ? "Xatolik yuz berdi" : "Произошла ошибка"));
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectOrderId) return;
    setRejectLoading(true);
    try {
      await apiFetch(`/orders/${rejectOrderId}/reject`, {
        method: "POST",
        body: JSON.stringify({ reason: rejectReason })
      });
      toast.success(locale === "uz" ? "Buyurtma rad etildi" : "Заказ отклонён");
      setRejectOrderId(null);
      setRejectReason("");
      fetchOrders();
    } catch (err: any) {
      toast.error(err.message || (locale === "uz" ? "Xatolik yuz berdi" : "Произошла ошибка"));
    } finally {
      setRejectLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="bg-warning/15 text-warning text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {t("status.pending")} (72 soat)
          </span>
        );
      case "ACCEPTED":
        return (
          <span className="bg-success/15 text-success text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            {t("status.accepted")}
          </span>
        );
      case "REJECTED":
        return (
          <span className="bg-danger/15 text-danger text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <X className="w-3 h-3" />
            {t("status.rejected")}
          </span>
        );
      case "EXPIRED":
        return (
          <span className="bg-danger/15 text-danger text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            {t("status.expired")}
          </span>
        );
      case "COMPLETED":
        return (
          <span className="bg-primary-soft text-primary text-xs font-bold px-2.5 py-1 rounded-full">
            {t("status.completed")}
          </span>
        );
      default:
        return (
          <span className="bg-surface-muted text-text-secondary text-xs font-medium px-2 py-0.5 rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <NavigationLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-text mb-6">
          {locale === "uz" ? "Buyurtmalar" : "Заказы"}
        </h1>

        {/* Tabs */}
        <div className="flex border-b border-border mb-6">
          <button
            onClick={() => setTab("incoming")}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all ${
              tab === "incoming"
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-text"
            }`}
          >
            {locale === "uz" ? "Kiruvchi buyurtmalar (Sotuv)" : "Входящие заказы (Продажа)"}
          </button>
          <button
            onClick={() => setTab("my")}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all ${
              tab === "my"
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-text"
            }`}
          >
            {locale === "uz" ? "Mening buyurtmalarim (Xarid)" : "Мои заказы (Покупка)"}
          </button>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-surface rounded-card border border-border p-12 text-center">
            <ClipboardList className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-60" />
            <p className="text-sm text-text-secondary">
              {locale === "uz" ? "Hozircha buyurtmalar mavjud emas" : "Заказов пока нет"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <div
                key={o.id}
                className="bg-surface rounded-card border border-border p-5 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                  <div>
                    <span className="text-xs font-bold text-primary bg-primary-soft px-2.5 py-0.5 rounded-full mr-2">
                      {o.contract?.number}
                    </span>
                    <span className="text-xs text-text-muted">
                      {new Date(o.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div>{getStatusBadge(o.status)}</div>
                </div>

                <div className="flex gap-4 items-center">
                  <img
                    src={o.listing?.images?.[0]?.url || "https://placehold.co/100"}
                    alt=""
                    className="w-16 h-16 object-cover rounded-btn"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-text truncate">
                      {o.listing?.title}
                    </h3>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {locale === "uz" ? "Buyurtma hajmi" : "Объём"}:{" "}
                      <span className="font-bold text-text">
                        {Number(o.quantity).toLocaleString("ru-RU")} {o.listing?.unit}
                      </span>{" "}
                      ·{" "}
                      <span className="font-semibold text-primary">
                        {(Number(o.quantity) * Number(o.listing?.pricePerUnit)).toLocaleString("ru-RU")} soʻm
                      </span>
                    </p>
                    <p className="text-xs text-text-muted mt-1">
                      {tab === "incoming" ? (
                        <>Xaridor: <span className="font-semibold text-text">{o.buyer?.companyName}</span> ({o.buyer?.phone})</>
                      ) : (
                        <>Sotuvchi: <span className="font-semibold text-text">{o.seller?.companyName}</span> ({o.seller?.phone})</>
                      )}
                    </p>
                  </div>
                </div>

                {/* Seller Actions if Pending */}
                {tab === "incoming" && o.status === "PENDING" && (
                  <div className="flex gap-3 pt-2 border-t border-border">
                    <button
                      onClick={() => setRejectOrderId(o.id)}
                      className="px-4 h-10 rounded-btn border border-danger text-danger text-xs font-semibold hover:bg-danger/10 transition-colors cursor-pointer"
                    >
                      {locale === "uz" ? "Rad etish" : "Отклонить"}
                    </button>
                    <button
                      onClick={() => handleAccept(o.id)}
                      className="flex-1 h-10 bg-primary text-white text-xs font-bold rounded-btn hover:bg-primary-hover shadow-sm"
                    >
                      {locale === "uz" ? "Buyurtmani qabul qilish" : "Принять заказ"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Order Form Dialog */}
      <FormDialog
        isOpen={!!rejectOrderId}
        onClose={() => {
          setRejectOrderId(null);
          setRejectReason("");
        }}
        title={locale === "uz" ? "Buyurtmani rad etish" : "Отклонение заказа"}
      >
        <div className="space-y-4">
          <p className="text-xs text-text-secondary leading-relaxed">
            {locale === "uz"
              ? "Iltimos, xaridorga buyurtmani nima sababdan bajara olmasligingizni tushuntiring."
              : "Пожалуйста, укажите покупателю причину, по которой заказ не может быть выполнен."}
          </p>
          <div>
            <label className="text-xs font-semibold text-text-secondary block mb-1.5">
              {locale === "uz" ? "Rad etish sababi:" : "Причина отклонения:"}
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              placeholder={
                locale === "uz"
                  ? "Masalan: Tovar qoldigʻi yetarli emas..."
                  : "Например: Недостаточно остатков на складе..."
              }
              className="w-full p-3 rounded-btn bg-surface-muted border border-border text-xs text-text focus:outline-none focus:border-primary resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setRejectOrderId(null);
                setRejectReason("");
              }}
              className="flex-1 h-11 border border-border rounded-btn text-xs font-semibold hover:bg-surface-muted text-text-secondary"
            >
              {locale === "uz" ? "Bekor qilish" : "Отмена"}
            </button>
            <button
              type="button"
              disabled={rejectLoading || !rejectReason.trim()}
              onClick={handleConfirmReject}
              className="flex-1 h-11 bg-danger text-white rounded-btn text-xs font-bold hover:bg-danger/90 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {rejectLoading && (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              <span>{locale === "uz" ? "Rad etishni tasdiqlash" : "Подтвердить отказ"}</span>
            </button>
          </div>
        </div>
      </FormDialog>
    </NavigationLayout>
  );
}
