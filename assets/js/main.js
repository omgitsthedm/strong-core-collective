(async function(){
  const qs = (s, el=document) => el.querySelector(s);

  // Inject shared components
  async function inject(id, url){
    const mount = qs(id);
    if(!mount) return;
    const res = await fetch(url, { cache: "no-store" });
    if(!res.ok) return;
    mount.innerHTML = await res.text();
  }

  await Promise.all([
    inject("#navMount", "/components/nav.html"),
    inject("#footerMount", "/components/footer.html"),
  ]);

  // Mobile nav toggle
  const toggle = qs("[data-mobile-toggle]");
  const panel = qs("[data-mobile-panel]");
  if(toggle && panel){
    toggle.addEventListener("click", () => {
      const isOpen = panel.getAttribute("data-open") === "true";
      panel.setAttribute("data-open", String(!isOpen));
      panel.style.display = isOpen ? "none" : "block";
      toggle.setAttribute("aria-expanded", String(!isOpen));
    });
  }

  // "Copied" helper for phone/email
  const toast = qs(".toast");
  document.addEventListener("click", async (e) => {
    const t = e.target.closest("[data-copy]");
    if(!t) return;
    const val = t.getAttribute("data-copy");
    try{
      await navigator.clipboard.writeText(val);
      if(toast){
        toast.textContent = "Copied: " + val;
        toast.classList.add("show");
        setTimeout(()=>toast.classList.remove("show"), 1400);
      }
    }catch{}
  });

  // Mark active nav link
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  document.querySelectorAll('a[data-nav]').forEach(a=>{
    const href = (a.getAttribute("href") || "").replace(/\/+$/, "") || "/";
    if(href === path){
      a.style.color = "var(--ink)";
      a.style.background = "rgba(255,255,255,.65)";
    }
  });
})();

/**
 * Waterfall River Background (SCC)
 * Heavier, more dynamic: crossing currents, diagonal/vertical ribbons, waterfall pull.
 * Still welcoming: soft edges + warm palette + no harsh contrast.
 * Honors prefers-reduced-motion.
 */
