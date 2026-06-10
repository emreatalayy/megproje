(function () {
  "use strict";

  var SCROLL_NAV_THRESHOLD = 60;
  var MOBILE_BREAKPOINT = 769;
  var PACMAN_LAYOUT_BREAKPOINT = 901;

  var nav = document.getElementById("nav");

  function onScrollNav() {
    if (!nav) return;
    if (window.scrollY > SCROLL_NAV_THRESHOLD) {
      nav.classList.add("nav--scrolled");
    } else {
      nav.classList.remove("nav--scrolled");
    }
  }

  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  /* Mobil menü */
  var navBurger = document.getElementById("navBurger");
  var navMobile = document.getElementById("navMobile");

  function setNavOpen(open) {
    if (!navBurger || !navMobile) return;
    navBurger.classList.toggle("is-open", open);
    navBurger.setAttribute("aria-expanded", open ? "true" : "false");
    navBurger.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
    navMobile.classList.toggle("is-open", open);
    navMobile.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.classList.toggle("nav-open", open);
  }

  if (navBurger && navMobile) {
    navBurger.addEventListener("click", function () {
      setNavOpen(!navMobile.classList.contains("is-open"));
    });

    navMobile.addEventListener("click", function (e) {
      if (e.target === navMobile) setNavOpen(false);
    });

    navMobile.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setNavOpen(false);
      });
    });
  }

  /* Custom cursor (desktop) */
  var dot = document.getElementById("cursorDot");
  var ring = document.getElementById("cursorRing");
  var mouseX = 0;
  var mouseY = 0;
  var ringX = 0;
  var ringY = 0;
  var cursorEnabled = false;

  function enableCursor() {
    cursorEnabled = window.innerWidth >= MOBILE_BREAKPOINT;
    if (!dot || !ring) return;
    if (!cursorEnabled) {
      dot.style.display = "none";
      ring.style.display = "none";
      document.body.classList.remove("cursor-hover");
    } else {
      dot.style.display = "";
      ring.style.display = "";
    }
  }

  enableCursor();
  window.addEventListener("resize", enableCursor);

  document.addEventListener("mousemove", function (e) {
    if (!cursorEnabled) return;
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + "px";
    dot.style.top = mouseY + "px";
  });

  function animateRing() {
    if (cursorEnabled && ring) {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + "px";
      ring.style.top = ringY + "px";
    }
    requestAnimationFrame(animateRing);
  }

  animateRing();

  document.querySelectorAll(".interactive, a, button, input, textarea").forEach(function (el) {
    el.addEventListener("mouseenter", function () {
      if (cursorEnabled) document.body.classList.add("cursor-hover");
    });
    el.addEventListener("mouseleave", function () {
      document.body.classList.remove("cursor-hover");
    });
  });

  /* Sekme / bölüm geçişleri */
  var navSectionIds = ["projects", "about", "services", "contact"];
  var navAnchors = document.querySelectorAll(
    '.nav__links a[href*="#"], .nav-mobile__link[href*="#"]'
  );
  var pageSections = document.querySelectorAll(".page-section[id]");

  function hashId(href) {
    var parts = String(href || "").split("#");
    return parts.length > 1 ? parts[1] : "";
  }

  function setActiveNav(sectionId) {
    navAnchors.forEach(function (anchor) {
      var id = hashId(anchor.getAttribute("href"));
      anchor.classList.toggle("is-active", id === sectionId);
    });
  }

  function updateActiveNavOnScroll() {
    var offset = (nav ? nav.offsetHeight : 72) + 100;
    var pos = window.scrollY + offset;
    var current = "";

    navSectionIds.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.offsetTop <= pos) current = id;
    });

    if (window.scrollY < 120) {
      navAnchors.forEach(function (anchor) {
        anchor.classList.remove("is-active");
      });
      return;
    }

    if (current) setActiveNav(current);
  }

  function playSectionEnter(section) {
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    section.classList.remove("is-entering");
    void section.offsetWidth;
    section.classList.add("is-entering");
    window.setTimeout(function () {
      section.classList.remove("is-entering");
    }, 900);
  }

  document.querySelectorAll('a[href^="#"], a[href^="/#"]').forEach(function (link) {
    var href = link.getAttribute("href");
    if (!href || href === "#") return;

    link.addEventListener("click", function (e) {
      // "/#projects" gibi linkler başka sayfadayken normal gezinmeye bırakılır;
      // hedef bu sayfada varsa (anasayfa) yumuşak kaydırma uygulanır.
      var id = hashId(href);
      if (!id) return;
      var target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      document.body.classList.add("is-section-transition");

      window.setTimeout(function () {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        playSectionEnter(target);

        var sectionId = target.id;
        if (sectionId) setActiveNav(sectionId);

        window.setTimeout(function () {
          document.body.classList.remove("is-section-transition");
        }, 650);
      }, 140);
    });
  });

  window.addEventListener("scroll", updateActiveNavOnScroll, { passive: true });
  updateActiveNavOnScroll();

  if ("IntersectionObserver" in window && pageSections.length) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-section-visible");
          }
        });
      },
      { root: null, rootMargin: "-25% 0px -60% 0px", threshold: 0.12 }
    );

    pageSections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  /* Scroll reveal */
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* Projeler — scroll ile Pac-Man + yatay kayma */
  var pacmanScroll = document.getElementById("pacmanScroll");
  var pacmanView = document.getElementById("pacmanView");
  var pacmanRail = document.getElementById("pacmanRail");
  var pacmanPath = document.getElementById("pacmanPath");
  var pacmanPlayer = document.getElementById("pacmanPlayer");
  var pacmanGhost = document.getElementById("pacmanGhost");
  var pacmanScrollFill = document.getElementById("pacmanScrollFill");
  var pacmanEatMaskPath = document.getElementById("pacmanEatMaskPath");
  var pacmanSvg = pacmanRail && pacmanRail.querySelector(".pacman-rail__svg");
  var pacmanNodes = document.querySelectorAll(".pacman-node");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* Aşama düğümlerinin yol (viewBox) üzerindeki çapa noktaları */
  var NODE_ANCHORS = [
    { x: 440, y: 110 },
    { x: 200, y: 290 },
    { x: 440, y: 470 },
    { x: 200, y: 650 },
    { x: 440, y: 830 },
  ];
  var NODE_STOPS = [0.1, 0.3, 0.5, 0.7, 0.9];

  function computeNodeStops() {
    if (!pacmanPath) return;
    var len = pacmanPath.getTotalLength();
    if (!len) return;
    NODE_ANCHORS.forEach(function (anchor, idx) {
      if (idx >= pacmanNodes.length) return;
      var best = 0;
      var bestDist = Infinity;
      for (var i = 0; i <= 260; i++) {
        var t = i / 260;
        var p = pacmanPath.getPointAtLength(len * t);
        var dx = p.x - anchor.x;
        var dy = p.y - anchor.y;
        var d = dx * dx + dy * dy;
        if (d < bestDist) {
          bestDist = d;
          best = t;
        }
      }
      NODE_STOPS[idx] = best;
    });
  }

  computeNodeStops();

  function pacmanDesktopLayout() {
    return window.innerWidth >= PACMAN_LAYOUT_BREAKPOINT;
  }

  function pacmanMotionEnabled() {
    return pacmanDesktopLayout();
  }

  function getPacmanProgress() {
    if (!pacmanScroll) return 0;
    var rect = pacmanScroll.getBoundingClientRect();
    var scrollRange = pacmanScroll.offsetHeight - window.innerHeight;
    if (scrollRange <= 0) return 0;
    return Math.min(1, Math.max(0, -rect.top / scrollRange));
  }

  function pathPointOnRail(ratio) {
    if (!pacmanPath || !pacmanSvg || !pacmanRail) return { x: 0, y: 0 };
    var len = pacmanPath.getTotalLength();
    var pt = pacmanPath.getPointAtLength(len * ratio);
    var ctm = pacmanPath.getScreenCTM();
    var railRect = pacmanRail.getBoundingClientRect();

    if (ctm) {
      var svgPt = pacmanSvg.createSVGPoint();
      svgPt.x = pt.x;
      svgPt.y = pt.y;
      var mapped = svgPt.matrixTransform(ctm);
      return {
        x: mapped.x - railRect.left,
        y: mapped.y - railRect.top,
      };
    }

    /* Fallback: SVG "xMidYMid meet" gerçek ölçeğini hesapla */
    var vb = pacmanSvg.viewBox.baseVal;
    var svgRect = pacmanSvg.getBoundingClientRect();
    var scale = Math.min(svgRect.width / vb.width, svgRect.height / vb.height);
    var svgOffX = svgRect.left - railRect.left + (svgRect.width - vb.width * scale) / 2;
    var svgOffY = svgRect.top - railRect.top + (svgRect.height - vb.height * scale) / 2;
    return {
      x: svgOffX + pt.x * scale,
      y: svgOffY + pt.y * scale,
    };
  }

  function clearPacmanNodeLayout() {
    pacmanNodes.forEach(function (node) {
      node.style.left = "";
      node.style.top = "";
      node.style.transform = "";
    });
  }

  function layoutPacmanNodes() {
    if (!pacmanPath || !pacmanNodes.length || !pacmanRail) return;

    pacmanNodes.forEach(function (node, i) {
      var stop = NODE_STOPS[i] !== undefined ? NODE_STOPS[i] : i / pacmanNodes.length;
      var base = pathPointOnRail(stop);
      node.style.left = base.x + "px";
      node.style.top = base.y + "px";
      node.style.transform = "translate(-50%, -50%)";
    });
  }

  /* Scroll hedefi ile çizim arasinda lerp — tekerlek adimlarinda isinlanma olmasin */
  var pacmanProgress = 0;
  var pacmanGhostProgress = 0;
  var pacmanRafId = null;
  var pacmanWasDesktop = null;

  function renderPacman() {
    if (!pacmanScroll || !pacmanView || !pacmanRail || !pacmanPath || !pacmanPlayer) {
      return;
    }

    if (!pacmanDesktopLayout()) {
      if (pacmanWasDesktop === false) return;
      pacmanWasDesktop = false;
      pacmanRail.style.transform = "";
      pacmanPlayer.style.opacity = "0";
      if (pacmanGhost) pacmanGhost.style.opacity = "0";
      pacmanNodes.forEach(function (node) {
        node.classList.remove("is-active", "is-eaten");
      });
      if (pacmanScrollFill) pacmanScrollFill.style.width = "0%";
      if (pacmanEatMaskPath) pacmanEatMaskPath.setAttribute("stroke-dashoffset", "0");
      clearPacmanNodeLayout();
      return;
    }

    pacmanWasDesktop = true;
    layoutPacmanNodes();
    pacmanRail.style.transform = "none";

    if (!pacmanMotionEnabled()) {
      pacmanPlayer.style.opacity = "0";
      if (pacmanGhost) pacmanGhost.style.opacity = "0";
      if (pacmanScrollFill) pacmanScrollFill.style.width = "100%";
      pacmanNodes.forEach(function (node) {
        node.classList.remove("is-active");
        node.classList.remove("is-eaten");
      });
      return;
    }

    pacmanPlayer.style.opacity = "1";

    var progress = pacmanProgress;

    if (pacmanScrollFill) {
      pacmanScrollFill.style.width = progress * 100 + "%";
    }

    if (pacmanEatMaskPath) {
      pacmanEatMaskPath.setAttribute("stroke-dashoffset", String(-progress));
    }

    var pos = pathPointOnRail(progress);
    var ahead = pathPointOnRail(Math.min(1, progress + 0.008));
    var angle = (Math.atan2(ahead.y - pos.y, ahead.x - pos.x) * 180) / Math.PI;

    pacmanPlayer.style.left = pos.x + "px";
    pacmanPlayer.style.top = pos.y + "px";
    pacmanPlayer.style.transform =
      "translate(-50%, -50%) rotate(" + angle + "deg)";

    if (pacmanGhost) {
      var gpos = pathPointOnRail(pacmanGhostProgress);
      pacmanGhost.style.left = gpos.x + "px";
      pacmanGhost.style.top = gpos.y + "px";
      pacmanGhost.style.transform = "translate(-50%, -50%)";
      pacmanGhost.style.opacity = progress > 0.05 ? "1" : "0";
    }

    pacmanNodes.forEach(function (node, i) {
      var stop = NODE_STOPS[i] !== undefined ? NODE_STOPS[i] : 0;
      node.classList.toggle("is-active", progress >= stop - 0.06 && progress <= stop + 0.1);
      node.classList.toggle("is-eaten", progress >= stop - 0.02);
    });
  }

  function pacmanFrame() {
    var target = getPacmanProgress();
    var ghostTarget = Math.max(0, target - 0.13);

    if (reducedMotion.matches) {
      pacmanProgress = target;
      pacmanGhostProgress = ghostTarget;
    } else {
      pacmanProgress += (target - pacmanProgress) * 0.14;
      pacmanGhostProgress += (ghostTarget - pacmanGhostProgress) * 0.1;
      if (Math.abs(target - pacmanProgress) < 0.0005) pacmanProgress = target;
      if (Math.abs(ghostTarget - pacmanGhostProgress) < 0.0005) pacmanGhostProgress = ghostTarget;
    }

    renderPacman();

    if (pacmanRafId !== null) {
      pacmanRafId = requestAnimationFrame(pacmanFrame);
    }
  }

  function startPacmanLoop() {
    if (pacmanRafId !== null) return;
    pacmanRafId = requestAnimationFrame(pacmanFrame);
  }

  function stopPacmanLoop() {
    if (pacmanRafId === null) return;
    cancelAnimationFrame(pacmanRafId);
    pacmanRafId = null;
  }

  function syncPacman() {
    computeNodeStops();
    pacmanProgress = getPacmanProgress();
    pacmanGhostProgress = Math.max(0, pacmanProgress - 0.13);
    renderPacman();
  }

  if (pacmanScroll && "IntersectionObserver" in window) {
    var pacmanVisibility = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            startPacmanLoop();
          } else {
            stopPacmanLoop();
            renderPacman();
          }
        });
      },
      { root: null, rootMargin: "15% 0px 15% 0px" }
    );
    pacmanVisibility.observe(pacmanScroll);
  } else {
    startPacmanLoop();
  }

  window.addEventListener("resize", syncPacman);
  window.addEventListener("load", syncPacman);
  syncPacman();

  if (pacmanView && "ResizeObserver" in window) {
    var pacmanResize = new ResizeObserver(syncPacman);
    pacmanResize.observe(pacmanView);
  }

  /* Contact form */
  var contactForm = document.getElementById("contactForm");
  var formStatus = document.getElementById("formStatus");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("name").value.trim();
      var email = document.getElementById("email").value.trim();
      var message = document.getElementById("message").value.trim();
      var submitBtn = contactForm.querySelector(".form-submit");

      if (!name || !email || !message) return;

      function showStatus(text, isError) {
        if (!formStatus) return;
        formStatus.hidden = false;
        formStatus.textContent = text;
        formStatus.classList.toggle("form-status--error", !!isError);
      }

      function mailtoFallback() {
        var mail =
          (window.MEG_SITE && window.MEG_SITE.contactEmail) || "info@megmimarlik.net";
        window.location.href =
          "mailto:" +
          mail +
          "?subject=" +
          encodeURIComponent("Proje Talebi - " + name) +
          "&body=" +
          encodeURIComponent(message + "\n\n- " + name + "\n" + email);
      }

      if (submitBtn) submitBtn.disabled = true;

      fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name, email: email, message: message }),
      })
        .then(function (res) {
          return res.json().then(function (data) {
            if (!res.ok) throw new Error(data.error || "Gönderilemedi");
            showStatus(data.message || "Mesajınız alındı.", false);
            contactForm.reset();
          });
        })
        .catch(function () {
          mailtoFallback();
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }
})();
