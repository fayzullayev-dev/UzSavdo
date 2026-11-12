"use client";

import React, { useState } from "react";
import { 
  Users, Search, ShieldCheck, ShieldAlert, Phone, Mail, 
  Building2, Calendar, Star, MoreVertical, Ban, RefreshCw, Eye 
} from "lucide-react";
import { toast } from "sonner";
import adminData from "../../../lib/adminData.json";

interface Props {
  locale: "uz" | "ru";
  onSelectUser: (user: any) => void;
}

export function AdminUsersSection({ locale, onSelectUser }: Props) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filteredUsers = adminData.users.filter((u) => {
    const matchesSearch = 
      (u.companyName || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.firstName || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.lastName || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.phone || "").includes(search) ||
      (u.login || "").toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-text tracking-tight">
            {locale === "uz" ? "Foydalanuvchilar va Tadbirkorlar" : "Пользователи и Предприниматели"}
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            {locale === "uz" 
              ? `Tizimda jami ${adminData.users.length} nafar faol foydalanuvchi va korxona roʻyxatdan oʻtgan`
              : `Всего ${adminData.users.length} активных пользователей и предприятий`}
          </p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-surface rounded-card border border-border p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={locale === "uz" ? "Kompaniya nomi, F.I.Sh yoki telefon raqami boʻyicha qidirish..." : "Поиск по названию компании, ФИО или телефону..."}
            className="w-full h-10 pl-9 pr-4 bg-surface-muted border border-border rounded-btn text-xs text-text focus:outline-none focus:border-primary"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="h-10 px-3 bg-surface-muted border border-border rounded-btn text-xs font-semibold text-text focus:outline-none"
        >
          <option value="all">{locale === "uz" ? "Barcha rollar" : "Все роли"}</option>
          <option value="USER">{locale === "uz" ? "Tadbirkor (USER)" : "Предприниматель (USER)"}</option>
          <option value="ADMIN">{locale === "uz" ? "Administrator" : "Администратор"}</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-surface rounded-card border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-muted border-b border-border text-text-secondary font-bold uppercase text-[11px]">
                <th className="p-3.5">{locale === "uz" ? "Tadbirkor / Kompaniya" : "Предприниматель / Компания"}</th>
                <th className="p-3.5">{locale === "uz" ? "Telefon / Login" : "Телефон / Логин"}</th>
                <th className="p-3.5">{locale === "uz" ? "Rol" : "Роль"}</th>
                <th className="p-3.5">{locale === "uz" ? "Reyting" : "Рейтинг"}</th>
                <th className="p-3.5">{locale === "uz" ? "Holat" : "Статус"}</th>
                <th className="p-3.5 text-right">{locale === "uz" ? "Amallar" : "Действия"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-surface-muted/60 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold text-text">{u.companyName || `${u.firstName} ${u.lastName || ''}`}</div>
                    <div className="text-[11px] text-text-secondary">{u.firstName} {u.lastName}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-text">{u.phone}</div>
                    <div className="text-[11px] text-text-muted">@{u.login}</div>
                  </td>
                  <td className="p-3.5">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      u.role === "ADMIN" 
                        ? "bg-purple-500/15 text-purple-700 dark:text-purple-400" 
                        : "bg-primary/10 text-primary"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-1 font-bold text-accent">
                      <Star className="w-3.5 h-3.5 fill-accent" />
                      {u.ratingAvg ? Number(u.ratingAvg).toFixed(1) : "5.0"}
                    </div>
                  </td>
                  <td className="p-3.5">
                    {u.isBlocked ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-danger/15 text-danger">
                        <ShieldAlert className="w-3 h-3" />
                        {locale === "uz" ? "Bloklangan" : "Заблокирован"}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-success/15 text-success">
                        <ShieldCheck className="w-3 h-3" />
                        {locale === "uz" ? "Tasdiqlangan" : "Активен"}
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => onSelectUser({
                        company: u.companyName,
                        name: `${u.firstName} ${u.lastName || ''}`,
                        phone: u.phone,
                        login: u.login,
                        rating: u.ratingAvg || 5.0,
                        listings: 12,
                        deals: 24,
                        region: "Oʻzbekiston",
                        role: u.role,
                        isBlocked: u.isBlocked
                      })}
                      className="px-3 py-1.5 bg-surface-muted hover:bg-border text-text font-bold text-xs rounded-btn transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{locale === "uz" ? "Koʻrish" : "Просмотр"}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
