require("dotenv").config();

const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const siteData = require("./data/site");
const apiRouter = require("./routes/api");
const publicRouter = require("./routes/public");
const adminRouter = require("./routes/admin");

const app = express();
const rootDir = path.join(__dirname, "..");

app.set("view engine", "ejs");
app.set("views", path.join(rootDir, "views"));
app.set("trust proxy", true);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(rootDir, "public")));

app.use("/admin", adminRouter);
app.use("/api", apiRouter);
app.use("/", publicRouter);

// 404
app.use((req, res) => {
  res.status(404).render("404", {
    site: siteData,
    seo: { title: "Sayfa bulunamadı | MEG Mimarlık", noindex: true },
  });
});

// Hata yakalayıcı
app.use((err, req, res, next) => {
  console.error("[error]", err);
  res.status(500).render("404", {
    site: siteData,
    seo: { title: "Bir hata oluştu | MEG Mimarlık", noindex: true },
  });
});

module.exports = app;
