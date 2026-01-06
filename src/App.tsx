import { useMemo, useState } from "react";
import { requestAccessToken } from "./google/gis";
import { loadSurveyResponses, type SurveyResponse } from "./google/formsApi";
import {
  Shell,
  TopBar,
  Title,
  Actions,
  Btn,
  Card,
  Label,
  Input,
  ErrorBox,
  Grid,
  Kpi,
  KpiLabel,
  KpiValue,
  Subtitle,
  Dist,
  DistRow,
  DistScore,
  DistCount,
  DistBar,
  Hint,
  Table,
} from "./styles";

const SCOPES = [
  "https://www.googleapis.com/auth/forms.responses.readonly",
  "https://www.googleapis.com/auth/forms.body.readonly",
];

export default function App() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [formId, setFormId] = useState<string>(
    import.meta.env.VITE_FORM_ID ?? ""
  );
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<SurveyResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  const metrics = useMemo(() => {
    const ratings = rows
      .map((r) => r.rating)
      .filter((n): n is number => typeof n === "number");
    const total = rows.length;
    const totalRated = ratings.length;

    const avg =
      totalRated > 0
        ? ratings.reduce((a, b) => a + b, 0) / totalRated
        : undefined;

    const dist = Array.from({ length: 11 }, (_, i) => ({
      score: i,
      count: ratings.filter((r) => r === i).length,
    }));

    return { total, totalRated, avg, dist };
  }, [rows]);

  async function onConnect() {
    setError(null);
    try {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
      if (!clientId) throw new Error("Faltou VITE_GOOGLE_CLIENT_ID no .env");

      const token = await requestAccessToken({ clientId, scopes: SCOPES });
      setAccessToken(token);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    }
  }

  async function onLoad() {
    setError(null);
    if (!accessToken) {
      setError("Conecte com Google primeiro.");
      return;
    }
    if (!formId.trim()) {
      setError("Informe o formId (o do link /d/<id>/edit).");
      return;
    }

    setLoading(true);
    try {
      const data = await loadSurveyResponses({
        formId: formId.trim(),
        accessToken,
      });
      setRows(data);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Shell>
      <TopBar>
        <Title>Dashboard — Exclusivo Ensino</Title>

        <Actions>
          <Btn onClick={onConnect}>
            {accessToken ? "Reconectar" : "Conectar Google"}
          </Btn>
          <Btn onClick={onLoad} disabled={!accessToken || loading}>
            {loading ? "Carregando..." : "Buscar respostas"}
          </Btn>
        </Actions>
      </TopBar>

      <Card>
        <Label>Form ID (do link /edit)</Label>
        <Input
          value={formId}
          onChange={(e) => setFormId(e.target.value)}
          placeholder="ex: 1kbtgwxxBvW1O_Uf9Oh9c-XsR4_NdqrKDBnBAO3GE1-o"
        />

        {error && <ErrorBox>{error}</ErrorBox>}
      </Card>

      <Grid>
        <Kpi>
          <KpiLabel>Total de respostas</KpiLabel>
          <KpiValue>{metrics.total}</KpiValue>
        </Kpi>

        <Kpi>
          <KpiLabel>Respostas com nota</KpiLabel>
          <KpiValue>{metrics.totalRated}</KpiValue>
        </Kpi>

        <Kpi>
          <KpiLabel>Média (0–10)</KpiLabel>
          <KpiValue>{metrics.avg?.toFixed(2) ?? "—"}</KpiValue>
        </Kpi>
      </Grid>

      <Card>
        <Subtitle>Distribuição das notas</Subtitle>
        <Dist>
          {metrics.dist.map((d) => (
            <DistRow key={d.score}>
              <DistScore>{d.score}</DistScore>
              <DistBar style={{ width: `${Math.min(100, d.count * 10)}%` }} />
              <DistCount>{d.count}</DistCount>
            </DistRow>
          ))}
        </Dist>
        <Hint>* A largura da barra é só visual (count × 10%).</Hint>
      </Card>

      <Card>
        <Subtitle>Respostas</Subtitle>
        <Table>
          <thead>
            <tr>
              <th>Quando</th>
              <th>Nome</th>
              <th>Nota</th>
              <th>Comentário</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.responseId}>
                <td>{new Date(r.submittedAt).toLocaleString()}</td>
                <td>{r.name ?? "—"}</td>
                <td>{typeof r.rating === "number" ? r.rating : "—"}</td>
                <td>{r.comment ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </Shell>
  );
}
