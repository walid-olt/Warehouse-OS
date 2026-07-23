import type { Metadata } from "next";
import {
  JetBrains_Mono as Mono,
  Open_Sans as Sans,
  Lora as Serif,
} from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const fontSans = Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontSerif = Serif({
  subsets: ["latin"],
  variable: "--font-serif",
});

const fontMono = Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Distrible — Warehouse Management",
  description:
    "Streamline your warehouse operations with real-time inventory tracking, order management, and analytics.",
};

// Prevent flash of wrong theme
const themeScript = `
(function() {
  try {
    var t = localStorage.getItem('theme');
    if (t === 'light') document.documentElement.classList.remove('dark');
    else document.documentElement.classList.add('dark');
  } catch(e) {}
})()
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: inline theme init script, no user input */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
