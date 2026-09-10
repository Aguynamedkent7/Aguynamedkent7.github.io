export type SectionId = 'home' | 'career' | 'telemetry' | 'contact';

export const replaySegments: Record<SectionId, { start: number; end: number; pov: string }> = {
  home: { start: 0, end: 34.9, pov: 'WHEEL CAM' },
  career: { start: 35, end: 69.9, pov: 'DASH CAM' },
  telemetry: { start: 70, end: 113.9, pov: 'WING CAM' },
  contact: { start: 114, end: 138, pov: 'INTERIOR' },
};

export const resumeData = {
  home: {
    name: 'KENT VINCENT',
    role: 'FULL-STACK DEVELOPER',
    description:
      'Building high-performance web applications. Driven by performance and deep customization.',
    location: 'Cagayan de Oro, PH',
    email: 'butaya.kentvincent07@gmail.com',
  },
  about: {
    title: 'TECHNICAL DISCIPLINE',
    education: 'BS Computer Science | USTP',
    bio: 'DOST SEI Scholar and Arch Linux enthusiast. I specialize in robust full-stack solutions with a strong foundation in systems programming and network security.',
    skills: [
      'React',
      'Next.js',
      'TypeScript',
      'SvelteKit',
      'Prisma',
      'Drizzle',
      'Postgres',
      'Supabase',
      'Kotlin',
      'Java',
      'C++',
      'Python',
      'WebSockets',
    ],
  },
  metrics: [
    { label: 'YEARS CODING', value: 4, suffix: '+', decimals: 0 },
    { label: 'PROJECTS SHIPPED', value: 6, suffix: '', decimals: 0 },
    { label: 'UPTIME DEPLOYED', value: 98, suffix: '%', decimals: 0 },
  ],
  milestones: [
    {
      id: 'ustp',
      title: 'BS Computer Science',
      org: 'USTP',
      period: '2022 — Present',
      description: 'DOST SEI Scholar. Specializing in systems programming and network security.',
    },
    {
      id: 'dost',
      title: 'DOST SEI Scholar',
      org: 'DOST',
      period: '2022',
      description: 'Awarded full scholarship for academic excellence in STEM.',
    },
    {
      id: 'veent',
      title: 'Veent WiFi Portal',
      org: 'HyuseCS',
      period: '2024',
      description: 'SvelteKit monorepo — customer captive portal + radius admin + AP locator; shared Postgres/Drizzle, Maya payments.',
    },
    {
      id: 'deezcord',
      title: 'Deezcord',
      org: 'seodowa',
      period: '2024',
      description: 'Real-time chat platform (discord-like). WebSockets, multi-channel, TypeScript client/server.',
    },
  ],
  projects: [
    {
      name: 'Veent WiFi Portal',
      tech: 'SvelteKit / Postgres / Drizzle',
      desc: 'Monorepo captive portal — customer portal + RADIUS admin + AP locator with Maya payments integration.',
      github: 'https://github.com/HyuseCS/Veent_WifiPortal',
      icon: 'wifi',
    },
    {
      name: 'Veent HRIS',
      tech: 'SvelteKit / Prisma',
      desc: 'Full-featured HRIS platform for people management, built with SvelteKit and Prisma.',
      github: 'https://github.com/Aguynamedkent7/Veent_HRIS',
      icon: 'users',
    },
    {
      name: 'Deezcord',
      tech: 'TypeScript / WebSockets',
      desc: 'Real-time multi-channel chat system. Client/server TypeScript, WebSocket infrastructure.',
      github: 'https://github.com/seodowa/Deezcord',
      icon: 'message',
    },
    {
      name: 'ByaHero',
      tech: 'Kotlin / Android',
      desc: 'Jeepney tracker — drivers see commuters, commuters see live tracking in real-time.',
      github: 'https://github.com/Aguynamedkent7/ByaHero',
      icon: 'map',
    },
    {
      name: 'SleepIN',
      tech: 'Kotlin / Python',
      desc: 'Auto class joiner for Android + companion PC utility for automated lecture attendance.',
      github: 'https://github.com/Aguynamedkent7/SleepIN',
      icon: 'clock',
    },
    {
      name: 'JRJC Booking',
      tech: 'Next.js / Supabase',
      desc: 'Full-stack rental management platform with real-time availability and booking.',
      github: 'https://github.com/seodowa/JRJC',
      icon: 'database',
    },
  ],
};
