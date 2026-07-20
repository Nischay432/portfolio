import { useEffect, useRef } from 'react';

const W = 13;
const H = 9;
const WALL = { N: 1, E: 2, S: 4, W: 8 } as const;
type Dir = keyof typeof WALL;
const DX: Record<Dir, number> = { N: 0, E: 1, S: 0, W: -1 };
const DY: Record<Dir, number> = { N: -1, E: 0, S: 1, W: 0 };
const OPP: Record<Dir, Dir> = { N: 'S', E: 'W', S: 'N', W: 'E' };

/** Randomized-DFS maze — the same algorithm Maze Rush runs in production. */
function generate(): number[] {
  const walls = new Array<number>(W * H).fill(15);
  const seen = new Array<boolean>(W * H).fill(false);
  const stack = [0];
  seen[0] = true;
  while (stack.length) {
    const cur = stack[stack.length - 1];
    const x = cur % W;
    const y = (cur / W) | 0;
    const dirs = (['N', 'E', 'S', 'W'] as Dir[]).sort(() => Math.random() - 0.5);
    let moved = false;
    for (const d of dirs) {
      const nx = x + DX[d];
      const ny = y + DY[d];
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      const n = ny * W + nx;
      if (seen[n]) continue;
      walls[cur] &= ~WALL[d];
      walls[n] &= ~WALL[OPP[d]];
      seen[n] = true;
      stack.push(n);
      moved = true;
      break;
    }
    if (!moved) stack.pop();
  }
  return walls;
}

/** BFS path from start (0) to exit (last cell), as a list of cell indices. */
function solve(walls: number[]): number[] {
  const prev = new Array<number>(W * H).fill(-1);
  const q = [0];
  prev[0] = 0;
  for (let h = 0; h < q.length; h++) {
    const cur = q[h];
    const x = cur % W;
    const y = (cur / W) | 0;
    for (const d of ['N', 'E', 'S', 'W'] as Dir[]) {
      if (walls[cur] & WALL[d]) continue;
      const n = (y + DY[d]) * W + (x + DX[d]);
      if (prev[n] === -1) { prev[n] = cur; q.push(n); }
    }
  }
  const path = [W * H - 1];
  while (path[0] !== 0) path.unshift(prev[path[0]]);
  return path;
}

/**
 * A miniature Maze Rush round on loop: a fresh maze generates, the runner
 * solves it under a fog-of-war spotlight, and the cycle repeats.
 */
export function MazePreview() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const CELL = 30;
    const PAD = 10;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = (W * CELL + PAD * 2) * dpr;
    canvas.height = (H * CELL + PAD * 2) * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let walls = generate();
    let path = solve(walls);
    let step = 0;
    let raf = 0;
    let last = 0;
    let px = PAD + CELL / 2;
    let py = PAD + CELL / 2;

    const cellCenter = (i: number) => ({
      x: PAD + (i % W) * CELL + CELL / 2,
      y: PAD + ((i / W) | 0) * CELL + CELL / 2,
    });

    const draw = (t: number) => {
      // advance one cell every 130ms
      if (t - last > 130 && step < path.length - 1) { step++; last = t; }
      const target = cellCenter(path[step]);
      px += (target.x - px) * 0.25;
      py += (target.y - py) * 0.25;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#05081a';
      ctx.fillRect(0, 0, W * CELL + PAD * 2, H * CELL + PAD * 2);

      // walls
      ctx.strokeStyle = '#3d4a75';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const w = walls[y * W + x];
          const ox = PAD + x * CELL;
          const oy = PAD + y * CELL;
          if (w & WALL.N) { ctx.moveTo(ox, oy); ctx.lineTo(ox + CELL, oy); }
          if (w & WALL.W) { ctx.moveTo(ox, oy); ctx.lineTo(ox, oy + CELL); }
          if (x === W - 1 && w & WALL.E && y !== H - 1) { ctx.moveTo(ox + CELL, oy); ctx.lineTo(ox + CELL, oy + CELL); }
          if (y === H - 1 && w & WALL.S) { ctx.moveTo(ox, oy + CELL); ctx.lineTo(ox + CELL, oy + CELL); }
        }
      }
      ctx.stroke();

      // exit glow
      const exit = cellCenter(W * H - 1);
      const glow = ctx.createRadialGradient(exit.x, exit.y, 0, exit.x, exit.y, CELL * 1.3);
      glow.addColorStop(0, 'rgba(29, 209, 161, 0.4)');
      glow.addColorStop(1, 'rgba(29, 209, 161, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(exit.x - CELL * 1.3, exit.y - CELL * 1.3, CELL * 2.6, CELL * 2.6);

      // runner
      ctx.beginPath();
      ctx.arc(px, py, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#48dbfb';
      ctx.shadowColor = '#48dbfb';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      // fog of war spotlight around the runner
      const fog = ctx.createRadialGradient(px, py, CELL * 1.6, px, py, CELL * 4.5);
      fog.addColorStop(0, 'rgba(3, 6, 20, 0)');
      fog.addColorStop(1, 'rgba(3, 6, 20, 0.82)');
      ctx.fillStyle = fog;
      ctx.fillRect(0, 0, W * CELL + PAD * 2, H * CELL + PAD * 2);

      // reached the exit: pause, then run a fresh maze
      if (step === path.length - 1 && Math.hypot(px - exit.x, py - exit.y) < 2) {
        walls = generate();
        path = solve(walls);
        step = 0;
        const s = cellCenter(0);
        px = s.x;
        py = s.y;
      }
      raf = requestAnimationFrame(draw);
    };

    if (reduced) {
      draw(0); // static first frame only
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(draw);
    }

    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduced) raf = requestAnimationFrame(draw);
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <div className="mini-window">
      <div className="mini-bar">
        <i /><i /><i />
        <span className="mini-url">maze-rush.nischay432.workers.dev</span>
      </div>
      <canvas ref={ref} className="maze-canvas" style={{ aspectRatio: `${W * 30 + 20} / ${H * 30 + 20}` }} />
    </div>
  );
}
