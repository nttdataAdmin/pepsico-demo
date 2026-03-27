import React, { useMemo, useState } from 'react';
import { useAppFlow } from '../../context/AppFlowContext';
import { sheetsForRoute } from '../../utils/excelSheetRoutes';
import './ExcelKpiSections.css';

function SheetTable({ sheetName, columns, rows }) {
  const [open, setOpen] = useState(true);
  const cols = columns && columns.length ? columns : Object.keys(rows[0] || {});
  const preview = rows.slice(0, 80);

  return (
    <div className="excel-sheet-block">
      <button type="button" className="excel-sheet-toggle" onClick={() => setOpen(!open)}>
        <span className="excel-sheet-name">{sheetName}</span>
        <span className="excel-sheet-meta">{rows.length} rows · {cols.length} columns</span>
        <span className="excel-chevron">{open ? '▼' : '▶'}</span>
      </button>
      {open && (
        <div className="excel-table-wrap">
          <table className="excel-table">
            <thead>
              <tr>
                {cols.map((c) => (
                  <th key={c}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview.map((row, i) => (
                <tr key={i}>
                  {cols.map((c) => (
                    <td key={c}>{formatCell(row[c])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length > preview.length && (
            <p className="excel-trunc">Showing first {preview.length} of {rows.length} rows.</p>
          )}
        </div>
      )}
    </div>
  );
}

function formatCell(v) {
  if (v === null || v === undefined) return '—';
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}

export default function ExcelKpiSections({ routeKey, title }) {
  const { excelBundle, excelLoading, excelError } = useAppFlow();

  const names = useMemo(() => {
    const s = excelBundle?.sheets;
    if (!s) return [];
    return Object.keys(s);
  }, [excelBundle]);

  const matched = useMemo(() => sheetsForRoute(names, routeKey), [names, routeKey]);

  if (excelLoading && !excelBundle) {
    return (
      <section className="excel-kpi-section loading">
        <p>Loading workbook data…</p>
      </section>
    );
  }

  if (excelError && !excelBundle) {
    return (
      <section className="excel-kpi-section error">
        <h3>{title || 'Workbook data'}</h3>
        <p className="excel-err-msg">{excelError}</p>
        <p className="excel-err-hint">Start the API and ensure super_excel.xlsx is at the project root.</p>
      </section>
    );
  }

  if (!matched.length) {
    return null;
  }

  return (
    <section className="excel-kpi-section">
      <h3 className="excel-kpi-title">{title || 'Data from super_excel.xlsx'}</h3>
      <p className="excel-kpi-sub">Sheets mapped to this view: {matched.join(', ')}</p>
      {matched.map((name) => {
        const sh = excelBundle.sheets[name];
        if (!sh?.rows?.length) return null;
        return (
          <SheetTable
            key={name}
            sheetName={name}
            columns={sh.columns}
            rows={sh.rows}
          />
        );
      })}
    </section>
  );
}
