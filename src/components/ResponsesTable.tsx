import { useMemo, useState } from "react";
import * as ReactTable from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import {
  Badge,
  Card,
  CardHeader,
  CardHint,
  CardTitle,
  Table,
  TableWrap,
  Button,
  Muted,
} from "../styles";
import type { SurveyResponse } from "../google/formsApi";

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function toneFromRating(r?: number) {
  if (typeof r !== "number") return "neutral";
  if (r >= 9) return "ok";
  if (r >= 7) return "warn";
  return "danger";
}

export function ResponsesTable({ rows }: { rows: SurveyResponse[] }) {
  const [sorting, setSorting] = useState<ReactTable.SortingState>([
    { id: "submittedAt", desc: true },
  ]);

  const columns = useMemo<ReactTable.ColumnDef<SurveyResponse>[]>(
    () => [
      {
        accessorKey: "submittedAt",
        header: () => "Quando",
        cell: (info) => <Muted>{fmtDate(info.getValue() as string)}</Muted>,
      },
      {
        accessorKey: "name",
        header: () => "Nome",
        cell: (info) => (info.getValue() as string) || "—",
      },
      {
        accessorKey: "rating",
        header: () => "Nota",
        cell: (info) => {
          const v = info.getValue() as number | undefined;
          if (typeof v !== "number") return "—";
          return <Badge tone={toneFromRating(v) as any}>{v}</Badge>;
        },
      },
      {
        accessorKey: "comment",
        header: () => "Comentário",
        cell: (info) => {
          const v = (info.getValue() as string) || "";
          if (!v) return "—";
          return (
            <span title={v}>{v.length > 120 ? v.slice(0, 120) + "…" : v}</span>
          );
        },
      },
    ],
    []
  );

  const table = ReactTable.useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: ReactTable.getCoreRowModel(),
    getSortedRowModel: ReactTable.getSortedRowModel(),
  });

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Respostas</CardTitle>
          <CardHint>{rows.length} linha(s) após filtros</CardHint>
        </div>
      </CardHeader>

      <TableWrap>
        <Table>
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th key={h.id}>
                    {h.isPlaceholder ? null : (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span>
                          {ReactTable.flexRender(
                            h.column.columnDef.header,
                            h.getContext()
                          )}
                        </span>

                        {h.column.getCanSort() && (
                          <Button
                            variant="ghost"
                            onClick={h.column.getToggleSortingHandler()}
                            style={{ padding: "6px 8px", borderRadius: 10 }}
                            aria-label="Ordenar"
                          >
                            <ArrowUpDown size={14} />
                          </Button>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((r) => (
              <tr key={r.id}>
                {r.getVisibleCells().map((c) => (
                  <td key={c.id}>
                    {ReactTable.flexRender(
                      c.column.columnDef.cell,
                      c.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrap>
    </Card>
  );
}
