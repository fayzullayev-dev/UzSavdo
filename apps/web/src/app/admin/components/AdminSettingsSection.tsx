"use client";

import React, { useState } from "react";
import { Settings, Save, CheckCircle2, Shield, Percent, Clock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import adminData from "../../../lib/adminData.json";

interface Props {
  locale: "uz" | "ru";
}

export function AdminSettingsSection({ locale }: Props) {
  const [trialEnabled, setTrialEnabled] = useState(true);
  const [commissionRate, setCommissionRate] = useState("1.5");
  const [timerHours, setTimerHours] = useState("72");
  const [maintenance, setMaintenance] = useState(false);

  const handleSave = () => {
    toast.success(locale === "uz" ? "Tizim sozlamalari muvaffaqiyatli saqlandi!" : "Системные настройки успешно сохранены!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-text tracking-tight">
            {locale === "uz" ? "Tizim va Platforma Sozlamalari" : "Системные настройки платформы"}
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            {locale === "uz" 
              ? "Savdo qoidalari, sinov davri va xavfsizlik parametrlarini boshqarish" 
              : "Управление тарифами, промо-периодом и регламентами торгов"}
          </p>
        </div>
        <button
          onClick={handleSave}
          className="h-10 px-5 bg-primary text-white text-xs font-bold rounded-btn hover:bg-primary-hover flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{locale === "uz" ? "Sozlamalarni saqlash" : "Сохранить настройки"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Trial Period Setting */}
        <div className="p-5 bg-surface rounded-card border border-border shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-btn bg-primary/10 text-primary">
              <Percent className="w-5 h-5" />
            </span>
            <div>
              <h4 className="font-bold text-sm text-text">
                {locale === "uz" ? "Bepul Sinov Davri (0% Komissiya)" : "Бесплатный пробный период (0%)"}
              </h4>
              <p className="text-xs text-text-muted">
                {locale === "uz" ? "10.01.2027 gacha tuzilgan shartnomalardan toʻlov olinmaydi" : "До 10.01.2027 все договоры оформляются без комиссии"}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-surface-muted rounded-btn border border-border">
            <span className="text-xs font-semibold text-text">
              {locale === "uz" ? "Sinov davri holati:" : "Статус периода:"}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={trialEnabled}
                onChange={(e) => setTrialEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>

        {/* Order Timer Setting */}
        <div className="p-5 bg-surface rounded-card border border-border shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-btn bg-accent/10 text-accent">
              <Clock className="w-5 h-5" />
            </span>
            <div>
              <h4 className="font-bold text-sm text-text">
                {locale === "uz" ? "Buyurtmaga javob berish reglamenti" : "Регламент ответа на заказ"}
              </h4>
              <p className="text-xs text-text-muted">
                {locale === "uz" ? "Sotuvchi ushbu vaqt ichida javob berishi shart" : "Срок, в течение которого продавец обязан ответить"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="number"
              value={timerHours}
              onChange={(e) => setTimerHours(e.target.value)}
              className="w-24 h-10 px-3 bg-surface-muted border border-border rounded-btn text-xs font-bold text-text focus:outline-none focus:border-primary text-center"
            />
            <span className="text-xs font-semibold text-text">
              {locale === "uz" ? "soat (standart: 72 soat)" : "часов (стандарт: 72 часа)"}
            </span>
          </div>
        </div>

        {/* Future Commission Rate */}
        <div className="p-5 bg-surface rounded-card border border-border shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-btn bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Shield className="w-5 h-5" />
            </span>
            <div>
              <h4 className="font-bold text-sm text-text">
                {locale === "uz" ? "Kelgusi komissiya foizi (Sinovdan soʻng)" : "Тариф комиссии (После промо-периода)"}
              </h4>
              <p className="text-xs text-text-muted">
                {locale === "uz" ? "Oddiy foydalanuvchilar uchun foiz stavkasi" : "Базовый процент от суммы завершённых сделок"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              value={commissionRate}
              onChange={(e) => setCommissionRate(e.target.value)}
              className="w-24 h-10 px-3 bg-surface-muted border border-border rounded-btn text-xs font-bold text-text focus:outline-none focus:border-primary text-center"
            />
            <span className="text-xs font-semibold text-text">%</span>
          </div>
        </div>

        {/* Maintenance Mode */}
        <div className="p-5 bg-surface rounded-card border border-border shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-btn bg-danger/10 text-danger">
              <AlertTriangle className="w-5 h-5" />
            </span>
            <div>
              <h4 className="font-bold text-sm text-text">
                {locale === "uz" ? "Texnik xizmat koʻrsatish rejimi" : "Режим тех. обслуживания"}
              </h4>
              <p className="text-xs text-text-muted">
                {locale === "uz" ? "Platformani vaqtinchalik yopish" : "Временная приостановка работы платформы"}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-surface-muted rounded-btn border border-border">
            <span className="text-xs font-semibold text-text">
              {locale === "uz" ? "Rejim faolligi:" : "Статус режима:"}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={maintenance}
                onChange={(e) => setMaintenance(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-danger"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
