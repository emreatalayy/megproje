module.exports = {
  meta: {
    title: "MEG Mimarlık | Konya Mimarlık ve İç Mimarlık Ofisi",
    description:
      "MEG Mimarlık — 2012'den beri Konya'da konut, villa ve ticari projeler tasarlayan mimarlık & iç mimarlık ofisi. Mimari tasarım, iç mekan, restorasyon ve 3B görselleştirme.",
    // SEO için kök adres. Vercel'de SITE_URL env'i ile ezilebilir.
    siteUrl: process.env.SITE_URL || "https://www.megproje.net",
    locale: "tr_TR",
    ogImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=630&fit=crop&q=80",
    keywords:
      "Konya mimarlık, Konya mimar, Konya mimarlık ofisi, Konya iç mimari, Konya iç mimarlık, villa projesi Konya, konut mimarisi Konya, restorasyon Konya, kentsel tasarım, mimari proje, Selçuklu mimar, Meram mimar, MEG Mimarlık",
    organization: {
      name: "MEG Mimarlık",
      legalName: "MEG Mimarlık",
      foundingDate: "2012",
      priceRange: "₺₺",
      // Yaklaşık konum (Sakarya Mah, Selçuklu/Konya). Google Business Profile'daki
      // gerçek pinle güncellenmeli.
      geo: { lat: 37.8997, lng: 32.4936 },
      areaServed: ["Konya", "Selçuklu", "Meram", "Karatay"],
      services: [
        "Mimari Tasarım",
        "İç Mimari",
        "Kentsel Tasarım",
        "Restorasyon",
        "3B Görselleştirme",
        "Proje Yönetimi",
      ],
    },
  },

  nav: [
    { label: "Projeler", href: "/#projects" },
    { label: "Hizmetler", href: "/#services" },
    { label: "Hakkımızda", href: "/#about" },
    { label: "Blog", href: "/blog" },
    { label: "İletişim", href: "/#contact" },
  ],

  hero: {
    eyebrow: "Mimarlık & İç Mekan — Konya",
    titleLines: ["Mekânı", "düşünceyle", "inşa ediyoruz"],
    titleItalicIndex: 1,
    subtitle:
      "Konya ve İç Anadolu'nun dokusundan ilham alan, sürdürülebilir ve insan odaklı mimari çözümler üretiyoruz.",
    decoChar: "M",
  },

  marquee: [
    "Mimarlık",
    "İç Mekan",
    "Kentsel Tasarım",
    "Sürdürülebilirlik",
    "Restorasyon",
    "Proje Yönetimi",
  ],

  projects: {
    label: "Seçili Projeler",
    title: "İz bırakan yapılar",
    cta: "Tüm Projeler →",
    scrollHint: "Fikri yuttur, projeye dönüştür — aşağı kaydır",
    items: [
      {
        id: "01",
        slug: "selcuklu-konut",
        name: "Selçuklu Konut",
        meta: "Konut · Konya",
        image:
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop&q=80",
        alt: "Selçuklu Konut — modern konut mimarisi",
        side: "right",
      },
      {
        id: "02",
        slug: "uluyayla-ofis",
        name: "Uluyayla Ofis",
        meta: "Ticari · Konya",
        image:
          "https://images.unsplash.com/photo-1600047509807-ba8f99d2cd7a?w=800&h=600&fit=crop&q=80",
        alt: "Uluyayla Ofis — ticari mimari",
        side: "left",
      },
      {
        id: "03",
        slug: "sakarya-villa",
        name: "Sakarya Villa",
        meta: "Konut · Selçuklu",
        image:
          "https://images.unsplash.com/photo-1600210492486-724fe994c013?w=800&h=600&fit=crop&q=80",
        alt: "Sakarya Villa",
        side: "right",
      },
      {
        id: "04",
        slug: "meg-studio",
        name: "MEG Stüdyo",
        meta: "İç Mekan · Konya",
        image:
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop&q=80",
        alt: "MEG Stüdyo iç mekan",
        side: "left",
      },
      {
        id: "05",
        slug: "kentsel-yasam",
        name: "Kentsel Yaşam Merkezi",
        meta: "Kamusal · Konya",
        image:
          "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop&q=80",
        alt: "Kentsel yaşam merkezi",
        side: "right",
      },
    ],
  },

  about: {
    statement:
      'Mimarlık, yalnızca <em>yapı</em> üretmek değil; yaşamın <em>ritmini</em> mekâna taşımaktır.',
    paragraphs: [
      "MEG Mimarlık, 2012'den bu yana Konya ve çevresinde konut, ticari ve kamusal projeler tasarlayan bağımsız bir stüdyodur. Her projede bağlam, iklim ve kullanıcı deneyimini birlikte ele alırız.",
      "Sürdürülebilir malzeme seçimi, yerel ustalık ve çağdaş tasarım dilini harmanlayarak; uzun ömürlü, bakımı kolay ve estetik açıdan zamansız mekânlar yaratmayı hedefliyoruz.",
    ],
  },

  services: {
    label: "Hizmetler",
    title: "Disiplinlerimiz",
    intro:
      "Fikirden anahtar teslimine kadar tüm süreçleri tek çatı altında yönetiyor; müşterilerimizle şeffaf ve sürdürülebilir bir iş birliği kuruyoruz.",
    items: [
      {
        no: "01",
        name: "Mimari Tasarım",
        desc: "Konut, ticari ve kamusal yapılar için konseptten ruhsata kadar bütüncül tasarım.",
      },
      {
        no: "02",
        name: "İç Mekan",
        desc: "Malzeme, ışık ve mobilya seçimiyle kullanıcı odaklı iç mekân çözümleri.",
      },
      {
        no: "03",
        name: "Kentsel Tasarım",
        desc: "Kamusal alan, peyzaj ve kentsel mobilya ile yaşanabilir şehir dokusu.",
      },
      {
        no: "04",
        name: "Restorasyon",
        desc: "Tarihi yapıların özgün karakterini koruyarak güncel kullanıma adaptasyonu.",
      },
      {
        no: "05",
        name: "3B Görselleştirme",
        desc: "Fotorealistik render ve sunum materyalleri ile karar süreçlerini hızlandırma.",
      },
      {
        no: "06",
        name: "Proje Yönetimi",
        desc: "Şantiye koordinasyonu, bütçe ve zaman planlaması ile uçtan uca takip.",
      },
    ],
  },

  philosophy: {
    quote:
      "İyi mimari, görmekten çok hissettirmeyi öğretir — sessizce, ama kalıcı biçimde.",
    attribution: "— MEG Mimarlık, Tasarım Manifestosu",
  },

  contact: {
    title: "Birlikte tasarlayalım",
    email: "info@megproje.net",
    phone: "0543 103 20 00",
    phoneHref: "+905431032000",
    address: {
      line1: "Sakarya, Uluyayla Cd. No:52 A",
      line2: "42100 Selçuklu / Konya",
      full: "Sakarya, Uluyayla Cd. NO:52 A, 42100 Selçuklu/Konya",
    },
    map: {
      label: "Konum",
      embedUrl:
        "https://maps.google.com/maps?q=Sakarya%2C+Uluyayla+Cd.+NO%3A52+A%2C+42100+Sel%C3%A7uklu%2FKonya&hl=tr&z=17&output=embed",
      openUrl:
        "https://www.google.com/maps/search/?api=1&query=Sakarya%2C+Uluyayla+Cd.+NO%3A52+A%2C+42100+Sel%C3%A7uklu%2FKonya",
      directionsUrl:
        "https://www.google.com/maps/dir/?api=1&destination=Sakarya%2C+Uluyayla+Cd.+NO%3A52+A%2C+42100+Sel%C3%A7uklu%2FKonya",
    },
  },

  footer: {
    year: new Date().getFullYear(),
    social: [
      { label: "Instagram", href: "https://instagram.com" },
      { label: "LinkedIn", href: "https://linkedin.com" },
      { label: "Behance", href: "https://behance.net" },
    ],
  },
};
