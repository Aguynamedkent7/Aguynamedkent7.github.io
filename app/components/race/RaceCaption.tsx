import { ArrowDown, ArrowUpRight } from 'lucide-react';
import type { RefObject } from 'react';
import { projects } from '../../content';
import type { Mode } from './scene/createRaceScene';

/** Caption panel: the project for the current sector, or the overview text after the lap. */
export default function RaceCaption({ front, mode, panel }: {
  front: number; mode: Mode; panel: RefObject<HTMLDivElement | null>;
}) {
  const p = projects[front];
  const race = mode === 'race';
  const href = p.url || p.github;
  return (
    <div ref={panel} className="race-cap panel">
      <div className="race-cap-head">
        <span className="caption">{race ? `SECTOR ${front + 1} / 7` : 'TRACK MAP / FULL LAP'}</span>
        <div className="race-dots" aria-hidden="true">
          {projects.map((x, i) => <span key={x.pos} className={!race || i === front ? 'on' : ''} data-wide={race && i === front} />)}
        </div>
      </div>
      <div aria-live="polite">
        {race ? (
          <div key={p.pos} className="race-cap-body swap">
            <div className="race-cap-meta">
              <span className="race-pos">{p.pos}</span>
              <span className="caption">{p.category.toUpperCase()}</span>
            </div>
            <div className="race-cap-name">{p.name}</div>
            <p className="race-cap-text">{p.body}</p>
            <div className="tags">{p.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
            {href && (
              <a className="race-cap-link" href={href} target="_blank" rel="noopener noreferrer">
                {p.url ? new URL(p.url).host : 'Code'} <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            )}
          </div>
        ) : (
          <div key="map" className="race-cap-body swap">
            <div className="race-cap-name">Projects</div>
            <p className="race-cap-text">
              Seven builds, one lap. Hover a screen to inspect it, or keep scrolling for the full breakdown.
            </p>
            <a className="race-cap-link" href="#work">
              See all projects <ArrowDown size={14} aria-hidden="true" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
