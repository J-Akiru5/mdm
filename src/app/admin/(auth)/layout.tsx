export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0b0d",
        fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
      }}
    >
      <div style={{ padding: "20px 32px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: "#d51c24", letterSpacing: "1px" }}>
          MDM Admin Portal
        </span>
      </div>
      {children}
    </div>
  );
}
