// All site copy lives here. Source of truth: portfolio-plan/PLAN.md section 6.

export const site = {
  name: 'Kent Vincent Butaya',
  shortName: 'Kent Vincent',
  number: '07',
  role: 'Full-Stack Developer',
  location: 'Cagayan de Oro, PH',
  email: 'butaya.kentvincent07@gmail.com',
  github: 'https://github.com/Aguynamedkent7',
  tagline: 'Built for the fast lane.',
  intro:
    "I'm a CS student and full-stack developer building high-performance web apps. Driven by performance and deep customization, from the database schema to the last pixel.",
};

export const highlights = [
  { title: 'BS Computer Science', sub: 'USTP, 2023 to present' },
  { title: 'DOST-SEI Scholar', sub: "Consistent Dean's Lister" },
  { title: 'TOPCIT Level 3', sub: 'Certified' },
  { title: 'Open to remote', sub: 'Junior full-stack, frontend, backend', accent: true },
];

export type Project = {
  pos: string;
  name: string;
  category: string;
  body: string;
  tags: string[];
  url?: string;
  github?: string;
  image?: string;
  featured?: boolean;
};

export const projects: Project[] = [
  { pos: 'P1', name: 'Karsayo', category: 'SaaS / Founder',
    body: "A multi-tenant car rental platform for vehicle owners in the Philippines. Each operator gets a branded booking portal, a calendar that can't double-book, and ID checks before a booking is confirmed.",
    tags: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS'], url: 'https://karsayo.online',
    github: 'https://github.com/Aguynamedkent7/Karsayo', image: '/projects/karsayo.webp', featured: true },
  { pos: 'P2', name: 'HRIS Platform', category: 'Client / Veent Apps',
    body: 'A human resources information system built during my internship, with end-to-end tests covering the core flows.',
    tags: ['SvelteKit', 'Prisma', 'PostgreSQL', 'Playwright'],
    github: 'https://github.com/Aguynamedkent7/Veent_HRIS', image: '/projects/hris.webp' },
  { pos: 'P3', name: 'Wi-Fi Auth Portal', category: 'Client / Parasat Parafiber',
    body: 'A captive portal for paid Wi-Fi access, with Maya payment gateway integration so customers can pay and connect in one flow.',
    tags: ['SvelteKit', 'Drizzle', 'PostgreSQL', 'Maya API', 'Playwright'],
    github: 'https://github.com/HyuseCS/Veent_WifiPortal', image: '/projects/wifi-portal.webp' },
  { pos: 'P4', name: 'Booking System', category: 'Client / JRJC Rent a Car',
    body: 'A web-based booking system for a local car rental business, written in TypeScript.',
    tags: ['Next.js', 'TypeScript', 'Supabase'], url: 'https://jrjc.vercel.app',
    github: 'https://github.com/seodowa/JRJC' },
  { pos: 'P5', name: 'NaviSayo', category: 'Mobile / In the garage',
    body: 'A route-based fuel cost and gas station price estimator for Filipino drivers. Plan the trip, know the cost before you leave.',
    tags: ['React Native', 'Expo', 'TypeScript', 'Supabase', 'PostGIS'] },
  { pos: 'P6', name: 'Deezcord', category: 'Team / Parallel and Distributed Computing',
    body: 'A real-time chat app with rooms and channels, built on WebSockets for full-duplex messaging over one persistent connection.',
    tags: ['React', 'Socket.IO', 'Express', 'Supabase'], url: 'https://talk.deezcord.online',
    github: 'https://github.com/seodowa/Deezcord' },
  { pos: 'P7', name: 'Happsay', category: 'Web app / Productivity',
    body: 'A time management platform designed to combat procrastination and improve productivity.',
    tags: ['React', 'TypeScript', 'Vite', 'Tailwind CSS'], url: 'https://happsay-frontend.vercel.app',
    github: 'https://github.com/Aguynamedkent7/Happsay_frontend' },
];

export const experience = [
  { date: 'Jun–Jul 2026', title: 'Full-Stack Developer Intern, Veent Apps Inc.',
    body: 'Built an HRIS platform on SvelteKit, Prisma and PostgreSQL, and a Wi-Fi authentication portal with Maya payments for Parasat Parafiber. Helped build a CRM, including migrating customer data from a legacy database to a new schema.' },
  { date: '2025', title: 'Full-Stack Developer, JRJC Rent a Car',
    body: "Designed and built the company's web-based booking system with Next.js, TypeScript and Supabase." },
  { date: '2023–Now', title: 'BS Computer Science, USTP',
    body: "DOST-SEI Scholar and consistent Dean's Lister since first year. Level 3 TOPCIT certified." },
];

export const stack = [
  { group: 'Frontend', items: ['React', 'Next.js', 'Svelte', 'TypeScript'] },
  { group: 'Backend', items: ['Supabase', 'PHP', 'C++'] },
  { group: 'Data', items: ['PostgreSQL', 'MySQL', 'Prisma', 'Drizzle'] },
  { group: 'Tooling', items: ['Playwright', 'Arch Linux', 'Claude Code', 'OpenCode'] },
];
