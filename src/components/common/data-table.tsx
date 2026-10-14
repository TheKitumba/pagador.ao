import type React from "react";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
  /** Hide the column below this breakpoint to keep tables readable on phones. */
  hideBelow?: "sm" | "md" | "lg" | "xl" | "2xl";
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  /** Read by screen readers; describes what the table lists. */
  caption: string;
  empty?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  rowClassName?: (row: T) => string | undefined;
}

const hideClass = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
  xl: "hidden xl:table-cell",
  "2xl": "hidden 2xl:table-cell",
};

const alignClass = { left: "text-left", right: "text-right", center: "text-center" };

export function DataTable<T>({ columns, rows, getRowKey, caption, empty, footer, className, rowClassName }: DataTableProps<T>) {
  return (
    <div className={cn("overflow-hidden rounded-xl border bg-card shadow-card", className)}>
      <Table>
        <TableCaption className="sr-only">{caption}</TableCaption>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map((column) => (
              <TableHead
                key={column.key}
                scope="col"
                className={cn(alignClass[column.align ?? "left"], column.hideBelow && hideClass[column.hideBelow], column.className)}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columns.length} className="p-0">
                {empty ?? <p className="px-4 py-10 text-center text-sm text-muted-foreground">Sem resultados.</p>}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={getRowKey(row)} className={rowClassName?.(row)}>
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={cn(alignClass[column.align ?? "left"], column.hideBelow && hideClass[column.hideBelow], column.className)}
                  >
                    {column.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {footer && <div className="flex items-center justify-between gap-4 border-t px-4 py-3 text-sm text-muted-foreground">{footer}</div>}
    </div>
  );
}

export function Money({ value, className, muted }: { value: string; className?: string; muted?: boolean }) {
  return <span className={cn("tabular whitespace-nowrap", muted && "text-muted-foreground", className)}>{value}</span>;
}
