"use client";

import { useMemo, useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

type FieldConfig = {
  key: string;
  label: string;
  x: number;
  y: number;
  pageIndex: number;
  w: number;
  h: number;
  rows: number;
};

const PDF_URL = "/strength-portfolio.pdf";

const fields: FieldConfig[] = [
  { key: "q1", label: "1. What makes you excited?", pageIndex: 0, x: 50, y: 720, w: 450, h: 90, rows: 3 },
  { key: "q2", label: "2. What feels easy to do?", pageIndex: 0, x: 50, y: 620, w: 450, h: 90, rows: 3 },
  { key: "q3", label: "3. What strengths do others praise?", pageIndex: 0, x: 50, y: 520, w: 450, h: 90, rows: 3 },
];

function wrapText(text: string, maxChars: number) {
  const lines: string[] = [];

  for (const paragraph of text.split("\n")) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    let line = "";

    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (candidate.length > maxChars) {
        if (line) lines.push(line);
        line = word;
      } else {
        line = candidate;
      }
    }

    if (line) {
      lines.push(line);
    }
    if (!paragraph.trim()) {
      lines.push("");
    }
  }

  return lines;
}

export default function Home() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [filledPdfUrl, setFilledPdfUrl] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  const answeredCount = useMemo(
    () => Object.values(values).filter((value) => value.trim()).length,
    [values]
  );

  function updateField(key: string, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function createFilledPdf() {
    setStatus("Creating your filled PDF...");
    if (filledPdfUrl) {
      URL.revokeObjectURL(filledPdfUrl);
      setFilledPdfUrl(null);
    }

    const existingPdfBytes = await fetch(PDF_URL).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;
    const lineHeight = 16;

    for (const field of fields) {
      const value = values[field.key]?.trim();
      if (!value) continue;

      const page = pdfDoc.getPage(field.pageIndex);
      const maxChars = Math.max(18, Math.floor(field.w / 6));
      const lines = wrapText(value, maxChars);
      const maxLines = Math.floor(field.h / lineHeight);

      lines.slice(0, maxLines).forEach((line, index) => {
        page.drawText(line, {
          x: field.x,
          y: field.y - index * lineHeight,
          size: fontSize,
          font,
          color: rgb(0.1, 0.1, 0.1),
          maxWidth: field.w,
        });
      });
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    setFilledPdfUrl(url);
    setStatus("Preview updated. You can now download the filled PDF.");
  }

  function downloadFilledPdf() {
    if (!filledPdfUrl) return;
    const link = document.createElement("a");
    link.href = filledPdfUrl;
    link.download = "filled-strength-portfolio.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <main style={styles.page}>
      <section style={styles.header}>
        <div>
          <p style={styles.eyebrow}>See the Good!</p>
          <h1 style={styles.title}>Strength portfolio PDF filler</h1>
          <p style={styles.subtitle}>
            Fill the form, generate a preview, and download the completed PDF.
          </p>
        </div>
        <div style={styles.actions}>
          <a href={PDF_URL} target="_blank" rel="noreferrer" style={styles.secondaryButton}>
            Open original PDF
          </a>
          <button onClick={createFilledPdf} style={styles.primaryButton}>
            Generate filled PDF
          </button>
          <button
            onClick={downloadFilledPdf}
            disabled={!filledPdfUrl}
            style={{
              ...styles.primaryButton,
              opacity: filledPdfUrl ? 1 : 0.5,
              cursor: filledPdfUrl ? "pointer" : "not-allowed",
            }}
          >
            Download filled PDF
          </button>
        </div>
      </section>

      <section style={styles.grid}>
        <aside style={styles.formPanel}>
          <h2 style={styles.panelTitle}>Fill your answers</h2>
          <p style={styles.helper}>{answeredCount} of {fields.length} fields filled</p>
          <div style={styles.fields}>
            {fields.map((field) => (
              <label key={field.key} style={styles.label}>
                <span>{field.label}</span>
                <textarea
                  rows={field.rows}
                  value={values[field.key] ?? ""}
                  onChange={(event) => updateField(field.key, event.target.value)}
                  style={styles.textarea}
                  placeholder="Type your answer here"
                />
              </label>
            ))}
          </div>
        </aside>

        <section style={styles.previewPanel}>
          <div style={styles.previewHeader}>
            <h2 style={styles.panelTitle}>{filledPdfUrl ? "Filled PDF preview" : "Original PDF preview"}</h2>
            <p style={styles.helper}>{status || "Your PDF preview appears here."}</p>
          </div>
          <iframe title="PDF preview" src={filledPdfUrl ?? PDF_URL} style={styles.iframe} />
        </section>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: 32,
    background: "#f3f4f6",
    fontFamily: "Inter, system-ui, sans-serif",
    color: "#111827",
  },
  header: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 20,
    marginBottom: 24,
  },
  eyebrow: {
    margin: 0,
    textTransform: "uppercase",
    fontSize: 12,
    letterSpacing: "0.18em",
    color: "#6366f1",
  },
  title: {
    margin: "8px 0 0",
    fontSize: 38,
    lineHeight: 1.05,
  },
  subtitle: {
    margin: "12px 0 0",
    maxWidth: 580,
    lineHeight: 1.7,
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
  },
  secondaryButton: {
    padding: "12px 18px",
    borderRadius: 12,
    background: "white",
    color: "#111827",
    textDecoration: "none",
    border: "1px solid #d1d5db",
    fontWeight: 600,
  },
  primaryButton: {
    padding: "12px 18px",
    borderRadius: 12,
    background: "#4f46e5",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1.4fr",
    gap: 24,
  },
  formPanel: {
    background: "white",
    borderRadius: 24,
    padding: 28,
    boxShadow: "0 24px 50px rgba(15, 23, 42, 0.08)",
  },
  panelTitle: {
    margin: 0,
    fontSize: 24,
  },
  helper: {
    marginTop: 10,
    color: "#6b7280",
  },
  fields: {
    marginTop: 24,
    display: "grid",
    gap: 16,
  },
  label: {
    display: "grid",
    gap: 8,
    fontSize: 14,
    fontWeight: 600,
  },
  textarea: {
    width: "100%",
    minHeight: 120,
    resize: "vertical",
    padding: 14,
    borderRadius: 14,
    border: "1px solid #d1d5db",
    background: "#f9fafb",
    fontSize: 14,
    color: "#111827",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  previewPanel: {
    minHeight: 700,
    background: "white",
    borderRadius: 24,
    padding: 28,
    boxShadow: "0 24px 50px rgba(15, 23, 42, 0.08)",
    display: "flex",
    flexDirection: "column",
  },
  previewHeader: {
    marginBottom: 20,
  },
  iframe: {
    width: "100%",
    flex: 1,
    minHeight: 580,
    border: "1px solid #e5e7eb",
    borderRadius: 18,
  },
};
