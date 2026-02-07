'use client';

import { motion } from 'framer-motion';

export default function TrackRecord() {
  const projects = [
    {
      title: 'JRJC RENTAL SYSTEM',
      stack: 'REACT, SUPABASE, POSTGRESQL',
      desc: 'A full-throttle booking engine with real-time vehicle availability, secure auth, and instant reservation handling.',
      link: 'https://github.com/seodowa/jrjc'
    },
    {
      title: 'HAPPSAY',
      stack: 'TYPESCRIPT, REACT, TAILWIND',
      desc: 'High-efficiency task management dashboard featuring dead-line tracking, archiving systems, and fluid UI.',
      link: 'https://github.com/aguynamedkent7/happsay_frontend'
    },
    {
      title: 'WORD LEADERBOARDS',
      stack: 'JAVA, FABRIC/FORGE API',
      desc: 'A server-side modification for Minecraft tracking global chat metrics and player statistics in real-time.',
      link: 'https://github.com/aguynamedkent7/wordleaderboards-mod'
    }
  ];

  return (
    <section id="projects" className="max-w-6xl mx-auto mb-20 px-4">
      <h2 className="font-racing text-3xl border-b-2 border-carbon pb-2 mb-8 text-white">
        TRACK RECORD
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -5, skewX: -2, borderColor: '#ff3b3b' }}
            className="bg-carbon p-6 border border-gray-800 transition-all shadow-lg group"
          >
            <h3 className="font-racing text-2xl text-white mb-2">{project.title}</h3>
            <p className="font-mono text-ferrari text-sm mb-4">{project.stack}</p>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              {project.desc}
            </p>
            
            <a 
              href={project.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block text-white font-bold text-sm uppercase tracking-wider hover:text-ferrari transition-colors"
            >
              VIEW TELEMETRY →
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}