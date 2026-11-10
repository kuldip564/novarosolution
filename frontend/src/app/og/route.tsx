import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * Branded 1200×630 social image: /og?title=…&eyebrow=…
 * Used as the Open Graph / Twitter image for every page that has no photo of its own.
 */

const SIZE = { width: 1200, height: 630 };

let logoDataUrl: string | null | undefined;

async function loadLogo(): Promise<string | null> {
  if (logoDataUrl !== undefined) return logoDataUrl;
  try {
    const file = await readFile(join(process.cwd(), "public/brand/novaro-icon-192.png"));
    logoDataUrl = `data:image/png;base64,${file.toString("base64")}`;
  } catch {
    logoDataUrl = null;
  }
  return logoDataUrl;
}

function clean(value: string | null, fallback: string, max: number): string {
  const text = (value ?? "").replace(/\s+/g, " ").trim();
  if (!text) return fallback;
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = clean(searchParams.get("title"), "Software, AI & growth for companies worldwide", 90);
  const eyebrow = clean(searchParams.get("eyebrow"), "Novaro Solution", 48).toUpperCase();
  const logo = await loadLogo();
  const titleSize = title.length > 60 ? 54 : title.length > 36 ? 62 : 72;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #05080f 0%, #0a1730 58%, #12286a 100%)",
          color: "#ffffff",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -220,
            right: -160,
            width: 720,
            height: 720,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(69,200,245,0.32) 0%, rgba(47,123,255,0.12) 45%, rgba(5,8,15,0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -260,
            left: -200,
            width: 640,
            height: 640,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(47,123,255,0.22) 0%, rgba(5,8,15,0) 68%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {logo ? <img src={logo} width={44} height={58} alt="" /> : null}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 30, letterSpacing: -0.5 }}>Novaro</span>
              <span style={{ fontSize: 13, letterSpacing: 6, color: "#8fe4ff" }}>SOLUTION</span>
            </div>
          </div>
          <span style={{ fontSize: 22, color: "#94a2bc" }}>novarosolution.com</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 1000 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22 }}>
            <div style={{ width: 44, height: 2, background: "#45c8f5" }} />
            <span style={{ fontSize: 22, letterSpacing: 5, color: "#45c8f5" }}>{eyebrow}</span>
          </div>
          <div style={{ fontSize: titleSize, lineHeight: 1.08, letterSpacing: -2, color: "#ffffff" }}>
            {title}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 12 }}>
            {["Web & mobile apps", "AI & ML", "SEO & growth"].map((chip) => (
              <span
                key={chip}
                style={{
                  fontSize: 20,
                  padding: "10px 20px",
                  borderRadius: 999,
                  border: "1px solid rgba(143,228,255,0.35)",
                  background: "rgba(255,255,255,0.04)",
                  color: "#d6deec",
                }}
              >
                {chip}
              </span>
            ))}
          </div>
          <span style={{ fontSize: 20, color: "#94a2bc" }}>Gandhinagar, India · Worldwide</span>
        </div>
      </div>
    ),
    {
      ...SIZE,
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
      },
    },
  );
}
