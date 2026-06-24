import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getCity } from "@/lib/constants";
import { getDoctorCountByCity } from "@/lib/data";

// Needs the Node runtime because we query MongoDB for the live count.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const citySlug = searchParams.get("city") ?? "";
  const city = getCity(citySlug);
  const label = city?.label ?? "India";
  const count = city ? await getDoctorCountByCity(city.slug) : 0;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px",
          background: "linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)",
          fontFamily: "sans-serif",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 34, fontWeight: 700 }}>
          India Health Arena
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 800, lineHeight: 1.05 }}>
            {`Doctors in ${label}`}
          </div>
          <div style={{ display: "flex", fontSize: 44, fontWeight: 600, marginTop: 16, opacity: 0.95 }}>
            {`${count.toLocaleString("en-IN")} verified doctors · Zero friction`}
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 28, fontWeight: 600 }}>
          <span style={{ background: "rgba(255,255,255,0.2)", padding: "8px 20px", borderRadius: 999 }}>
            Always Updated
          </span>
          <span style={{ background: "rgba(255,255,255,0.2)", padding: "8px 20px", borderRadius: 999 }}>
            No Sign-in
          </span>
          <span style={{ background: "rgba(255,255,255,0.2)", padding: "8px 20px", borderRadius: 999 }}>
            Free Forever
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
