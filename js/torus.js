/* ═══════════════════════════════════════════════════════════════
   THE LIQUID IRIDESCENT TORUS
   A 3D particle ribbon rendered on canvas with prism dispersion,
   chromatic aberration, and mouse-driven parallax rotation.
   + cosmic micro-particle drift field (background layer)
   ═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  /* ───────────────────────────────────────────────
     SHARED MOUSE STATE (smoothed)
  ─────────────────────────────────────────────── */
  const mouse = { x: 0, y: 0, sx: 0, sy: 0 }; // -1..1 normalized
  window.addEventListener("pointermove", (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  /* ═══════════════════════════════════════════════
     0 · MINI-TORUS SUPPORT FOR SUB-PAGE HEROES
  ═══════════════════════════════════════════════ */
  function buildTorus(canvasEl, cfg) {
    if (!canvasEl) return;
    const ctx = canvasEl.getContext("2d");
    let W = 0, H = 0, CX = 0, CY = 0, SCALE = 1;
    const scaleMult = cfg.scale || 1;
    const N = cfg.particleCount || (window.innerWidth < 760 ? 1400 : 2600);

    function size() {
      const r = canvasEl.getBoundingClientRect();
      W = r.width; H = r.height;
      canvasEl.width = W * DPR;
      canvasEl.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      CX = W / 2; CY = H * (cfg.cy || 0.44);
      SCALE = Math.min(W, H) / 3.1 * scaleMult;
    }
    size();
    window.addEventListener("resize", size);

    const SPECTRUM = [[0,229,255],[124,58,237],[255,61,138],[255,213,74],[174,234,0]];
    function spectral(t) {
      t = ((t%1)+1)%1; const f=t*SPECTRUM.length; const i=Math.floor(f)%SPECTRUM.length;
      const j=(i+1)%SPECTRUM.length; const k=f-Math.floor(f);
      return [SPECTRUM[i][0]+(SPECTRUM[j][0]-SPECTRUM[i][0])*k, SPECTRUM[i][1]+(SPECTRUM[j][1]-SPECTRUM[i][1])*k, SPECTRUM[i][2]+(SPECTRUM[j][2]-SPECTRUM[i][2])*k];
    }

    const pts = new Array(N);
    const R=1.0, TUBE=0.34;
    for(let i=0;i<N;i++) pts[i]={ u:Math.random()*6.2832, v:Math.random()*6.2832, du:0.0016+Math.random()*0.0022, dv:0.004+Math.random()*0.009, size:0.6+Math.random()*1.7, tw:Math.random()*6.2832 };
    let t=0;

    function draw() {
      t+=0.004; mouse.sx+=(mouse.x-mouse.sx)*0.045; mouse.sy+=(mouse.y-mouse.sy)*0.045;
      ctx.clearRect(0,0,W,H); ctx.globalCompositeOperation="lighter";
      const rotX=1.05+mouse.sy*0.22+Math.sin(t*0.6)*0.06, rotZ=t*0.55+mouse.sx*0.45;
      const cosX=Math.cos(rotX),sinX=Math.sin(rotX),cosZ=Math.cos(rotZ),sinZ=Math.sin(rotZ);
      for(let i=0;i<N;i++){
        const p=pts[i]; p.u+=p.du; p.v+=p.dv;
        const wob=TUBE*(1+0.38*Math.sin(p.u*3+t*2.2)*Math.cos(p.v+t));
        const cu=Math.cos(p.u),su=Math.sin(p.u),cv=Math.cos(p.v),sv=Math.sin(p.v);
        let x=(R+wob*cv)*cu, y=(R+wob*cv)*su, z=wob*sv+0.18*Math.sin(p.u*2+t*1.4);
        let x1=x*cosZ-y*sinZ, y1=x*sinZ+y*cosZ, y2=y1*cosX-z*sinX, z2=y1*sinX+z*cosX;
        const persp=2.6/(2.6+z2); const px=CX+x1*SCALE*persp; const py=CY+y2*SCALE*persp;
        const depth=(z2+1.4)/2.8; const alpha=0.12+depth*0.6; const sz=p.size*persp*(0.7+depth);
        const [r,g,b]=spectral(p.u/(Math.PI*2)+t*0.13); const tw=0.75+0.25*Math.sin(p.tw+t*3);
        if(depth>0.72&&sz>1.1){ctx.fillStyle=`rgba(255,80,120,${alpha*0.35*tw})`;ctx.fillRect(px-sz*1.1-1.4,py-sz*0.5,sz,sz);ctx.fillStyle=`rgba(80,220,255,${alpha*0.35*tw})`;ctx.fillRect(px+1.4,py-sz*0.5,sz,sz);}
        ctx.fillStyle=`rgba(${r|0},${g|0},${b|0},${alpha*tw})`;ctx.beginPath();ctx.arc(px,py,sz,0,6.2832);ctx.fill();
      }
      const glow=ctx.createRadialGradient(CX,CY,0,CX,CY,SCALE*1.5);
      glow.addColorStop(0,"rgba(124,58,237,0.08)"); glow.addColorStop(0.45,"rgba(0,229,255,0.04)"); glow.addColorStop(1,"rgba(0,0,0,0)");
      ctx.fillStyle=glow; ctx.fillRect(0,0,W,H); ctx.globalCompositeOperation="source-over";
    }
    if(reduceMotion){draw();}else{let vis=true;new IntersectionObserver(e=>{vis=e[0].isIntersecting;}).observe(canvasEl);(function loop(){if(vis)draw();requestAnimationFrame(loop);})();}
  }

  /* ═══════════════════════════════════════════════
     1 · BOOT TORUS INSTANCES
  ═══════════════════════════════════════════════ */
  // Main hero torus (index.html)
  buildTorus(document.getElementById("torus-canvas"), { particleCount: window.innerWidth < 760 ? 1400 : 2600, scale: 1, cy: 0.44 });
  // Mini torus (sub-page heroes)
  const miniCfg = window.__MINI_TORUS__ || {};
  if (miniCfg.canvasId) buildTorus(document.getElementById(miniCfg.canvasId), { particleCount: miniCfg.particleCount || 800, scale: miniCfg.scale || 0.48, cy: 0.5 });

  /* LEGACY BLOCK STUB — replaced by buildTorus above */
  const torusCanvas = null;
  if (torusCanvas) {
    const ctx = torusCanvas.getContext("2d");
    let W = 0, H = 0, CX = 0, CY = 0, SCALE = 1;

    function sizeTorus() {
      const r = torusCanvas.getBoundingClientRect();
      W = r.width; H = r.height;
      torusCanvas.width = W * DPR;
      torusCanvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      CX = W / 2; CY = H * 0.44;
      SCALE = Math.min(W, H) / 3.1;
    }
    sizeTorus();
    window.addEventListener("resize", sizeTorus);

    // Spectral palette across the ribbon (cyan → violet → magenta → gold → lime)
    const SPECTRUM = [
      [0, 229, 255],    // cyan
      [124, 58, 237],   // violet
      [255, 61, 138],   // magenta
      [255, 213, 74],   // gold
      [174, 234, 0]     // lime
    ];
    function spectral(t) {
      t = ((t % 1) + 1) % 1;
      const f = t * (SPECTRUM.length);
      const i = Math.floor(f) % SPECTRUM.length;
      const j = (i + 1) % SPECTRUM.length;
      const k = f - Math.floor(f);
      const a = SPECTRUM[i], b = SPECTRUM[j];
      return [
        a[0] + (b[0] - a[0]) * k,
        a[1] + (b[1] - a[1]) * k,
        a[2] + (b[2] - a[2]) * k
      ];
    }

    // Particle cloud distributed along the torus surface
    const N = window.innerWidth < 760 ? 1400 : 2600;
    const pts = new Array(N);
    for (let i = 0; i < N; i++) {
      pts[i] = {
        u: Math.random() * Math.PI * 2,        // angle around the main ring
        v: Math.random() * Math.PI * 2,        // angle around the tube
        du: 0.0016 + Math.random() * 0.0022,   // drift speed along ring
        dv: 0.004 + Math.random() * 0.009,     // swirl speed around tube
        size: 0.6 + Math.random() * 1.7,
        tw: Math.random() * Math.PI * 2        // twinkle phase
      };
    }

    const R = 1.0;        // main radius (normalized)
    const TUBE = 0.34;    // tube radius
    let t = 0;

    function drawTorus() {
      t += 0.004;
      // smooth the mouse
      mouse.sx += (mouse.x - mouse.sx) * 0.045;
      mouse.sy += (mouse.y - mouse.sy) * 0.045;

      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";

      const rotX = 1.05 + mouse.sy * 0.22 + Math.sin(t * 0.6) * 0.06;
      const rotZ = t * 0.55 + mouse.sx * 0.45;
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      const cosZ = Math.cos(rotZ), sinZ = Math.sin(rotZ);

      for (let i = 0; i < N; i++) {
        const p = pts[i];
        p.u += p.du;
        p.v += p.dv;

        // liquid pinch — tube radius breathes along the ring
        const wob = TUBE * (1 + 0.38 * Math.sin(p.u * 3 + t * 2.2) * Math.cos(p.v + t));
        const cu = Math.cos(p.u), su = Math.sin(p.u);
        const cv = Math.cos(p.v), sv = Math.sin(p.v);

        // torus surface point
        let x = (R + wob * cv) * cu;
        let y = (R + wob * cv) * su;
        let z = wob * sv + 0.18 * Math.sin(p.u * 2 + t * 1.4); // ribbon wave

        // rotate Z then X
        let x1 = x * cosZ - y * sinZ;
        let y1 = x * sinZ + y * cosZ;
        let y2 = y1 * cosX - z * sinX;
        let z2 = y1 * sinX + z * cosX;

        // perspective
        const persp = 2.6 / (2.6 + z2);
        const px = CX + x1 * SCALE * persp;
        const py = CY + y2 * SCALE * persp;

        // depth-based intensity & size
        const depth = (z2 + 1.4) / 2.8;            // 0 (far) .. 1 (near)
        const alpha = 0.12 + depth * 0.6;
        const sz = p.size * persp * (0.7 + depth);

        // prism color shifts along the ring + time
        const [r, g, b] = spectral(p.u / (Math.PI * 2) + t * 0.13);
        const tw = 0.75 + 0.25 * Math.sin(p.tw + t * 3);

        // chromatic aberration on near particles
        if (depth > 0.72 && sz > 1.1) {
          ctx.fillStyle = `rgba(255,80,120,${alpha * 0.35 * tw})`;
          ctx.fillRect(px - sz * 1.1 - 1.4, py - sz * 0.5, sz, sz);
          ctx.fillStyle = `rgba(80,220,255,${alpha * 0.35 * tw})`;
          ctx.fillRect(px + 1.4, py - sz * 0.5, sz, sz);
        }

        ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${alpha * tw})`;
        ctx.beginPath();
        ctx.arc(px, py, sz, 0, 6.2832);
        ctx.fill();
      }

      // central core glow
      const glow = ctx.createRadialGradient(CX, CY, 0, CX, CY, SCALE * 1.5);
      glow.addColorStop(0, "rgba(124,58,237,0.10)");
      glow.addColorStop(0.45, "rgba(0,229,255,0.05)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      ctx.globalCompositeOperation = "source-over";
    }

    if (reduceMotion) {
      drawTorus(); // single static frame
    } else {
      let heroVisible = true;
      new IntersectionObserver((en) => { heroVisible = en[0].isIntersecting; })
        .observe(document.getElementById("hero-section"));
      (function loop() {
        if (heroVisible) drawTorus();
        requestAnimationFrame(loop);
      })();
    }
  }

  /* ═══════════════════════════════════════════════
     2 · COSMIC MICRO-PARTICLE DRIFT FIELD
  ═══════════════════════════════════════════════ */
  const fieldCanvas = document.getElementById("particle-field");
  if (fieldCanvas) {
    const fctx = fieldCanvas.getContext("2d");
    let FW = 0, FH = 0;

    function sizeField() {
      FW = window.innerWidth; FH = window.innerHeight;
      fieldCanvas.width = FW * DPR;
      fieldCanvas.height = FH * DPR;
      fctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    sizeField();
    window.addEventListener("resize", sizeField);

    const COLORS = ["0,229,255", "124,58,237", "255,61,138", "174,234,0", "230,235,245"];
    const M = window.innerWidth < 760 ? 50 : 95;
    const dots = new Array(M);
    for (let i = 0; i < M; i++) {
      dots[i] = {
        x: Math.random() * FW,
        y: Math.random() * FH,
        z: 0.25 + Math.random() * 0.75,            // depth → parallax factor
        r: 0.5 + Math.random() * 1.6,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -0.04 - Math.random() * 0.12,
        c: COLORS[(Math.random() * COLORS.length) | 0],
        tw: Math.random() * Math.PI * 2
      };
    }

    let scrollOffset = 0, lastScroll = window.scrollY;
    let ft = 0;

    function drawField() {
      ft += 0.012;
      const sc = window.scrollY;
      scrollOffset += (sc - lastScroll) * 0.06;
      scrollOffset *= 0.94;
      lastScroll = sc;

      fctx.clearRect(0, 0, FW, FH);
      for (let i = 0; i < M; i++) {
        const d = dots[i];
        d.x += d.vx + mouse.sx * 0.15 * d.z;
        d.y += d.vy - scrollOffset * d.z * 0.4;
        if (d.y < -8) { d.y = FH + 8; d.x = Math.random() * FW; }
        if (d.y > FH + 8) d.y = -8;
        if (d.x < -8) d.x = FW + 8;
        if (d.x > FW + 8) d.x = -8;

        const a = (0.18 + 0.5 * d.z) * (0.6 + 0.4 * Math.sin(d.tw + ft * 2));
        fctx.fillStyle = `rgba(${d.c},${a.toFixed(3)})`;
        fctx.beginPath();
        fctx.arc(d.x, d.y, d.r * d.z, 0, 6.2832);
        fctx.fill();
      }
    }

    if (reduceMotion) {
      drawField();
    } else {
      (function floop() { drawField(); requestAnimationFrame(floop); })();
    }
  }
})();
