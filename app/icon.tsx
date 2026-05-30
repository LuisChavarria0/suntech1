import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0A0F1E",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "6px",
        }}
      >
        <div
          style={{
            width: "22px",
            height: "22px",
            background: "linear-gradient(135deg, #F59E0B, #D97706)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#0A0F1E",
            fontSize: "13px",
            fontWeight: 900,
          }}
        >
          S
        </div>
      </div>
    ),
    { ...size }
  );
}
