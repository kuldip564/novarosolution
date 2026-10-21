import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import Script from "next/script";
import { SiteShell } from "@/components/SiteShell";
import { ThemeProvider } from "@/components/ThemeProvider";
import { rootMetadata } from "@/lib/site-metadata";
import "@/styles/globals.css";
import "@/styles/mobile.css";

const GA_MEASUREMENT_ID = "G-3Z1Z971K06";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
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
      {process.env.NODE_ENV === "production" && (
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            (function(){
              var id='${GA_MEASUREMENT_ID}';
              function load(){
                if (window.__gaLoaded) return;
                window.__gaLoaded=1;
                var s=document.createElement('script');
                s.src='https://www.googletagmanager.com/gtag/js?id='+id;
                s.async=true;
                document.head.appendChild(s);
                window.dataLayer=window.dataLayer||[];
                window.gtag=function(){dataLayer.push(arguments);};
                gtag('js', new Date());
                gtag('config', id);
              }
              addEventListener('pointerdown', load, {once:true});
              addEventListener('scroll', load, {once:true, passive:true});
              setTimeout(load, 8000);
            })();
          `}
        </Script>
      )}
    </html>
  );
}
