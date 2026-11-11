"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "../../lib/language";
import { apiFetch } from "../../lib/api";
import { NavigationLayout } from "../../components/navigation";
import { Bell, Check } from "lucide-react";

export default function NotificationsPage() {
  const { locale } = useLanguage();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = () => {
    apiFetch("/notifications")
      .then((data) => setNotifications(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleReadAll = async () => {
    try {
      await apiFetch("/notifications/read-all", { method: "POST" });
      fetchNotifs();
    } catch {}
  };

  return (
    <NavigationLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text mb-1">
              {locale === "uz" ? "Bildirishnomalar" : "Уведомления"}
            </h1>
            <p className="text-xs text-text-secondary">
              {locale === "uz" ? "Barcha muhim xabarnomalar va yangiliklar" : "Все уведомления о заказах и статусах"}
            </p>
          </div>
          <button
            onClick={handleReadAll}
            className="h-10 px-4 border border-border text-xs font-semibold rounded-btn hover:bg-surface-muted flex items-center gap-1.5 text-text"
          >
            <Check className="w-4 h-4 text-primary" />
            {locale === "uz" ? "Barchasini oʻqilgan deb belgilash" : "Прочитать все"}
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-surface rounded-card border border-border p-12 text-center">
            <Bell className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-60" />
            <p className="text-xs text-text-secondary">
              {locale === "uz" ? "Hozircha bildirishnomalar mavjud emas" : "Новых уведомлений нет"}
            </p>
          </div>
        ) : (
          <div className="bg-surface rounded-card border border-border divide-y divide-border overflow-hidden shadow-xs">
            {notifications.map((n) => (
              <Link
                key={n.id}
                href={n.link || "/orders"}
                className={`p-4.5 block hover:bg-surface-muted transition-colors ${
                  !n.readAt ? "bg-primary-soft/30 font-medium" : ""
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="text-sm text-text font-bold leading-snug">
                      {locale === "uz" ? "Yangi buyurtma qabul qilindi!" : "Поступил новый заказ!"}
                    </h4>
                    <p className="text-xs text-text-secondary mt-1">
                      {locale === "uz" ? "Xaridor sizning tovaringizga shartnoma rasmiylashtirdi. 72 soat ichida javob bering." : "Покупатель оформил договор. Подтвердите заказ в течение 72 часов."}
                    </p>
                  </div>
                  <span className="text-[11px] text-text-muted shrink-0">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </NavigationLayout>
  );
}