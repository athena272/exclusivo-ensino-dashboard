import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  :root{
    --bg: #0b0f17;
    --panel: rgba(255,255,255,0.06);
    --card: rgba(255,255,255,0.08);
    --stroke: rgba(255,255,255,0.10);
    --text: rgba(255,255,255,0.92);
    --muted: rgba(255,255,255,0.65);
    --muted2: rgba(255,255,255,0.50);
    --danger: #ff5c5c;
    --ok: #44d481;
    --warn: #ffcc66;
    --shadow: 0 14px 40px rgba(0,0,0,0.35);
    --radius: 16px;
  }

  * { box-sizing: border-box; }
  html, body { height: 100%; }
  body {
    margin: 0;
    background: radial-gradient(1200px 800px at 15% 15%, rgba(120,79,255,0.25), transparent 60%),
                radial-gradient(1000px 700px at 85% 25%, rgba(40,221,255,0.18), transparent 55%),
                var(--bg);
    color: var(--text);
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial;
  }

  a { color: inherit; text-decoration: none; }
  button, input { font-family: inherit; }
`;

export const Shell = styled.div`
  max-width: 1180px;
  margin: 0 auto;
  padding: 22px;
`;

export const TopBar = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(12px);
  background: linear-gradient(
    to bottom,
    rgba(11, 15, 23, 0.88),
    rgba(11, 15, 23, 0.55)
  );
  border-bottom: 1px solid var(--stroke);
  padding: 16px 0 14px 0;
  margin-bottom: 18px;
`;

export const TopBarInner = styled.div`
  display: flex;
  gap: 14px;
  align-items: center;
  justify-content: space-between;
`;

export const TitleWrap = styled.div`
  display: grid;
  gap: 4px;
`;

export const Title = styled.h1`
  font-size: 18px;
  margin: 0;
  letter-spacing: 0.2px;
`;

export const Subtitle = styled.div`
  font-size: 12px;
  color: var(--muted);
`;

export const Actions = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
`;

export const Pill = styled.span<{
  tone?: "ok" | "warn" | "danger" | "neutral";
}>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: 999px;
  border: 1px solid var(--stroke);
  background: var(--panel);
  font-size: 12px;
  color: ${({ tone }) =>
    tone === "ok"
      ? "rgba(68,212,129,0.95)"
      : tone === "warn"
      ? "rgba(255,204,102,0.95)"
      : tone === "danger"
      ? "rgba(255,92,92,0.95)"
      : "var(--muted)"};
`;

export const Button = styled.button<{
  variant?: "primary" | "secondary" | "ghost";
}>`
  border: 1px solid var(--stroke);
  border-radius: 12px;
  padding: 10px 12px;
  cursor: pointer;
  color: var(--text);
  background: ${({ variant }) =>
    variant === "primary"
      ? "linear-gradient(135deg, rgba(120,79,255,0.9), rgba(40,221,255,0.55))"
      : variant === "secondary"
      ? "rgba(255,255,255,0.08)"
      : "transparent"};
  box-shadow: ${({ variant }) =>
    variant === "primary" ? "0 10px 30px rgba(0,0,0,0.25)" : "none"};

  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    filter: brightness(1.06);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    filter: none;
  }
`;

export const Card = styled.div`
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--stroke);
  border-radius: var(--radius);
  padding: 16px;
  box-shadow: var(--shadow);
  margin-bottom: 16px;
`;

export const CardHeader = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const CardTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.2px;
`;

export const CardHint = styled.div`
  font-size: 12px;
  color: var(--muted);
`;

export const ErrorBox = styled.div`
  margin-top: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(255, 92, 92, 0.12);
  border: 1px solid rgba(255, 92, 92, 0.28);
  color: rgba(255, 220, 220, 0.95);
  font-size: 13px;
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr 0.8fr 0.8fr;
  gap: 10px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const Field = styled.div`
  display: grid;
  gap: 6px;
`;

export const Label = styled.div`
  font-size: 12px;
  color: var(--muted);
`;

export const Input = styled.input`
  width: 100%;
  border: 1px solid var(--stroke);
  background: rgba(0, 0, 0, 0.2);
  color: var(--text);
  border-radius: 12px;
  padding: 10px 12px;
  outline: none;

  &::placeholder {
    color: var(--muted2);
  }
  &:focus {
    border-color: rgba(120, 79, 255, 0.7);
  }
`;

export const Select = styled.select`
  width: 100%;
  border: 1px solid var(--stroke);
  background: rgba(0, 0, 0, 0.2);
  color: var(--text);
  border-radius: 12px;
  padding: 10px 12px;
  outline: none;

  &:focus {
    border-color: rgba(120, 79, 255, 0.7);
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 1050px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const Kpi = styled.div`
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--stroke);
  border-radius: var(--radius);
  padding: 14px 14px 12px 14px;
`;

export const KpiLabel = styled.div`
  font-size: 12px;
  color: var(--muted);
  margin-bottom: 6px;
`;

export const KpiValue = styled.div`
  font-size: 26px;
  font-weight: 800;
  letter-spacing: 0.2px;
`;

export const KpiSub = styled.div`
  margin-top: 6px;
  font-size: 12px;
  color: var(--muted);
`;

export const TableWrap = styled.div`
  overflow: auto;
  border-radius: var(--radius);
  border: 1px solid var(--stroke);
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 860px;

  thead th {
    position: sticky;
    top: 0;
    z-index: 1;
    background: rgba(11, 15, 23, 0.88);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--stroke);
    font-size: 12px;
    color: var(--muted);
    text-align: left;
    padding: 12px 10px;
    white-space: nowrap;
    cursor: default;
  }

  tbody td {
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    padding: 12px 10px;
    font-size: 13px;
    vertical-align: top;
  }

  tbody tr:hover td {
    background: rgba(255, 255, 255, 0.04);
  }
`;

export const Badge = styled.span<{
  tone?: "ok" | "warn" | "danger" | "neutral";
}>`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid var(--stroke);
  background: rgba(0, 0, 0, 0.18);
  font-size: 12px;
  color: ${({ tone }) =>
    tone === "ok"
      ? "rgba(68,212,129,0.95)"
      : tone === "warn"
      ? "rgba(255,204,102,0.95)"
      : tone === "danger"
      ? "rgba(255,92,92,0.95)"
      : "var(--muted)"};
`;

export const Muted = styled.span`
  color: var(--muted);
`;

export const Hr = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 12px 0;
`;
