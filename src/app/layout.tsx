import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

/**
 * Montserrat font loaded via next/font.
 * Weights: 400 (regular), 600 (semibold), 700 (bold), 800 (extrabold)
 * Italic: 400, 600
 * Applied as a CSS variable for Tailwind's font-sans.
 */
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SkillItLearn - Career Paths, Skills & Verifiable Certificates",
    template: "%s | SkillItLearn",
  },
  description:
    "Discover structured career paths, master in-demand skills through guided modules, prove your expertise with quizzes, and earn verifiable certificates.",
  keywords: [
    "career development",
    "skill learning",
    "online courses",
    "verifiable certificates",
    "career paths",
    "professional development",
  ],
  authors: [{ name: "SkillItLearn" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "SkillItLearn",
    title: "SkillItLearn - Career Paths, Skills & Verifiable Certificates",
    description:
      "Discover structured career paths, master in-demand skills, and earn verifiable certificates.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.variable} font-sans antialiased`}>
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
