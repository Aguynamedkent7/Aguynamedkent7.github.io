// app/data.ts
export const resumeData = {
  home: {
    name: "KENT VINCENT",
    role: "SOFTWARE DEVELOPER",
    description: "Building high-performance web applications. Driven by performance and deep customization.",
    location: "Cagayan de Oro, PH",
    email: "butaya.kentvincent07@gmail.com"
  },
  about: {
    title: "TECHNICAL DISCIPLINE",
    education: "BS Computer Science | USTP",
    bio: "DOST SEI Scholar and Arch Linux enthusiast. I specialize in robust full-stack solutions with a strong foundation in C++ and Network Security.",
    // These are used for the icon grid in the About section
    skills: ["React", "Next.js", "Supabase", "C++", "Python", "Arch Linux", "SIMD"],
  },
  projects: [
    {
      name: "Karsayo",
      tech: "Next.js / Supabase",
      desc: "Multi-tenant car rental SaaS: branded operator subdomains, conflict-free booking calendar with 6-hour holds, GCash downpayments and ID verification.",
      url: "https://karsayo.online",
      github: "https://github.com/Aguynamedkent7/Karsayo",
      image: "/projects/karsayo.webp"
    },
    {
      name: "JRJC Rent-a-Car",
      tech: "Next.js / Supabase",
      desc: "Booking site for a Bukidnon car rental: fleet browsing, date booking, GCash payment and booking tracking.",
      url: "https://jrjc.vercel.app",
      github: "https://github.com/seodowa/JRJC",
      image: "/projects/jrjc.webp"
    },
    {
      name: "Veent HRIS",
      tech: "SvelteKit / Prisma / PostgreSQL",
      desc: "HR information system: digital 201 files, attendance and timesheets, leave requests, approvals and payslips.",
      github: "https://github.com/Aguynamedkent7/Veent_HRIS",
      image: "/projects/hris.webp"
    },
    {
      name: "Parafiber WiFi Portal",
      tech: "SvelteKit / Drizzle / MikroTik",
      desc: "Captive portal, admin dashboard and coverage map for a WiFi ISP: OTP login, top-ups, session crediting and router control.",
      github: "https://github.com/HyuseCS/Veent_WifiPortal",
      image: "/projects/wifi-portal.webp"
    },
    {
      name: "Deezcord",
      tech: "React / Socket.IO / Supabase",
      desc: "Real-time multi-channel chat app built on WebSockets for full-duplex messaging across rooms.",
      url: "https://talk.deezcord.online",
      github: "https://github.com/seodowa/Deezcord",
      image: "/projects/deezcord.webp"
    },
    {
      name: "Happsay",
      tech: "React / TypeScript",
      desc: "Time management platform designed to combat procrastination and improve productivity.",
      url: "https://happsay-frontend.vercel.app",
      github: "https://github.com/Aguynamedkent7/Happsay_frontend",
      image: "/projects/happsay.webp"
    },
    {
      name: "Auto Backup Mod",
      tech: "Java",
      desc: "A Minecraft mod that automatically backs up your world every 3 minutes when empty, ensuring progress is never lost.",
      github: "https://github.com/Aguynamedkent7/AutoBackupMod"
    }
  ] as { name: string; tech: string; desc: string; url?: string; github: string; image?: string }[]
};
