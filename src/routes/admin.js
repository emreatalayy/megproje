/**
 * Admin paneli rotaları.
 *
 * Giriş (env şifresi) → imzalı cookie oturumu. Korumalı sayfalarda proje ve
 * blog yazıları için tam CRUD + Firebase Storage'a resim yükleme.
 */
const express = require("express");
const multer = require("multer");
const siteData = require("../data/site");
const auth = require("../lib/auth");
const firebase = require("../config/firebase");
const projectsService = require("../services/projects");
const blogService = require("../services/blog");
const { uploadImage } = require("../services/storage");
const { slugify, formatDate } = require("../lib/util");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB
});

function adminView(res, view, opts = {}) {
  res.render(`admin/${view}`, {
    site: siteData,
    layout: false,
    firebaseReady: firebase.isConfigured,
    storageReady: firebase.hasStorage,
    formatDate,
    error: null,
    notice: null,
    ...opts,
  });
}

/* ---- Giriş / Çıkış ---- */

router.get("/login", (req, res) => {
  if (auth.isAuthed(req)) return res.redirect("/admin");
  adminView(res, "login", { configured: auth.isConfigured() });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body || {};
  const matched = auth.verifyCredentials(username, password);
  if (matched) {
    auth.setSession(res, matched);
    return res.redirect("/admin");
  }
  adminView(res, "login", {
    configured: auth.isConfigured(),
    error: "Kullanıcı adı veya şifre hatalı.",
  });
});

router.post("/logout", (req, res) => {
  auth.clearSession(res);
  res.redirect("/admin/login");
});

/* Bundan sonrası korumalı */
router.use(auth.requireAuth);

/* ---- Dashboard ---- */

router.get("/", async (req, res, next) => {
  try {
    const [projects, posts] = await Promise.all([
      projectsService.listAll().catch(() => []),
      blogService.listAll().catch(() => []),
    ]);
    adminView(res, "dashboard", { projects, posts, ok: req.query.ok || null });
  } catch (err) {
    next(err);
  }
});

/* ---- Projeler ---- */

router.get("/projects/new", (req, res) => {
  adminView(res, "project-form", { project: null, action: "/admin/projects" });
});

router.post("/projects", upload.single("image"), async (req, res, next) => {
  try {
    const data = parseProjectBody(req.body);
    if (req.file) data.image = await uploadImage(req.file, "projects");
    await projectsService.create(data);
    res.redirect("/admin?ok=project-created");
  } catch (err) {
    handleFormError(res, "project-form", err, {
      project: { ...req.body },
      action: "/admin/projects",
    });
  }
});

router.get("/projects/:id/edit", async (req, res, next) => {
  try {
    const project = await projectsService.getById(req.params.id);
    if (!project) return res.redirect("/admin");
    adminView(res, "project-form", { project, action: `/admin/projects/${project.id}` });
  } catch (err) {
    next(err);
  }
});

router.post("/projects/:id", upload.single("image"), async (req, res) => {
  try {
    const data = parseProjectBody(req.body);
    if (req.file) data.image = await uploadImage(req.file, "projects");
    await projectsService.update(req.params.id, data);
    res.redirect("/admin?ok=project-updated");
  } catch (err) {
    handleFormError(res, "project-form", err, {
      project: { id: req.params.id, ...req.body },
      action: `/admin/projects/${req.params.id}`,
    });
  }
});

router.post("/projects/:id/delete", async (req, res, next) => {
  try {
    await projectsService.remove(req.params.id);
    res.redirect("/admin?ok=project-deleted");
  } catch (err) {
    next(err);
  }
});

/* ---- Blog ---- */

router.get("/posts/new", (req, res) => {
  adminView(res, "blog-form", { post: null, action: "/admin/posts" });
});

router.post("/posts", upload.single("cover"), async (req, res) => {
  try {
    const data = parsePostBody(req.body);
    if (req.file) data.cover = await uploadImage(req.file, "blog");
    await blogService.create(data);
    res.redirect("/admin?ok=post-created");
  } catch (err) {
    handleFormError(res, "blog-form", err, {
      post: { ...req.body, tags: req.body.tags },
      action: "/admin/posts",
    });
  }
});

router.get("/posts/:id/edit", async (req, res, next) => {
  try {
    const post = await blogService.getById(req.params.id);
    if (!post) return res.redirect("/admin");
    adminView(res, "blog-form", { post, action: `/admin/posts/${post.id}` });
  } catch (err) {
    next(err);
  }
});

router.post("/posts/:id", upload.single("cover"), async (req, res) => {
  try {
    const data = parsePostBody(req.body);
    if (req.file) data.cover = await uploadImage(req.file, "blog");
    await blogService.update(req.params.id, data);
    res.redirect("/admin?ok=post-updated");
  } catch (err) {
    handleFormError(res, "blog-form", err, {
      post: { id: req.params.id, ...req.body },
      action: `/admin/posts/${req.params.id}`,
    });
  }
});

router.post("/posts/:id/delete", async (req, res, next) => {
  try {
    await blogService.remove(req.params.id);
    res.redirect("/admin?ok=post-deleted");
  } catch (err) {
    next(err);
  }
});

/* ---- Yardımcılar ---- */

function parseProjectBody(body) {
  return {
    name: (body.name || "").trim(),
    slug: body.slug ? slugify(body.slug) : slugify(body.name),
    meta: (body.meta || "").trim(),
    description: (body.description || "").trim(),
    alt: (body.alt || "").trim(),
    side: body.side === "left" ? "left" : "right",
    order: Number(body.order) || 0,
    published: body.published === "on" || body.published === "true" || body.published === true,
    image: body.imageUrl || body.image || "",
  };
}

function parsePostBody(body) {
  return {
    title: (body.title || "").trim(),
    slug: body.slug ? slugify(body.slug) : slugify(body.title),
    excerpt: (body.excerpt || "").trim(),
    content: body.content || "",
    coverAlt: (body.coverAlt || "").trim(),
    author: (body.author || "").trim() || "MEG Mimarlık",
    tags: body.tags || "",
    published: body.published === "on" || body.published === "true" || body.published === true,
    cover: body.coverUrl || body.cover || "",
  };
}

function handleFormError(res, view, err, extra) {
  console.error(`[admin] ${view} hata:`, err.message);
  res.status(400).render(`admin/${view}`, {
    site: siteData,
    layout: false,
    firebaseReady: firebase.isConfigured,
    storageReady: firebase.hasStorage,
    formatDate,
    error: err.message || "Bir hata oluştu.",
    notice: null,
    ...extra,
  });
}

module.exports = router;
