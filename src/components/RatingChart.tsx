import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Card, CardHeader, CardTitle, CardHint } from "../styles";
import { CustomTooltip } from "./CustomTooltip";

type Props = {
  dist: { score: number; count: number }[];
  avg?: number;
};

export function RatingChart({ dist, avg }: Props) {
  const total = dist.reduce((a, b) => a + b.count, 0);

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Distribuição das notas</CardTitle>
          <CardHint>0–10 (quantidade de respostas por nota)</CardHint>
        </div>
        <div style={{ textAlign: "right" }}>
          <CardHint>Média</CardHint>
          <div style={{ fontWeight: 800, fontSize: 14 }}>
            {avg?.toFixed(2) ?? "—"}
          </div>
        </div>
      </CardHeader>

      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <BarChart
            data={dist}
            margin={{ top: 10, right: 18, left: 0, bottom: 0 }}
          >
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis
              dataKey="score"
              stroke="rgba(255,255,255,0.55)"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="rgba(255,255,255,0.55)"
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip total={total} />} />
            <Bar dataKey="count" radius={[10, 10, 10, 10]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
