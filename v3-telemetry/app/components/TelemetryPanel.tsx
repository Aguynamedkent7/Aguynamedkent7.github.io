'use client';

import { Database, Code2, ExternalLink, Wifi, Users, MessageSquare, Map, Clock } from 'lucide-react';
import GlassPanel from './GlassPanel';
import CountUp from './CountUp';
import { resumeData } from '../data';

const getProjectIcon = (iconName: string) => {
  switch (iconName) {
    case 'wifi': return <Wifi className="w-5 h-5" />;
    case 'users': return <Users className="w-5 h-5" />;
    case 'message': return <MessageSquare className="w-5 h-5" />;
    case 'map': return <Map className="w-5 h-5" />;
    case 'clock': return <Clock className="w-5 h-5" />;
    case 'database': return <Database className="w-5 h-5" />;
    default: return <Code2 className="w-5 h-5" />;
  }
};

export default function TelemetryPanel() {
  return (
    <div className="w-full space-y-10 lg:space-y-14">
      {/* Big metrics row */}
      <div className="grid grid-cols-3 gap-4">
        {resumeData.metrics.map((m, i) => (
          <GlassPanel key={i} accent className="p-4 sm:p-6 text-center">
            <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-accent mb-2">
              {m.label}
            </p>
            <CountUp
              target={m.value}
              suffix={m.suffix}
              decimals={m.decimals}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white"
            />
          </GlassPanel>
        ))}
      </div>

      {/* Skills badges */}
      <div>
        <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-4">
          Core Stack
        </h3>
        <div className="flex flex-wrap gap-2">
          {resumeData.about.skills.map((skill) => (
            <span
              key={skill}
              className="glass-accent px-3 py-1.5 rounded-full font-mono text-xs text-accent tracking-wider uppercase hover:bg-accent/10 transition-colors cursor-default"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Project session logs */}
      <div>
        <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-4">
          Session Logs
        </h3>
        <div className="space-y-3">
          {resumeData.projects.map((proj, i) => (
            <a
              key={i}
              href={proj.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <GlassPanel className="p-4 flex items-center gap-4 hover:border-accent/20 hover:-translate-y-0.5 transition-all">
                <div className="shrink-0 p-2 rounded-lg bg-accent/5 text-accent group-hover:bg-accent/10 transition-colors">
                  {getProjectIcon(proj.icon)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-display font-bold text-white text-sm group-hover:text-accent transition-colors truncate">
                      {proj.name}
                    </h4>
                    <ExternalLink className="w-3 h-3 text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>
                  <p className="font-mono text-[10px] text-accent/70 uppercase tracking-wider">
                    {proj.tech}
                  </p>
                  <p className="text-xs text-muted/70 mt-1 truncate">{proj.desc}</p>
                </div>
              </GlassPanel>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
