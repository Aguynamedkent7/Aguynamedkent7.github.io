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
      name: "JRJC Booking",
      tech: "Next.js / Supabase",
      desc: "Full-stack rental system focused on real-time management and efficiency.",
      github: "https://github.com/seodowa/JRJC",
      icon: "database"
    },
    {
      name: "Auto Backup Mod",
      tech: "Java",
      desc: "A Minecraft mod that automatically backs up your world every 3 minutes when empty, ensuring progress is never lost.",
      github: "https://github.com/Aguynamedkent7/AutoBackupMod",
      icon: "cpu"
    },
    {
      name: "Happsay",
      tech: "React / AWS",
      desc: "Time management platform designed to combat procrastination and improve productivity.",
      github: "https://github.com/Aguynamedkent7/Happsay_frontend",
      icon: "globe"
    }
  ]
};