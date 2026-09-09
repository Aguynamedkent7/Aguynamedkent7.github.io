import type { Metadata } from "next";
import { Titillium_Web, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const titillium = Titillium_Web({
  weight: ["700", "900"],
  subsets: ["latin"],
  variable: "--font-titillium",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Kent Vincent Butaya | Telemetry",
  description: "Full-Stack Developer — Performance-driven portfolio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${titillium.variable} ${inter.variable} ${jetbrains.variable} bg-void text-white font-body antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
