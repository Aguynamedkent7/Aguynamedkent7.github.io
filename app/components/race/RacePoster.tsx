import { ArrowUpRight } from 'lucide-react';
import { projects } from '../../content';
import { markers, path, start, viewBox } from './posterCircuit';

/** Static circuit: shown before the scene loads, and as the whole hero without WebGL or with reduced motion. */
export function PosterCircuit({ active = -1 }: { active?: number }) {
  return (
    <svg className="poster-svg" viewBox={viewBox} aria-hidden="true">
      <path d={path} className="poster-track" />
      <path d={path} className="poster-line" />
      <circle cx={start[0]} cy={start[1]} r="2.2" className="poster-start" />
      {markers.map(([x, y], i) => (
        <g key={i} className={i === active ? 'poster-mark on' : 'poster-mark'}>
          <rect x={x - 5} y={y - 5} width="10" height="10" />
          <text x={x} y={y + 0.4}>{i + 1}</text>
        </g>
      ))}
    </svg>
  );
}

/** The project list that stands in for the lap in the poster tier. */
export function PosterList() {
  return (
    <ol className="poster-list">
      {projects.map((p) => {
        const href = p.url || p.github;
        return (
          <li key={p.pos}>
            <span className="pos">{p.pos}</span>
            <span className="poster-name">{p.name}</span>
            <span className="poster-cat">{p.category}</span>
            {href && (
              <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} (opens in a new tab)`}>
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            )}
          </li>
        );
      })}
    </ol>
  );
}
