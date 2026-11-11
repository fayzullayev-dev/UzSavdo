"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "../lib/language";
import { apiFetch } from "../lib/api";
import { Search, RotateCcw, MapPin, ChevronRight, Check } from "lucide-react";

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

  // Dropdown menus visibility
  const [catOpen, setCatOpen] = useState(false);
  const [hoveredCat, setHoveredCat] = useState<Category | null>(null);
  const [prodSearch, setProdSearch] = useState("");

  const [regOpen, setRegOpen] = useState(false);
  const [hoveredReg, setHoveredReg] = useState<Region | null>(null);
  const [distSearch, setDistSearch] = useState("");

  // Modal for new product
  const [showAddProd, setShowAddProd] = useState(false);
  const [newProdNameUz, setNewProdNameUz] = useState("");
  const [newProdNameRu, setNewProdNameRu] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([apiFetch("/categories"), apiFetch("/regions")])
      .then(([cats, regs]) => {
        setCategories(cats);
        setRegions(regs);
      })
      .catch(console.error);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000); // 2 seconds toast
  };

  const handleApply = () => {
    onApply({
      categoryId: selectedCategory?.id,
      productId: selectedProduct?.id,
      regionId: selectedRegion?.id,
      districtId: selectedDistrict?.id,
      minPrice,
      maxPrice,
      sort,
      onlyFourStars
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
    onApply({});
  };

  const handleAddNewProduct = async () => {
    if (!newProdNameUz.trim() || !hoveredCat) return;
    try {
      const res = await apiFetch("/products", {
        method: "POST",
        body: JSON.stringify({
          categoryId: hoveredCat.id,
          nameUz: newProdNameUz.trim(),
          nameRu: newProdNameRu.trim() || newProdNameUz.trim()
        })
      });

      if (res.duplicate) {
        showToast(
          locale === "uz"
            ? "Bu mahsulot nomi allaqachon mavjud"
            : "Такое название товара уже существует"
        );
      } else {
        showToast(
          locale === "uz" ? "Mahsulot nomi qoʻshildi" : "Название товара добавлено"
        );
        setSelectedCategory(hoveredCat);
        setSelectedProduct(res.product);
        setShowAddProd(false);
        setCatOpen(false);
      }
    } catch {
      showToast(locale === "uz" ? "Xatolik yuz berdi" : "Произошла ошибка");
    }
  };

  return (
    <div className="bg-surface border border-border rounded-card p-4 shadow-sm mb-6 relative">
      {/* 2-second Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 md:top-6 md:right-6 z-50 bg-primary text-white text-sm font-medium px-4 py-3 rounded-btn shadow-xl animate-in fade-in slide-in-from-top-2">
          {toastMessage}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
        {/* Category & Product Selector */}
        <div className="relative">
          <label className="text-xs font-semibold text-text-secondary block mb-1">
            {locale === "uz" ? "Kategoriya va mahsulot" : "Категория и товар"}
          </label>
          <button
            type="button"
            onClick={() => {
              setCatOpen(!catOpen);
              setRegOpen(false);
            }}
            className="w-full h-11 px-3 bg-surface-muted border border-border rounded-btn text-left text-sm flex items-center justify-between truncate"
          >
            <span className="truncate">
              {selectedProduct
                ? `${selectedCategory ? (locale === "uz" ? selectedCategory.nameUz : selectedCategory.nameRu) : ""} → ${
                    locale === "uz" ? selectedProduct.nameUz : selectedProduct.nameRu
                  }`
                : selectedCategory
                ? locale === "uz"
                  ? selectedCategory.nameUz
                  : selectedCategory.nameRu
                : t("listing.selectCategory")}
            </span>
            <ChevronRight className="w-4 h-4 text-text-muted shrink-0" />
          </button>

          {/* Flyout Category Menu */}
          {catOpen && (
            <div className="absolute top-full left-0 mt-1 z-50 flex shadow-2xl bg-surface border border-border rounded-card overflow-hidden">
              {/* Category Column */}
              <div className="w-64 max-h-80 overflow-y-auto border-r border-border py-1">
                {categories.map((c) => (
                  <div
                    key={c.id}
                    onMouseEnter={() => setHoveredCat(c)}
                    onClick={() => setHoveredCat(c)}
                    className={`px-3.5 py-2 text-sm flex items-center justify-between cursor-pointer hover:bg-surface-muted ${
                      hoveredCat?.id === c.id ? "bg-primary-soft text-primary font-medium" : "text-text"
                    }`}
                  >
                    <span>{locale === "uz" ? c.nameUz : c.nameRu}</span>
                    <ChevronRight className="w-4 h-4 text-text-muted" />
                  </div>
                ))}
              </div>

              {/* Products Flyout Column */}
              {hoveredCat && (
                <div className="w-72 max-h-80 overflow-y-auto p-2 bg-surface flex flex-col justify-between">
                  <div>
                    <input
                      type="text"
                      placeholder={locale === "uz" ? "Mahsulotni qidirish..." : "Найти товар..."}
                      value={prodSearch}
                      onChange={(e) => setProdSearch(e.target.value)}
                      className="w-full h-9 px-3 rounded-btn bg-surface-muted border border-border text-xs mb-2 focus:outline-none"
                    />
                    <div
                      onClick={() => {
                        setSelectedCategory(hoveredCat);
                        setSelectedProduct(null);
                        setCatOpen(false);
                      }}
                      className="px-2.5 py-1.5 text-xs font-semibold rounded-btn cursor-pointer hover:bg-surface-muted text-primary"
                    >
                      {t("listing.allProducts")}
                    </div>
                    {hoveredCat.products
                      .filter((p) =>
                        (locale === "uz" ? p.nameUz : p.nameRu).toLowerCase().includes(prodSearch.toLowerCase())
                      )
                      .map((p) => (
                        <div
                          key={p.id}
                          onClick={() => {
                            setSelectedCategory(hoveredCat);
                            setSelectedProduct(p);
                            setCatOpen(false);
                          }}
                          className="px-2.5 py-1.5 text-xs rounded-btn cursor-pointer hover:bg-surface-muted flex items-center justify-between text-text"
                        >
                          <span>{locale === "uz" ? p.nameUz : p.nameRu}</span>
                          {selectedProduct?.id === p.id && <Check className="w-3.5 h-3.5 text-primary" />}
                        </div>
                      ))}
                  </div>

                  <button
                    onClick={() => setShowAddProd(true)}
                    className="w-full mt-2 pt-2 border-t border-border text-left text-xs font-medium text-accent hover:underline"
                  >
                    {t("listing.addNewProduct")}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Region & District Selector */}
        <div className="relative">
          <label className="text-xs font-semibold text-text-secondary block mb-1">
            {locale === "uz" ? "Hudud" : "Регион"}
          </label>
          <button
            type="button"
            onClick={() => {
              setRegOpen(!regOpen);
              setCatOpen(false);
            }}
            className="w-full h-11 px-3 bg-surface-muted border border-border rounded-btn text-left text-sm flex items-center justify-between truncate"
          >
            <span className="truncate flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-text-muted shrink-0" />
              {selectedDistrict
                ? `${selectedRegion ? (locale === "uz" ? selectedRegion.nameUz : selectedRegion.nameRu) : ""} → ${
                    locale === "uz" ? selectedDistrict.nameUz : selectedDistrict.nameRu
                  }`
                : selectedRegion
                ? locale === "uz"
                  ? selectedRegion.nameUz
                  : selectedRegion.nameRu
                : t("listing.allUzbekistan")}
            </span>
            <ChevronRight className="w-4 h-4 text-text-muted shrink-0" />
          </button>

          {/* Flyout Region Menu */}
          {regOpen && (
            <div className="absolute top-full left-0 mt-1 z-50 flex shadow-2xl bg-surface border border-border rounded-card overflow-hidden">
              <div className="w-64 max-h-80 overflow-y-auto border-r border-border py-1">
                <div
                  onClick={() => {
                    setSelectedRegion(null);
                    setSelectedDistrict(null);
                    setRegOpen(false);
                  }}
                  className="px-3.5 py-2 text-sm font-semibold text-primary cursor-pointer hover:bg-surface-muted"
                >
                  {t("listing.allUzbekistan")}
                </div>
                {regions.map((r) => (
                  <div
                    key={r.id}
                    onMouseEnter={() => setHoveredReg(r)}
                    onClick={() => setHoveredReg(r)}
                    className={`px-3.5 py-2 text-sm flex items-center justify-between cursor-pointer hover:bg-surface-muted ${
                      hoveredReg?.id === r.id ? "bg-primary-soft text-primary font-medium" : "text-text"
                    }`}
                  >
                    <span>{locale === "uz" ? r.nameUz : r.nameRu}</span>
                    <ChevronRight className="w-4 h-4 text-text-muted" />
                  </div>
                ))}
              </div>

              {hoveredReg && (
                <div className="w-72 max-h-80 overflow-y-auto p-2 bg-surface">
                  <input
                    type="text"
                    placeholder={locale === "uz" ? "Tumanni qidirish..." : "Найти район..."}
                    value={distSearch}
                    onChange={(e) => setDistSearch(e.target.value)}
                    className="w-full h-9 px-3 rounded-btn bg-surface-muted border border-border text-xs mb-2 focus:outline-none"
                  />
                  <div
                    onClick={() => {
                      setSelectedRegion(hoveredReg);
                      setSelectedDistrict(null);
                      setRegOpen(false);
                    }}
                    className="px-2.5 py-1.5 text-xs font-semibold rounded-btn cursor-pointer hover:bg-surface-muted text-primary"
                  >
                    {t("listing.allRegion")}
                  </div>
                  {hoveredReg.districts
                    .filter((d) =>
                      (locale === "uz" ? d.nameUz : d.nameRu).toLowerCase().includes(distSearch.toLowerCase())
                    )
                    .map((d) => (
                      <div
                        key={d.id}
                        onClick={() => {
                          setSelectedRegion(hoveredReg);
                          setSelectedDistrict(d);
                          setRegOpen(false);
                        }}
                        className="px-2.5 py-1.5 text-xs rounded-btn cursor-pointer hover:bg-surface-muted flex items-center justify-between text-text"
                      >
                        <span>{locale === "uz" ? d.nameUz : d.nameRu}</span>
                        {selectedDistrict?.id === d.id && <Check className="w-3.5 h-3.5 text-primary" />}
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Price Range */}
        <div>
          <label className="text-xs font-semibold text-text-secondary block mb-1">
            {locale === "uz" ? "Narx (soʻm)" : "Цена (сум)"}
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder={t("listing.priceFrom")}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-1/2 h-11 px-2.5 bg-surface-muted border border-border rounded-btn text-xs focus:outline-none text-text"
            />
            <input
              type="number"
              placeholder={t("listing.priceTo")}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-1/2 h-11 px-2.5 bg-surface-muted border border-border rounded-btn text-xs focus:outline-none text-text"
            />
          </div>
        </div>

        {/* Sorting */}
        <div>
          <label className="text-xs font-semibold text-text-secondary block mb-1">
            {locale === "uz" ? "Saralash" : "Сортировка"}
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full h-11 px-3 bg-surface-muted border border-border rounded-btn text-xs focus:outline-none text-text font-medium"
          >
            <option value="newest">{t("listing.sortNew")}</option>
            <option value="rating">{locale === "uz" ? "Reyting boʻyicha" : "По рейтингу"}</option>
            <option value="price_asc">{t("listing.sortCheap")}</option>
            <option value="price_desc">{t("listing.sortExpensive")}</option>
          </select>
        </div>

        {/* Rating Filter (Only 4* and above) */}
        <div className="flex items-center pt-6">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-text select-none">
            <input
              type="checkbox"
              checked={onlyFourStars}
              onChange={(e) => setOnlyFourStars(e.target.checked)}
              className="w-4 h-4 text-primary rounded"
            />
            <span>{locale === "uz" ? "Faqat 4★ va yuqori" : "Только 4★ и выше"}</span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-5">
          <button
            onClick={handleApply}
            className="flex-1 h-11 bg-primary text-white text-sm font-semibold rounded-btn hover:bg-primary-hover transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Search className="w-4 h-4" />
            {t("listing.filterFind")}
          </button>
          <button
            onClick={handleReset}
            className="h-11 px-3 border border-border rounded-btn hover:bg-surface-muted text-text-secondary transition-colors"
            title={t("listing.filterReset")}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add New Product Modal */}
      {showAddProd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-modal border border-border p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95">
            <h3 className="font-bold text-lg text-text mb-4">
              {locale === "uz" ? "Yangi mahsulot nomini qoʻshish" : "Добавить новое название товара"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">
                  {locale === "uz" ? "Mahsulot nomi (Oʻzbekcha)" : "Название товара (Узбекский)"}
                </label>
                <input
                  type="text"
                  value={newProdNameUz}
                  onChange={(e) => setNewProdNameUz(e.target.value)}
                  placeholder="Masalan: Qizil olma"
                  className="w-full h-10 px-3 rounded-btn bg-surface-muted border border-border text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">
                  {locale === "uz" ? "Mahsulot nomi (Ruscha)" : "Название товара (Русский)"}
                </label>
                <input
                  type="text"
                  value={newProdNameRu}
                  onChange={(e) => setNewProdNameRu(e.target.value)}
                  placeholder="Например: Красное яблоко"
                  className="w-full h-10 px-3 rounded-btn bg-surface-muted border border-border text-sm focus:outline-none"
                />
              </div>
              <div className="flex gap-3 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddProd(false)}
                  className="px-4 py-2 rounded-btn text-sm font-medium text-text-secondary hover:bg-surface-muted"
                >
                  {t("auth.cancel")}
                </button>
                <button
                  type="button"
                  onClick={handleAddNewProduct}
                  className="px-5 py-2 rounded-btn text-sm font-semibold bg-accent text-white hover:bg-accent-hover"
                >
                  {locale === "uz" ? "Qoʻshish" : "Добавить"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
