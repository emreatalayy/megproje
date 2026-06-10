/**
 * Basit, bağımlılıksız admin oturumu.
 *
 * Giriş: env'deki ADMIN_USERNAME / ADMIN_PASSWORD ile karşılaştırılır.
 * Oturum: HMAC-SHA256 ile imzalanmış bir cookie (sunucu tarafı state yok →
 * Vercel serverless uyumlu).
 *
 * Gerekli env:
 *   ADMIN_USERNAME
 *   ADMIN_PASSWORD
 *   SESSION_SECRET   (uzun rastgele bir dize)
 */
const crypto = require("crypto");

const COOKIE_NAME = "meg_admin";
const MAX_AGE_MS = 1000 * 60 * 60 * 12; // 12 saat

function getSecret() {
  return process.env.SESSION_SECRET || "meg-dev-secret-degistir";
}

function sign(value) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
}

function timingSafeEqual(a, b) {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

/**
 * Tanımlı admin kullanıcılarını döndürür.
 * Öncelik: ADMIN_USERS = "kullanici1:sifre1,kullanici2:sifre2"
 * Yedek:   ADMIN_USERNAME + ADMIN_PASSWORD (tek kullanıcı)
 */
function getUsers() {
  const raw = process.env.ADMIN_USERS;
  if (raw && raw.trim()) {
    return raw
      .split(",")
      .map((pair) => {
        const i = pair.indexOf(":");
        if (i < 0) return null;
        return { u: pair.slice(0, i).trim(), p: pair.slice(i + 1) };
      })
      .filter((x) => x && x.u);
  }
  if (process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD) {
    return [{ u: process.env.ADMIN_USERNAME, p: process.env.ADMIN_PASSWORD }];
  }
  return [];
}

/** Hiç admin tanımlı mı? */
function isConfigured() {
  return getUsers().length > 0;
}

/**
 * Kullanıcı adı/şifre doğruysa eşleşen kullanıcı adını, değilse null döner.
 */
function verifyCredentials(username, password) {
  let matched = null;
  // Zamanlama saldırısına karşı tüm kullanıcılar üzerinde döner.
  for (const user of getUsers()) {
    const okUser = timingSafeEqual(username || "", user.u);
    const okPass = timingSafeEqual(password || "", user.p);
    if (okUser && okPass) matched = user.u;
  }
  return matched;
}

/** İmzalı oturum token'ı üret. */
function createToken(username) {
  const payload = JSON.stringify({ u: username, exp: Date.now() + MAX_AGE_MS });
  const data = Buffer.from(payload).toString("base64url");
  return `${data}.${sign(data)}`;
}

/** Token geçerli mi (imza + süre)? */
function verifyToken(token) {
  if (!token || typeof token !== "string") return false;
  const [data, sig] = token.split(".");
  if (!data || !sig) return false;
  if (!timingSafeEqual(sig, sign(data))) return false;
  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8"));
    return typeof payload.exp === "number" && payload.exp > Date.now();
  } catch {
    return false;
  }
}

/** Giriş başarılı → oturum cookie'sini ayarla. */
function setSession(res, username) {
  const secure = process.env.NODE_ENV === "production";
  res.cookie(COOKIE_NAME, createToken(username), {
    httpOnly: true,
    sameSite: "lax",
    secure,
    maxAge: MAX_AGE_MS,
    path: "/",
  });
}

/** Çıkış → cookie'yi temizle. */
function clearSession(res) {
  res.clearCookie(COOKIE_NAME, { path: "/" });
}

/** Korumalı rotalar için middleware. */
function requireAuth(req, res, next) {
  const token = req.cookies && req.cookies[COOKIE_NAME];
  if (verifyToken(token)) return next();
  return res.redirect("/admin/login");
}

/** Şablonlarda kullanmak için: oturum açık mı? */
function isAuthed(req) {
  return verifyToken(req.cookies && req.cookies[COOKIE_NAME]);
}

module.exports = {
  COOKIE_NAME,
  isConfigured,
  verifyCredentials,
  setSession,
  clearSession,
  requireAuth,
  isAuthed,
};
