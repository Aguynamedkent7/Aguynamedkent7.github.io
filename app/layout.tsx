import type { Metadata } from "next";
import { Russo_One, Exo_2 } from "next/font/google";
import "./globals.css";

// 1. Define the fonts here (THIS WAS MISSING)
const russo = Russo_One({ 
  weight: "400", 
  subsets: ["latin"],
  variable: "--font-russo" 
});

const exo = Exo_2({ 
  subsets: ["latin"],
  variable: "--font-exo" 
});

export const metadata: Metadata = {
  title: "Kent Vincent Butaya | Full Stack Racer",
  description: "CS Student, Arch Linux User, and Full Stack Developer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* The Icon Library Link */}
        <link rel="stylesheet" type='text/css' href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />
      </head>
      
      {/* 2. Now these variables will work */}
      <body className={`${russo.variable} ${exo.variable} bg-tarmac text-textMain font-body`}>
        {children}
      </body>
    </html>
  );
}