function initWaves(){
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  // Atmospheric layers (cheap and pretty)
  if(!document.querySelector(".flow-glow")){
    const glow = document.createElement("div");
    glow.className = "flow-glow";
    document.body.prepend(glow);
  }
  if(!document.querySelector(".bg-noise")){
    const noise = document.createElement("div");
    noise.className = "bg-noise";
    document.body.prepend(noise);
  }

  // Canvas
  const canvas = document.createElement("canvas");
  canvas.className = "bg-waves";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);

  const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
  if(!ctx) return;

  let w = 0, h = 0;
  function resize(){
    w = Math.floor(window.innerWidth * DPR);
    h = Math.floor(window.innerHeight * DPR);
    canvas.width = w;
    canvas.height = h;
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });

  // Interaction state
  let targetX = 0.52, targetY = 0.34;
  let x = targetX, y = targetY;

  function onPointer(e){
    const pt = e.touches ? e.touches[0] : e;
    targetX = Math.min(Math.max(pt.clientX / window.innerWidth, 0), 1);
    targetY = Math.min(Math.max(pt.clientY / window.innerHeight, 0), 1);
  }
  window.addEventListener("mousemove", onPointer, { passive: true });
  window.addEventListener("touchmove", onPointer, { passive: true });

  // Deterministic pseudo-random for stable layout
  let seed = 1337;
  const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
  const lerp = (a,b,t)=> a+(b-a)*t;
  const clamp = (v, a, b)=> Math.max(a, Math.min(b, v));

  // Layer system: multiple ribbons with different angles, widths, and drift
  const layers = [];
  const layerCount = reduce ? 4 : 7;

  for(let i=0;i<layerCount;i++){
    const angle = (i%3===0 ? lerp(-35, -12, rnd())
                : i%3===1 ? lerp(10, 38, rnd())
                : lerp(70, 110, rnd())); // include near-vertical currents

    layers.push({
      angle,
      yNorm: lerp(-0.15, 1.15, rnd()),
      xNorm: lerp(-0.10, 1.10, rnd()),
      thickness: lerp(90, 170, rnd()),
      freq: lerp(0.6, 1.6, rnd()),
      speed: lerp(0.35, 0.85, rnd()),
      phase: rnd() * Math.PI * 2,
      jitter: lerp(0.6, 1.15, rnd()),
      alpha: lerp(0.06, 0.14, rnd()),
      tint: i%4
    });
  }

  // Palette (warm clay/sand), slightly varied per layer
  const colors = [
    "rgba(192,123,97,ALPHA)",
    "rgba(179,155,122,ALPHA)",
    "rgba(215,193,176,ALPHA)",
    "rgba(192,123,97,ALPHA)"
  ];

  let t0 = performance.now();

  function paintBase(){
    // warm paper wash
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "rgba(248,244,238,0.98)");
    g.addColorStop(0.42, "rgba(242,236,228,0.94)");
    g.addColorStop(1, "rgba(248,244,238,0.98)");
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);
  }

  function ribbon(layer, time){
    const angle = layer.angle + (x-0.5)*14 + (0.5-y)*10; // interactive tilt
    const rad = angle * Math.PI/180;

    const cx = (layer.xNorm + (x-0.5)*0.06) * w;
    const cy = (layer.yNorm + (y-0.5)*0.08) * h;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rad);
    ctx.translate(-cx, -cy);

    // Waterfall pull: overall downward drift, varies by layer
    const fall = (time * 0.18 * layer.speed + (window.scrollY||0)*0.00012) * h * 0.15;

    const baseY = cy + fall;
    const thickness = layer.thickness * DPR;
    const freq = layer.freq;
    const ampBase = reduce ? 10 : 18;
    const amp = ampBase * DPR * (0.8 + layer.jitter*0.55) * (1 + Math.abs(x-0.5)*0.35);

    // Soft edge gradient fill (makes it welcoming, not neon)
    const alpha = layer.alpha;
    const breathe = 0.82 + 0.18 * Math.sin(time*0.9 + layer.phase);
    const col = colors[layer.tint].replace("ALPHA", String(alpha * breathe));
    const col2 = colors[(layer.tint+1)%colors.length].replace("ALPHA", String(alpha * breathe * 0.75));

    // Build path across the long axis (we draw wider than screen to allow diagonals)
    const long = Math.max(w,h) * 1.35;
    const left = cx - long;
    const right = cx + long;

    ctx.beginPath();
    const step = Math.max(16 * DPR, 12);
    for(let px=left; px<=right+step; px+=step){
      const nx = (px-left) / (right-left);
      const wobbleA = Math.sin((nx*freq + time*layer.speed + layer.phase) * Math.PI*2);
      const wobbleB = Math.sin((nx*(freq*0.52) - time*layer.speed*0.68 + layer.phase*1.37) * Math.PI*2);
      const chop = Math.sin((nx*(freq*2.2) + time*layer.speed*1.65 + layer.phase*0.7) * Math.PI*2);
      // Sporadic feel: use "chop" to create local turbulence
      const dy = (wobbleA*0.75 + wobbleB*0.35) * amp + chop * (amp*0.09);
      // Occasional cross-current "snap"
      const cross = Math.sin((nx*3.0 + time*0.25 + x*0.55) * Math.PI*2) * (amp*0.05);
      const py = baseY + dy + cross;
      if(px===left) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    for(let px=right; px>=left; px-=step){
      const nx = (px-left) / (right-left);
      const wobbleA = Math.sin((nx*freq + time*layer.speed + layer.phase) * Math.PI*2);
      const wobbleB = Math.sin((nx*(freq*0.52) - time*layer.speed*0.68 + layer.phase*1.37) * Math.PI*2);
      const chop = Math.sin((nx*(freq*2.2) + time*layer.speed*1.65 + layer.phase*0.7) * Math.PI*2);
      const dy = (wobbleA*0.75 + wobbleB*0.35) * amp + chop * (amp*0.09);
      const cross = Math.sin((nx*3.0 + time*0.25 + x*0.55) * Math.PI*2) * (amp*0.05);
      const py = baseY + dy + cross + thickness;
      ctx.lineTo(px, py);
    }
    ctx.closePath();

    // Fill with a subtle two-tone gradient across thickness
    const fg = ctx.createLinearGradient(cx, baseY, cx, baseY + thickness);
    fg.addColorStop(0, col);
    fg.addColorStop(1, col2);
    ctx.fillStyle = fg;
    ctx.fill();

    // Soft highlight line to hint "water"
    if(!reduce){
      ctx.globalAlpha = 0.22;
      ctx.lineWidth = 2 * DPR;
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.beginPath();
      for(let px=left; px<=right+step; px+=step){
        const nx = (px-left) / (right-left);
        const wobbleA = Math.sin((nx*freq + time*layer.speed + layer.phase) * Math.PI*2);
        const wobbleB = Math.sin((nx*(freq*0.52) - time*layer.speed*0.68 + layer.phase*1.37) * Math.PI*2);
        const chop = Math.sin((nx*(freq*2.2) + time*layer.speed*1.65 + layer.phase*0.7) * Math.PI*2);
        const dy = (wobbleA*0.75 + wobbleB*0.35) * amp + chop * (amp*0.09);
        const cross = Math.sin((nx*3.0 + time*0.25 + x*0.55) * Math.PI*2) * (amp*0.05);
        const py = baseY + dy + cross + thickness*0.18;
        if(px===left) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    ctx.restore();
  }

  function mist(time){
    // Waterfall mist near the top-center, welcoming glow
    const gx = w*(0.46 + (x-0.5)*0.08);
    const gy = h*(0.06 + (y-0.5)*0.04);
    const r1 = Math.max(w,h)*0.22;
    const r2 = Math.max(w,h)*0.55;
    const m = ctx.createRadialGradient(gx, gy, r1*0.05, gx, gy, r2);
    m.addColorStop(0, "rgba(255,255,255,0.20)");
    m.addColorStop(0.25, "rgba(255,255,255,0.10)");
    m.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = m;
    ctx.fillRect(0,0,w,h);
  }

  function vignette(){
    const v = ctx.createRadialGradient(w*0.5, h*0.45, Math.min(w,h)*0.12, w*0.5, h*0.5, Math.max(w,h)*0.75);
    v.addColorStop(0, "rgba(255,255,255,0)");
    v.addColorStop(1, "rgba(28,25,23,0.06)");
    ctx.fillStyle = v;
    ctx.fillRect(0,0,w,h);
  }

  function draw(now){
    const time = now * 0.00024;
    x = lerp(x, targetX, 0.06);
    y = lerp(y, targetY, 0.06);

    ctx.clearRect(0,0,w,h);
    paintBase();

    // Draw crossing ribbons: alternate blend to feel deeper
    for(let i=0;i<layers.length;i++){
      const layer = layers[i];
      // Some layers use soft-light-ish feel via alpha and overlap (canvas doesn't have soft-light reliably across browsers)
      ctx.globalCompositeOperation = "source-over";
      ribbon(layer, time + i*0.11);
    }

    mist(time);
    vignette();

    ctx.globalCompositeOperation = "source-over";

    if(!reduce) requestAnimationFrame(draw);
  }

  // Render
  requestAnimationFrame(draw);
}

try{ initWaves(); }catch(e){}

// Sticky CTA: show after gentle scroll
(function(){
  const el = document.querySelector('[data-sticky-cta]');
  if(!el) return;

  const showAfter = 220; // px
  let visible = false;

  function onScroll(){
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    const shouldShow = y > showAfter;
    if(shouldShow && !visible){
      el.classList.add('is-visible');
      visible = true;
    }else if(!shouldShow && visible){
      el.classList.remove('is-visible');
      visible = false;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
