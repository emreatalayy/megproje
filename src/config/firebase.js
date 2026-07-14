/**
 * Firebase Admin SDK başlatma.
 *
 * Kimlik bilgileri ortam değişkenlerinden (env) okunur. Henüz Firebase
 * yapılandırılmadıysa uygulama çökmtmez; `isConfigured` false döner ve
 * uygulama statik veriye (src/data/site.js) düşer.
 *
 * Gerekli env değişkenleri:
 *   FIREBASE_PROJECT_ID
 *   FIREBASE_CLIENT_EMAIL
 *   FIREBASE_PRIVATE_KEY        (satır sonları \n olarak kaçışlı)
 *
 * Not: Resim yükleme Cloudinary'e taşındı (bkz. src/config/cloudinary.js).
 */
const admin = require("firebase-admin");

let app = null;
let db = null;
let isConfigured = false;
let initError = null;

function init() {
  if (app || initError) return;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    // Firebase yapılandırılmamış — sessizce statik moda düş.
    return;
  }

  // .env içinde \n çoğunlukla literal "\n" olarak gelir; gerçek satır sonuna çevir.
  privateKey = privateKey.replace(/\\n/g, "\n");

  try {
    app = admin.initializeApp({
      credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
    });
    db = admin.firestore();
    db.settings({ ignoreUndefinedProperties: true });
    isConfigured = true;
  } catch (err) {
    initError = err;
    console.error("[firebase] başlatılamadı:", err.message);
  }
}

init();

module.exports = {
  admin,
  get db() {
    return db;
  },
  get isConfigured() {
    return isConfigured;
  },
  FieldValue: admin.firestore.FieldValue,
  Timestamp: admin.firestore.Timestamp,
};
