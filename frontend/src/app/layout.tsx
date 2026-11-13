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
      data-theme="light"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=document.documentElement,s=localStorage.getItem('theme');if(s==='dark'||s==='light'){d.setAttribute('data-theme',s);return;}if(s==='system'){d.setAttribute('data-theme',window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');return;}d.setAttribute('data-theme','light');}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`,
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
              // Only the live site reports to GA: local builds, previews and the
              // onrender.com copy would otherwise pollute the data with test visits.
              if (!/(^|\\.)novarosolution\\.com$/.test(location.hostname)) return;
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
                (window.__gaPending||[]).forEach(function(e){gtag('event', e[0], e[1]);});
                window.__gaPending=[];
              }
              window.__gaLoad=load;
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
