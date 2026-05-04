import { useMemo, useState } from "react";
import { ChevronUp, ChevronDown, Pencil, Trash2 } from "lucide-react";
import { cn } from "~/utils/cn";

export type Column<T> = {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  getValue?: (item: T) => string;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  getKey: (item: T) => string;
  emptyText?: string;
  isLoading?: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
};

export function DataTable<T>({
  columns,
  data,
  getKey,
  emptyText = "Ingen data endnu",
  isLoading = false,
  onEdit,
  onDelete,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    const col = columns.find((c) => c.key === sortKey);
    return [...data].sort((a, b) => {
      const aVal = col?.getValue
        ? col.getValue(a)
        : String((a as Record<string, unknown>)[sortKey] ?? "");
      const bVal = col?.getValue
        ? col.getValue(b)
        : String((b as Record<string, unknown>)[sortKey] ?? "");
      const cmp = aVal.localeCompare(bVal, "da");
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir, columns]);

  const hasActions = onEdit || onDelete;

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-surface border-b border-border">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left text-[13px] font-medium text-foreground-muted">
                  {col.header}
                </th>
              ))}
              {hasActions && <th className="px-4 py-3 w-20" />}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 4 }).map((_, i) => (
              <tr key={i} className="border-b border-border last:border-0">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    <div className="h-4 bg-surface rounded animate-pulse" />
                  </td>
                ))}
                {hasActions && <td className="px-4 py-3" />}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-surface border-b border-border">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left text-[13px] font-medium text-foreground-muted">
                  {col.header}
                </th>
              ))}
              {hasActions && <th className="px-4 py-3 w-20" />}
            </tr>
          </thead>
        </table>
        <div className="py-12 text-center text-sm text-foreground-muted">{emptyText}</div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <table className="w-full">
        <thead className="bg-surface border-b border-border">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 text-left text-[13px] font-medium text-foreground-muted">
                {col.sortable ? (
                  <button
                    onClick={() => handleSort(col.key)}
                    className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    {col.header}
                    <span className="flex flex-col">
                      <ChevronUp
                        className={cn(
                          "h-3 w-3 -mb-1",
                          sortKey === col.key && sortDir === "asc" ? "text-foreground" : "opacity-30"
                        )}
                      />
                      <ChevronDown
                        className={cn(
                          "h-3 w-3",
                          sortKey === col.key && sortDir === "desc" ? "text-foreground" : "opacity-30"
                        )}
                      />
                    </span>
                  </button>
                ) : (
                  col.header
                )}
              </th>
            ))}
            {hasActions && <th className="px-4 py-3 w-20" />}
          </tr>
        </thead>
        <tbody>
          {sorted.map((item) => (
            <tr key={getKey(item)} className="border-b border-border last:border-0 even:bg-surface hover:bg-surface-hover transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-sm text-foreground">
                  {col.render
                    ? col.render(item)
                    : String((item as Record<string, unknown>)[col.key] ?? "")}
                </td>
              ))}
              {hasActions && (
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className="p-1.5 rounded text-foreground-muted hover:text-foreground hover:bg-surface-hover transition-colors"
                        aria-label="Rediger"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item)}
                        className="p-1.5 rounded text-foreground-muted hover:text-danger hover:bg-surface-hover transition-colors"
                        aria-label="Slet"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
