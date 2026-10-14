type Cell = string | number | boolean | null | undefined;

/** Triggers a browser download of generated content. */
export function downloadFile(filename: string, content: string, type = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/** CSV with ";" separators and a UTF-8 BOM, so Excel in pt-AO opens accents and decimals correctly. */
export function toCsv(rows: Record<string, Cell>[]) {
  if (rows.length === 0) return "﻿";
  const headers = Object.keys(rows[0]);
  const escape = (value: Cell) => {
    const text = value === null || value === undefined ? "" : String(value);
    return /[";\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  return "﻿" + [headers.join(";"), ...rows.map((row) => headers.map((header) => escape(row[header])).join(";"))].join("\n");
}
