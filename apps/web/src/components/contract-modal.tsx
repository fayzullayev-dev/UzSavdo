"use client";

import React, { useState } from "react";
import { useLanguage } from "../lib/language";
import { apiFetch } from "../lib/api";
import { X, CheckCircle2, Download, MessageSquare, Send } from "lucide-react";
import { formatUnit, formatCurrency } from "../lib/localization";
import { toast } from "sonner";

interface ContractModalProps {
  listing: any;
  initialQuantity?: number;
  quantity?: number;
  onClose: () => void;
  onSuccess: () => void;
}

export const ContractModal: React.FC<ContractModalProps> = ({
  listing,
  initialQuantity,
  quantity: propQuantity,
  onClose,
  onSuccess
}) => {
  const { locale, t } = useLanguage();
  const quantity = initialQuantity || propQuantity || 1;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [paymentMethod, setPaymentMethod] = useState<"CLICK" | "PAYME">("CLICK");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createdContract, setCreatedContract] = useState<any>(null);

  const priceNum = Number(listing.pricePerUnit) || 0;
  const estimatedTotal = priceNum * quantity;
  const isTrial = true;
  const feeAmount = 0;

  const displayTitle = locale === "ru" && listing.titleRu ? listing.titleRu : listing.title;
  const displayUnit = formatUnit(listing.unit, locale);

  const handleCreateContract = async () => {
    if (!agreed) return;
    setLoading(true);

    try {
      const res = await apiFetch("/contracts", {
        method: "POST",
        body: JSON.stringify({
          listingId: listing.id,
          quantity
        })
      });
      setCreatedContract(res);
      setStep(3);
    } catch (err: any) {
      toast.error(err.message || (locale === "uz" ? "Xatolik yuz berdi" : "Произошла ошибка"));
    } finally {
      setLoading(false);
    }
  };

  const handleSendOrder = async () => {
    if (!createdContract) return;
    setLoading(true);
    try {
      await apiFetch("/orders", {
        method: "POST",
        body: JSON.stringify({ contractId: createdContract.id })
      });
      toast.success(
        locale === "uz"
          ? "Buyurtma sotuvchiga muvaffaqiyatli yuborildi!"
          : "Заказ успешно отправлен продавцу!"
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || (locale === "uz" ? "Xatolik yuz berdi" : "Произошла ошибка"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-[4px] p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-surface rounded-[20px] border border-border w-full max-w-[480px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-180 relative my-8">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-lg text-text">
            {step === 3 ? t("contract.successTitle") : t("contract.modalTitle")}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-surface-muted text-text-muted hover:text-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Summary & Fee */}
        {step === 1 && (
          <div className="p-6 space-y-4">
            <div className="flex gap-4 items-center p-3 bg-surface-muted rounded-btn border border-border">
              <img
                src={
                  listing.images?.[0]?.url ||
                  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=120&auto=format&fit=crop&q=80"
                }
                alt={displayTitle}
                className="w-14 h-14 object-cover rounded-btn shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-text truncate">{displayTitle}</h4>
                <p className="text-xs text-text-secondary mt-0.5">
                  {quantity} {displayUnit} · {formatCurrency(priceNum, locale)} / {displayUnit}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b border-border text-xs sm:text-sm">
                <span className="text-text-secondary">{t("contract.estimatedTotal")}</span>
                <span className="font-bold text-primary">{formatCurrency(estimatedTotal, locale)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border text-xs sm:text-sm">
                <span className="text-text-secondary">{t("contract.region")}</span>
                <span className="font-medium text-text">
                  {locale === "uz" ? listing.district?.nameUz : listing.district?.nameRu},{" "}
                  {locale === "uz" ? listing.region?.nameUz : listing.region?.nameRu}
                </span>
              </div>
            </div>

            {/* Fee badge */}
            <div className="p-4 bg-primary/10 rounded-btn border border-primary/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-text">{t("contract.feeTitle")}</span>
                {isTrial ? (
                  <span className="bg-success/20 text-success text-xs font-bold px-2 py-0.5 rounded-full">
                    {t("contract.freeInTrial")}
                  </span>
                ) : (
                  <span className="font-bold text-sm text-primary">{formatCurrency(feeAmount, locale)}</span>
                )}
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">{t("contract.paymentNotice")}</p>
            </div>

            {/* Agreement check */}
            <label className="flex items-start gap-3 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 text-primary rounded"
              />
              <span className="text-xs text-text-secondary leading-tight">
                {t("contract.agreementCheckbox")}
              </span>
            </label>

            {/* Buttons */}
            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-12 rounded-btn border border-border text-sm font-semibold hover:bg-surface-muted text-text-secondary transition-colors"
              >
                {t("auth.cancel")}
              </button>
              <button
                type="button"
                disabled={!agreed || loading}
                onClick={handleCreateContract}
                className="flex-1 h-12 rounded-btn bg-accent text-white text-sm font-bold hover:bg-accent-hover disabled:opacity-50 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{locale === "uz" ? "Yuklanmoqda..." : "Загрузка..."}</span>
                  </>
                ) : isTrial ? (
                  t("contract.confirmContract")
                ) : (
                  t("contract.pay")
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success Screen */}
        {step === 3 && createdContract && (
          <div className="p-6 space-y-5 animate-in fade-in">
            <div className="text-center space-y-2">
              <CheckCircle2 className="w-14 h-14 text-success mx-auto" />
              <h4 className="font-bold text-lg text-text">{t("contract.successTitle")}</h4>
              <p className="text-xs font-bold text-primary bg-primary/10 py-1 px-3 rounded-full inline-block">
                {createdContract.number}
              </p>
            </div>

            {/* Seller unlocked contact box */}
            <div className="bg-surface-muted border border-border p-4 rounded-btn space-y-2 text-xs">
              <div className="font-bold text-sm text-text mb-1">
                {locale === "uz" ? "Sotuvchi aloqa maʼlumotlari" : "Контакты продавца"}
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">{locale === "uz" ? "Korxona:" : "Предприятие:"}</span>
                <span className="font-semibold text-text">{listing.seller?.companyName || "ООО «Agro Savdo Biznes»"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">{locale === "uz" ? "Telefon:" : "Телефон:"}</span>
                <a href={`tel:${listing.seller?.phone}`} className="font-bold text-primary hover:underline">
                  {listing.seller?.phone || "+998 90 123-45-67"}
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">{locale === "uz" ? "Hudud:" : "Регион:"}</span>
                <span className="text-text">
                  {locale === "uz" ? listing.region?.nameUz : listing.region?.nameRu}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                disabled={loading}
                onClick={handleSendOrder}
                className="w-full h-12 bg-accent text-white font-bold rounded-btn hover:bg-accent-hover flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{locale === "uz" ? "Yuborilmoqda..." : "Отправка..."}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{t("contract.sendOrder")}</span>
                  </>
                )}
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    toast.info(
                      locale === "uz"
                        ? "Shartnoma PDF yuklab olindi (Demo)"
                        : "Договор PDF скачан (Демо)"
                    )
                  }
                  className="flex-1 h-10 border border-border rounded-btn text-xs font-semibold hover:bg-surface-muted flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  PDF
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    window.location.href = "/messages";
                  }}
                  className="flex-1 h-10 border border-border rounded-btn text-xs font-semibold hover:bg-surface-muted flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  {t("contract.writeMessage")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const ContractPurchaseModal = ContractModal;
