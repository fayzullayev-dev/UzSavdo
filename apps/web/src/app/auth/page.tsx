"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "../../lib/language";
import { useAuth } from "../../lib/auth";
import { apiFetch } from "../../lib/api";
import { Building2, User, Phone, MapPin, Lock, Eye, EyeOff, CheckCircle2, ShieldCheck, X } from "lucide-react";

function AuthComponent() {
  const { locale, setLocale, t } = useLanguage();
  const { user, login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<"login" | "register">(tabParam === "register" ? "register" : "login");

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user]);

  // Update tab state when URL changes
  useEffect(() => {
    if (tabParam === "register") {
      setActiveTab("register");
    } else {
      setActiveTab("login");
    }
  }, [tabParam]);

  const switchTab = (tab: "login" | "register") => {
    setActiveTab(tab);
    router.replace(`/auth?tab=${tab}`);
  };

  // Login Form State
  const [loginForm, setLoginForm] = useState({ login: "", password: "", rememberMe: false });
  const [loginShowPassword, setLoginShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register Form State
  const [regions, setRegions] = useState<any[]>([]);
  const [regForm, setRegForm] = useState({
    companyName: "",
    firstName: "",
    lastName: "",
    phone: "+998 (",
    regionId: "",
    districtId: "",
    email: "",
    login: "",
    password: "",
    confirmPassword: ""
  });
  const [regShowPassword, setRegShowPassword] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  // Agreement Modal
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const [agreementText, setAgreementText] = useState({ textUz: "", textRu: "" });

  useEffect(() => {
    Promise.all([apiFetch("/regions"), apiFetch("/auth/agreement")])
      .then(([regs, agr]) => {
        setRegions(regs || []);
        if (regs && regs.length > 0) {
          setRegForm((f) => ({
            ...f,
            regionId: regs[0].id,
            districtId: regs[0].districts[0]?.id || ""
          }));
        }
        if (agr) {
          setAgreementText({ textUz: agr.textUz, textRu: agr.textRu });
        }
      })
      .catch(console.error);
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(loginForm)
      });
      login(res.user);
      router.push("/");
    } catch (err: any) {
      setLoginError(err.message || t("auth.wrongCredentials"));
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterPreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (regForm.password !== regForm.confirmPassword) {
      setRegError(locale === "uz" ? "Parollar mos kelmadi" : "Пароли не совпадают");
      return;
    }

    if (regForm.password.length < 8) {
      setRegError(
        locale === "uz"
          ? "Parol kamida 8 ta belgidan iborat boʻlishi kerak"
          : "Пароль должен содержать не менее 8 символов"
      );
      return;
    }

    setShowAgreementModal(true);
  };

  const handleAgreeAndRegister = async () => {
    setRegLoading(true);
    try {
      const res = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(regForm)
      });
      login(res.user);
      router.push("/");
    } catch (err: any) {
      setRegError(err.message || "Xatolik yuz berdi");
      setShowAgreementModal(false);
    } finally {
      setRegLoading(false);
    }
  };

  const handleScrollAgreement = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 25) {
      setHasScrolledToEnd(true);
    }
  };

  const selectedRegionObj = regions.find((r) => r.id === regForm.regionId);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Banner */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#1F5F4A] to-[#2C7A5F] text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-btn bg-white text-primary flex items-center justify-center font-bold text-xl shadow-md">
            UZ
          </div>
          <span className="font-bold text-2xl tracking-tight">UzSavdo</span>
        </div>

        <div className="max-w-md space-y-6">
          <h1 className="text-3xl font-extrabold leading-tight">
            {locale === "uz" ? "Oʻzbekiston boʻylab savdo maydonchasi" : "Торговая площадка по всему Узбекистану"}
          </h1>
          <p className="text-sm text-white/80 leading-relaxed">
            {locale === "uz"
              ? "Mahsulotlarni joylashtiring, xaridor toping, rasmiy shartnoma tuzing"
              : "Размещайте товары, находите покупателей, заключайте официальные договоры"}
          </p>
          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle2 className="w-5 h-5 text-accent" />
              <span>{locale === "uz" ? "Butun Oʻzbekiston boʻylab xaridorlar" : "Покупатели по всему Узбекистану"}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle2 className="w-5 h-5 text-accent" />
              <span>{locale === "uz" ? "Rasmiy shartnoma asosida savdo" : "Торговля на основе официального договора"}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle2 className="w-5 h-5 text-accent" />
              <span>{locale === "uz" ? "Oʻzbek va rus tillarida toʻliq interfeys" : "На узбекском и русском языках"}</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-white/60">
          © 2026 UzSavdo. Oʻzbekiston Respublikasi qonunchiligi asosida faoliyat yuritadi.
        </div>
      </div>

      {/* Right Form Container */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 relative">
        {/* Language switch */}
        <div className="absolute top-6 right-6 flex items-center bg-surface-muted p-1 rounded-btn border border-border text-xs font-semibold z-10">
          <button
            onClick={() => setLocale("uz")}
            className={`px-2.5 py-1 rounded-md transition-all ${
              locale === "uz" ? "bg-primary text-white" : "text-text-secondary"
            }`}
          >
            UZ
          </button>
          <button
            onClick={() => setLocale("ru")}
            className={`px-2.5 py-1 rounded-md transition-all ${
              locale === "ru" ? "bg-primary text-white" : "text-text-secondary"
            }`}
          >
            RU
          </button>
        </div>

        <div className="w-full max-w-[480px] bg-surface rounded-modal border border-border p-7 sm:p-9 shadow-xl transition-all">
          {/* Segmented Switcher Tabs */}
          <div className="flex bg-surface-muted p-1 rounded-btn border border-border mb-6">
            <button
              type="button"
              onClick={() => switchTab("login")}
              className={`flex-1 py-2 rounded-btn text-xs font-bold transition-all ${
                activeTab === "login"
                  ? "bg-primary text-white shadow-sm"
                  : "text-text-secondary hover:text-text"
              }`}
            >
              {t("auth.signIn")}
            </button>
            <button
              type="button"
              onClick={() => switchTab("register")}
              className={`flex-1 py-2 rounded-btn text-xs font-bold transition-all ${
                activeTab === "register"
                  ? "bg-primary text-white shadow-sm"
                  : "text-text-secondary hover:text-text"
              }`}
            >
              {t("auth.signUp")}
            </button>
          </div>

          {/* Tab 1: LOGIN */}
          {activeTab === "login" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-text mb-1">{t("auth.welcome")}</h2>
                <p className="text-xs text-text-secondary">{t("auth.loginSubtitle")}</p>
              </div>

              {loginError && (
                <div className="mb-4 p-3 bg-danger/10 border border-danger/30 rounded-btn text-xs text-danger font-medium">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-text-secondary block mb-1">
                    {t("auth.login")}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={loginForm.login}
                      onChange={(e) => setLoginForm({ ...loginForm, login: e.target.value })}
                      placeholder={locale === "uz" ? "Loginni kiriting" : "Введите логин"}
                      className="w-full h-11 pl-9 pr-3 rounded-btn bg-surface-muted border border-border text-sm focus:outline-none focus:border-primary text-text"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-text-secondary block mb-1">
                    {t("auth.password")}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={loginShowPassword ? "text" : "password"}
                      required
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full h-11 pl-9 pr-10 rounded-btn bg-surface-muted border border-border text-sm focus:outline-none focus:border-primary text-text"
                    />
                    <button
                      type="button"
                      onClick={() => setLoginShowPassword(!loginShowPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                    >
                      {loginShowPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-text-secondary">
                    <input
                      type="checkbox"
                      checked={loginForm.rememberMe}
                      onChange={(e) => setLoginForm({ ...loginForm, rememberMe: e.target.checked })}
                      className="rounded text-primary focus:ring-0"
                    />
                    <span>{t("auth.rememberMe")}</span>
                  </label>
                  <a href="#" className="text-primary hover:underline font-medium">
                    {t("auth.forgotPassword")}
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full h-12 bg-primary text-white font-bold rounded-btn hover:bg-primary-hover active:scale-[0.99] transition-all shadow-md disabled:opacity-50 text-sm"
                >
                  {loginLoading ? "..." : t("auth.signIn")}
                </button>
              </form>
            </div>
          )}

          {/* Tab 2: REGISTER */}
          {activeTab === "register" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="text-center mb-5">
                <h2 className="text-xl font-bold text-text mb-1">{t("auth.signUp")}</h2>
                <p className="text-xs text-text-secondary">{t("auth.registerSubtitle")}</p>
              </div>

              {regError && (
                <div className="mb-4 p-3 bg-danger/10 border border-danger/30 rounded-btn text-xs text-danger font-medium">
                  {regError}
                </div>
              )}

              <form onSubmit={handleRegisterPreSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-text-secondary block mb-1">
                    {t("auth.companyName")} *
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={regForm.companyName}
                      onChange={(e) => setRegForm({ ...regForm, companyName: e.target.value })}
                      placeholder="Masalan: «Sharq Agro» MChJ"
                      className="w-full h-10 pl-9 pr-3 rounded-btn bg-surface-muted border border-border text-xs focus:outline-none focus:border-primary text-text"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-text-secondary block mb-1">
                      {t("auth.firstName")} *
                    </label>
                    <input
                      type="text"
                      required
                      value={regForm.firstName}
                      onChange={(e) => setRegForm({ ...regForm, firstName: e.target.value })}
                      placeholder="Alisher"
                      className="w-full h-10 px-3 rounded-btn bg-surface-muted border border-border text-xs focus:outline-none focus:border-primary text-text"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-text-secondary block mb-1">
                      {t("auth.lastName")} *
                    </label>
                    <input
                      type="text"
                      required
                      value={regForm.lastName}
                      onChange={(e) => setRegForm({ ...regForm, lastName: e.target.value })}
                      placeholder="Usmonov"
                      className="w-full h-10 px-3 rounded-btn bg-surface-muted border border-border text-xs focus:outline-none focus:border-primary text-text"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-text-secondary block mb-1">
                    {t("auth.phone")} *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={regForm.phone}
                      onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                      placeholder="+998 (90) 123-45-67"
                      className="w-full h-10 pl-9 pr-3 rounded-btn bg-surface-muted border border-border text-xs focus:outline-none focus:border-primary text-text"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-text-secondary block mb-1">
                      {locale === "uz" ? "Viloyat" : "Область"} *
                    </label>
                    <select
                      value={regForm.regionId}
                      onChange={(e) => {
                        const r = regions.find((reg) => reg.id === e.target.value);
                        setRegForm({
                          ...regForm,
                          regionId: e.target.value,
                          districtId: r?.districts[0]?.id || ""
                        });
                      }}
                      className="w-full h-10 px-2 bg-surface-muted border border-border rounded-btn text-xs focus:outline-none text-text"
                    >
                      {regions.map((r) => (
                        <option key={r.id} value={r.id}>
                          {locale === "uz" ? r.nameUz : r.nameRu}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-text-secondary block mb-1">
                      {locale === "uz" ? "Tuman" : "Район"} *
                    </label>
                    <select
                      value={regForm.districtId}
                      onChange={(e) => setRegForm({ ...regForm, districtId: e.target.value })}
                      className="w-full h-10 px-2 bg-surface-muted border border-border rounded-btn text-xs focus:outline-none text-text"
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
                  <label className="font-semibold text-text-secondary block mb-1">
                    {t("auth.login")} *
                  </label>
                  <input
                    type="text"
                    required
                    value={regForm.login}
                    onChange={(e) => setRegForm({ ...regForm, login: e.target.value })}
                    placeholder="login"
                    className="w-full h-10 px-3 rounded-btn bg-surface-muted border border-border text-xs focus:outline-none focus:border-primary text-text"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-text-secondary block mb-1">
                      {t("auth.password")} *
                    </label>
                    <input
                      type={regShowPassword ? "text" : "password"}
                      required
                      value={regForm.password}
                      onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full h-10 px-3 rounded-btn bg-surface-muted border border-border text-xs focus:outline-none focus:border-primary text-text"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-text-secondary block mb-1">
                      {t("auth.confirmPassword")} *
                    </label>
                    <input
                      type={regShowPassword ? "text" : "password"}
                      required
                      value={regForm.confirmPassword}
                      onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full h-10 px-3 rounded-btn bg-surface-muted border border-border text-xs focus:outline-none focus:border-primary text-text"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-11 mt-3 bg-accent text-white font-bold rounded-btn hover:bg-accent-hover active:scale-[0.99] transition-all shadow-md text-xs"
                >
                  {t("auth.signUp")}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* User Agreement Modal */}
      {showAgreementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-modal border border-border w-full max-w-xl shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-base text-text flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                {t("auth.agreementTitle")}
              </h3>
              <button
                onClick={() => setShowAgreementModal(false)}
                className="p-1 rounded-btn hover:bg-surface-muted"
              >
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>

            <div
              onScroll={handleScrollAgreement}
              className="p-5 overflow-y-auto flex-1 text-xs text-text-secondary leading-relaxed space-y-3 whitespace-pre-wrap font-sans"
            >
              {locale === "uz" ? agreementText.textUz : agreementText.textRu}
            </div>

            <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
              {!hasScrolledToEnd && (
                <span className="text-[11px] text-text-muted">
                  {t("auth.agreementScrollHint")}
                </span>
              )}
              <div className="flex gap-2 w-full sm:w-auto ml-auto">
                <button
                  type="button"
                  onClick={() => setShowAgreementModal(false)}
                  className="px-4 h-10 rounded-btn border border-border text-xs font-semibold hover:bg-surface-muted"
                >
                  {t("auth.cancel")}
                </button>
                <button
                  type="button"
                  disabled={!hasScrolledToEnd || regLoading}
                  onClick={handleAgreeAndRegister}
                  className="px-6 h-10 bg-accent text-white font-bold rounded-btn hover:bg-accent-hover disabled:opacity-40 transition-all text-xs shadow-md"
                >
                  {regLoading ? "..." : t("auth.iAgree")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <AuthComponent />
    </Suspense>
  );
}