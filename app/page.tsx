'use client';

import { useState } from 'react';
import Showroom from './Showroom';
import { resumeData } from './data';
import { 
  Code2, Database, Cpu, Globe, Terminal, Mail, MapPin, 
  ExternalLink, Monitor, Box, Server
} from 'lucide-react';

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState('home');

  const getStackIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('arch') || n.includes('next')) return <Monitor className="w-5 h-5" />;
    if (n.includes('supabase') || n.includes('simd') || n.includes('c++')) return <Cpu className="w-5 h-5" />;
    return <Code2 className="w-5 h-5" />;
  };

  const getProjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'database': return <Database className="w-6 h-6" />;
      case 'cpu': return <Server className="w-6 h-6" />;
      case 'globe': return <Globe className="w-6 h-6" />;
      default: return <Code2 className="w-6 h-6" />;
    }
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-zinc-950 text-white selection:bg-yellow-500/30">
      <Showroom activeSection={activeSection} />

      {/* LEGIBILITY OVERLAY: Adds a shadow behind text so it doesn't blend with the car */}
      <div className={`absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000 ${activeSection === 'home' ? 'bg-gradient-to-r from-black/80 via-black/20 to-transparent' : 'bg-gradient-to-l from-black/80 via-black/20 to-transparent'}`} />

      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-8 md:p-16">
        
        {/* Navigation */}
        <header className="pointer-events-auto flex gap-8 md:gap-12">
          {['home', 'about', 'projects', 'contact'].map((item) => (
            <button
              key={item}
              onClick={() => setActiveSection(item)}
              className={`font-mono uppercase tracking-[0.4em] text-sm transition-all duration-300 ${
                activeSection === item ? 'text-yellow-500 border-b-2 border-yellow-500 pb-2' : 'text-zinc-500 hover:text-white'
              }`}
            >
              {item}
            </button>
          ))}
        </header>

        {/* Content Container */}
        <div className={`pointer-events-auto flex w-full transition-all duration-700 ease-in-out ${activeSection === 'home' ? 'justify-start' : 'justify-end'}`}>
          
          <div className="max-w-3xl">
            
            {/* HOME - Focused on your Resume Data */}
            {activeSection === 'home' && (
              <div className="animate-in fade-in slide-in-from-left duration-1000">
                <h1 className="text-8xl md:text-[10rem] font-black italic tracking-tighter leading-none drop-shadow-2xl">
                  {resumeData.home.name}
                </h1>
                <div className="flex flex-col md:flex-row md:items-center gap-6 mt-4">
                  <h2 className="text-yellow-500 font-mono tracking-[0.5em] text-lg uppercase drop-shadow-md">
                    {resumeData.home.role}
                  </h2>
                  <div className="hidden md:block w-px h-6 bg-zinc-700" />
                  <div className="flex items-center gap-2 text-zinc-300 font-mono text-sm tracking-widest uppercase drop-shadow-md">
                    <MapPin className="w-4 h-4 text-yellow-500" />
                    {resumeData.home.location}
                  </div>
                </div>
                <p className="text-zinc-400 mt-10 max-w-md text-sm uppercase leading-relaxed tracking-[0.25em] font-medium drop-shadow-lg">
                  {resumeData.home.description}
                </p>
              </div>
            )}

            {/* ABOUT */}
            {activeSection === 'about' && (
              <div className="animate-in fade-in slide-in-from-right duration-700 text-right flex flex-col items-end">
                <div className="flex items-center gap-4 mb-4">
                   <h2 className="text-7xl font-black italic tracking-tighter text-yellow-500 uppercase">{resumeData.about.title}</h2>
                   <Terminal className="text-white w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-100 tracking-tight">{resumeData.about.education}</h3>
                <p className="text-zinc-300 mt-6 max-w-xl leading-relaxed text-lg italic font-medium">{resumeData.about.bio}</p>
                
                <div className="grid grid-cols-2 gap-4 mt-12 w-full max-w-lg">
                  {resumeData.about.skills.map((skill) => (
                    <div key={skill} className="flex items-center justify-end gap-4 p-4 border-r-4 border-zinc-800 hover:border-yellow-500 bg-zinc-900/60 backdrop-blur-sm transition-all group">
                      <span className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-400 group-hover:text-white">{skill}</span>
                      <div className="text-zinc-500 group-hover:text-yellow-500 transition-colors">{getStackIcon(skill)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PROJECTS */}
            {activeSection === 'projects' && (
              <div className="animate-in fade-in slide-in-from-right duration-700 space-y-12 text-right flex flex-col items-end">
                <h2 className="text-7xl font-black italic tracking-tighter text-yellow-500 uppercase text-outline">The Blacklist</h2>
                <div className="grid gap-10 w-full">
                  {resumeData.projects.map((proj, i) => (
                    <a 
                      key={i} href={proj.github} target="_blank" rel="noopener noreferrer"
                      className="group flex items-start justify-end gap-8 hover:translate-x-[-20px] transition-transform cursor-pointer"
                    >
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-3">
                          <ExternalLink className="w-4 h-4 text-yellow-500 opacity-0 group-hover:opacity-100 transition-all" />
                          <h3 className="text-4xl font-black group-hover:text-yellow-500 transition-colors uppercase italic tracking-tighter">{proj.name}</h3>
                        </div>
                        <p className="text-xs font-mono text-zinc-500 uppercase tracking-[0.3em] mt-1">{proj.tech}</p>
                        <p className="text-zinc-300 text-sm mt-3 max-w-md leading-relaxed">{proj.desc}</p>
                      </div>
                      <div className="mt-1 p-4 bg-zinc-900/80 backdrop-blur-md border-2 border-zinc-800 group-hover:border-yellow-500 group-hover:text-yellow-500 transition-all rounded-sm shadow-2xl">
                        {getProjectIcon(proj.icon)}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* CONTACT */}
            {activeSection === 'contact' && (
              <div className="animate-in fade-in slide-in-from-bottom duration-700 text-right flex flex-col items-end">
                <h2 className="text-6xl font-black italic tracking-tighter text-yellow-500 uppercase">Establish Contact</h2>
                <div className="mt-12 space-y-8">
                  <div className="flex items-center justify-end gap-6 text-zinc-200 group">
                    <span className="font-mono text-xl tracking-[0.2em] uppercase group-hover:text-yellow-500 transition-colors">{resumeData.home.email}</span>
                    <div className="p-3 bg-zinc-900 border-2 border-zinc-800 text-yellow-500"><Mail className="w-8 h-8" /></div>
                  </div>
                  <div className="flex items-center justify-end gap-6 text-zinc-200">
                    <span className="font-mono text-xl tracking-[0.2em] uppercase">{resumeData.home.location}</span>
                    <div className="p-3 bg-zinc-900 border-2 border-zinc-800 text-yellow-500"><MapPin className="w-8 h-8" /></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="flex justify-between items-end pointer-events-none">
          <div className="font-mono text-xs text-zinc-600 tracking-tighter">
            <p className="flex items-center gap-2"><span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" /> SYSTEM_ONLINE</p>
            <p>KERN: 6.7.ARCH1-1</p>
          </div>
          <div className="text-zinc-900 text-8xl font-black italic opacity-20 select-none uppercase tracking-tighter">Rockport</div>
        </footer>
      </div>
    </main>
  );
}