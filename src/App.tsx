import { useMemo, useState } from "react";
import { requestAccessToken } from "./google/gis";
import { loadSurveyResponses, type SurveyResponse } from "./google/formsApi";
import {
  GlobalStyle,
  Shell,
  TopBar,
  TopBarInner,
  TitleWrap,
  Title,
  Subtitle,
  Actions,
  Button,
  Pill,
  Grid,
  Kpi,
  KpiLabel,
  KpiValue,
  KpiSub,
  ErrorBox,
} from "./styles";
import { FiltersBar, type Filters } from "./components/FiltersBar";
import { RatingChart } from "./components/RatingChart";
import { ResponsesTable } from "./components/ResponsesTable";
import { CheckCircle2, AlertTriangle, PlugZap } from "lucide-react";

const SCOPES = [
  "https://www.googleapis.com/auth/forms.responses.readonly",
  "https://www.googleapis.com/auth/forms.body.readonly",
];

function toBucket(
  r?: number
): "promoters" | "passives" | "detractors" | "unknown" {
  if (typeof r !== "number") return "unknown";
  if (r >= 9) return "promoters";
  if (r >= 7) return "passives";
  return "detractors";
}

function downloadCsv(filename: string, rows: SurveyResponse[]) {
  const headers = ["submittedAt", "name", "rating", "comment", "responseId"];
  const esc = (v: any) => {
    const s = (v ?? "").toString().replace(/\r?\n/g, " ");
    return `"${s.replace(/"/g, '""')}"`;
  };

  const lines = [
    headers.join(","),
    ...rows.map((r) =>
      [
        r.submittedAt,
        r.name ?? "",
        r.rating ?? "",
        r.comment ?? "",
        r.responseId,
      ]
        .map(esc)
        .join(",")
    ),
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const TOKEN_KEY = "exclusivo_google_token";

function saveToken(accessToken: string, expiresIn?: number) {
  const expiresAt = expiresIn
    ? Date.now() + expiresIn * 1000
    : Date.now() + 50 * 60 * 1000; // fallback 50min
  sessionStorage.setItem(TOKEN_KEY, JSON.stringify({ accessToken, expiresAt }));
}

function loadToken(): string | null {
  const raw = sessionStorage.getItem(TOKEN_KEY);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as { accessToken: string; expiresAt: number };
    if (!data?.accessToken || !data?.expiresAt) return null;
    if (Date.now() >= data.expiresAt) {
      sessionStorage.removeItem(TOKEN_KEY);
      return null;
    }
    return data.accessToken;
  } catch {
    sessionStorage.removeItem(TOKEN_KEY);
    return null;
  }
}

function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

export default function App() {
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    loadToken()
  );
  const [formId, setFormId] = useState<string>(
    import.meta.env.VITE_FORM_ID ?? ""
  );
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<SurveyResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const [filters, setFilters] = useState<Filters>({ q: "", bucket: "all" });

  const filteredRows = useMemo(() => {
    const q = filters.q.trim().toLowerCase();

    return rows.filter((r) => {
      const bucket = toBucket(r.rating);

      if (filters.bucket !== "all") {
        if (bucket !== filters.bucket) return false;
      }

      if (q) {
        const hay = `${r.name ?? ""} ${r.comment ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      return true;
    });
  }, [rows, filters]);

  const metrics = useMemo(() => {
    const ratings = filteredRows
      .map((r) => r.rating)
      .filter((n): n is number => typeof n === "number");

    const total = filteredRows.length;
    const totalRated = ratings.length;

    const avg =
      totalRated > 0
        ? ratings.reduce((a, b) => a + b, 0) / totalRated
        : undefined;

    const dist = Array.from({ length: 11 }, (_, i) => ({
      score: i,
      count: ratings.filter((r) => r === i).length,
    }));

    const promoters = ratings.filter((r) => r >= 9).length;
    const detractors = ratings.filter((r) => r <= 6).length;
    const passives = ratings.filter((r) => r >= 7 && r <= 8).length;

    const nps =
      totalRated > 0
        ? Math.round(
            ((promoters / totalRated) * 100 - (detractors / totalRated) * 100) *
              10
          ) / 10
        : undefined;

    return {
      total,
      totalRated,
      avg,
      dist,
      promoters,
      passives,
      detractors,
      nps,
    };
  }, [filteredRows]);

  async function onConnect() {
    setError(null);
    try {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
      if (!clientId) throw new Error("Faltou VITE_GOOGLE_CLIENT_ID no .env");

      const result = await requestAccessToken({
        clientId,
        scopes: SCOPES,
        prompt: "",
      });
      setAccessToken(result.accessToken);
      saveToken(result.accessToken, result.expiresIn);
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

    setLoading(true);
    try {
      const data = await loadSurveyResponses({
        formId: formId.trim(),
        accessToken,
      });
      setRows(data);
      setLastSync(new Date());
    } catch (e: any) {
      const msg = e?.message ?? String(e);

      // token expirou/revogado → força reconectar
      if (msg.includes("401") || msg.includes("403")) {
        clearToken();
        setAccessToken(null);
      }

      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function onExportCsv() {
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    downloadCsv(`exclusivo-ensino-respostas-${stamp}.csv`, filteredRows);
  }

  const connected = !!accessToken;

  return (
    <>
      <GlobalStyle />
      <TopBar>
        <Shell>
          <TopBarInner>
            <TitleWrap>
              <Title>Dashboard — Exclusivo Ensino</Title>
              <Subtitle>
                {lastSync
                  ? `Última atualização: ${lastSync.toLocaleString()}`
                  : "Conecte e carregue as respostas"}
              </Subtitle>
            </TitleWrap>

            <Actions>
              <Pill tone={connected ? "ok" : "warn"}>
                {connected ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <AlertTriangle size={16} />
                )}
                {connected ? "Conectado" : "Não conectado"}
              </Pill>

              <Button variant="secondary" onClick={onConnect}>
                <PlugZap size={16} />
                {connected ? "Reconectar" : "Conectar Google"}
              </Button>
            </Actions>
          </TopBarInner>
        </Shell>
      </TopBar>

      <Shell>
        <FiltersBar
          formId={formId}
          setFormId={setFormId}
          filters={filters}
          setFilters={setFilters}
          connected={connected}
          loading={loading}
          onLoad={onLoad}
          onExportCsv={onExportCsv}
        />

        {error && <ErrorBox>{error}</ErrorBox>}

        <Grid>
          <Kpi>
            <KpiLabel>Total (após filtros)</KpiLabel>
            <KpiValue>{metrics.total}</KpiValue>
            <KpiSub>Linhas visíveis na tabela</KpiSub>
          </Kpi>

          <Kpi>
            <KpiLabel>Respostas com nota</KpiLabel>
            <KpiValue>{metrics.totalRated}</KpiValue>
            <KpiSub>Ignora vazios/sem nota</KpiSub>
          </Kpi>

          <Kpi>
            <KpiLabel>Média (0–10)</KpiLabel>
            <KpiValue>{metrics.avg?.toFixed(2) ?? "—"}</KpiValue>
            <KpiSub>Base: {metrics.totalRated}</KpiSub>
          </Kpi>

          <Kpi>
            <KpiLabel>NPS</KpiLabel>
            <KpiValue>{metrics.nps ?? "—"}</KpiValue>
            <KpiSub>
              9–10: {metrics.promoters} • 7–8: {metrics.passives} • 0–6:{" "}
              {metrics.detractors}
            </KpiSub>
          </Kpi>
        </Grid>

        <RatingChart dist={metrics.dist} avg={metrics.avg} />
        <ResponsesTable rows={filteredRows} />
      </Shell>
    </>
  );
}
