"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "../lib/language";
import { apiFetch } from "../lib/api";
import {
  Search,
  SlidersHorizontal,
  ChevronRight,
  Check,
  X,
  RotateCcw,
  Plus,
  ArrowLeft
} from "lucide-react";

interface Category {
  id: string;
  nameUz: string;
  nameRu: string;
  products: { id: string; nameUz: string; nameRu: string }[];
}

interface Region {
  id: string;
  nameUz: string;
  nameRu: string;
  districts: { id: string; nameUz: string; nameRu: string }[];
}

interface FilterProps {
  onApply: (filters: any) => void;
  initialFilters?: any;
}

export const ListingFilter: React.FC<FilterProps> = ({ onApply, initialFilters = {} }) => {
  const { locale, t } = useLanguage();

  const [categories, setCategories] = useState<Category[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);

  // Selected state
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<{ id: string; nameUz: string; nameRu: string } | null>(null);

  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<{ id: string; nameUz: string; nameRu: string } | null>(null);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("newest");
  const [onlyFourStars, setOnlyFourStars] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Mobile Bottom Sheet state
  const [sheetOpen, setSheetOpen] = useState(false);
  // Picker step inside sheet: "main" | "cat-step1" | "cat-step2" | "reg-step1" | "reg-step2"
  const [step, setStep] = useState<"main" | "cat-step1" | "cat-step2" | "reg-step1" | "reg-step2">("main");
  const [activeCatForStep2, setActiveCatForStep2] = useState<Category | null>(null);
  const [activeRegForStep2, setActiveRegForStep2] = useState<Region | null>(null);

  // Search inside picker
  const [pickerSearch, setPickerSearch] = useState("");

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Desktop Dropdowns visibility
  const [catOpen, setCatOpen] = useState(false);
  const [hoveredCat, setHoveredCat] = useState<Category | null>(null);
  const [regOpen, setRegOpen] = useState(false);
  const [hoveredReg, setHoveredReg] = useState<Region | null>(null);

  // New product inline input
  const [showAddProd, setShowAddProd] = useState(false);
  const [newProdName, setNewProdName] = useState("");

  useEffect(() => {
    Promise.all([apiFetch("/categories"), apiFetch("/regions")])
      .then(([cats, regs]) => {
        setCategories(cats || []);
        setRegions(regs || []);
      })
      .catch(console.error);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000); // 2s toast as in Section 2.2
  };

  const handleApply = () => {
    setSheetOpen(false);
    onApply({
      categoryId: selectedCategory?.id,
      productId: selectedProduct?.id,
      regionId: selectedRegion?.id,
      districtId: selectedDistrict?.id,
      minPrice,
      maxPrice,
      sort,
      onlyFourStars,
      q: searchTerm
    });
  };

  const handleReset = () => {
    setSelectedCategory(null);
    setSelectedProduct(null);
    setSelectedRegion(null);
    setSelectedDistrict(null);
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    setOnlyFourStars(false);
    setSearchTerm("");
    onApply({});
  };

  // Active filter count
  const activeCount = [
    selectedCategory || selectedProduct,
    selectedRegion || selectedDistrict,
    minPrice || maxPrice,
    sort !== "newest",
    onlyFourStars
  ].filter(Boolean).length;

  const handleAddNewProductSubmit = (category: Category) => {
    const trimmed = newProdName.trim();
    if (!trimmed) return;

    // Check duplicate
    const exists = category.products.some(
      (p) =>
        p.nameUz.toLowerCase() === trimmed.toLowerCase() ||
        p.nameRu.toLowerCase() === trimmed.toLowerCase()
    );

    if (exists) {
      showToast(
        locale === "uz"
          ? "Bu mahsulot allaqachon mavjud!"
          : "Этот товар уже существует в списке!"
      );
      return;
    }

    const tempProduct = {
      id: "new-" + Date.now(),
      nameUz: trimmed,
      nameRu: trimmed
    };

    category.products.push(tempProduct);
    setSelectedCategory(category);
    setSelectedProduct(tempProduct);
    setNewProdName("");
    setShowAddProd(false);
    setStep("main");
    showToast(
      locale === "uz"
        ? "Yangi mahsulot tanlandi!"
        : "Новый товар успешно добавлен!"
    );
  };

  return (
    <div className="w-full mb-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[100] bg-text text-surface px-4 py-2 rounded-full text-xs font-semibold shadow-2xl animate-in fade-in slide-in-from-top-2">
          {toastMessage}
        </div>
      )}

      {/* 
        ====================================================================
        MOBILE FILTER BAR (< 1024px)
        1. Single top bar: Search input + 'Filtr' button (SlidersHorizontal + count badge)
        2. Horizontally scrollable filter chips with '✕'
        ====================================================================
      */}
      <div className="lg:hidden space-y-2.5">
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleApply()}
              placeholder={locale === "uz" ? "Mahsulot qidirish..." : "Поиск товаров..."}
              className="w-full h-11 pl-9 pr-3 rounded-[14px] bg-surface border border-border text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary shadow-xs"
            />
          </div>

          {/* Filtr Button */}
          <button
            type="button"
            onClick={() => {
              setStep("main");
              setSheetOpen(true);
            }}
            className="h-11 px-3.5 rounded-[14px] bg-surface border border-border flex items-center gap-2 text-text font-semibold text-xs active:scale-95 transition-all shadow-xs shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            <span>{locale === "uz" ? "Filtr" : "Фильтр"}</span>
            {activeCount > 0 && (
              <span className="min-w-[18px] h-[18px] px-1 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </button>
        </div>

        {/* Horizontal Chips */}
        {activeCount > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {selectedCategory && (
              <div className="inline-flex items-center gap-1 bg-surface-muted text-text text-xs px-2.5 py-1 rounded-full border border-border shrink-0">
                <span className="max-w-[160px] truncate">
                  {locale === "uz" ? selectedCategory.nameUz : selectedCategory.nameRu}
                  {selectedProduct && ` → ${locale === "uz" ? selectedProduct.nameUz : selectedProduct.nameRu}`}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedProduct(null);
                    handleApply();
                  }}
                  className="p-0.5 hover:text-danger"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {selectedRegion && (
              <div className="inline-flex items-center gap-1 bg-surface-muted text-text text-xs px-2.5 py-1 rounded-full border border-border shrink-0">
                <span className="max-w-[160px] truncate">
                  {locale === "uz" ? selectedRegion.nameUz : selectedRegion.nameRu}
                  {selectedDistrict && ` → ${locale === "uz" ? selectedDistrict.nameUz : selectedDistrict.nameRu}`}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRegion(null);
                    setSelectedDistrict(null);
                    handleApply();
                  }}
                  className="p-0.5 hover:text-danger"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {(minPrice || maxPrice) && (
              <div className="inline-flex items-center gap-1 bg-surface-muted text-text text-xs px-2.5 py-1 rounded-full border border-border shrink-0">
                <span>
                  {minPrice ? `${minPrice} ` : ""}– {maxPrice ? `${maxPrice} ` : ""}soʻm
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setMinPrice("");
                    setMaxPrice("");
                    handleApply();
                  }}
                  className="p-0.5 hover:text-danger"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {onlyFourStars && (
              <div className="inline-flex items-center gap-1 bg-surface-muted text-text text-xs px-2.5 py-1 rounded-full border border-border shrink-0">
                <span>4★ +</span>
                <button
                  type="button"
                  onClick={() => {
                    setOnlyFourStars(false);
                    handleApply();
                  }}
                  className="p-0.5 hover:text-danger"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-text-muted hover:text-danger font-medium shrink-0 px-2 py-1"
            >
              {locale === "uz" ? "Tozalash" : "Сбросить"}
            </button>
          </div>
        )}
      </div>

      {/* 
        ====================================================================
        MOBILE 92% HEIGHT BOTTOM SHEET (Section 2.1 & 2.2)
        ====================================================================
      */}
      {sheetOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setSheetOpen(false)}
          />

          {/* Bottom Sheet Container */}
          <div className="relative w-full h-[92vh] max-h-[92vh] bg-surface rounded-t-[24px] shadow-2xl flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom duration-250">
            {/* Drag Handle */}
            <div className="pt-3 pb-1 flex justify-center shrink-0">
              <div className="w-12 h-1.5 bg-border rounded-full" />
            </div>

            {/* SHEET CONTENT: Animated Steps */}
            <div className="flex-1 overflow-y-auto px-4 pb-24">
              {/* MAIN FILTER STEP */}
              {step === "main" && (
                <div className="space-y-4 pt-1 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <h2 className="text-lg font-bold text-text">
                      {locale === "uz" ? "Filtr" : "Фильтр"}
                    </h2>
                    <button
                      type="button"
                      onClick={() => setSheetOpen(false)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-muted"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Kategoriya va mahsulot Selector */}
                  <button
                    type="button"
                    onClick={() => {
                      setPickerSearch("");
                      setStep("cat-step1");
                    }}
                    className="w-full p-3.5 bg-surface-muted/60 border border-border rounded-[14px] flex items-center justify-between text-left active:bg-surface-muted"
                  >
                    <div>
                      <div className="text-xs text-text-muted font-medium">
                        {locale === "uz" ? "Kategoriya va mahsulot" : "Категория и товар"}
                      </div>
                      <div className="text-sm font-semibold text-text truncate mt-0.5">
                        {selectedCategory
                          ? `${locale === "uz" ? selectedCategory.nameUz : selectedCategory.nameRu}${
                              selectedProduct
                                ? ` → ${locale === "uz" ? selectedProduct.nameUz : selectedProduct.nameRu}`
                                : ""
                            }`
                          : locale === "uz"
                          ? "Barcha kategoriyalar"
                          : "Все категории"}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-text-muted shrink-0 ml-2" />
                  </button>

                  {/* Hudud Selector */}
                  <button
                    type="button"
                    onClick={() => {
                      setPickerSearch("");
                      setStep("reg-step1");
                    }}
                    className="w-full p-3.5 bg-surface-muted/60 border border-border rounded-[14px] flex items-center justify-between text-left active:bg-surface-muted"
                  >
                    <div>
                      <div className="text-xs text-text-muted font-medium">
                        {locale === "uz" ? "Hudud" : "Регион"}
                      </div>
                      <div className="text-sm font-semibold text-text truncate mt-0.5">
                        {selectedRegion
                          ? `${locale === "uz" ? selectedRegion.nameUz : selectedRegion.nameRu}${
                              selectedDistrict
                                ? ` → ${locale === "uz" ? selectedDistrict.nameUz : selectedDistrict.nameRu}`
                                : ""
                            }`
                          : locale === "uz"
                          ? "Butun Oʻzbekiston"
                          : "Весь Узбекистан"}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-text-muted shrink-0 ml-2" />
                  </button>

                  {/* Narx */}
                  <div className="space-y-2 pt-1">
                    <label className="text-xs font-semibold text-text">
                      {locale === "uz" ? "Narx (soʻm)" : "Цена (сум)"}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        inputMode="numeric"
                        placeholder={locale === "uz" ? "dan" : "от"}
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="h-11 px-3 rounded-[12px] bg-surface-muted/60 border border-border text-sm text-text focus:outline-none focus:border-primary"
                      />
                      <input
                        type="number"
                        inputMode="numeric"
                        placeholder={locale === "uz" ? "gacha" : "до"}
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="h-11 px-3 rounded-[12px] bg-surface-muted/60 border border-border text-sm text-text focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Saralash (Sorting) */}
                  <div className="space-y-2 pt-1">
                    <label className="text-xs font-semibold text-text">
                      {locale === "uz" ? "Saralash" : "Сортировка"}
                    </label>
                    <div className="space-y-1.5">
                      {[
                        { id: "newest", uz: "Eng yangi", ru: "Сначала новые" },
                        { id: "price_asc", uz: "Arzonroq", ru: "Сначала дешевле" },
                        { id: "price_desc", uz: "Qimmatroq", ru: "Сначала дороже" },
                        { id: "popular", uz: "Koʻp koʻrilgan", ru: "По популярности" }
                      ].map((s) => (
                        <label
                          key={s.id}
                          className="flex items-center justify-between p-2.5 rounded-[12px] bg-surface-muted/40 border border-border/60 text-xs font-medium cursor-pointer"
                        >
                          <span className="text-text">{locale === "uz" ? s.uz : s.ru}</span>
                          <input
                            type="radio"
                            name="sort"
                            value={s.id}
                            checked={sort === s.id}
                            onChange={(e) => setSort(e.target.value)}
                            className="accent-primary w-4 h-4"
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Faqat 4★ va yuqori */}
                  <label className="flex items-center justify-between p-3 rounded-[14px] bg-surface-muted/60 border border-border cursor-pointer">
                    <span className="text-xs font-semibold text-text">
                      {locale === "uz" ? "Faqat 4★ va yuqori sotuvchilar" : "Только 4★ и выше"}
                    </span>
                    <input
                      type="checkbox"
                      checked={onlyFourStars}
                      onChange={(e) => setOnlyFourStars(e.target.checked)}
                      className="accent-primary w-4 h-4 rounded"
                    />
                  </label>
                </div>
              )}

              {/* REGION STEP 1: Select Viloyat */}
              {step === "reg-step1" && (
                <div className="space-y-3 pt-1 animate-in slide-in-from-right-4 duration-200">
                  <div className="flex items-center gap-2 pb-2 border-b border-border">
                    <button
                      type="button"
                      onClick={() => setStep("main")}
                      className="p-1 rounded-btn hover:bg-surface-muted text-text-secondary"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-base font-bold text-text">
                      {locale === "uz" ? "Viloyatni tanlang" : "Выберите область"}
                    </h2>
                  </div>

                  <input
                    type="text"
                    value={pickerSearch}
                    onChange={(e) => setPickerSearch(e.target.value)}
                    placeholder={locale === "uz" ? "Viloyatni qidirish..." : "Поиск области..."}
                    className="w-full h-10 px-3 rounded-[12px] bg-surface-muted border border-border text-xs text-text focus:outline-none"
                  />

                  <div className="divide-y divide-border/60">
                    {/* All Uzbekistan option */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRegion(null);
                        setSelectedDistrict(null);
                        setStep("main");
                      }}
                      className="w-full h-12 flex items-center justify-between text-left text-xs font-semibold text-primary"
                    >
                      <span>{locale === "uz" ? "Butun Oʻzbekiston" : "Весь Узбекистан"}</span>
                      {!selectedRegion && <Check className="w-4 h-4 text-primary" />}
                    </button>

                    {regions
                      .filter((r) =>
                        locale === "uz"
                          ? r.nameUz.toLowerCase().includes(pickerSearch.toLowerCase())
                          : r.nameRu.toLowerCase().includes(pickerSearch.toLowerCase())
                      )
                      .map((reg) => (
                        <button
                          key={reg.id}
                          type="button"
                          onClick={() => {
                            setActiveRegForStep2(reg);
                            setPickerSearch("");
                            setStep("reg-step2");
                          }}
                          className="w-full h-13 py-3 flex items-center justify-between text-left text-xs font-medium text-text hover:text-primary active:bg-surface-muted/60"
                        >
                          <span className="truncate">
                            {locale === "uz" ? reg.nameUz : reg.nameRu}
                          </span>
                          <div className="flex items-center gap-2 text-text-muted">
                            <span className="text-[11px]">{reg.districts.length} tuman</span>
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* REGION STEP 2: Select Tuman */}
              {step === "reg-step2" && activeRegForStep2 && (
                <div className="space-y-3 pt-1 animate-in slide-in-from-right-4 duration-200">
                  <div className="flex items-center gap-2 pb-2 border-b border-border">
                    <button
                      type="button"
                      onClick={() => setStep("reg-step1")}
                      className="p-1 rounded-btn hover:bg-surface-muted text-text-secondary"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-base font-bold text-text truncate">
                      {locale === "uz" ? activeRegForStep2.nameUz : activeRegForStep2.nameRu}
                    </h2>
                  </div>

                  <input
                    type="text"
                    value={pickerSearch}
                    onChange={(e) => setPickerSearch(e.target.value)}
                    placeholder={locale === "uz" ? "Tumanni qidirish..." : "Найти район..."}
                    className="w-full h-10 px-3 rounded-[12px] bg-surface-muted border border-border text-xs text-text focus:outline-none"
                  />

                  <div className="divide-y divide-border/60">
                    {/* All region option */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRegion(activeRegForStep2);
                        setSelectedDistrict(null);
                        setStep("main");
                      }}
                      className="w-full h-12 flex items-center justify-between text-left text-xs font-semibold text-primary"
                    >
                      <span>{locale === "uz" ? "Butun viloyat boʻyicha" : "По всей области"}</span>
                      {selectedRegion?.id === activeRegForStep2.id && !selectedDistrict && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </button>

                    {activeRegForStep2.districts
                      .filter((d) =>
                        locale === "uz"
                          ? d.nameUz.toLowerCase().includes(pickerSearch.toLowerCase())
                          : d.nameRu.toLowerCase().includes(pickerSearch.toLowerCase())
                      )
                      .map((dist) => (
                        <button
                          key={dist.id}
                          type="button"
                          onClick={() => {
                            setSelectedRegion(activeRegForStep2);
                            setSelectedDistrict(dist);
                            setStep("main");
                          }}
                          className="w-full h-12 flex items-center justify-between text-left text-xs font-medium text-text hover:text-primary active:bg-surface-muted/60"
                        >
                          <span className="truncate">
                            {locale === "uz" ? dist.nameUz : dist.nameRu}
                          </span>
                          {selectedDistrict?.id === dist.id && (
                            <Check className="w-4 h-4 text-primary" />
                          )}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* CATEGORY STEP 1: Select Category */}
              {step === "cat-step1" && (
                <div className="space-y-3 pt-1 animate-in slide-in-from-right-4 duration-200">
                  <div className="flex items-center gap-2 pb-2 border-b border-border">
                    <button
                      type="button"
                      onClick={() => setStep("main")}
                      className="p-1 rounded-btn hover:bg-surface-muted text-text-secondary"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-base font-bold text-text">
                      {locale === "uz" ? "Kategoriyani tanlang" : "Выберите категорию"}
                    </h2>
                  </div>

                  <input
                    type="text"
                    value={pickerSearch}
                    onChange={(e) => setPickerSearch(e.target.value)}
                    placeholder={locale === "uz" ? "Kategoriyani qidirish..." : "Поиск категории..."}
                    className="w-full h-10 px-3 rounded-[12px] bg-surface-muted border border-border text-xs text-text focus:outline-none"
                  />

                  <div className="divide-y divide-border/60">
                    {/* All categories option */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory(null);
                        setSelectedProduct(null);
                        setStep("main");
                      }}
                      className="w-full h-12 flex items-center justify-between text-left text-xs font-semibold text-primary"
                    >
                      <span>{locale === "uz" ? "Barcha kategoriyalar" : "Все категории"}</span>
                      {!selectedCategory && <Check className="w-4 h-4 text-primary" />}
                    </button>

                    {categories
                      .filter((c) =>
                        locale === "uz"
                          ? c.nameUz.toLowerCase().includes(pickerSearch.toLowerCase())
                          : c.nameRu.toLowerCase().includes(pickerSearch.toLowerCase())
                      )
                      .map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setActiveCatForStep2(cat);
                            setPickerSearch("");
                            setStep("cat-step2");
                          }}
                          className="w-full h-13 py-3 flex items-center justify-between text-left text-xs font-medium text-text hover:text-primary active:bg-surface-muted/60"
                        >
                          <span className="truncate">
                            {locale === "uz" ? cat.nameUz : cat.nameRu}
                          </span>
                          <div className="flex items-center gap-2 text-text-muted">
                            <span className="text-[11px]">{cat.products.length} mahsulot</span>
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* CATEGORY STEP 2: Select Product + Add New Product */}
              {step === "cat-step2" && activeCatForStep2 && (
                <div className="space-y-3 pt-1 animate-in slide-in-from-right-4 duration-200">
                  <div className="flex items-center gap-2 pb-2 border-b border-border">
                    <button
                      type="button"
                      onClick={() => setStep("cat-step1")}
                      className="p-1 rounded-btn hover:bg-surface-muted text-text-secondary"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-base font-bold text-text truncate">
                      {locale === "uz" ? activeCatForStep2.nameUz : activeCatForStep2.nameRu}
                    </h2>
                  </div>

                  <input
                    type="text"
                    value={pickerSearch}
                    onChange={(e) => setPickerSearch(e.target.value)}
                    placeholder={locale === "uz" ? "Mahsulotni qidirish..." : "Найти товар..."}
                    className="w-full h-10 px-3 rounded-[12px] bg-surface-muted border border-border text-xs text-text focus:outline-none"
                  />

                  <div className="divide-y divide-border/60 max-h-[45vh] overflow-y-auto">
                    {/* All products option */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory(activeCatForStep2);
                        setSelectedProduct(null);
                        setStep("main");
                      }}
                      className="w-full h-12 flex items-center justify-between text-left text-xs font-semibold text-primary"
                    >
                      <span>{locale === "uz" ? "Barcha mahsulotlar" : "Все товары"}</span>
                      {selectedCategory?.id === activeCatForStep2.id && !selectedProduct && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </button>

                    {activeCatForStep2.products
                      .filter((p) =>
                        locale === "uz"
                          ? p.nameUz.toLowerCase().includes(pickerSearch.toLowerCase())
                          : p.nameRu.toLowerCase().includes(pickerSearch.toLowerCase())
                      )
                      .map((prod) => (
                        <button
                          key={prod.id}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(activeCatForStep2);
                            setSelectedProduct(prod);
                            setStep("main");
                          }}
                          className="w-full h-12 flex items-center justify-between text-left text-xs font-medium text-text hover:text-primary active:bg-surface-muted/60"
                        >
                          <span className="truncate">
                            {locale === "uz" ? prod.nameUz : prod.nameRu}
                          </span>
                          {selectedProduct?.id === prod.id && (
                            <Check className="w-4 h-4 text-primary" />
                          )}
                        </button>
                      ))}
                  </div>

                  {/* Add New Product Trigger */}
                  <div className="pt-2 border-t border-border">
                    {!showAddProd ? (
                      <button
                        type="button"
                        onClick={() => setShowAddProd(true)}
                        className="w-full py-2.5 px-3 rounded-[12px] bg-primary/10 text-primary text-xs font-bold flex items-center justify-center gap-1.5 active:scale-98 transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        <span>
                          {locale === "uz"
                            ? "+ Yangi mahsulot nomini qoʻshish"
                            : "+ Добавить новое название"}
                        </span>
                      </button>
                    ) : (
                      <div className="space-y-2 p-3 bg-surface-muted/60 rounded-[14px] border border-border">
                        <div className="text-xs font-semibold text-text">
                          {locale === "uz" ? "Yangi mahsulot nomi" : "Название нового товара"}
                        </div>
                        <input
                          type="text"
                          value={newProdName}
                          onChange={(e) => setNewProdName(e.target.value)}
                          placeholder={locale === "uz" ? "Masalan: Sara kartoshka" : "Например: Картофель"}
                          className="w-full h-10 px-3 rounded-[10px] bg-surface border border-border text-xs text-text focus:outline-none"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setShowAddProd(false)}
                            className="flex-1 py-2 rounded-[10px] bg-surface border border-border text-xs text-text-secondary font-medium"
                          >
                            {locale === "uz" ? "Bekor qilish" : "Отмена"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddNewProductSubmit(activeCatForStep2)}
                            className="flex-1 py-2 rounded-[10px] bg-primary text-white text-xs font-bold"
                          >
                            {locale === "uz" ? "Qoʻshish" : "Добавить"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* STICKY BOTTOM ACTIONS (Section 2.1) */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-surface border-t border-border flex items-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="py-3 px-4 text-xs font-semibold text-text-secondary hover:text-danger active:scale-95 transition-all"
              >
                {locale === "uz" ? "Tozalash" : "Сбросить"}
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="flex-1 py-3.5 px-4 rounded-[14px] bg-primary text-white font-bold text-sm shadow-md active:scale-98 transition-all hover:bg-primary-hover flex items-center justify-center gap-2"
              >
                <span>
                  {locale === "uz" ? "Topish" : "Найти"}
                </span>
                <span className="text-xs font-semibold opacity-90">(30)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 
        ====================================================================
        DESKTOP FILTER BAR (>= 1024px)
        Preserves clean multi-dropdown UI from v2
        ====================================================================
      */}
      <div className="hidden lg:block bg-surface p-4 rounded-card border border-border shadow-xs">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Category Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setCatOpen(!catOpen);
                setRegOpen(false);
              }}
              className="h-10 px-4 rounded-btn bg-surface-muted border border-border text-xs font-medium text-text flex items-center gap-2 hover:border-primary transition-colors"
            >
              <span>
                {selectedCategory
                  ? `${locale === "uz" ? selectedCategory.nameUz : selectedCategory.nameRu}${
                      selectedProduct
                        ? ` → ${locale === "uz" ? selectedProduct.nameUz : selectedProduct.nameRu}`
                        : ""
                    }`
                  : locale === "uz"
                  ? "Kategoriya"
                  : "Категория"}
              </span>
              <ChevronRight className="w-3.5 h-3.5 rotate-90 text-text-muted" />
            </button>

            {catOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-surface border border-border rounded-card shadow-xl z-50 p-2 divide-y divide-border/60">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedProduct(null);
                    setCatOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-primary hover:bg-surface-muted rounded-md"
                >
                  {locale === "uz" ? "Barcha kategoriyalar" : "Все категории"}
                </button>
                <div className="max-h-60 overflow-y-auto pt-1 space-y-0.5">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(c);
                        setSelectedProduct(null);
                        setCatOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-text hover:bg-surface-muted rounded-md flex items-center justify-between"
                    >
                      <span className="truncate">{locale === "uz" ? c.nameUz : c.nameRu}</span>
                      <span className="text-[10px] text-text-muted">({c.products.length})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Region Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setRegOpen(!regOpen);
                setCatOpen(false);
              }}
              className="h-10 px-4 rounded-btn bg-surface-muted border border-border text-xs font-medium text-text flex items-center gap-2 hover:border-primary transition-colors"
            >
              <span>
                {selectedRegion
                  ? `${locale === "uz" ? selectedRegion.nameUz : selectedRegion.nameRu}${
                      selectedDistrict
                        ? ` → ${locale === "uz" ? selectedDistrict.nameUz : selectedDistrict.nameRu}`
                        : ""
                    }`
                  : locale === "uz"
                  ? "Hudud"
                  : "Регион"}
              </span>
              <ChevronRight className="w-3.5 h-3.5 rotate-90 text-text-muted" />
            </button>

            {regOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-surface border border-border rounded-card shadow-xl z-50 p-2 divide-y divide-border/60">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRegion(null);
                    setSelectedDistrict(null);
                    setRegOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-primary hover:bg-surface-muted rounded-md"
                >
                  {locale === "uz" ? "Butun Oʻzbekiston" : "Весь Узбекистан"}
                </button>
                <div className="max-h-60 overflow-y-auto pt-1 space-y-0.5">
                  {regions.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        setSelectedRegion(r);
                        setSelectedDistrict(null);
                        setRegOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-text hover:bg-surface-muted rounded-md flex items-center justify-between"
                    >
                      <span className="truncate">{locale === "uz" ? r.nameUz : r.nameRu}</span>
                      <span className="text-[10px] text-text-muted">({r.districts.length})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Price Range */}
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              placeholder={locale === "uz" ? "Narx dan" : "Цена от"}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-28 h-10 px-3 rounded-btn bg-surface-muted border border-border text-xs text-text focus:outline-none"
            />
            <span className="text-text-muted text-xs">–</span>
            <input
              type="number"
              placeholder={locale === "uz" ? "gacha" : "до"}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-28 h-10 px-3 rounded-btn bg-surface-muted border border-border text-xs text-text focus:outline-none"
            />
          </div>

          {/* Sorting */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-10 px-3 rounded-btn bg-surface-muted border border-border text-xs text-text focus:outline-none"
          >
            <option value="newest">{locale === "uz" ? "Eng yangi" : "Сначала новые"}</option>
            <option value="price_asc">{locale === "uz" ? "Arzonroq" : "Сначала дешевле"}</option>
            <option value="price_desc">{locale === "uz" ? "Qimmatroq" : "Сначала дороже"}</option>
            <option value="popular">{locale === "uz" ? "Koʻp koʻrilgan" : "По популярности"}</option>
          </select>

          {/* 4+ Stars */}
          <label className="flex items-center gap-1.5 text-xs text-text cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyFourStars}
              onChange={(e) => setOnlyFourStars(e.target.checked)}
              className="accent-primary w-4 h-4 rounded"
            />
            <span>4★ +</span>
          </label>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="h-10 px-3 rounded-btn text-xs font-semibold text-text-secondary hover:text-danger hover:bg-surface-muted transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{locale === "uz" ? "Tozalash" : "Сбросить"}</span>
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="h-10 px-5 rounded-btn bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-xs active:scale-95 transition-all"
            >
              {locale === "uz" ? "Qidirish" : "Применить"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
