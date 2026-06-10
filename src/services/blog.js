/**
 * Blog yazısı servis katmanı.
 *
 * Firestore `posts` koleksiyonunu kullanır. Firebase yoksa boş liste döner
 * (blog sayfası "henüz yazı yok" gösterir).
 */
const firebase = require("../config/firebase");
const { slugify, toDate, readingTime, truncate } = require("../lib/util");

const COLLECTION = "posts";

function mapDoc(doc) {
  const d = doc.data() || {};
  return {
    id: doc.id,
    slug: d.slug || doc.id,
    title: d.title || "",
    excerpt: d.excerpt || truncate(d.content, 160),
    content: d.content || "",
    cover: d.cover || "",
    coverAlt: d.coverAlt || d.title || "",
    author: d.author || "MEG Mimarlık",
    tags: Array.isArray(d.tags) ? d.tags : [],
    published: d.published !== false,
    readingTime: readingTime(d.content),
    createdAt: toDate(d.createdAt),
    updatedAt: toDate(d.updatedAt),
    publishedAt: toDate(d.publishedAt) || toDate(d.createdAt),
  };
}

/** Yayındaki yazılar (blog listesi). */
async function listPublished() {
  if (!firebase.isConfigured) return [];
  const snap = await firebase.db.collection(COLLECTION).where("published", "==", true).get();
  const items = snap.docs.map(mapDoc);
  items.sort((a, b) => (b.publishedAt || 0) - (a.publishedAt || 0));
  return items;
}

/** Tüm yazılar (admin). */
async function listAll() {
  if (!firebase.isConfigured) return [];
  const snap = await firebase.db.collection(COLLECTION).get();
  const items = snap.docs.map(mapDoc);
  items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  return items;
}

async function getById(id) {
  if (!firebase.isConfigured) return null;
  const doc = await firebase.db.collection(COLLECTION).doc(id).get();
  return doc.exists ? mapDoc(doc) : null;
}

async function getBySlug(slug) {
  if (!firebase.isConfigured) return null;
  const snap = await firebase.db.collection(COLLECTION).where("slug", "==", slug).limit(1).get();
  return snap.empty ? null : mapDoc(snap.docs[0]);
}

async function create(data) {
  if (!firebase.isConfigured) throw new Error("Firebase yapılandırılmadı.");
  const now = firebase.FieldValue.serverTimestamp();
  const payload = {
    title: data.title,
    slug: data.slug || slugify(data.title),
    excerpt: data.excerpt || truncate(data.content, 160),
    content: data.content || "",
    cover: data.cover || "",
    coverAlt: data.coverAlt || data.title,
    author: data.author || "MEG Mimarlık",
    tags: parseTags(data.tags),
    published: data.published !== false,
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  };
  const ref = await firebase.db.collection(COLLECTION).add(payload);
  return ref.id;
}

async function update(id, data) {
  if (!firebase.isConfigured) throw new Error("Firebase yapılandırılmadı.");
  const payload = {
    title: data.title,
    slug: data.slug || slugify(data.title),
    excerpt: data.excerpt || truncate(data.content, 160),
    content: data.content || "",
    coverAlt: data.coverAlt || data.title,
    author: data.author || "MEG Mimarlık",
    tags: parseTags(data.tags),
    published: data.published !== false,
    updatedAt: firebase.FieldValue.serverTimestamp(),
  };
  if (data.cover) payload.cover = data.cover;
  await firebase.db.collection(COLLECTION).doc(id).update(payload);
}

async function remove(id) {
  if (!firebase.isConfigured) throw new Error("Firebase yapılandırılmadı.");
  await firebase.db.collection(COLLECTION).doc(id).delete();
}

function parseTags(tags) {
  if (Array.isArray(tags)) return tags;
  return String(tags || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

module.exports = { listPublished, listAll, getById, getBySlug, create, update, remove };
