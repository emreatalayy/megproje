/**
 * Firebase Storage'a resim yükleme.
 *
 * multer ile bellekte tutulan dosya buffer'ını Storage'a yazar ve herkese
 * açık (public) bir URL döndürür.
 */
const crypto = require("crypto");
const path = require("path");
const firebase = require("../config/firebase");

const ALLOWED = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".svg"]);

/**
 * @param {Express.Multer.File} file  multer bellek dosyası
 * @param {string} folder             "projects" | "blog"
 * @returns {Promise<string>}         public URL
 */
async function uploadImage(file, folder = "uploads") {
  if (!file) return "";
  if (!firebase.hasStorage) {
    throw new Error("Firebase Storage yapılandırılmadı (FIREBASE_STORAGE_BUCKET eksik).");
  }

  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED.has(ext)) {
    throw new Error("Desteklenmeyen dosya türü. JPG, PNG, WEBP, GIF, AVIF veya SVG yükleyin.");
  }

  const name = `${folder}/${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
  const token = crypto.randomUUID();
  const blob = firebase.bucket.file(name);

  await blob.save(file.buffer, {
    resumable: false,
    contentType: file.mimetype,
    metadata: {
      cacheControl: "public, max-age=31536000",
      metadata: { firebaseStorageDownloadTokens: token },
    },
  });

  // Token tabanlı public URL (kovayı public yapmaya gerek kalmadan erişilir).
  const encoded = encodeURIComponent(name);
  return `https://firebasestorage.googleapis.com/v0/b/${firebase.bucket.name}/o/${encoded}?alt=media&token=${token}`;
}

module.exports = { uploadImage };
