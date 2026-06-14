import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import { SiteShell } from "@/components/SiteShell";
import { ThemeProvider } from "@/components/ThemeProvider";
import { rootMetadata } from "@/lib/site-metadata";
import "@/styles/globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = rootMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sora.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=document.documentElement,k='theme',s=localStorage.getItem(k);if(s==='light'||s==='dark'){d.setAttribute('data-theme',s);return;}if(s==='system'||!s){var m=window.matchMedia('(prefers-color-scheme: dark)').matches;d.setAttribute('data-theme',m?'dark':'light');return;}d.setAttribute('data-theme','dark');}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <SiteShell>{children}</SiteShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
