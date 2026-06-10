const path = require("path");
const express = require("express");
const siteData = require("./data/site");
const apiRouter = require("./routes/api");

const app = express();
const rootDir = path.join(__dirname, "..");

app.set("view engine", "ejs");
app.set("views", path.join(rootDir, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDir, "public")));

app.get("/", (req, res) => {
  res.render("index", { site: siteData });
});

app.use("/api", apiRouter);

app.use((req, res) => {
  res.status(404).render("404", { site: siteData });
});

module.exports = app;
