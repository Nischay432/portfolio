import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number; // depth 0..1 — drives size, speed and parallax
  tw: number; // twinkle phase
}

/**
 * Fixed full-viewport starfield: slow upward drift, twinkle, and subtle
 * mouse parallax by depth. Skips animation entirely for reduced-motion.
 */
export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let stars: Star[] = [];
    let raf = 0;
    let w = 0;
    let h = 0;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(180, Math.round((w * h) / 9000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random(),
        tw: Math.random() * Math.PI * 2,
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      for (const s of stars) {
        if (!reduced) {
          s.y -= 0.02 + s.z * 0.05; // deeper stars drift faster
          if (s.y < -2) { s.y = h + 2; s.x = Math.random() * w; }
        }
        const px = s.x + mouse.x * s.z * 22;
        const py = s.y + mouse.y * s.z * 22;
        const alpha = 0.25 + s.z * 0.5 + (reduced ? 0 : Math.sin(t / 900 + s.tw) * 0.2);
        const r = 0.4 + s.z * 1.3;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(190, 210, 255, ${Math.max(0.05, alpha)})`;
        ctx.fill();
      }
      if (!reduced) raf = requestAnimationFrame(draw);
    };

    const onMouse = (e: MouseEvent) => {
      mouse.tx = (e.clientX / w - 0.5) * 2;
      mouse.ty = (e.clientY / h - 0.5) * 2;
    };
    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduced) raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);
    if (reduced) draw(0); // single static frame

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouse);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return <canvas ref={ref} className="starfield" aria-hidden="true" />;
}
