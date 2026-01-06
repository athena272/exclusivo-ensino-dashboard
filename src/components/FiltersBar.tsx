import {
  Card,
  CardHeader,
  CardTitle,
  CardHint,
  FormRow,
  Field,
  Label,
  Input,
  Select,
  Button,
} from "../styles";
import { Download, RefreshCcw } from "lucide-react";

export type Filters = {
  q: string;
  bucket: "all" | "promoters" | "passives" | "detractors";
};

type Props = {
  formId: string;
  setFormId: (v: string) => void;
  filters: Filters;
  setFilters: (f: Filters) => void;
  connected: boolean;
  loading: boolean;
  onLoad: () => void;
  onExportCsv: () => void;
};

export function FiltersBar({
  formId,
  setFormId,
  filters,
  setFilters,
  connected,
  loading,
  onLoad,
  onExportCsv,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Fonte e filtros</CardTitle>
          <CardHint>
            Pesquise por nome/comentário e filtre por faixa (NPS)
          </CardHint>
        </div>
      </CardHeader>

      <FormRow>
        <Field>
          <Label>Form ID (do link /edit)</Label>
          <Input
            value={formId}
            onChange={(e) => setFormId(e.target.value)}
            placeholder="ex: 1kbtgwxxBvW1O_Uf9Oh9c-XsR4_NdqrKDBnBAO3GE1-o"
          />
        </Field>

        <Field>
          <Label>Pesquisar</Label>
          <Input
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            placeholder="nome ou comentário…"
          />
        </Field>

        <Field>
          <Label>Segmento (NPS)</Label>
          <Select
            value={filters.bucket}
            onChange={(e) =>
              setFilters({ ...filters, bucket: e.target.value as any })
            }
          >
            <option value="all">Todos</option>
            <option value="promoters">Promotores (9–10)</option>
            <option value="passives">Neutros (7–8)</option>
            <option value="detractors">Detratores (0–6)</option>
          </Select>
        </Field>

        <Field>
          <Label>Ações</Label>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Button
              variant="secondary"
              onClick={onExportCsv}
              disabled={loading}
            >
              <Download size={16} /> Exportar CSV
            </Button>
            <Button
              variant="primary"
              onClick={onLoad}
              disabled={!connected || loading}
            >
              <RefreshCcw size={16} /> {loading ? "Carregando..." : "Atualizar"}
            </Button>
          </div>
        </Field>
      </FormRow>
    </Card>
  );
}
