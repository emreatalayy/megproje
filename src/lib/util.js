/** Küçük yardımcı fonksiyonlar. */

const TR_MAP = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", İ: "i" };

/** Türkçe karakterleri sadeleştirip URL dostu slug üretir. */
function slugify(text) {
  return String(text || "")
    .trim()
    .replace(/[çğıöşüİ]/gi, (c) => TR_MAP[c] || TR_MAP[c.toLowerCase()] || c)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Metinden ~kelime hızına göre okuma süresi (dakika). */
function readingTime(text) {
  const words = String(text || "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** HTML etiketlerini söküp düz metin döndürür (özet/SEO için). */
function stripHtml(html) {
  return String(html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

/** Belirli uzunlukta kısaltma. */
function truncate(text, length = 160) {
  const t = stripHtml(text);
  if (t.length <= length) return t;
  return t.slice(0, length - 1).trimEnd() + "…";
}

/** Firestore Timestamp / Date / string → JS Date. */
function toDate(value) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate();
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Tarihi Türkçe okunur biçime çevirir. */
function formatDate(value) {
  const d = toDate(value);
  if (!d) return "";
  return d.toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" });
}

module.exports = { slugify, readingTime, stripHtml, truncate, toDate, formatDate };
