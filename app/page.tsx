import Image from "next/image";
import ProgressBlock from "./ProgressBlock";
import styles from "./page.module.css";

const CONTACT_EMAIL = "info@megproje.net";

const SERVICES = [
  "Mimarlık",
  "İç mimarlık",
  "Mühendislik",
] as const;

export default function ParkPage() {
  const year = new Date().getFullYear();

  return (
    <div className={styles.page}>
      <div className={styles.ambient} aria-hidden>
        <span className={styles.grid} />
        <span className={styles.blob1} />
        <span className={styles.blob2} />
        <span className={styles.blob3} />
        <span className={styles.ring} />
      </div>

      <main className={styles.main}>
        <div className={styles.heroCard}>
          <div className={styles.logoFrame}>
            <Image
              src="/logo.jpeg"
              alt="Meg Proje — Mimarlık, İç mimarlık, Mühendislik"
              width={480}
              height={200}
              className={styles.logoImg}
              priority
            />
          </div>

          <ul className={styles.services} aria-label="Hizmet alanları">
            {SERVICES.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>

          <p className={styles.badge}>
            <span className={styles.badgeDot} aria-hidden />
            Web sitemiz hazırlanıyor
          </p>

          <h1 className={styles.title}>
            Yakında
            <span className={styles.titleLine}> sizlerle</span>
          </h1>

          <p className={styles.lead}>
            Meg Proje kurumsal sitesi üzerinde çalışıyoruz. Tam sürüm
            yayınlandığında projelerimizi ve hizmetlerimizi buradan
            paylaşacağız.
          </p>

          <ProgressBlock />

          <div className={styles.contactInline}>
            <span className={styles.contactLabel}>İletişim</span>
            <a
              className={styles.contactLink}
              href={`mailto:${CONTACT_EMAIL}`}
            >
              {CONTACT_EMAIL}
            </a>
            <span className={styles.contactBrand}>Meg Proje</span>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© {year} Meg Proje</p>
      </footer>
    </div>
  );
}
