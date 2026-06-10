/**
 * İletişim formu e-posta gönderimi (nodemailer).
 *
 * SMTP bilgileri env'den okunur. Yapılandırılmamışsa e-posta gönderilmez,
 * sadece konsola loglanır (geliştirme/yedek davranış).
 *
 * Gerekli env:
 *   SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS
 *   CONTACT_TO    (bildirimlerin gideceği adres)
 *   CONTACT_FROM  (gönderen; çoğu sağlayıcı SMTP_USER ile aynı olmasını ister)
 */
const nodemailer = require("nodemailer");

let transporter = null;
let configured = false;

function init() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return;

  const port = Number(process.env.SMTP_PORT) || 465;
  const secure =
    process.env.SMTP_SECURE != null
      ? process.env.SMTP_SECURE === "true"
      : port === 465;

  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass: pass.replace(/\s+/g, "") }, // app password'ta boşlukları temizle
  });
  configured = true;
}

init();

function isConfigured() {
  return configured;
}

/** SMTP bağlantısını doğrula (test amaçlı). */
async function verify() {
  if (!transporter) throw new Error("SMTP yapılandırılmadı.");
  return transporter.verify();
}

function escapeHtml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * İletişim formundan gelen mesajı e-posta olarak gönderir.
 * @param {{name:string,email:string,message:string}} data
 */
async function sendContact(data) {
  const to = process.env.CONTACT_TO || process.env.SMTP_USER;
  const from =
    process.env.CONTACT_FROM ||
    `"MEG Mimarlık Web" <${process.env.SMTP_USER}>`;

  if (!transporter) {
    console.log("[contact] (SMTP kapalı, loglandı)", data);
    return { delivered: false };
  }

  const subject = `Yeni iletişim mesajı — ${data.name}`;
  const text =
    `Ad Soyad: ${data.name}\n` +
    `E-posta: ${data.email}\n\n` +
    `Mesaj:\n${data.message}\n`;
  const html =
    `<div style="font-family:Arial,sans-serif;font-size:15px;color:#1a1714;">` +
    `<h2 style="margin:0 0 12px;">Yeni iletişim mesajı</h2>` +
    `<p><strong>Ad Soyad:</strong> ${escapeHtml(data.name)}</p>` +
    `<p><strong>E-posta:</strong> <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></p>` +
    `<p><strong>Mesaj:</strong></p>` +
    `<p style="white-space:pre-line;border-left:3px solid #b5512a;padding-left:12px;">${escapeHtml(data.message)}</p>` +
    `<hr style="border:none;border-top:1px solid #eee;margin:16px 0;" />` +
    `<p style="color:#7a7168;font-size:13px;">megmimarlik web sitesi iletişim formu</p>` +
    `</div>`;

  await transporter.sendMail({
    from,
    to,
    replyTo: data.email,
    subject,
    text,
    html,
  });
  return { delivered: true };
}

module.exports = { isConfigured, verify, sendContact };
