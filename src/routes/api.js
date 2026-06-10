const express = require("express");
const projectsService = require("../services/projects");
const mailer = require("../services/mailer");

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ ok: true, service: "meg-mimarlik" });
});

router.get("/projects", async (req, res, next) => {
  try {
    res.json(await projectsService.listPublished());
  } catch (err) {
    next(err);
  }
});

router.post("/contact", async (req, res) => {
  const { name, email, message } = req.body || {};

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({
      ok: false,
      error: "Ad, e-posta ve mesaj zorunludur.",
    });
  }

  // Basit e-posta format kontrolü
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ ok: false, error: "Geçerli bir e-posta girin." });
  }

  try {
    await mailer.sendContact({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });
    res.json({
      ok: true,
      message: "Mesajınız alındı. En kısa sürede dönüş yapacağız.",
    });
  } catch (err) {
    console.error("[contact] gönderim hatası:", err.message);
    res.status(500).json({
      ok: false,
      error: "Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyin.",
    });
  }
});

module.exports = router;
