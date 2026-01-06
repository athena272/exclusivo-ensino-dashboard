type Props = {
  active?: boolean;
  payload?: any[];
  label?: any;
  total: number;
};

export function CustomTooltip({ active, payload, label, total }: Props) {
  if (!active || !payload?.length) return null;

  const count = Number(payload[0]?.value ?? 0);
  const pct = total ? Math.round((count / total) * 100) : 0;

  return (
    <div
      style={{
        background: "rgba(15,18,28,0.96)",
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: 12,
        padding: "10px 12px",
        boxShadow: "0 14px 40px rgba(0,0,0,0.35)",
        minWidth: 160,
      }}
    >
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.70)" }}>Nota</div>
      <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 6 }}>
        {label}
      </div>

      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.70)" }}>
        Respostas
      </div>
      <div style={{ fontSize: 14, fontWeight: 800 }}>
        {count}{" "}
        <span style={{ color: "rgba(255,255,255,0.70)", fontWeight: 600 }}>
          ({pct}%)
        </span>
      </div>
    </div>
  );
}
