import { useEffect, useRef } from 'react';
import { Starfield } from './components/Starfield';
import { MazePreview } from './components/MazePreview';

const GITHUB = 'https://github.com/Nischay432';
const LINKEDIN = 'https://www.linkedin.com/in/nischay-prasher/';
const EMAIL = 'nischayprasherngh123@gmail.com';

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.36.95.1-.74.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11.1 11.1 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12v3.14c0 .3.21.66.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
  </svg>
);
const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
  </svg>
);
const FileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6M9 13h6M9 17h6" />
  </svg>
);
const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17 17 7M9 7h8v8" />
  </svg>
);

/** Adds .in when an element scrolls into view (drives reveal transitions). */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.18 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/** Soft radial glow that trails the pointer (fine pointers only). */
function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const el = ref.current!;
    let raf = 0;
    let x = innerWidth / 2, y = innerHeight / 3, tx = x, ty = y;
    const loop = () => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      raf = requestAnimationFrame(loop);
    };
    const move = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY; };
    window.addEventListener('mousemove', move);
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('mousemove', move); };
  }, []);
  return <div ref={ref} className="cursor-glow" aria-hidden="true" />;
}

/** Pointer-tracked 3D tilt for the project cards. */
function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const rx = ((e.clientY - r.top) / r.height - 0.5) * -3.5;
    const ry = ((e.clientX - r.left) / r.width - 0.5) * 3.5;
    el.style.transform = `perspective(1100px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  };
  const onLeave = () => {
    ref.current!.style.transform = '';
  };
  return (
    <div ref={ref} className="project-card reveal" onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </div>
  );
}

const NextractPreview = () => (
  <div className="mini-window">
    <div className="mini-bar">
      <i /><i /><i />
      <span className="mini-url">nextract-lms.vercel.app</span>
    </div>
    <div className="mini-dash">
      <div className="mini-side">
        <i /><i style={{ width: '70%' }} /><i style={{ width: '85%' }} /><i style={{ width: '60%' }} />
      </div>
      <div className="mini-main">
        <h5>REVENUE ANALYTICS</h5>
        <div className="mini-bars">
          <i style={{ height: '45%' }} /><i style={{ height: '70%' }} /><i style={{ height: '38%' }} />
          <i style={{ height: '88%' }} /><i style={{ height: '60%' }} /><i style={{ height: '100%' }} />
        </div>
        <div className="mini-row"><b /><span className="lines"><i /><i /></span><span className="mini-progress" style={{ '--p': '82%' } as React.CSSProperties}><i /></span></div>
        <div className="mini-row"><b /><span className="lines"><i /><i /></span><span className="mini-progress" style={{ '--p': '54%' } as React.CSSProperties}><i /></span></div>
      </div>
    </div>
  </div>
);

export default function App() {
  useReveal();

  return (
    <>
      <Starfield />
      <div className="orb orb-tr" aria-hidden="true" />
      <div className="orb orb-bl" aria-hidden="true" />
      <CursorGlow />

      <nav className="nav">
        <a href="#top" className="nav-logo">NISCHAY</a>
        <div className="nav-links">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="/resume.pdf" target="_blank" rel="noreferrer">Resume</a>
          <a href="#contact" className="nav-cta">Get in touch</a>
        </div>
      </nav>

      <main id="top">
        {/* ------------------------------------------------ hero */}
        <header className="hero">
          <div className="hero-chips" aria-hidden="true">
            <span className="code-chip" style={{ top: '22%', left: '9%', animationDelay: '0s' }}>
              <span className="dot">●</span>npm run dev
            </span>
            <span className="code-chip" style={{ top: '64%', left: '13%', animationDelay: '1.4s' }}>
              git commit -m <span className="str">"feat: ui update"</span>
            </span>
            <span className="code-chip" style={{ top: '30%', right: '8%', animationDelay: '0.7s' }}>
              const ship = () =&gt; 🚀
            </span>
            <span className="code-chip" style={{ top: '70%', right: '12%', animationDelay: '2.1s' }}>
              <span className="dot">◦—◦</span>main
            </span>
          </div>

          <span className="hero-kicker">● available for frontend roles</span>
          <h1>
            Nischay <span className="grad">Prasher</span>
          </h1>
          <p className="hero-tagline">
            Turning ideas into <span className="seam">seamless</span> digital experiences.
          </p>
          <p className="hero-sub">
            Frontend engineer building scalable, high-performance web applications
            with React, Next.js and TypeScript — from real-time multiplayer games
            to full-stack platforms.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#work">
              View my work <ArrowIcon />
            </a>
            <a className="btn" href={GITHUB} target="_blank" rel="noreferrer">
              <GithubIcon /> GitHub
            </a>
            <a className="btn" href={LINKEDIN} target="_blank" rel="noreferrer">
              <LinkedinIcon /> LinkedIn
            </a>
            <a className="btn" href="/resume.pdf" target="_blank" rel="noreferrer">
              <FileIcon /> Resume
            </a>
          </div>
          <a className="scroll-hint" href="#work">
            <span>scroll — selected work</span>
            <i>▾</i>
          </a>
        </header>

        {/* ------------------------------------------------ projects */}
        <section id="work">
          <div className="wrap">
            <p className="section-kicker reveal">Selected work</p>
            <h2 className="section-title reveal">Things I've built</h2>
            <p className="section-lede reveal">
              Real products, live on the internet — not just repos. Both previews
              below are rendered by this page itself.
            </p>

            <div className="project-grid">
              <TiltCard>
                <div className="project-info">
                  <span className="project-index">01 — realtime multiplayer game</span>
                  <h3>Maze Rush</h3>
                  <p className="project-desc">
                    A real-time multiplayer maze race with a <strong>fog-of-war</strong> twist:
                    everyone is visible for five seconds, then you run blind while
                    finishers spectate live. <strong>Server-authoritative</strong> game state
                    runs in a Durable Object per room at the edge, with a typed
                    WebSocket protocol shared end-to-end. Mazes are generated with
                    randomized DFS — every round is provably solvable with exactly
                    one path. Playable on any device, with drag-to-steer touch controls.
                  </p>
                  <div className="tech-row">
                    <span className="tech-chip">React</span>
                    <span className="tech-chip">TypeScript</span>
                    <span className="tech-chip">Cloudflare Workers</span>
                    <span className="tech-chip">Durable Objects</span>
                    <span className="tech-chip">WebSockets</span>
                    <span className="tech-chip">Canvas</span>
                  </div>
                  <div className="project-links">
                    <a className="btn btn-primary" href="https://maze-rush.nischay432.workers.dev" target="_blank" rel="noreferrer">
                      Play live <ArrowIcon />
                    </a>
                    <a className="btn" href={`${GITHUB}/maze-rush`} target="_blank" rel="noreferrer">
                      <GithubIcon /> Code
                    </a>
                  </div>
                </div>
                <div className="project-preview">
                  <MazePreview />
                </div>
              </TiltCard>

              <TiltCard>
                <div className="project-info">
                  <span className="project-index">02 — full-stack platform</span>
                  <h3>Nextract LMS</h3>
                  <p className="project-desc">
                    A complete learning management system: course authoring with
                    drag-and-drop chapters, video lessons with{' '}
                    <strong>progress tracking</strong>, purchases and a revenue dashboard.
                    Built on the Next.js App Router with{' '}
                    <strong>server-side access control</strong> — locked content never
                    reaches the client — and webhook-confirmed Stripe payments
                    with a free-enrollment demo mode.
                  </p>
                  <div className="tech-row">
                    <span className="tech-chip">Next.js 15</span>
                    <span className="tech-chip">React 19</span>
                    <span className="tech-chip">PostgreSQL</span>
                    <span className="tech-chip">Prisma</span>
                    <span className="tech-chip">Clerk</span>
                    <span className="tech-chip">Stripe</span>
                  </div>
                  <div className="project-links">
                    <a className="btn btn-primary" href="https://nextract-lms.vercel.app" target="_blank" rel="noreferrer">
                      Live demo <ArrowIcon />
                    </a>
                    <a className="btn" href={`${GITHUB}/Nextract_LMS`} target="_blank" rel="noreferrer">
                      <GithubIcon /> Code
                    </a>
                  </div>
                </div>
                <div className="project-preview">
                  <NextractPreview />
                </div>
              </TiltCard>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ about */}
        <section id="about">
          <div className="wrap">
            <div className="about-grid">
              <div className="about-photo reveal">
                <img src="/nischay.webp" alt="Nischay Prasher" width={720} height={720} />
              </div>
              <div className="about-text">
                <p className="section-kicker reveal">About me</p>
                <h2 className="section-title reveal">Engineer first, pixel-perfectionist always</h2>
                <p className="reveal">
                  I'm a frontend engineer who enjoys transforming complex business
                  requirements into <strong>clean, scalable and maintainable</strong> user
                  experiences. Over the past year I've worked on large-scale frontend
                  applications, authentication systems, white-label architectures,
                  admin dashboards, payment workflows and cross-platform mobile development.
                </p>
                <p className="reveal">
                  I care about the whole journey — from architecture decisions and
                  reusable UI systems down to the last easing curve. When something
                  ships under my name, it should feel <strong>fast, obvious and alive</strong>.
                </p>
                <div className="stat-row reveal">
                  <div className="stat"><b>2</b><span>products live in production</span></div>
                  <div className="stat"><b>1+</b><span>years building for the web</span></div>
                  <div className="stat"><b>∞</b><span>curiosity for what's next</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ skills */}
        <section id="skills">
          <div className="wrap">
            <p className="section-kicker reveal">Toolbox</p>
            <h2 className="section-title reveal">Technologies I work with</h2>
            <p className="section-lede reveal">
              The stack I reach for daily — and the platforms my projects run on.
            </p>
            <div className="skill-grid">
              {[
                'TypeScript', 'JavaScript (ES6+)', 'React', 'Next.js', 'React Native',
                'Redux Toolkit', 'Zustand', 'Tailwind CSS', 'Material UI', 'Node.js',
                'PostgreSQL', 'Prisma', 'WebSockets', 'Cloudflare Workers', 'Vercel', 'Git & GitHub',
              ].map((s) => (
                <div className="skill reveal" key={s}>
                  <i />{s}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ contact */}
        <section id="contact" className="contact">
          <div className="wrap">
            <p className="section-kicker reveal">Contact</p>
            <h2 className="section-title reveal">Let's build something</h2>
            <p className="section-lede reveal">
              I'm open to frontend roles and interesting collaborations.
              The fastest way to reach me is email or LinkedIn.
            </p>
            <div className="contact-actions reveal">
              <a className="btn btn-primary" href={`mailto:${EMAIL}`}>
                Say hello <ArrowIcon />
              </a>
              <a className="btn" href={LINKEDIN} target="_blank" rel="noreferrer">
                <LinkedinIcon /> LinkedIn
              </a>
              <a className="btn" href={GITHUB} target="_blank" rel="noreferrer">
                <GithubIcon /> GitHub
              </a>
              <a className="btn" href="/resume.pdf" download="Nischay-Prasher-Resume.pdf">
                <FileIcon /> Download resume
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} Nischay Prasher</span>
        <span className="footer-mono">designed & built from scratch — no templates</span>
        <div className="footer-links">
          <a href={GITHUB} target="_blank" rel="noreferrer">GitHub</a>
          <a href={LINKEDIN} target="_blank" rel="noreferrer">LinkedIn</a>
          <a href={`mailto:${EMAIL}`}>Email</a>
        </div>
      </footer>
    </>
  );
}
