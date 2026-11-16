"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../../lib/language";
import { apiFetch } from "../../../lib/api";
import { NavigationLayout } from "../../../components/navigation";
import { Send, UploadCloud, Image as ImageIcon, X, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const DEFAULT_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80";

// Helper function: compress image on client-side to keep under 2MB
async function compressImageTo2MB(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        // Calculate scaled dimensions if very large
        let width = img.width;
        let height = img.height;
        const maxDim = 1920;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Compress starting at 0.88 quality
        let quality = 0.88;
        let dataUrl = canvas.toDataURL("image/jpeg", quality);

        // Approximate base64 size: (length * 3/4)
        // If > 2MB (2 * 1024 * 1024 = 2,097,152 bytes) reduce quality
        const maxBytes = 2 * 1024 * 1024;
        while (dataUrl.length * 0.75 > maxBytes && quality > 0.4) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL("image/jpeg", quality);
        }

        resolve(dataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function NewListingPage() {
  const { locale, t } = useLanguage();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [selectedCat, setSelectedCat] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

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
    images: [] as string[]
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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (uploadedImages.length + files.length > 5) {
      toast.error(
        locale === "uz"
          ? "Koʻpi bilan 5 tagacha rasm yuklash mumkin"
          : "Можно загрузить не более 5 фотографий"
      );
      return;
    }

    setUploadingImage(true);
    try {
      const newImages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith("image/")) continue;
        const compressedBase64 = await compressImageTo2MB(file);
        newImages.push(compressedBase64);
      }
      setUploadedImages((prev) => [...prev, ...newImages].slice(0, 5));
      toast.success(
        locale === "uz"
          ? "Rasm muvaffaqiyatli yuklandi va hajmi 2MB ga moslashtirildi!"
          : "Фото успешно загружено и сжато до 2МБ!"
      );
    } catch (err) {
      console.error("Image compression error:", err);
      toast.error(
        locale === "uz"
          ? "Rasmni yuklashda xatolik yuz berdi"
          : "Ошибка при загрузке фото"
      );
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const finalImages =
        uploadedImages.length > 0 ? uploadedImages : [DEFAULT_FALLBACK_IMAGE];

      const res = await apiFetch("/listings", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          images: finalImages
        })
      });
      toast.success(
        locale === "uz"
          ? "Eʼlon muvaffaqiyatli joylashtirildi!"
          : "Объявление успешно размещено!"
      );
      router.push(`/listings/${res.id}`);
    } catch (err: any) {
      toast.error(
        err.message || (locale === "uz" ? "Xatolik yuz berdi" : "Произошла ошибка")
      );
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
                placeholder={locale === "uz" ? "Masalan: Saralangan sifatli kartoshka, 2026-yil hosili" : "Например: Картофель отборный, урожай 2026"}
                className="w-full h-11 px-3 rounded-btn bg-surface-muted border border-border text-sm focus:outline-none text-text"
              />
            </div>
          </div>

          {/* Section 2: Photo upload with automatic 2MB compression */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h3 className="font-bold text-sm text-text uppercase tracking-wider">
                2. {locale === "uz" ? "Mahsulot rasmlari" : "Фотографии товара"}
              </h3>
              <span className="text-xs text-text-muted">
                {locale === "uz" ? "(Avtomatik 2MB gacha siqiladi)" : "(Автоматическое сжатие до 2МБ)"}
              </span>
            </div>

            {/* Hidden native file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              multiple
              className="hidden"
            />

            {/* Drop / Click Upload Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border hover:border-primary rounded-card p-6 text-center cursor-pointer transition-colors bg-surface-muted/40 hover:bg-surface-muted flex flex-col items-center justify-center gap-2 group"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-text">
                {locale === "uz"
                  ? "Rasm yuklash uchun bu yerni bosing"
                  : "Нажмите сюда, чтобы загрузить фото товара"}
              </p>
              <p className="text-xs text-text-secondary max-w-sm">
                {locale === "uz"
                  ? "PNG, JPG, WEBP. Rasm hajmi qancha boʻlishidan qatʼi nazar sayt avtomatik tarzda 2MB gacha ixchamlashtiradi."
                  : "PNG, JPG, WEBP. Независимо от размера исходного файла, сайт автоматически оптимизирует его до 2МБ."}
              </p>
            </div>

            {/* Uploaded images preview gallery */}
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                {uploadedImages.map((img, idx) => (
                  <div key={idx} className="relative group rounded-card overflow-hidden border border-border aspect-square bg-surface-muted">
                    <img
                      src={img}
                      alt={`Mahsulot ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(idx);
                      }}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 hover:bg-danger text-white flex items-center justify-center transition-colors shadow-xs"
                      title={locale === "uz" ? "Oʻchirish" : "Удалить"}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[10px] bg-primary text-white font-semibold">
                        {locale === "uz" ? "Asosiy" : "Главное"}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Price & Quantity */}
          <div className="space-y-4 pt-2">
            <h3 className="font-bold text-sm text-text uppercase tracking-wider border-b border-border pb-2">
              3. {locale === "uz" ? "Narx va miqdor" : "Цена и количество"}
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

          {/* Section 4: Region & Delivery */}
          <div className="space-y-4 pt-2">
            <h3 className="font-bold text-sm text-text uppercase tracking-wider border-b border-border pb-2">
              4. {locale === "uz" ? "Hudud va yetkazib berish" : "Регион и доставка"}
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
              disabled={loading || uploadingImage}
              className="flex-1 h-12 bg-accent text-white font-bold rounded-btn hover:bg-accent-hover flex items-center justify-center gap-2 shadow-md transition-all text-sm disabled:opacity-50"
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
