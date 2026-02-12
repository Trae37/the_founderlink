import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

/*
 * MAINTENANCE MODE — Coming Soon page
 * To restore the full site, revert this file:
 *   git checkout main -- client/src/App.tsx
 */

function ComingSoon() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
        color: "#f8fafc",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <div style={{ maxWidth: "540px" }}>
        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 700,
            marginBottom: "1rem",
            letterSpacing: "-0.02em",
          }}
        >
          Something New Is Coming
        </h1>
        <p
          style={{
            fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
            color: "#94a3b8",
            lineHeight: 1.6,
            marginBottom: "2rem",
          }}
        >
          We're building something great. Check back soon.
        </p>
        <div
          style={{
            width: "60px",
            height: "4px",
            background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
            borderRadius: "2px",
            margin: "0 auto",
          }}
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <ComingSoon />
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default App;
