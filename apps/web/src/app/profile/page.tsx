"use client";

import React, { useState } from "react";
import { useLanguage } from "../../lib/language";
import { useAuth } from "../../lib/auth";
import { NavigationLayout } from "../../components/navigation";
import { User, Building2, Phone, MapPin, Mail, Lock, Shield, Check } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { locale } = useLanguage();
  const { user } = useAuth();

  const [tab, setTab] = useState<"info" | "security">("info");
  const [form, setForm] = useState({
    companyName: user?.companyName || "«Sharq Agro Fayz» MChJ",
    firstName: user?.firstName || "Alisher",
    lastName: user?.lastName || "Usmonov",
    phone: user?.phone || "+998 (90) 123-45-67",
    email: "sharq.agro@example.com",
    address: "Navoiy koʻchasi, 45-uy",
    telegram: "@sharq_agro"
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      locale === "uz" ? "Maʼlumotlar muvaffaqiyatli saqlandi!" : "Данные успешно сохранены!"
    );
  };

  return (
    <NavigationLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text mb-1">
            {locale === "uz" ? "Profil va sozlamalar" : "Профиль и настройки"}
          </h1>
          <p className="text-xs text-text-secondary">
            {locale === "uz" ? "Korxona maʼlumotlari va xavfsizlik sozlamalari" : "Информация о предприятии и безопасность"}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setTab("info")}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all ${
              tab === "info" ? "border-primary text-primary" : "border-transparent text-text-secondary hover:text-text"
            }`}
          >
            {locale === "uz" ? "Shaxsiy maʼlumotlar" : "Личные данные"}
          </button>
          <button
            onClick={() => setTab("security")}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all ${
              tab === "security" ? "border-primary text-primary" : "border-transparent text-text-secondary hover:text-text"
            }`}
          >
            {locale === "uz" ? "Xavfsizlik" : "Безопасность"}
          </button>
        </div>

        {tab === "info" ? (
          <form onSubmit={handleSave} className="bg-surface rounded-card border border-border p-6 sm:p-8 space-y-4 shadow-xs">
            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1">
                {locale === "uz" ? "Korxona yoki kompaniya nomi" : "Название компании"}
              </label>
              <input
                type="text"
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                className="w-full h-11 px-3 rounded-btn bg-surface-muted border border-border text-xs focus:outline-none focus:border-primary text-text"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">
                  {locale === "uz" ? "Ism" : "Имя"}
                </label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="w-full h-11 px-3 rounded-btn bg-surface-muted border border-border text-xs focus:outline-none focus:border-primary text-text"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">
                  {locale === "uz" ? "Familiya" : "Фамилия"}
                </label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="w-full h-11 px-3 rounded-btn bg-surface-muted border border-border text-xs focus:outline-none focus:border-primary text-text"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">
                  {locale === "uz" ? "Telefon raqami" : "Телефон"}
                </label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full h-11 px-3 rounded-btn bg-surface-muted border border-border text-xs focus:outline-none focus:border-primary text-text"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">
                  Telegram
                </label>
                <input
                  type="text"
                  value={form.telegram}
                  onChange={(e) => setForm({ ...form, telegram: e.target.value })}
                  className="w-full h-11 px-3 rounded-btn bg-surface-muted border border-border text-xs focus:outline-none focus:border-primary text-text"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1">
                {locale === "uz" ? "Manzil" : "Адрес"}
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full h-11 px-3 rounded-btn bg-surface-muted border border-border text-xs focus:outline-none focus:border-primary text-text"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="h-11 px-6 bg-primary text-white font-bold text-xs rounded-btn hover:bg-primary-hover shadow-xs"
              >
                {locale === "uz" ? "Oʻzgarishlarni saqlash" : "Сохранить изменения"}
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-surface rounded-card border border-border p-6 sm:p-8 space-y-6 shadow-xs">
            <div>
              <h3 className="font-bold text-sm text-text mb-3">
                {locale === "uz" ? "Parolni oʻzgartirish" : "Смена пароля"}
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-text-secondary block mb-1">
                    {locale === "uz" ? "Amaldagi parol" : "Текущий пароль"}
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full h-11 px-3 rounded-btn bg-surface-muted border border-border text-xs focus:outline-none text-text"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-secondary block mb-1">
                    {locale === "uz" ? "Yangi parol" : "Новый пароль"}
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full h-11 px-3 rounded-btn bg-surface-muted border border-border text-xs focus:outline-none text-text"
                  />
                </div>
                <button
                  onClick={() =>
                    toast.success(
                      locale === "uz" ? "Parol muvaffaqiyatli oʻzgartirildi!" : "Пароль успешно изменён!"
                    )
                  }
                  className="h-10 px-5 bg-primary text-white font-semibold text-xs rounded-btn hover:bg-primary-hover mt-1 cursor-pointer"
                >
                  {locale === "uz" ? "Parolni yangilash" : "Обновить пароль"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </NavigationLayout>
  );
}