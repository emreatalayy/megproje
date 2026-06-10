/**
 * Herkese açık sayfalar: anasayfa, blog listesi/detayı, proje detayı,
 * sitemap.xml ve robots.txt.
 */
const express = require("express");
const siteData = require("../data/site");
const projectsService = require("../services/projects");
const blogService = require("../services/blog");
const { truncate, formatDate } = require("../lib/util");

const router = express.Router();

function siteUrl() {
  return (siteData.meta.siteUrl || "").replace(/\/$/, "");
}

function absUrl(req, pathname) {
  const base = siteUrl() || `${req.protocol}://${req.get("host")}`;
  return base + pathname;
}

/* Anasayfa */
router.get("/", async (req, res, next) => {
  try {
    const projects = await projectsService.listPublished();
    res.render("index", {
      site: siteData,
      projects,
      seo: {
        title: siteData.meta.title,
        description: siteData.meta.description,
        url: absUrl(req, "/"),
        type: "website",
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: siteData.meta.organization.name,
          url: siteData.meta.siteUrl,
          inLanguage: "tr-TR",
          publisher: { "@id": siteData.meta.siteUrl + "/#organization" },
        },
      },
    });
  } catch (err) {
    next(err);
  }
});

/* Blog listesi */
router.get("/blog", async (req, res, next) => {
  try {
    const posts = await blogService.listPublished();
    res.render("blog/index", {
      site: siteData,
      posts,
      formatDate,
      seo: {
        title: "Blog | MEG Mimarlık",
        description:
          "Mimarlık, iç mekan ve kentsel tasarım üzerine MEG Mimarlık günlüğü — fikirler, projeler ve süreçler.",
        url: absUrl(req, "/blog"),
        type: "website",
        breadcrumb: [
          { name: "Ana Sayfa", url: absUrl(req, "/") },
          { name: "Blog", url: absUrl(req, "/blog") },
        ],
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "MEG Mimarlık Blog",
          url: absUrl(req, "/blog"),
        },
      },
    });
  } catch (err) {
    next(err);
  }
});

/* Blog yazısı detayı */
router.get("/blog/:slug", async (req, res, next) => {
  try {
    const post = await blogService.getBySlug(req.params.slug);
    if (!post || !post.published) {
      return res.status(404).render("404", { site: siteData, seo: { title: "Bulunamadı | MEG Mimarlık", noindex: true } });
    }
    const url = absUrl(req, `/blog/${post.slug}`);
    res.render("blog/post", {
      site: siteData,
      post,
      formatDate,
      seo: {
        title: `${post.title} | MEG Mimarlık`,
        description: post.excerpt || truncate(post.content, 160),
        url,
        image: post.cover || siteData.meta.ogImage,
        type: "article",
        publishedTime: post.publishedAt ? post.publishedAt.toISOString() : undefined,
        modifiedTime: post.updatedAt ? post.updatedAt.toISOString() : undefined,
        breadcrumb: [
          { name: "Ana Sayfa", url: absUrl(req, "/") },
          { name: "Blog", url: absUrl(req, "/blog") },
          { name: post.title, url },
        ],
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          image: post.cover || siteData.meta.ogImage,
          datePublished: post.publishedAt ? post.publishedAt.toISOString() : undefined,
          dateModified: post.updatedAt ? post.updatedAt.toISOString() : undefined,
          author: { "@type": "Organization", name: post.author },
          publisher: {
            "@type": "Organization",
            name: siteData.meta.organization.name,
            logo: { "@type": "ImageObject", url: siteData.meta.ogImage },
          },
          mainEntityOfPage: { "@type": "WebPage", "@id": url },
        },
      },
    });
  } catch (err) {
    next(err);
  }
});

/* Proje detayı */
router.get("/projeler/:slug", async (req, res, next) => {
  try {
    const project = await projectsService.getBySlug(req.params.slug);
    if (!project || project.published === false) {
      return res.status(404).render("404", { site: siteData, seo: { title: "Bulunamadı | MEG Mimarlık", noindex: true } });
    }
    const url = absUrl(req, `/projeler/${project.slug}`);
    res.render("project", {
      site: siteData,
      project,
      seo: {
        title: `${project.name} | MEG Mimarlık`,
        description: project.description ? truncate(project.description, 160) : project.meta,
        url,
        image: project.image || siteData.meta.ogImage,
        type: "article",
        breadcrumb: [
          { name: "Ana Sayfa", url: absUrl(req, "/") },
          { name: "Projeler", url: absUrl(req, "/#projects") },
          { name: project.name, url },
        ],
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: project.name,
          description: project.description || project.meta,
          image: project.image,
          url,
          creator: { "@type": "Organization", name: siteData.meta.organization.name },
        },
      },
    });
  } catch (err) {
    next(err);
  }
});

/* robots.txt */
router.get("/robots.txt", (req, res) => {
  const base = siteUrl() || `${req.protocol}://${req.get("host")}`;
  res.type("text/plain").send(`User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${base}/sitemap.xml
`);
});

/* sitemap.xml */
router.get("/sitemap.xml", async (req, res, next) => {
  try {
    const [projects, posts] = await Promise.all([
      projectsService.listAll().catch(() => []),
      blogService.listPublished().catch(() => []),
    ]);

    const urls = [
      { loc: absUrl(req, "/"), priority: "1.0", changefreq: "weekly" },
      { loc: absUrl(req, "/blog"), priority: "0.8", changefreq: "weekly" },
    ];

    projects
      .filter((p) => p.published !== false && p.slug)
      .forEach((p) => {
        urls.push({
          loc: absUrl(req, `/projeler/${p.slug}`),
          priority: "0.7",
          changefreq: "monthly",
          lastmod: p.updatedAt ? p.updatedAt.toISOString() : undefined,
        });
      });

    posts.forEach((p) => {
      urls.push({
        loc: absUrl(req, `/blog/${p.slug}`),
        priority: "0.6",
        changefreq: "monthly",
        lastmod: (p.updatedAt || p.publishedAt) ? (p.updatedAt || p.publishedAt).toISOString() : undefined,
      });
    });

    const xml =
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      urls
        .map(
          (u) =>
            `  <url>\n    <loc>${u.loc}</loc>\n` +
            (u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>\n` : "") +
            `    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
        )
        .join("\n") +
      `\n</urlset>\n`;

    res.type("application/xml").send(xml);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
