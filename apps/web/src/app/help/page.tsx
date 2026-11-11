"use client";

import React, { useState } from "react";
import { useLanguage } from "../../lib/language";
import { NavigationLayout } from "../../components/navigation";
import { ChevronDown, Send, LifeBuoy, Phone, Mail, HelpCircle } from "lucide-react";
import { toast } from "sonner";

export default function HelpPage() {
  const { locale } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [ticket, setTicket] = useState({ subject: "", message: "" });

  const faqs = [
    {
      qUz: "UzSavdo maydonchasida qanday qilib savdo qilsa boʻladi?",
      qRu: "Как торговать на площадке UzSavdo?",
      aUz: "Roʻyxatdan oʻtganingizdan soʻng «Eʼlon joylash» tugmasini bosib, mahsulotingizni joylashtirasiz. Xaridorlar uni topib, shartnoma tuzadilar.",
      aRu: "После регистрации нажмите «Разместить объявление» и заполните данные о товаре. Покупатели смогут найти его и оформить договор."
    },
    {
      qUz: "Nima uchun sotuvchining telefon raqami birdaniga koʻrinmaydi?",
      qRu: "Почему контакты продавца не видны сразу?",
      aUz: "Bu tizim rasmiy savdo va shartnoma asosida ishlashni taʼminlash uchun xizmat qiladi. Mahsulot shartnomasi rasmiylashtirilishi bilan barcha kontaktlar ochiladi.",
      aRu: "Это необходимо для обеспечения официальной торговли на основе договора. Контакты становятся доступны сразу после подтверждения договора."
    },
    {
      qUz: "Mahsulot shartnomasi uchun toʻlov qancha?",
      qRu: "Сколько стоит оформление договора на товар?",
      aUz: "Platforma ishga tushirilganidan keyingi dastlabki 60 kun davomida barcha mahsulot shartnomalari mutlaqo bepul rasmiylashtiriladi.",
      aRu: "В течение первых 60 дней после запуска все договоры на товары оформляются абсолютно бесплатно в рамках пробного периода."
    },
    {
      qUz: "Sotuvchi buyurtmaga necha kun ichida javob berishi kerak?",
      qRu: "В течение какого срока продавец обязан ответить на заказ?",
      aUz: "Sotuvchi buyurtmani 72 soat (3 kun) ichida qabul qilishi yoki rad etishi shart. Javobsiz qolgan buyurtmalar avtomatik ravishda bekor qilinadi.",
      aRu: "Продавец обязан принять или отклонить заказ в течение 72 часов (3 дней). По истечении этого времени заказ автоматически аннулируется."
    },
    {
      qUz: "Mahsulot uchun toʻlov qanday amalga oshiriladi?",
      qRu: "Как производятся расчёты за сам товар?",
      aUz: "Mahsulot uchun toʻlovlar xaridor va sotuvchi oʻrtasida toʻgʻridan-toʻgʻri bank hisobvaragʻi yoki kelishuv asosida amalga oshiriladi.",
      aRu: "Оплата за сам товар производится напрямую между покупателем и продавцом согласно условиям заключённого договора."
    }
  ];

  const handleSendTicket = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      locale === "uz"
        ? "Murojaatingiz maʼmuriyatga yuborildi. Tez orada javob beramiz."
        : "Ваше обращение отправлено администрации. Мы ответим в ближайшее время."
    );
    setTicket({ subject: "", message: "" });
  };

  return (
    <NavigationLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-text mb-1">
            {locale === "uz" ? "Yordam va qoʻllab-quvvatlash" : "Помощь и поддержка"}
          </h1>
          <p className="text-xs text-text-secondary">
            {locale === "uz" ? "Eng koʻp beriladigan savollar va qoʻllab-quvvatlash xizmati" : "Часто задаваемые вопросы и служба поддержки"}
          </p>
        </div>

        {/* Contacts Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-surface p-4 rounded-card border border-border flex items-center gap-3 shadow-xs">
            <div className="w-10 h-10 rounded-btn bg-primary-soft text-primary flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-text-muted block">{locale === "uz" ? "Telefon" : "Телефон"}</span>
              <span className="font-bold text-xs text-text">+998 (71) 200-00-00</span>
            </div>
          </div>

          <div className="bg-surface p-4 rounded-card border border-border flex items-center gap-3 shadow-xs">
            <div className="w-10 h-10 rounded-btn bg-primary-soft text-primary flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-text-muted block">Email</span>
              <span className="font-bold text-xs text-text">support@uzsavdo.uz</span>
            </div>
          </div>

          <div className="bg-surface p-4 rounded-card border border-border flex items-center gap-3 shadow-xs">
            <div className="w-10 h-10 rounded-btn bg-primary-soft text-primary flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-text-muted block">{locale === "uz" ? "Ish tartibi" : "Режим работы"}</span>
              <span className="font-bold text-xs text-text">Dush - Shan, 09:00 - 18:00</span>
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-surface rounded-card border border-border p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-text mb-2">
            {locale === "uz" ? "Koʻp beriladigan savollar (FAQ)" : "Часто задаваемые вопросы"}
          </h2>
          <div className="divide-y divide-border">
            {faqs.map((f, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="py-3">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left font-semibold text-xs text-text flex justify-between items-center py-1 hover:text-primary transition-colors"
                  >
                    <span>{locale === "uz" ? f.qUz : f.qRu}</span>
                    <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <p className="text-xs text-text-secondary mt-2 leading-relaxed animate-in fade-in">
                      {locale === "uz" ? f.aUz : f.aRu}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Support Request Form */}
        <div className="bg-surface rounded-card border border-border p-6 shadow-xs">
          <h2 className="text-base font-bold text-text mb-4">
            {locale === "uz" ? "Qoʻllab-quvvatlash xizmatiga murojaat qilish" : "Обращение в службу поддержки"}
          </h2>
          <form onSubmit={handleSendTicket} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1">
                {locale === "uz" ? "Mavzu" : "Тема обращения"} *
              </label>
              <input
                type="text"
                required
                value={ticket.subject}
                onChange={(e) => setTicket({ ...ticket, subject: e.target.value })}
                placeholder={locale === "uz" ? "Masalan: Shartnoma toʻlovi boʻyicha savol" : "Например: Вопрос по договору"}
                className="w-full h-11 px-3 rounded-btn bg-surface-muted border border-border text-xs focus:outline-none focus:border-primary text-text"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1">
                {locale === "uz" ? "Murojaat matni" : "Текст обращения"} *
              </label>
              <textarea
                rows={4}
                required
                value={ticket.message}
                onChange={(e) => setTicket({ ...ticket, message: e.target.value })}
                placeholder={locale === "uz" ? "Savolingizni batafsil yozing..." : "Опишите ваш вопрос подробно..."}
                className="w-full p-3 rounded-btn bg-surface-muted border border-border text-xs focus:outline-none focus:border-primary text-text"
              />
            </div>
            <button
              type="submit"
              className="h-11 px-6 bg-accent text-white font-bold text-xs rounded-btn hover:bg-accent-hover flex items-center gap-2 shadow-md"
            >
              <Send className="w-4 h-4" />
              {locale === "uz" ? "Yuborish" : "Отправить"}
            </button>
          </form>
        </div>
      </div>
    </NavigationLayout>
  );
}