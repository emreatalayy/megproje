/**
 * Proje verisi servis katmanı.
 *
 * Firebase yapılandırılmışsa Firestore `projects` koleksiyonunu kullanır.
 * Aksi halde statik src/data/site.js içindeki projelere düşer (site çalışır
 * durumda kalır).
 */
const firebase = require("../config/firebase");
const siteData = require("../data/site");
const { slugify, toDate } = require("../lib/util");

const COLLECTION = "projects";

/** Statik fallback projeleri ortak şekle getir. */
function staticProjects() {
  return siteData.projects.items.map((p, i) => ({
    id: p.slug || p.id,
    slug: p.slug,
    name: p.name,
    meta: p.meta,
    description: "",
    image: p.image,
    alt: p.alt,
    side: p.side || (i % 2 === 0 ? "right" : "left"),
    order: i,
    published: true,
    createdAt: null,
  }));
}

function mapDoc(doc) {
  const d = doc.data() || {};
  return {
    id: doc.id,
    slug: d.slug || doc.id,
    name: d.name || "",
    meta: d.meta || "",
    description: d.description || "",
    image: d.image || "",
    alt: d.alt || d.name || "",
    side: d.side || "right",
    order: typeof d.order === "number" ? d.order : 0,
    published: d.published !== false,
    createdAt: toDate(d.createdAt),
    updatedAt: toDate(d.updatedAt),
  };
}

/** Yayındaki projeler (anasayfa için). */
async function listPublished() {
  if (!firebase.isConfigured) return staticProjects();
  const snap = await firebase.db.collection(COLLECTION).where("published", "==", true).get();
  const items = snap.docs.map(mapDoc);
  items.sort((a, b) => a.order - b.order || (b.createdAt - a.createdAt));
  // Anasayfa pac-man düzeni için side'ı sırayla dağıt.
  return items.map((p, i) => ({ ...p, side: i % 2 === 0 ? "right" : "left", id: String(i + 1).padStart(2, "0"), docId: p.id }));
}

/** Tüm projeler (admin için). */
async function listAll() {
  if (!firebase.isConfigured) return staticProjects();
  const snap = await firebase.db.collection(COLLECTION).get();
  const items = snap.docs.map(mapDoc);
  items.sort((a, b) => a.order - b.order || (b.createdAt - a.createdAt));
  return items;
}

async function getById(id) {
  if (!firebase.isConfigured) return staticProjects().find((p) => p.id === id) || null;
  const doc = await firebase.db.collection(COLLECTION).doc(id).get();
  return doc.exists ? mapDoc(doc) : null;
}

async function getBySlug(slug) {
  if (!firebase.isConfigured) return staticProjects().find((p) => p.slug === slug) || null;
  const snap = await firebase.db.collection(COLLECTION).where("slug", "==", slug).limit(1).get();
  return snap.empty ? null : mapDoc(snap.docs[0]);
}

async function create(data) {
  if (!firebase.isConfigured) throw new Error("Firebase yapılandırılmadı.");
  const now = firebase.FieldValue.serverTimestamp();
  const payload = {
    name: data.name,
    slug: data.slug || slugify(data.name),
    meta: data.meta || "",
    description: data.description || "",
    image: data.image || "",
    alt: data.alt || data.name,
    side: data.side || "right",
    order: Number(data.order) || 0,
    published: data.published !== false,
    createdAt: now,
    updatedAt: now,
  };
  const ref = await firebase.db.collection(COLLECTION).add(payload);
  return ref.id;
}

async function update(id, data) {
  if (!firebase.isConfigured) throw new Error("Firebase yapılandırılmadı.");
  const payload = {
    name: data.name,
    slug: data.slug || slugify(data.name),
    meta: data.meta || "",
    description: data.description || "",
    alt: data.alt || data.name,
    side: data.side || "right",
    order: Number(data.order) || 0,
    published: data.published !== false,
    updatedAt: firebase.FieldValue.serverTimestamp(),
  };
  if (data.image) payload.image = data.image;
  await firebase.db.collection(COLLECTION).doc(id).update(payload);
}

async function remove(id) {
  if (!firebase.isConfigured) throw new Error("Firebase yapılandırılmadı.");
  await firebase.db.collection(COLLECTION).doc(id).delete();
}

module.exports = { listPublished, listAll, getById, getBySlug, create, update, remove };
