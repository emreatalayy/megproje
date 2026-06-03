import styles from "./page.module.css";

const activities = [
  {
    icon: "🌳",
    title: "Yürüyüş patikaları",
    text: "3 km ana hat ve çocuk dostu kısa rota; her mevsim işaretli.",
  },
  {
    icon: "🧺",
    title: "Piknik alanları",
    text: "Gölgelik masalar, çeşmeler ve atık ayrıştırma noktaları.",
  },
  {
    icon: "🛝",
    title: "Oyun parkı",
    text: "Güvenli zemin, 2–12 yaş grubu için ayrı bölümler.",
  },
  {
    icon: "🐦",
    title: "Kuş gözlem",
    text: "Sessiz kuş kulübesi ve rehberli hafta sonu turları.",
  },
];

const hours = [
  { day: "Pazartesi – Cuma", time: "06:00 – 22:00" },
  { day: "Cumartesi – Pazar", time: "05:30 – 23:00" },
];

export default function ParkPage() {
  return (
    <>
      <header className={styles.header}>
        <div className={`container ${styles.headerInner}`}>
          <a href="#" className={styles.logo}>
            <span className={styles.logoMark} aria-hidden>
              🌿
            </span>
            Yeşil Vadi
          </a>
          <nav className={styles.nav} aria-label="Ana menü">
            <a href="#hakkinda">Hakkında</a>
            <a href="#aktiviteler">Aktiviteler</a>
            <a href="#ziyaret">Ziyaret</a>
            <a href="#iletisim" className={styles.navCta}>
              İletişim
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={`container ${styles.heroGrid}`}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>Şehir merkezine 12 dk</p>
              <h1 className={styles.heroTitle}>
                Doğanın{" "}
                <span className={styles.heroAccent}>nefesini</span> hisset
              </h1>
              <p className={styles.heroLead}>
                Yeşil Vadi Parkı; ağaçlık koridorlar, açık çimen alanlar ve
                aileler için güvenli bir gün geçirme alanı sunar. Ücretsiz
                giriş, her yaş için.
              </p>
              <div className={styles.heroActions}>
                <a href="#ziyaret" className={styles.btnPrimary}>
                  Ziyaret bilgisi
                </a>
                <a href="#aktiviteler" className={styles.btnGhost}>
                  Neler yapılır?
                </a>
              </div>
              <dl className={styles.stats}>
                <div>
                  <dt>Alan</dt>
                  <dd>18 hektar</dd>
                </div>
                <div>
                  <dt>Ağaç</dt>
                  <dd>2.400+</dd>
                </div>
                <div>
                  <dt>Giriş</dt>
                  <dd>Ücretsiz</dd>
                </div>
              </dl>
            </div>
            <div className={styles.heroVisual} aria-hidden>
              <div className={styles.heroCard}>
                <div className={styles.heroScene}>
                  <div className={styles.sun} />
                  <div className={styles.hillBack} />
                  <div className={styles.hillFront} />
                  <div className={styles.trees}>
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
                <p className={styles.heroCardCaption}>
                  Bugün hava açık — piknik için ideal
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="hakkinda" className={styles.section}>
          <div className={`container ${styles.aboutGrid}`}>
            <div>
              <h2 className={styles.sectionTitle}>Park hakkında</h2>
              <p className={styles.sectionLead}>
                2018&apos;de rehabilitasyonu tamamlanan Yeşil Vadi, yerel
                bitki türleriyle yeniden ağaçlandırıldı. Amacımız şehir
                sakinlerine sürdürülebilir, sessiz ve erişilebilir bir yeşil
                alan sunmak.
              </p>
            </div>
            <ul className={styles.principles}>
              <li>
                <strong>Sürdürülebilirlik</strong> — Yağmur suyu geri
                kazanımı ve kompost alanı
              </li>
              <li>
                <strong>Erişilebilirlik</strong> — Tekerlekli sandalye
                uyumlu ana yol
              </li>
              <li>
                <strong>Topluluk</strong> — Gönüllü temizlik günleri her ay
              </li>
            </ul>
          </div>
        </section>

        <section id="aktiviteler" className={styles.sectionAlt}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Aktiviteler</h2>
            <p className={styles.sectionLead}>
              Sabah koşusundan akşam pikniğine — park gün boyu açık.
            </p>
            <ul className={styles.activityGrid}>
              {activities.map((item) => (
                <li key={item.title} className={styles.activityCard}>
                  <span className={styles.activityIcon} aria-hidden>
                    {item.icon}
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="ziyaret" className={styles.section}>
          <div className={`container ${styles.visitGrid}`}>
            <div className={styles.visitCard}>
              <h2 className={styles.sectionTitle}>Ziyaret saatleri</h2>
              <ul className={styles.hoursList}>
                {hours.map((row) => (
                  <li key={row.day}>
                    <span>{row.day}</span>
                    <span>{row.time}</span>
                  </li>
                ))}
              </ul>
              <p className={styles.visitNote}>
                Köpekler tasmalı ve kayışlı kabul edilir. Mangal yalnızca
                belirlenmiş ızgara alanında.
              </p>
            </div>
            <div className={styles.mapPlaceholder}>
              <p className={styles.mapLabel}>Konum</p>
              <p className={styles.mapAddress}>
                Yeşil Vadi Cd. No: 1
                <br />
                Merkez / İstanbul
              </p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnPrimary}
              >
                Haritada aç
              </a>
            </div>
          </div>
        </section>

        <section id="iletisim" className={styles.ctaBand}>
          <div className={`container ${styles.ctaInner}`}>
            <div>
              <h2 className={styles.ctaTitle}>Etkinlik veya kiralama?</h2>
              <p>
                Okul gezileri ve sivil toplum etkinlikleri için önceden
                rezervasyon alınır.
              </p>
            </div>
            <a href="mailto:info@yesilvadi.example" className={styles.btnLight}>
              info@yesilvadi.example
            </a>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={`container ${styles.footerInner}`}>
          <p>© {new Date().getFullYear()} Yeşil Vadi Parkı</p>
          <p className={styles.footerMeta}>megproje · Vercel üzerinde barındırılır</p>
        </div>
      </footer>
    </>
  );
}
