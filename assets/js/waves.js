/**
 * Zen wave background for SCC
 * - Canvas-based, ultra-lightweight
 * - Mouse/touch parallax
 * - Honors prefers-reduced-motion
 */
export function initWaves(){
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  // Create layers (glow + noise) via divs for cheaper effects
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
  let targetX = 0.5, targetY = 0.35;
  let x = targetX, y = targetY;

  function onPointer(e){
    const pt = e.touches ? e.touches[0] : e;
    targetX = Math.min(Math.max(pt.clientX / window.innerWidth, 0), 1);
    targetY = Math.min(Math.max(pt.clientY / window.innerHeight, 0), 1);
  }
  window.addEventListener("mousemove", onPointer, { passive: true });
  window.addEventListener("touchmove", onPointer, { passive: true });

  // Helpers
  const lerp = (a,b,t)=> a+(b-a)*t;
  const clamp = (v, a, b)=> Math.max(a, Math.min(b, v));

  // Paint
  let t0 = performance.now();
  function draw(now){
    const dt = Math.min((now - t0) / 1000, 0.05);
    t0 = now;

    // ease toward pointer
    x = lerp(x, targetX, 0.08);
    y = lerp(y, targetY, 0.08);

    // Slight scroll coupling
    const scroll = (window.scrollY || 0) * 0.00008;
    const time = now * 0.00035 + scroll;

    ctx.clearRect(0,0,w,h);

    // background wash
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "rgba(251,250,247,0.95)");
    g.addColorStop(0.45, "rgba(248,244,238,0.92)");
    g.addColorStop(1, "rgba(251,250,247,0.95)");
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);

    // wave palette (warm clay + sand)
    const c1 = "rgba(192,123,97,0.20)";
    const c2 = "rgba(179,155,122,0.18)";
    const c3 = "rgba(192,123,97,0.12)";
    const c4 = "rgba(179,155,122,0.10)";

    // amplitude responds to pointer (subtle)
    const ampBase = reduce ? 10 : 18;
    const amp = ampBase + (x-0.5)*18 + (0.5-y)*12;
    const speed = reduce ? 0.55 : 1.0;

    // Draw multiple soft ribbons
    function ribbon(yNorm, thickness, color, phase, freq){
      const mid = yNorm * h;
      ctx.beginPath();
      const step = Math.max(18 * DPR, 14);
      for(let px=0; px<=w+step; px+=step){
        const nx = px / w;
        const wobble = Math.sin((nx*freq + time*speed + phase) * Math.PI*2);
        const wobble2 = Math.sin((nx*(freq*0.5) - time*speed*0.7 + phase*1.7) * Math.PI*2);
        const dy = (wobble*0.75 + wobble2*0.35) * amp * DPR;
        const pull = Math.sin((nx + time*0.25 + x*0.18) * Math.PI*2) * (amp*0.28*DPR);
        const py = mid + dy + pull;
        if(px===0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      // close shape with thickness
      for(let px=w; px>=0; px-=Math.max(18 * DPR, 14)){
        const nx = px / w;
        const wobble = Math.sin((nx*freq + time*speed + phase) * Math.PI*2);
        const wobble2 = Math.sin((nx*(freq*0.5) - time*speed*0.7 + phase*1.7) * Math.PI*2);
        const dy = (wobble*0.75 + wobble2*0.35) * amp * DPR;
        const pull = Math.sin((nx + time*0.25 + x*0.18) * Math.PI*2) * (amp*0.28*DPR);
        const py = (yNorm * h) + dy + pull + thickness*DPR;
        ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    }

    // Placement feels like "river": top ribbons + mid + bottom
    ribbon(0.10 + y*0.06, 110, c4, 0.11, 1.2);
    ribbon(0.22 + y*0.08, 140, c3, 0.28, 1.35);
    ribbon(0.42 + y*0.10, 160, c2, 0.62, 1.15);
    ribbon(0.62 + y*0.08, 150, c1, 0.90, 1.05);
    ribbon(0.80 + y*0.06, 120, c3, 1.18, 0.95);

    // Gentle vignette
    const v = ctx.createRadialGradient(w*0.5, h*0.45, Math.min(w,h)*0.15, w*0.5, h*0.5, Math.max(w,h)*0.72);
    v.addColorStop(0, "rgba(255,255,255,0)");
    v.addColorStop(1, "rgba(28,25,23,0.05)");
    ctx.fillStyle = v;
    ctx.fillRect(0,0,w,h);

    if(!reduce) requestAnimationFrame(draw);
  }

  // If reduced motion, render once (still pretty)
  if(reduce){
    requestAnimationFrame(draw);
  }else{
    requestAnimationFrame(draw);
  }
}
