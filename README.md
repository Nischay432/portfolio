# nischay.dev — portfolio

Personal portfolio, designed and built from scratch — no templates, no UI libraries.

**Live: https://tinygridlabs.com**

- Vite + React + TypeScript, plain hand-written CSS
- Canvas starfield with mouse parallax and a self-solving mini maze (randomized DFS + BFS, the same algorithms behind [Maze Rush](https://github.com/Nischay432/maze-rush))
- Scroll-reveal, 3D-tilt project cards, pointer glow — all hand-rolled, `prefers-reduced-motion` respected
- Deployed on Cloudflare Workers static assets

```bash
npm install
npm run dev      # local
npm run deploy   # build + cloudflare
```
