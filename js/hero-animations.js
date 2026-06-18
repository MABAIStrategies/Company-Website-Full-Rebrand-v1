/* ═══════════════════════════════════════════════════════════════
   MAB AI — PAGE-SPECIFIC HERO CANVAS ANIMATIONS
   Each scene is semantically themed to its page's content.
   All share: mouse parallax · DPR aware · reduced-motion safe
   ═══════════════════════════════════════════════════════════════

   SCENES:
   1. SERVICES  — Capability Matrix: illuminated node-graph network
                  Nodes pulse as "services", edges carry data-flow photons
                  Palette: phosphorescent cyan (#00E5FF) on dark field

   2. ABOUT     — Orbital Constellation: 16 orbiting bodies around a
                  gravitational core, trails of gold/violet starlight
                  Palette: violet (#7C3AED) / gold (#FFD54A)

   3. CONTACT   — Signal Transmission: concentric ripple rings from center
                  with particle bursts riding the wavefronts outward
                  Palette: lime (#AEEA00) / cyan (#00E5FF)

   4. MEMBER    — Cipher Stream: encrypted vertical data-rain with a
                  glowing refractive shield rising from the center
                  Palette: violet (#7C3AED) / magenta (#FF3D8A)
═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  const RM  = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  const mouse = { x: 0.5, y: 0.5, sx: 0.5, sy: 0.5 }; // 0..1

  window.addEventListener("pointermove", e => {
    mouse.x = e.clientX / window.innerWidth;
    mouse.y = e.clientY / window.innerHeight;
  }, { passive: true });

  /* ─── Shared canvas resize helper ─── */
  function setupCanvas(id) {
    const el = document.getElementById(id);
    if (!el) return null;
    const ctx = el.getContext("2d");
    let W = 0, H = 0;
    function resize() {
      const r = el.getBoundingClientRect();
      W = r.width; H = r.height;
      el.width  = W * DPR;
      el.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);
    return { el, ctx, get W(){ return W; }, get H(){ return H; } };
  }

  /* ─── Smooth mouse ─── */
  function smoothMouse() {
    mouse.sx += (mouse.x - mouse.sx) * 0.055;
    mouse.sy += (mouse.y - mouse.sy) * 0.055;
  }

  /* ─── Lerp / rand helpers ─── */
  const lerp  = (a, b, t) => a + (b - a) * t;
  const rand  = (lo, hi)  => lo + Math.random() * (hi - lo);
  const TAU   = Math.PI * 2;


  /* ══════════════════════════════════════════════════════════
     SCENE 1 · SERVICES — CAPABILITY MATRIX NETWORK
     Nodes = service capability hubs, edges carry photon pulses.
     Mouse parallax shifts the entire graph.
  ══════════════════════════════════════════════════════════ */
  function sceneServices(cvs) {
    if (!cvs) return;
    const { ctx } = cvs;

    // 28 nodes arranged in a loose organic grid
    const NODE_COUNT = 28;
    const nodes = [];

    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        bx: rand(0.06, 0.94),   // base X (0-1)
        by: rand(0.05, 0.95),   // base Y (0-1)
        r:  rand(2.5, 5.5),     // radius
        phase: rand(0, TAU),
        speed: rand(0.006, 0.018),
        // pulse state
        pulseT: 0,
        pulseMax: rand(0.5, 1.5),
        nextPulse: rand(0, 200),
        // label (6 are named, rest ambient)
        label: i < 6 ? ["AI Agents","Automation","Audits","Data Synthesis","Fractional CAO","Web Experiences"][i] : null
      });
    }

    // Build edges: connect each node to 2-4 nearest neighbours
    const edges = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const dists = [];
      for (let j = 0; j < NODE_COUNT; j++) {
        if (i === j) continue;
        const dx = nodes[i].bx - nodes[j].bx;
        const dy = nodes[i].by - nodes[j].by;
        dists.push({ j, d: Math.sqrt(dx*dx+dy*dy) });
      }
      dists.sort((a,b) => a.d - b.d);
      const numEdges = i < 6 ? 3 : 2;
      for (let k = 0; k < numEdges; k++) {
        const { j } = dists[k];
        if (!edges.find(e => (e.a===i&&e.b===j)||(e.a===j&&e.b===i))) {
          edges.push({ a: i, b: j, photons: [] });
        }
      }
    }

    // Spawn photon on an edge
    function spawnPhoton(edge) {
      edge.photons.push({ t: 0, speed: rand(0.004, 0.012), forward: Math.random() > 0.5 });
    }
    // Seed a few
    edges.forEach(e => { if (Math.random() > 0.3) spawnPhoton(e); });

    let frame = 0;

    function draw() {
      frame++;
      const { W, H } = cvs;
      smoothMouse();
      ctx.clearRect(0, 0, W, H);

      const mx = (mouse.sx - 0.5) * W * 0.04;
      const my = (mouse.sy - 0.5) * H * 0.04;

      // Compute screen coords with mouse parallax
      function nx(n) { return n.bx * W + mx + Math.sin(n.phase + frame * n.speed) * 8; }
      function ny(n) { return n.by * H + my + Math.cos(n.phase + frame * n.speed * 0.8) * 6; }

      // Draw edges
      edges.forEach(edge => {
        const a = nodes[edge.a], b = nodes[edge.b];
        const ax = nx(a), ay = ny(a), bx = nx(b), by = ny(b);

        // Base edge line
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.strokeStyle = "rgba(0,229,255,0.07)";
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Spawn photons occasionally
        if (frame % 80 === 0 && Math.random() > 0.55) spawnPhoton(edge);

        // Draw & advance photons
        edge.photons = edge.photons.filter(ph => ph.t <= 1);
        edge.photons.forEach(ph => {
          ph.t += ph.speed;
          const t  = ph.forward ? ph.t : 1 - ph.t;
          const px = lerp(ax, bx, t);
          const py = lerp(ay, by, t);
          const grd = ctx.createRadialGradient(px, py, 0, px, py, 6);
          grd.addColorStop(0, "rgba(0,229,255,0.95)");
          grd.addColorStop(0.5,"rgba(0,229,255,0.45)");
          grd.addColorStop(1,  "rgba(0,229,255,0)");
          ctx.beginPath();
          ctx.arc(px, py, 6, 0, TAU);
          ctx.fillStyle = grd;
          ctx.fill();

          // trailing glow
          const t2 = Math.max(0, t - 0.035);
          const px2 = lerp(ax, bx, ph.forward ? t2 : 1-t2);
          const py2 = lerp(ay, by, ph.forward ? t2 : 1-t2);
          ctx.beginPath();
          ctx.moveTo(px2, py2);
          ctx.lineTo(px, py);
          ctx.strokeStyle = "rgba(0,229,255,0.35)";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        });
      });

      // Draw nodes
      nodes.forEach((n, i) => {
        const x = nx(n), y = ny(n);

        // Pulse animation
        if (frame >= n.nextPulse) {
          n.pulseT += 0.035;
          if (n.pulseT >= n.pulseMax) {
            n.pulseT = 0;
            n.nextPulse = frame + rand(60, 300);
          }
        }
        const pulse = n.pulseT < 1 ? Math.sin(n.pulseT * Math.PI) : 0;
        const glowR = n.r + pulse * 14;

        // Glow halo
        if (pulse > 0) {
          const grd = ctx.createRadialGradient(x, y, 0, x, y, glowR * 2.5);
          grd.addColorStop(0,  `rgba(0,229,255,${0.55 * pulse})`);
          grd.addColorStop(0.5,`rgba(0,229,255,${0.18 * pulse})`);
          grd.addColorStop(1,  "rgba(0,229,255,0)");
          ctx.beginPath();
          ctx.arc(x, y, glowR * 2.5, 0, TAU);
          ctx.fillStyle = grd;
          ctx.fill();
        }

        // Node core
        const isNamed = i < 6;
        const coreGrd = ctx.createRadialGradient(x - n.r*0.3, y - n.r*0.3, 0, x, y, n.r * (isNamed ? 2 : 1.4));
        coreGrd.addColorStop(0, isNamed ? "rgba(180,245,255,0.95)" : "rgba(0,229,255,0.8)");
        coreGrd.addColorStop(1, isNamed ? "rgba(0,229,255,0.5)"    : "rgba(0,160,200,0.2)");
        ctx.beginPath();
        ctx.arc(x, y, isNamed ? n.r * 1.5 : n.r, 0, TAU);
        ctx.fillStyle = coreGrd;
        ctx.shadowBlur = isNamed ? 18 : 8;
        ctx.shadowColor = "#00E5FF";
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label for named nodes
        if (isNamed) {
          ctx.font = `500 10px 'JetBrains Mono', monospace`;
          ctx.fillStyle = "rgba(0,229,255,0.75)";
          ctx.textAlign = "center";
          ctx.fillText(n.label.toUpperCase(), x, y + n.r * 2.8);
        }
      });
    }

    if (RM) { draw(); return; }
    let vis = true;
    new IntersectionObserver(e => { vis = e[0].isIntersecting; }).observe(cvs.el);
    (function loop() { if (vis) draw(); requestAnimationFrame(loop); })();
  }


  /* ══════════════════════════════════════════════════════════
     SCENE 2 · ABOUT — ORBITAL CONSTELLATION
     A gravitational core surrounded by 16 orbiting bodies.
     Each body leaves a fading arc trail. Mouse tilts the orbits.
     Gold core, violet/gold orbital rings.
  ══════════════════════════════════════════════════════════ */
  function sceneAbout(cvs) {
    if (!cvs) return;
    const { ctx } = cvs;

    // 16 bodies referencing 16 years
    const BODIES = 16;
    const bodies = [];
    const RINGS = [
      { r: 0.11, color: [255, 213, 74],  count: 3, speed: 0.008 },  // inner — gold
      { r: 0.19, color: [124,  58, 237], count: 5, speed: 0.005 },  // mid — violet
      { r: 0.28, color: [167, 139, 250], count: 5, speed: 0.0032 }, // outer — lavender
      { r: 0.36, color: [255,  61, 138], count: 3, speed: 0.0022 }, // far — magenta
    ];
    let idx = 0;
    RINGS.forEach(ring => {
      for (let i = 0; i < ring.count; i++, idx++) {
        const baseAngle = (i / ring.count) * TAU;
        bodies.push({
          ring,
          angle: baseAngle,
          r: rand(2.8, 5.2),
          trail: [],
          trailLen: Math.floor(rand(28, 55))
        });
      }
    });

    // Core star burst lines
    const RAYS = 12;

    let frame = 0;

    function draw() {
      frame++;
      const { W, H } = cvs;
      smoothMouse();
      ctx.clearRect(0, 0, W, H);

      const CX = W * 0.5 + (mouse.sx - 0.5) * W * 0.025;
      const CY = H * 0.48 + (mouse.sy - 0.5) * H * 0.025;

      // Tilt factor from mouse (0-1 range offset)
      const tiltX = (mouse.sx - 0.5) * 0.45;  // perspective tilt
      const tiltY = (mouse.sy - 0.5) * 0.3;

      // Core glow
      const coreR = Math.min(W, H) * 0.045;
      const cGrd = ctx.createRadialGradient(CX, CY, 0, CX, CY, coreR * 5);
      cGrd.addColorStop(0,   "rgba(255,240,180,1)");
      cGrd.addColorStop(0.08,"rgba(255,213,74,0.9)");
      cGrd.addColorStop(0.25,"rgba(255,213,74,0.35)");
      cGrd.addColorStop(0.6, "rgba(124,58,237,0.1)");
      cGrd.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.beginPath();
      ctx.arc(CX, CY, coreR * 5, 0, TAU);
      ctx.fillStyle = cGrd;
      ctx.fill();

      // Core disc
      ctx.beginPath();
      ctx.arc(CX, CY, coreR, 0, TAU);
      ctx.fillStyle = "rgba(255,240,180,0.95)";
      ctx.shadowBlur = 30;
      ctx.shadowColor = "#FFD54A";
      ctx.fill();
      ctx.shadowBlur = 0;

      // Ray burst
      for (let r = 0; r < RAYS; r++) {
        const angle = (r / RAYS) * TAU + frame * 0.003;
        const len   = coreR * (2.2 + 0.6 * Math.sin(angle * 3 + frame * 0.02));
        ctx.beginPath();
        ctx.moveTo(CX + Math.cos(angle) * coreR * 0.8, CY + Math.sin(angle) * coreR * 0.8);
        ctx.lineTo(CX + Math.cos(angle) * len, CY + Math.sin(angle) * len);
        ctx.strokeStyle = `rgba(255,213,74,${0.22 - r * 0.005})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // Orbital rings (elliptical from tilt)
      RINGS.forEach(ring => {
        const [rr, gg, bb] = ring.color;
        const rPx = ring.r * Math.min(W, H);
        const ry   = rPx * (1 - Math.abs(tiltY) * 0.55); // flatten on Y for tilt
        ctx.beginPath();
        ctx.ellipse(CX, CY, rPx, ry, tiltX * 0.3, 0, TAU);
        ctx.strokeStyle = `rgba(${rr},${gg},${bb},0.12)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Bodies + trails
      bodies.forEach(b => {
        b.angle += b.ring.speed * (1 + tiltX * 0.4);
        const [rr, gg, bb] = b.ring.color;
        const rPx = b.ring.r * Math.min(W, H);
        const ry   = rPx * (1 - Math.abs(tiltY) * 0.55);

        const bx = CX + Math.cos(b.angle) * rPx;
        const by = CY + Math.sin(b.angle) * ry;

        // Record trail
        b.trail.push({ x: bx, y: by });
        if (b.trail.length > b.trailLen) b.trail.shift();

        // Draw trail
        if (b.trail.length > 1) {
          for (let i = 1; i < b.trail.length; i++) {
            const progress = i / b.trail.length;
            ctx.beginPath();
            ctx.moveTo(b.trail[i-1].x, b.trail[i-1].y);
            ctx.lineTo(b.trail[i].x,   b.trail[i].y);
            ctx.strokeStyle = `rgba(${rr},${gg},${bb},${progress * 0.55})`;
            ctx.lineWidth   = progress * b.r * 0.7;
            ctx.stroke();
          }
        }

        // Body disc
        const bGrd = ctx.createRadialGradient(bx - b.r*0.35, by - b.r*0.35, 0, bx, by, b.r * 2.2);
        bGrd.addColorStop(0, `rgba(${Math.min(255,rr+80)},${Math.min(255,gg+80)},${Math.min(255,bb+80)},1)`);
        bGrd.addColorStop(1, `rgba(${rr},${gg},${bb},0)`);
        ctx.beginPath();
        ctx.arc(bx, by, b.r, 0, TAU);
        ctx.fillStyle = bGrd;
        ctx.shadowBlur = 12;
        ctx.shadowColor = `rgba(${rr},${gg},${bb},0.9)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // "16+" label at core
      ctx.font = `bold ${Math.floor(coreR * 0.9)}px 'Space Grotesk', sans-serif`;
      ctx.fillStyle = "rgba(10,12,16,0.85)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("16", CX, CY - coreR * 0.08);
      ctx.font = `500 ${Math.floor(coreR * 0.35)}px 'JetBrains Mono', monospace`;
      ctx.fillStyle = "rgba(10,12,16,0.65)";
      ctx.fillText("YRS", CX, CY + coreR * 0.52);
      ctx.textBaseline = "alphabetic";
    }

    if (RM) { draw(); return; }
    let vis = true;
    new IntersectionObserver(e => { vis = e[0].isIntersecting; }).observe(cvs.el);
    (function loop() { if (vis) draw(); requestAnimationFrame(loop); })();
  }


  /* ══════════════════════════════════════════════════════════
     SCENE 3 · CONTACT — SIGNAL TRANSMISSION
     Concentric ripple rings expand from center. Particle bursts
     ride the wavefronts. Mouse warps ring center position.
     Lime / cyan palette — evokes direct, open-channel signal.
  ══════════════════════════════════════════════════════════ */
  function sceneContact(cvs) {
    if (!cvs) return;
    const { ctx } = cvs;

    const rings = [];
    let frame = 0;
    let nextRing = 0;

    function spawnRing() {
      rings.push({
        r: 0,
        maxR: 0,      // set on draw based on canvas size
        speed: rand(1.2, 2.2),
        alpha: 0.7,
        // color alternates
        hue: rings.length % 2 === 0 ? [174, 234, 0] : [0, 229, 255],
        particles: [],
        particlesSpawned: false
      });
    }
    spawnRing(); // seed first ring immediately

    // Central beacon
    const beacon = { pulse: 0, pulseSpeed: 0.028 };

    function draw() {
      frame++;
      const { W, H } = cvs;
      smoothMouse();
      ctx.clearRect(0, 0, W, H);

      const CX = W * (0.5 + (mouse.sx - 0.5) * 0.08);
      const CY = H * (0.46 + (mouse.sy - 0.5) * 0.06);
      const maxR = Math.max(W, H) * 0.75;

      // Spawn new rings on interval
      if (frame >= nextRing) {
        spawnRing();
        nextRing = frame + Math.floor(rand(55, 90));
      }

      // Draw rings
      rings.forEach(ring => {
        ring.r   += ring.speed;
        ring.maxR = maxR;
        ring.alpha = Math.max(0, 0.7 * (1 - ring.r / ring.maxR));

        if (ring.alpha <= 0) return;

        const [rr, gg, bb] = ring.hue;

        // Outer glow
        ctx.beginPath();
        ctx.arc(CX, CY, ring.r, 0, TAU);
        ctx.strokeStyle = `rgba(${rr},${gg},${bb},${ring.alpha * 0.18})`;
        ctx.lineWidth = 8;
        ctx.stroke();

        // Core ring line
        ctx.beginPath();
        ctx.arc(CX, CY, ring.r, 0, TAU);
        ctx.strokeStyle = `rgba(${rr},${gg},${bb},${ring.alpha * 0.85})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Spawn particles when ring hits ~15% radius
        if (!ring.particlesSpawned && ring.r > maxR * 0.06) {
          ring.particlesSpawned = true;
          const count = Math.floor(rand(6, 14));
          for (let i = 0; i < count; i++) {
            const angle = (i / count) * TAU + rand(-0.3, 0.3);
            const spd   = rand(0.8, 2.4);
            ring.particles.push({ angle, spd, dist: ring.r, alpha: 0.85, r: rand(1.5, 3.5), [Symbol.for('rr')]:rr,[Symbol.for('gg')]:gg,[Symbol.for('bb')]:bb });
          }
        }

        // Advance + draw particles
        ring.particles.forEach(p => {
          p.dist  += p.spd;
          p.alpha *= 0.975;
          const px = CX + Math.cos(p.angle) * p.dist;
          const py = CY + Math.sin(p.angle) * p.dist;
          const pGrd = ctx.createRadialGradient(px, py, 0, px, py, p.r * 3);
          pGrd.addColorStop(0,  `rgba(${rr},${gg},${bb},${p.alpha})`);
          pGrd.addColorStop(1,  `rgba(${rr},${gg},${bb},0)`);
          ctx.beginPath();
          ctx.arc(px, py, p.r, 0, TAU);
          ctx.fillStyle = pGrd;
          ctx.fill();
        });
        ring.particles = ring.particles.filter(p => p.alpha > 0.04);
      });

      // Remove dead rings
      rings.splice(0, rings.length, ...rings.filter(r => r.alpha > 0));

      // Central beacon
      beacon.pulse = (beacon.pulse + beacon.pulseSpeed) % TAU;
      const beaconGlow = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(beacon.pulse));
      const beaconR = 7 + 4 * Math.sin(beacon.pulse * 0.5);

      const bGrd = ctx.createRadialGradient(CX, CY, 0, CX, CY, beaconR * 5);
      bGrd.addColorStop(0,   `rgba(174,234,0,${beaconGlow})`);
      bGrd.addColorStop(0.2, `rgba(0,229,255,${beaconGlow * 0.5})`);
      bGrd.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.beginPath();
      ctx.arc(CX, CY, beaconR * 5, 0, TAU);
      ctx.fillStyle = bGrd;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(CX, CY, beaconR, 0, TAU);
      ctx.fillStyle = `rgba(174,234,0,${0.8 + 0.2 * Math.sin(beacon.pulse)})`;
      ctx.shadowBlur = 24;
      ctx.shadowColor = "#AEEA00";
      ctx.fill();
      ctx.shadowBlur = 0;

      // Inner dot
      ctx.beginPath();
      ctx.arc(CX, CY, 2.5, 0, TAU);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
    }

    if (RM) { draw(); return; }
    let vis = true;
    new IntersectionObserver(e => { vis = e[0].isIntersecting; }).observe(cvs.el);
    (function loop() { if (vis) draw(); requestAnimationFrame(loop); })();
  }


  /* ══════════════════════════════════════════════════════════
     SCENE 4 · MEMBER PORTAL — CIPHER STREAM
     Vertical encrypted data-rain cascades downward. Short segments
     of monospace characters in violet/magenta. A refractive
     glowing lock/shield rises from the bottom center.
     Evokes: exclusive access, secured, encrypted.
  ══════════════════════════════════════════════════════════ */
  function sceneMember(cvs) {
    if (!cvs) return;
    const { ctx } = cvs;

    const CHARS = "アイウエオカキクケコサシスセソタチツテトABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*<>/|\\{}[]";
    const COLS_PER_PX = 22; // character column width in px
    let cols = [];
    let frame = 0;

    function initCols(W) {
      const numCols = Math.floor(W / COLS_PER_PX);
      cols = [];
      for (let i = 0; i < numCols; i++) {
        cols.push({
          x: i * COLS_PER_PX + COLS_PER_PX / 2,
          y: rand(-500, 0),
          speed: rand(1.8, 4.5),
          len: Math.floor(rand(4, 18)),
          chars: [],
          mutateTimer: 0,
          // color: mostly violet, some magenta
          palette: Math.random() > 0.72 ? [255, 61, 138] : [167, 139, 250]
        });
        // Pre-fill chars
        for (let c = 0; c < cols[cols.length-1].len; c++) {
          cols[cols.length-1].chars.push(CHARS[Math.floor(Math.random() * CHARS.length)]);
        }
      }
    }
    initCols(cvs.W || 800);
    // Read the live layout width on resize so column count never uses a stale
    // value (cvs.W is updated by setupCanvas's own resize listener, ordering-dependent).
    window.addEventListener("resize", () => initCols(cvs.el.getBoundingClientRect().width));

    // Shield geometry (drawn with canvas paths)
    function drawShield(ctx, cx, cy, size, alpha, frame) {
      const s = size;
      ctx.save();
      ctx.translate(cx, cy);

      // Outer glow
      const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, s * 2.8);
      grd.addColorStop(0,   `rgba(124,58,237,${alpha * 0.55})`);
      grd.addColorStop(0.4, `rgba(167,139,250,${alpha * 0.22})`);
      grd.addColorStop(0.7, `rgba(255,61,138,${alpha * 0.1})`);
      grd.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.beginPath();
      ctx.arc(0, 0, s * 2.8, 0, TAU);
      ctx.fillStyle = grd;
      ctx.fill();

      // Shield shape
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo( s*0.9, -s*0.85,  s*1.1, -s*0.1,  s*0.6,  s*0.5);
      ctx.bezierCurveTo( s*0.3,  s*0.9,   0,      s*1.05,  0,      s*1.05);
      ctx.bezierCurveTo(-s*0.3,  s*0.9,  -s*0.6,  s*0.5,  -s*1.1, -s*0.1);
      ctx.bezierCurveTo(-s*1.1, -s*0.85,  0,      -s,      0,      -s);
      ctx.closePath();

      // Glass fill
      const sfill = ctx.createLinearGradient(0, -s, 0, s);
      sfill.addColorStop(0,   `rgba(167,139,250,${alpha * 0.28})`);
      sfill.addColorStop(0.5, `rgba(124,58,237,${alpha * 0.15})`);
      sfill.addColorStop(1,   `rgba(255,61,138,${alpha * 0.22})`);
      ctx.fillStyle = sfill;
      ctx.fill();

      // Border
      ctx.strokeStyle = `rgba(167,139,250,${alpha * 0.85})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Inner highlight (refraction)
      ctx.beginPath();
      ctx.moveTo(-s * 0.28, -s * 0.62);
      ctx.bezierCurveTo(-s*0.15, -s*0.75, s*0.05, -s*0.7, s*0.18, -s*0.55);
      ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.45})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Lock icon (simplified)
      const lk = s * 0.3;
      const pulse = 0.7 + 0.3 * Math.sin(frame * 0.04);
      ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.7 * pulse})`;
      ctx.fillStyle   = `rgba(255,255,255,${alpha * 0.55 * pulse})`;
      ctx.lineWidth   = 1.4;
      // shackle
      ctx.beginPath();
      ctx.arc(0, -lk * 0.55, lk * 0.42, Math.PI, TAU);
      ctx.stroke();
      // body
      ctx.beginPath();
      ctx.roundRect(-lk * 0.5, -lk * 0.38, lk, lk * 0.9, lk * 0.12);
      ctx.fill();
      // keyhole
      ctx.beginPath();
      ctx.arc(0, lk * 0.06, lk * 0.16, 0, TAU);
      ctx.fillStyle = `rgba(124,58,237,${alpha * 0.8})`;
      ctx.fill();

      ctx.restore();
    }

    function draw() {
      frame++;
      const { W, H } = cvs;
      smoothMouse();

      // Fade trail
      ctx.fillStyle = "rgba(10,12,16,0.18)";
      ctx.fillRect(0, 0, W, H);

      // Draw column streams
      cols.forEach(col => {
        col.y += col.speed;
        col.mutateTimer++;
        if (col.mutateTimer > 4) {
          col.mutateTimer = 0;
          // mutate a random char
          const i = Math.floor(Math.random() * col.chars.length);
          col.chars[i] = CHARS[Math.floor(Math.random() * CHARS.length)];
        }

        const [rr, gg, bb] = col.palette;
        const charH = COLS_PER_PX * 1.4;

        col.chars.forEach((ch, i) => {
          const cy = col.y - (col.len - 1 - i) * charH;
          if (cy < -charH || cy > H + charH) return;
          const norm = (col.len - 1 - i) / col.len; // 0=head, 1=tail
          const a    = norm < 0.15 ? 1.0 : 0.12 + (1 - norm) * 0.55;
          ctx.font = `${COLS_PER_PX - 4}px 'JetBrains Mono', monospace`;
          ctx.fillStyle = norm < 0.15
            ? `rgba(240,240,255,${a})`
            : `rgba(${rr},${gg},${bb},${a})`;
          ctx.fillText(ch, col.x - 7, cy);
        });

        // Reset when fully off screen
        if (col.y - col.len * COLS_PER_PX * 1.4 > H) {
          col.y = rand(-200, 0);
          col.speed = rand(1.8, 4.5);
          col.len   = Math.floor(rand(4, 18));
          col.chars = [];
          for (let c = 0; c < col.len; c++) col.chars.push(CHARS[Math.floor(Math.random() * CHARS.length)]);
        }
      });

      // Mouse-reactive parallax offset on shield
      const sx = (mouse.sx - 0.5) * W * 0.025;
      const sy = (mouse.sy - 0.5) * H * 0.02;
      const shieldSize = Math.min(W, H) * 0.12;
      const shieldY = H * 0.52 + sy;
      const riseAlpha = 0.55 + 0.2 * Math.sin(frame * 0.022);

      // Shield fade mask (blends naturally with the matrix)
      const maskGrd = ctx.createRadialGradient(W/2 + sx, shieldY, 0, W/2 + sx, shieldY, shieldSize * 3.5);
      maskGrd.addColorStop(0,   "rgba(10,12,16,0.45)");
      maskGrd.addColorStop(0.7, "rgba(10,12,16,0)");
      ctx.beginPath();
      ctx.arc(W/2 + sx, shieldY, shieldSize * 3.5, 0, TAU);
      ctx.fillStyle = maskGrd;
      ctx.fill();

      drawShield(ctx, W/2 + sx, shieldY, shieldSize, riseAlpha, frame);
    }

    if (RM) { draw(); return; }
    let vis = true;
    new IntersectionObserver(e => { vis = e[0].isIntersecting; }).observe(cvs.el);
    (function loop() { if (vis) draw(); requestAnimationFrame(loop); })();
  }


  /* ══════════════════════════════════════════════════════════
     BOOT — read page type and launch correct scene.
     Uses a module-level generation counter (_gen) so that when
     __launchHeroScene() is called, the old rAF loop detects its
     generation is stale and self-terminates on the next frame.
     This requires each scene to accept a `gen` token and check it.
  ══════════════════════════════════════════════════════════ */

  /* ── Module-level state ── */
  let _gen = 0;        // incremented on every scene launch; old loops exit when stale
  let _cvs = null;     // shared canvas wrapper (single canvas per page)

  /* ── Patched scene launchers — inject gen token ─────────────────
     Each scene is wrapped so its rAF loop checks `_gen === myGen`.
     We do this cleanly by re-implementing the loop wrapper here
     rather than modifying the scene draw functions.                */

  function _bootScene(name) {
    if (!_cvs) return;
    _gen++;
    const myGen = _gen;
    const { ctx, W, H } = _cvs;
    ctx.clearRect(0, 0, W, H);

    /* Create a thin canvas proxy that carries the gen token.
       Scene functions receive this; their internal rAF loop is
       replaced by a gen-aware wrapper defined below.            */
    const sceneCvs = {
      el:  _cvs.el,
      ctx: _cvs.ctx,
      get W() { return _cvs.W; },
      get H() { return _cvs.H; },
      _gen: myGen        // scene functions read this via closure
    };

    /* Each scene already calls:
         (function loop() { if (vis) draw(); requestAnimationFrame(loop); })();
       We hijack requestAnimationFrame temporarily so the scene's loop
       becomes gen-aware.                                                   */
    const _origRAF = window.requestAnimationFrame;
    window.requestAnimationFrame = function _genRAF(cb) {
      return _origRAF.call(window, function(ts) {
        if (_gen !== myGen) return;   // ← stale generation: drop silently
        cb(ts);
      });
    };

    switch (name) {
      case "services": sceneServices(sceneCvs); break;
      case "about":    sceneAbout(sceneCvs);    break;
      case "contact":  sceneContact(sceneCvs);  break;
      case "member":   sceneMember(sceneCvs);   break;
    }

    // Restore real rAF immediately — the scene's loop is now registered
    window.requestAnimationFrame = _origRAF;
  }

  /* ─────────────────────────────────────────────────────────────────
     ACTUAL BOOT
  ───────────────────────────────────────────────────────────────── */
  const scene = document.body.dataset.scene;
  if (!scene) return;

  _cvs = setupCanvas("page-hero-canvas");
  if (!_cvs) return;

  _bootScene(scene);

  /* ── Export for contact.html tab-switcher ──────────────────────
     window.__launchHeroScene(newScene) — stops the running scene
     with a brief cross-fade, then boots the new one.              */
  window.__launchHeroScene = function(newScene) {
    if (!_cvs) return;
    _gen++;                              // invalidates old loop immediately
    const savedGen = _gen;
    const { ctx } = _cvs;

    /* 8-frame fade-to-dark transition */
    let fadeStep = 0;
    const _origRAF = window.requestAnimationFrame;
    (function fadeOut() {
      if (_gen !== savedGen) return;     // superseded by another call
      const { W, H } = _cvs;
      ctx.fillStyle = "rgba(10,12,16,0.4)";
      ctx.fillRect(0, 0, W, H);
      fadeStep++;
      if (fadeStep < 8) {
        _origRAF(fadeOut);
      } else {
        ctx.clearRect(0, 0, _cvs.W, _cvs.H);
        _bootScene(newScene);
      }
    })();
  };

})();
