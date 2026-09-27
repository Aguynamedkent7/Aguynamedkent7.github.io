'use client';

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { site } from './content';

const links = ['work', 'experience', 'stack', 'contact'];

export default function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="nav">
      <a href="#top" className="brand" onClick={() => setOpen(false)}>
        <span className="brand-badge">{site.number}</span>
        <span className="brand-full">{site.name.toUpperCase()}</span>
        <span className="brand-short">{site.shortName.toUpperCase()}</span>
      </a>

      <nav className="nav-links" aria-label="Main">
        {links.map((l) => <a key={l} href={`#${l}`}>{l}</a>)}
        <a href={`mailto:${site.email}`} className="btn btn--solid btn--nav">hire me</a>
      </nav>

      <button
        type="button" className="menu-btn" aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <nav id="mobile-menu" className="mobile-menu" aria-label="Mobile">
          {links.map((l) => (
            <a key={l} href={`#${l}`} onClick={() => setOpen(false)}>{l}</a>
          ))}
          <a href={`mailto:${site.email}`} className="btn btn--solid" onClick={() => setOpen(false)}>
            hire me
          </a>
        </nav>
      )}
    </header>
  );
}
