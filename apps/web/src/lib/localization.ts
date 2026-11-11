export function formatUnit(unit: string | undefined | null, locale: string): string {
  if (!unit) return "";
  const u = unit.toLowerCase();
  if (locale === "ru") {
    switch (u) {
      case "kg":
        return "кг";
      case "tonna":
        return "т";
      case "dona":
        return "шт.";
      case "litr":
        return "л";
      case "qop":
        return "мешок";
      case "quti":
        return "коробка";
      default:
        return unit;
    }
  }
  return unit;
}

export function formatCurrency(amount: number | string | undefined | null, locale: string): string {
  const num = Number(amount) || 0;
  const formatted = num.toLocaleString("ru-RU");
  return locale === "ru" ? `${formatted} сум` : `${formatted} soʻm`;
}

export function formatListingDate(dateString: string | undefined | null, locale: string): string {
  if (!dateString) return "";
  const d = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return locale === "ru" ? "Сегодня" : "Bugun";
  if (diffDays === 1) return locale === "ru" ? "Вчера" : "Kecha";
  return d.toLocaleDateString(locale === "ru" ? "ru-RU" : "uz-UZ", {
    day: "numeric",
    month: "short"
  });
}
