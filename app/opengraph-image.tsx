import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Grupo Suntech — Energía Solar y Tecnología en El Salvador";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0A0F1E",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background orbs */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "5%",
            width: "400px",
            height: "400px",
            background:
              "radial-gradient(circle, rgba(251,191,36,0.12), transparent)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            right: "5%",
            width: "350px",
            height: "350px",
            background:
              "radial-gradient(circle, rgba(59,130,246,0.1), transparent)",
            borderRadius: "50%",
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(251,191,36,0.1)",
            border: "1px solid rgba(251,191,36,0.3)",
            borderRadius: "100px",
            padding: "8px 20px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              background: "#F59E0B",
              borderRadius: "50%",
            }}
          />
          <span
            style={{
              color: "#F59E0B",
              fontSize: "16px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            El Salvador
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            fontSize: "80px",
            fontWeight: 900,
            color: "white",
            lineHeight: 1.05,
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          Grupo{" "}
          <span style={{ color: "#F59E0B", marginLeft: "20px" }}>Suntech</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "28px",
            color: "#8aa4c8",
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          Energía Solar · Seguridad Electrónica · Tecnología
        </div>

        {/* Pills */}
        <div style={{ display: "flex", gap: "16px" }}>
          {["10+ años", "13+ proyectos", "Cobertura nacional"].map((item) => (
            <div
              key={item}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "100px",
                padding: "10px 24px",
                color: "#8aa4c8",
                fontSize: "18px",
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
