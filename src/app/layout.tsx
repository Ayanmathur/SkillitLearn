import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { PwaRegister } from "@/components/pwa-register";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-montserrat",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#1a1a2e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    default: "SkillItLearn - Career Paths, Skills & Verifiable Certificates",
    template: "%s | SkillItLearn",
  },
  description:
    "Discover structured career paths, master in-demand skills through guided tracks, prove your expertise with quizzes, and earn verifiable certificates.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SkillItLearn",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
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
          <PwaRegister />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
