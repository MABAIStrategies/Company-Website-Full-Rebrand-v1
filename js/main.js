/* ═══════════════════════════════════════════════════════════════
   MAB AI — INTERACTION ORCHESTRATION
   magnetic buttons · scroll reveal · pipeline illumination ·
   counters · refractive light scatter · nebula parallax · nav
   ═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(hover: none)").matches;

  /* ───────────── 1 · SCROLL REVEAL (staggered, depth-of-field blur) ───────────── */
  const revealEls = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add("in-view");
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -40px 0px" });

  revealEls.forEach((el, i) => {
    // stagger siblings within grids
    if (!el.style.getPropertyValue("--d")) {
      const sibs = el.parentElement ? [...el.parentElement.children].filter(c => c.classList.contains("reveal")) : [];
      const idx = sibs.indexOf(el);
      if (idx > 0) el.style.setProperty("--d", `${Math.min(idx * 0.12, 0.6)}s`);
    }
    io.observe(el);
  });

  /* ───────────── 2 · MAGNETIC BUTTONS ───────────── */
  if (!isTouch && !reduceMotion) {
    document.querySelectorAll(".magnetic").forEach((btn) => {
      let raf = null;
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          btn.style.transform = `translate(${dx * 0.22}px, ${dy * 0.28}px)`;
        });
      });
      btn.addEventListener("pointerleave", () => {
        if (raf) cancelAnimationFrame(raf);
        btn.style.transition = "transform .6s cubic-bezier(.16,1,.3,1)";
        btn.style.transform = "translate(0,0)";
        setTimeout(() => { btn.style.transition = ""; }, 600);
      });
    });
  }

  /* ───────────── 3 · ANIMATED COUNTERS ───────────── */
  const counters = document.querySelectorAll("[data-count]");
  const cio = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      cio.unobserve(en.target);
      const el = en.target;
      const target = parseFloat(el.dataset.count);
      const prefix = el.dataset.prefix || "";
      const suffix = el.dataset.suffix || "";
      const dur = 1600;
      const t0 = performance.now();
      (function tick(now) {
        const p = Math.min((now - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 4);
        el.textContent = prefix + Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }, { threshold: 0.6 });
  counters.forEach((c) => cio.observe(c));

  /* ───────────── 4 · PIPELINE ILLUMINATION (scroll-driven) ───────────── */
  const pipeLit = document.getElementById("pipe-lit");
  const pipeComet = document.getElementById("pipe-comet");
  const pipeWrap = document.querySelector(".pipeline-wrap");

  if (pipeLit && pipeWrap) {
    const len = pipeLit.getTotalLength();
    pipeLit.style.strokeDasharray = `${len}`;
    pipeLit.style.strokeDashoffset = `${len}`;

    let pipeRaf = null;
    function updatePipe() {
      pipeRaf = null;
      const r = pipeWrap.getBoundingClientRect();
      const vh = window.innerHeight;
      // progress: 0 when wrap top hits 80% vh, 1 when wrap bottom hits 45% vh
      const total = r.height + vh * 0.35;
      const passed = vh * 0.8 - r.top;
      const p = Math.max(0, Math.min(1, passed / total));
      pipeLit.style.strokeDashoffset = `${len * (1 - p)}`;
      if (pipeComet) {
        const pt = pipeLit.getPointAtLength(len * p);
        pipeComet.setAttribute("cx", pt.x);
        pipeComet.setAttribute("cy", pt.y);
        pipeComet.style.opacity = p > 0.01 && p < 0.995 ? "1" : "0";
      }
    }
    window.addEventListener("scroll", () => {
      if (!pipeRaf) pipeRaf = requestAnimationFrame(updatePipe);
    }, { passive: true });
    updatePipe();
  }

  /* ───────────── 5 · REFRACTIVE LIGHT SCATTER ON CORE CARDS ───────────── */
  document.querySelectorAll(".core-card").forEach((card) => {
    if (!isTouch) {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
        card.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
      });
    } else {
      // touch: tap toggles the spec sheet
      card.addEventListener("click", () => card.classList.toggle("is-open"));
    }
  });

  /* ───────────── 6 · NEBULA PARALLAX MORPH (scroll-driven) ───────────── */
  if (!reduceMotion) {
    const nebulae = document.querySelectorAll(".nebula");
    const speeds = [0.05, -0.035, 0.045, -0.025];
    let nRaf = null;
    window.addEventListener("scroll", () => {
      if (nRaf) return;
      nRaf = requestAnimationFrame(() => {
        const y = window.scrollY;
        nebulae.forEach((n, i) => {
          const s = speeds[i % speeds.length];
          n.style.transform = `translateY(${y * s}px) scale(${1 + Math.sin(y * 0.0006 + i) * 0.08})`;
        });
        nRaf = null;
      });
    }, { passive: true });
  }

  /* ───────────── 7 · NAV: shrink on scroll + mobile menu ───────────── */
  const nav = document.getElementById("site-nav");
  window.addEventListener("scroll", () => {
    nav.style.padding = window.scrollY > 60 ? "10px clamp(16px,4vw,48px)" : "";
  }, { passive: true });

  const burger = document.getElementById("nav-burger");
  const links = document.getElementById("nav-links");
  burger.addEventListener("click", () => links.classList.toggle("open"));
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => links.classList.remove("open"))
  );

  /* ───────────── 8 · SMOOTH ANCHOR OFFSET ───────────── */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
    });
  });

  /* ───────────── 9 · FAQ ACCORDION (services.html) ───────────── */
  document.querySelectorAll('.faq-q').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // close all
      document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ───────────── 10 · HOVER LIGHT SCATTER — ABOUT PAGE CARDS ───────────── */
  document.querySelectorAll('.svc-detail-card').forEach((card) => {
    if (!isTouch) {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
        card.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
      });
    }
  });

  /* ───────────── 11 · ACTIVE NAV LINK HIGHLIGHT ───────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.split('?')[0] === currentPage) {
      link.style.color = '#fff';
    }
  });

  /* ───────────── 12 · MOTION-BAND VIDEO — play only in view, honor reduced-motion ───────────── */
  const bandVideos = document.querySelectorAll('.motion-band__video');
  if (bandVideos.length) {
    if (reduceMotion) {
      // Show a static first frame; never autoplay under reduced-motion.
      bandVideos.forEach(v => { v.removeAttribute('autoplay'); v.pause && v.pause(); });
    } else {
      const vIO = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          const v = en.target;
          if (en.isIntersecting) {
            const p = v.play();
            if (p && typeof p.catch === 'function') p.catch(() => {}); // ignore autoplay blocks
          } else if (!v.paused) {
            v.pause();
          }
        });
      }, { threshold: 0.25 });
      bandVideos.forEach(v => vIO.observe(v));
    }
  }
})();
