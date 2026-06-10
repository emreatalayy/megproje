const express = require("express");
const siteData = require("../data/site");

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ ok: true, service: "meg-mimarlik" });
});

router.get("/projects", (req, res) => {
  res.json(siteData.projects.items);
});

router.post("/contact", (req, res) => {
  const { name, email, message } = req.body || {};

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({
      ok: false,
      error: "Ad, e-posta ve mesaj zorunludur.",
    });
  }

  // İleride: Resend, Nodemailer, Supabase vb. buraya bağlanır
  console.log("[contact]", { name, email, message });

  res.json({
    ok: true,
    message: "Mesajınız alındı. En kısa sürede dönüş yapacağız.",
  });
});

module.exports = router;
