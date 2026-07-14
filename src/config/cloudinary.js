/**
 * Cloudinary yapılandırması.
 *
 * Kimlik bilgileri ortam değişkenlerinden okunur. İki yol desteklenir:
 *   1) Tek satır:   CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
 *   2) Ayrı ayrı:   CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 *
 * Yapılandırma yoksa uygulama çökmez; `isConfigured` false döner ve admin
 * panelinde dosya yükleme kapanır (resimler URL yapıştırma ile eklenir).
 */
const { v2: cloudinary } = require("cloudinary");

let isConfigured = false;

function init() {
  const url = process.env.CLOUDINARY_URL;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (url) {
    // CLOUDINARY_URL varsa SDK otomatik okur; sadece secure'u zorunlu kılalım.
    cloudinary.config({ secure: true });
    isConfigured = true;
    return;
  }

  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
    isConfigured = true;
  }
}

init();

module.exports = {
  cloudinary,
  get isConfigured() {
    return isConfigured;
  },
};
