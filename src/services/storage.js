/**
 * Cloudinary'e resim yükleme.
 *
 * multer ile bellekte tutulan dosya buffer'ını Cloudinary'e yükler ve herkese
 * açık (public), CDN üzerinden servis edilen bir URL döndürür.
 */
const path = require("path");
const cloud = require("../config/cloudinary");

const ALLOWED = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".svg"]);

/**
 * @param {Express.Multer.File} file  multer bellek dosyası
 * @param {string} folder             "projects" | "blog"
 * @returns {Promise<string>}         public (secure) URL
 */
async function uploadImage(file, folder = "uploads") {
  if (!file) return "";
  if (!cloud.isConfigured) {
    throw new Error("Cloudinary yapılandırılmadı (CLOUDINARY_URL veya CLOUDINARY_* env değişkenleri eksik).");
  }

  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED.has(ext)) {
    throw new Error("Desteklenmeyen dosya türü. JPG, PNG, WEBP, GIF, AVIF veya SVG yükleyin.");
  }

  const result = await new Promise((resolve, reject) => {
    const stream = cloud.cloudinary.uploader.upload_stream(
      {
        folder: `meg/${folder}`,
        resource_type: "image",
        // Aynı isimden gelen çakışmaları önlemek için benzersiz public_id üret.
        use_filename: false,
        unique_filename: true,
        overwrite: false,
      },
      (error, uploaded) => {
        if (error) return reject(error);
        resolve(uploaded);
      }
    );
    stream.end(file.buffer);
  });

  return result.secure_url;
}

/** Yükleme özelliğinin aktif olup olmadığını bildirir (admin panel formları için). */
function hasStorage() {
  return cloud.isConfigured;
}

module.exports = { uploadImage, hasStorage };
