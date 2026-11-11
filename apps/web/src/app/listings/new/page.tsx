"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../../lib/language";
import { apiFetch } from "../../../lib/api";
import { NavigationLayout } from "../../../components/navigation";
import { Send, UploadCloud, Info } from "lucide-react";
import { toast } from "sonner";

export default function NewListingPage() {
  const { locale, t } = useLanguage();
  const router = useRouter();

  const [categories, setCategories] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [selectedCat, setSelectedCat] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    categoryId: "",
    productId: "",
    title: "",
    origin: "LOCAL",
    unit: "kg",
    pricePerUnit: "",
    isNegotiable: false,
    totalQuantity: "",
    minOrderQuantity: "1",
    delivery: "DELIVERY",
    regionId: "",
    districtId: "",
    description: "",
    images: ["https://placehold.co/800x600/1F5F4A/ffffff?text=Yangi+Mahsulot"]
  });

  useEffect(() => {
    Promise.all([apiFetch("/categories"), apiFetch("/regions")])
      .then(([cats, regs]) => {
        setCategories(cats);
        setRegions(regs);
        if (cats.length > 0) {
          setSelectedCat(cats[0]);
          setForm((f) => ({
            ...f,
            categoryId: cats[0].id,
            productId: cats[0].products[0]?.id || ""
          }));
        }
        if (regs.length > 0) {
          setForm((f) => ({
            ...f,
            regionId: regs[0].id,
            districtId: regs[0].districts[0]?.id || ""
          }));
        }
      })
      .catch(console.error);
  }, []);

  const handleCatChange = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    setSelectedCat(cat);
    setForm((f) => ({
      ...f,
      categoryId: catId,
      productId: cat?.products[0]?.id || ""
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await apiFetch("/listings", {
        method: "POST",
        body: JSON.stringify(form)
      });
      toast.success(locale === "uz" ? "Eʼlon muvaffaqiyatli joylashtirildi!" : "Объявление успешно размещено!");
      router.push(`/listings/${res.id}`);
    } catch (err: any) {
      toast.error(err.message || (locale === "uz" ? "Xatolik yuz berdi" : "Произошла ошибка"));
    } finally {
      setLoading(false);
    }
  };

  const selectedRegionObj = regions.find((r) => r.id === form.regionId);

  return (
    <NavigationLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-text mb-6">
          {locale === "uz" ? "Yangi eʼlon joylashtirish" : "Разместить новое объявление"}
        </h1>

        <form onSubmit={handleSubmit} className="bg-surface rounded-card border border-border p-6 sm:p-8 space-y-6 shadow-sm">
          {/* Section 1: Product info */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-text uppercase tracking-wider border-b border-border pb-2">
              1. {locale === "uz" ? "Mahsulot haqida" : "О товаре"}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">
                  {locale === "uz" ? "Kategoriya" : "Категория"} *
                </label>
                <select
                  value={form.categoryId}
                  onChange={(e) => handleCatChange(e.target.value)}
                  className="w-full h-11 px-3 bg-surface-muted border border-border rounded-btn text-sm focus:outline-none text-text"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {locale === "uz" ? c.nameUz : c.nameRu}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">
                  {locale === "uz" ? "Mahsulot nomi" : "Товар"} *
                </label>
                <select
                  value={form.productId}
                  onChange={(e) => setForm({ ...form, productId: e.target.value })}
                  className="w-full h-11 px-3 bg-surface-muted border border-border rounded-btn text-sm focus:outline-none text-text"
                >
                  {selectedCat?.products.map((p: any) => (
                    <option key={p.id} value={p.id}>
                      {locale === "uz" ? p.nameUz : p.nameRu}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1">
                {locale === "uz" ? "Eʼlon sarlavhasi" : "Заголовок объявления"} *
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Masalan: Saralangan sifatli kartoshka, 2026-yil hosili"
                className="w-full h-11 px-3 rounded-btn bg-surface-muted border border-border text-sm focus:outline-none text-text"
              />
            </div>
          </div>

          {/* Section 2: Price & Quantity */}
          <div className="space-y-4 pt-2">
            <h3 className="font-bold text-sm text-text uppercase tracking-wider border-b border-border pb-2">
              2. {locale === "uz" ? "Narx va miqdor" : "Цена и количество"}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">
                  {locale === "uz" ? "Oʻlchov birligi" : "Единица измерения"} *
                </label>
                <select
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  className="w-full h-11 px-3 bg-surface-muted border border-border rounded-btn text-sm focus:outline-none text-text"
                >
                  <option value="kg">kg (кг)</option>
                  <option value="tonna">tonna (тонна)</option>
                  <option value="dona">dona (шт.)</option>
                  <option value="litr">litr (литр)</option>
                  <option value="qop">qop (мешок)</option>
                  <option value="quti">quti (коробка)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">
                  {locale === "uz" ? "Narxi (soʻm)" : "Цена за единицу (сум)"} *
                </label>
                <input
                  type="number"
                  required
                  value={form.pricePerUnit}
                  onChange={(e) => setForm({ ...form, pricePerUnit: e.target.value })}
                  placeholder="12000"
                  className="w-full h-11 px-3 rounded-btn bg-surface-muted border border-border text-sm focus:outline-none text-text"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">
                  {locale === "uz" ? "Mavjud miqdor" : "Количество в наличии"} *
                </label>
                <input
                  type="number"
                  required
                  value={form.totalQuantity}
                  onChange={(e) => setForm({ ...form, totalQuantity: e.target.value })}
                  placeholder="5000"
                  className="w-full h-11 px-3 rounded-btn bg-surface-muted border border-border text-sm focus:outline-none text-text"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Region & Delivery */}
          <div className="space-y-4 pt-2">
            <h3 className="font-bold text-sm text-text uppercase tracking-wider border-b border-border pb-2">
              3. {locale === "uz" ? "Hudud va yetkazib berish" : "Регион и доставка"}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">
                  {locale === "uz" ? "Viloyat" : "Область"} *
                </label>
                <select
                  value={form.regionId}
                  onChange={(e) => {
                    const reg = regions.find((r) => r.id === e.target.value);
                    setForm({
                      ...form,
                      regionId: e.target.value,
                      districtId: reg?.districts[0]?.id || ""
                    });
                  }}
                  className="w-full h-11 px-3 bg-surface-muted border border-border rounded-btn text-sm focus:outline-none text-text"
                >
                  {regions.map((r) => (
                    <option key={r.id} value={r.id}>
                      {locale === "uz" ? r.nameUz : r.nameRu}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">
                  {locale === "uz" ? "Tuman yoki shahar" : "Район или город"} *
                </label>
                <select
                  value={form.districtId}
                  onChange={(e) => setForm({ ...form, districtId: e.target.value })}
                  className="w-full h-11 px-3 bg-surface-muted border border-border rounded-btn text-sm focus:outline-none text-text"
                >
                  {selectedRegionObj?.districts.map((d: any) => (
                    <option key={d.id} value={d.id}>
                      {locale === "uz" ? d.nameUz : d.nameRu}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1">
                {locale === "uz" ? "Tavsif (ixtiyoriy)" : "Описание (необязательно)"}
              </label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder={locale === "uz" ? "Mahsulot sifati, saqlash sharoiti va boshqalar haqida..." : "О качестве, условиях хранения и др."}
                className="w-full p-3 rounded-btn bg-surface-muted border border-border text-sm focus:outline-none text-text"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 h-12 rounded-btn border border-border font-semibold text-sm hover:bg-surface-muted"
            >
              {t("auth.cancel")}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-12 bg-accent text-white font-bold rounded-btn hover:bg-accent-hover flex items-center justify-center gap-2 shadow-md transition-all text-sm"
            >
              <Send className="w-4 h-4" />
              {loading ? "..." : locale === "uz" ? "Eʼlonni joylashtirish" : "Разместить объявление"}
            </button>
          </div>
        </form>
      </div>
    </NavigationLayout>
  );
}
