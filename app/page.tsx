import Image from 'next/image';
import { ArrowRight, ArrowUpRight, Download } from 'lucide-react';
import Nav from './Nav';
import { site, highlights, projects, experience, stack, type Project } from './content';

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3.1-.4 6.4-1.5 6.4-7a5.4 5.4 0 0 0-1.5-3.8 5 5 0 0 0-.1-3.8s-1.2-.4-3.9 1.5a13.4 13.4 0 0 0-7 0C6.3 1.3 5.1 1.7 5.1 1.7a5 5 0 0 0-.1 3.8A5.4 5.4 0 0 0 3.5 9.3c0 5.4 3.3 6.6 6.4 7a3.4 3.4 0 0 0-.9 2.6V22" />
    </svg>
  );
}

function SectionHeader({ label, title, intro }: { label: string; title: string; intro?: string }) {
  return (
    <div className="section-header">
      <div className="stack-14">
        <span className="label">{label}</span>
        <h2 className="h2">{title}</h2>
      </div>
      {intro && <p className="section-intro">{intro}</p>}
    </div>
  );
}

function ProjectLinks({ p }: { p: Project }) {
  if (!p.url && !p.github) return null;
  return (
    <div className="project-links">
      {p.url && (
        <a href={p.url} target="_blank" rel="noopener noreferrer" className="link-accent">
          {new URL(p.url).host} <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      )}
      {p.github && (
        <a href={p.github} target="_blank" rel="noopener noreferrer" className="link-muted">
          Code <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      )}
    </div>
  );
}

function ProjectCard({ p }: { p: Project }) {
  const variant = p.featured ? 'featured' : p.image ? 'image' : 'text';
  return (
    <article className={`card project project--${variant} reveal`}>
      {p.image && (
        <div className="project-shot">
          <Image src={p.image} alt={`${p.name} screenshot`} width={1200} height={750} />
        </div>
      )}
      <div className="project-body">
        <div className="project-meta">
          <span className={p.featured ? 'pos pos--solid' : 'pos'}>{p.pos}</span>
          <span>{p.category.toUpperCase()}</span>
        </div>
        <h3 className="project-title">{p.name}</h3>
        <p className="project-text">{p.body}</p>
        <div className="project-foot">
          <div className="tags">
            {p.tags.map((t) => <span key={t} className="tag">{t}</span>)}
          </div>
          <ProjectLinks p={p} />
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        {/* HERO */}
        <section className="hero">
          <div className="hero-text">
            <div className="stack-28">
              <div className="eyebrow">
                {site.role.toUpperCase()} / {site.location.toUpperCase()}
              </div>
              <h1 className="h1">Kent<br />Vincent<br />Butaya</h1>
              <div className="subline">{site.tagline}</div>
              <p className="intro">{site.intro}</p>
            </div>
            <div className="hero-actions">
              <a href="#work" className="btn btn--solid">
                See the work <ArrowRight size={18} aria-hidden="true" />
              </a>
              <a href={site.github} target="_blank" rel="noopener noreferrer" className="btn btn--outline">
                <GitHubIcon /> GitHub
              </a>
            </div>
          </div>

          <div className="driver-card">
            <div className="driver-head"><span>DRIVER CARD</span><span>2026 SEASON</span></div>
            <div className="driver-photo">
              <Image src="/kent.jpg" alt="Portrait of Kent Vincent Butaya" width={880} height={1320}
                priority sizes="(max-width: 1023px) 100vw, 440px" />
              <span className="driver-number" aria-hidden="true">{site.number}</span>
            </div>
            <dl className="driver-specs">
              {[
                ['NAME', 'Kent Vincent B. Butaya'],
                ['TEAM', 'Open to offers'],
                ['ENGINE', 'TypeScript, React, Next.js'],
                ['GARAGE', 'Arch Linux'],
              ].map(([k, v]) => (
                <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
              ))}
            </dl>
          </div>
        </section>

        {/* HIGHLIGHTS */}
        <section className="highlights" aria-label="Highlights">
          {highlights.map((h) => (
            <div key={h.title} className="highlight">
              <span className={h.accent ? 'highlight-title accent' : 'highlight-title'}>{h.title}</span>
              <span className="highlight-sub">{h.sub}</span>
            </div>
          ))}
        </section>

        {/* PROJECTS */}
        <section id="work" className="section">
          <SectionHeader label="S1 / STARTING GRID" title="Projects"
            intro="My own products and client builds, lined up by where they'd start on the grid." />
          <div className="project-grid">
            {projects.map((p) => <ProjectCard key={p.pos} p={p} />)}
          </div>
        </section>

        {/* EXPERIENCE */}
        <section id="experience" className="section experience">
          <div className="experience-head stack-14">
            <span className="label">S2 / RACE HISTORY</span>
            <h2 className="h2">Experience</h2>
          </div>
          <div className="experience-list">
            {experience.map((e) => (
              <div key={e.title} className="experience-row reveal">
                <span className="experience-date">{e.date.toUpperCase()}</span>
                <div className="stack-10">
                  <h3 className="experience-title">{e.title}</h3>
                  <p className="experience-text">{e.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* STACK */}
        <section id="stack" className="section">
          <SectionHeader label="S3 / SETUP SHEET" title="Tech stack"
            intro="What I reach for, tuned over real projects rather than tutorials." />
          <div className="stack-grid">
            {stack.map((s, i) => (
              <div key={s.group} className="card stack-card reveal">
                <span className="caption">0{i + 1} / {s.group.toUpperCase()}</span>
                <ul>{s.items.map((it) => <li key={it}>{it}</li>)}</ul>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="card contact reveal">
          <div className="stack-20">
            <span className="label">PIT LANE</span>
            <h2 className="h2 h2--contact">Contact</h2>
            <div className="contact-sub">Need a driver for your team?</div>
            <p className="contact-text">
              I&apos;m looking for junior full-stack, frontend or backend roles, remote first. Happy
              to talk about your stack.
            </p>
          </div>
          <div className="contact-actions">
            <a href={`mailto:${site.email}`} className="btn btn--solid btn--wide">
              Email me <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a href={site.github} target="_blank" rel="noopener noreferrer" className="btn btn--outline btn--wide">
              github.com/Aguynamedkent7 <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <a href="/resume.pdf" download="Kent Vincent Butaya - Resume.pdf" className="btn btn--outline btn--wide">
              Download résumé <Download size={18} aria-hidden="true" />
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} {site.name}</span>
        <div className="flag" aria-hidden="true">
          {Array.from({ length: 16 }, (_, i) => (
            <span key={i} className={(i + Math.floor(i / 8)) % 2 === 0 ? 'on' : ''} />
          ))}
        </div>
        <span>Last seen: Rockport</span>
      </footer>
    </>
  );
}
