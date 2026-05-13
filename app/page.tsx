"use client";

import { useMemo, useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

type FieldConfig = {
  key: string;
  label: string;
  pageIndex: number;
  x: number;
  y: number;
  w: number;
  h: number;
  rows: number;
};

const PDF_URL = "/strength-portfolio.pdf";

const fields: FieldConfig[] = [
  { key: "q1", label: "1. What makes you excited?", pageIndex: 7, x: 95, y: 312, w: 165, h: 90, rows: 4 },
  { key: "q2", label: "2. What feels easy to do?", pageIndex: 7, x: 65, y: 80, w: 155, h: 95, rows: 4 },
  { key: "q3", label: "3. For which character strengths do you receive praise and feedback from others?", pageIndex: 7, x: 270, y: 78, w: 165, h: 90, rows: 4 },
  { key: "q4", label: "4. What do you love doing in your free time?", pageIndex: 7, x: 315, y: 268, w: 150, h: 90, rows: 4 },
  { key: "q5", label: "5. What do you look forward to the most during your day?", pageIndex: 7, x: 490, y: 382, w: 165, h: 90, rows: 4 },
  { key: "q6", label: "6. What makes you lose track of time?", pageIndex: 7, x: 545, y: 88, w: 150, h: 90, rows: 4 },
  { key: "q7", label: "7. Which strengths empower you in your free time?", pageIndex: 7, x: 615, y: 242, w: 145, h: 90, rows: 4 },
  { key: "q8", label: "8. Which strengths come to school when you arrive?", pageIndex: 7, x: 665, y: 382, w: 145, h: 90, rows: 4 },
  { key: "q9", label: "9. Which strengths do you appreciate the most in yourself?", pageIndex: 7, x: 690, y: 78, w: 120, h: 90, rows: 4 },
  { key: "garbage", label: "Garbage list", pageIndex: 8, x: 75, y: 130, w: 670, h: 260, rows: 8 },
  { key: "wishlist", label: "Top list: wishlist", pageIndex: 9, x: 55, y: 295, w: 690, h: 110, rows: 5 },
  { key: "notice", label: "Top list: what do you notice?", pageIndex: 9, x: 55, y: 105, w: 690, h: 125, rows: 5 },
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

    if (line) lines.push(line);
    if (!paragraph.trim()) lines.push("");
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
    const fontSize = 11;
    const lineHeight = 14;

    for (const field of fields) {
      const value = values[field.key]?.trim();
      if (!value) continue;

      const page = pdfDoc.getPage(field.pageIndex);
      const maxChars = Math.max(18, Math.floor(field.w / 5.4));
      const lines = wrapText(value, maxChars);
      const maxLines = Math.floor(field.h / lineHeight);

      lines.slice(0, maxLines).forEach((line, index) => {
        page.drawText(line, {
          x: field.x,
          y: field.y + field.h - 18 - index * lineHeight,
          size: fontSize,
          font,
          color: rgb(0.1, 0.1, 0.1),
          maxWidth: field.w,
        });
      });
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
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
            The original PDF is included in this app. Fill the fields, generate a preview,
            and download the completed PDF.
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
              opacity: filledPdfUrl ? 1 : 0.45,
              cursor: filledPdfUrl ? "pointer" : "not-allowed",
            }}
          >
            Download filled PDF
          </button>
        </div>
      </section>

      <section style={styles.grid}>
        <aside style={styles.formPanel}>
          <h2 style={styles.panelTitle}>Fill answers</h2>
          <p style={styles.helper}>{answeredCount} of {fields.length} sections filled</p>

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
            <h2 style={styles.panelTitle}>
              {filledPdfUrl ? "Filled PDF preview" : "Original PDF preview"}
            </h2>
            <p style={styles.helper}>{status || "Your PDF preview appears here."}</p>
          </div>

          <iframe
            title="PDF preview"
            src={filledPdfUrl ?? PDF_URL}
            style={styles.iframe}
          />
        </section>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: 40,
    fontFamily: "Inter, system-ui, sans-serif",
    background: "#f7f7fb",
    color: "#111827",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 24,
    flexWrap: "wrap",
    marginBottom: 32,
  },
  title: {
    margin: 0,
    fontSize: 40,
    lineHeight: 1.1,
  },
  eyebrow: {
    margin: 0,
    textTransform: "uppercase",
    fontSize: 12,
    letterSpacing: "0.2em",
    color: "#6366f1",
    marginBottom: 8,
  },
  subtitle: {
    margin: "12px 0 0",
    maxWidth: 620,
    lineHeight: 1.7,
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 12,
  },
  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 18px",
    borderRadius: 10,
    background: "white",
    color: "#111827",
    textDecoration: "none",
    border: "1px solid #d1d5db",
    fontWeight: 600,
  },
  primaryButton: {
    padding: "12px 18px",
    borderRadius: 10,
    background: "#4f46e5",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1.5fr",
    gap: 24,
  },
  formPanel: {
    background: "white",
    borderRadius: 24,
    padding: 28,
    boxShadow: "0 30px 60px rgba(15, 23, 42, 0.08)",
  },
  panelTitle: {
    margin: 0,
    fontSize: 24,
  },
  helper: {
    marginTop: 8,
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
    minHeight: 96,
    resize: "vertical",
    padding: 14,
    borderRadius: 14,
    border: "1px solid #d1d5db",
    background: "#f9fafb",
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: 14,
    color: "#111827",
  },
  previewPanel: {
    minHeight: 760,
    background: "white",
    borderRadius: 24,
    padding: 28,
    boxShadow: "0 30px 60px rgba(15, 23, 42, 0.08)",
    display: "flex",
    flexDirection: "column",
  },
  previewHeader: {
    marginBottom: 18,
  },
  iframe: {
    border: "1px solid #e5e7eb",
    borderRadius: 18,
    width: "100%",
    flex: 1,
    minHeight: 620,
  },
};
"use client";

import { useMemo, useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

type FieldConfig = {
  key: string;
  label: string;
  pageIndex: number;
  x: number;
  y: number;
  w: number;
  h: number;
  rows: number;
};

const PDF_URL = "/strength-portfolio.pdf";

const fields: FieldConfig[] = [
  { key: "q1", label: "1. What makes you excited?", pageIndex: 7, x: 95, y: 312, w: 165, h: 90, rows: 4 },
  { key: "q2", label: "2. What feels easy to do?", pageIndex: 7, x: 65, y: 80, w: 155, h: 95, rows: 4 },
  { key: "q3", label: "3. For which character strengths do you receive praise and feedback from others?", pageIndex: 7, x: 270, y: 78, w: 165, h: 90, rows: 4 },
  { key: "q4", label: "4. What do you love doing in your free time?", pageIndex: 7, x: 315, y: 268, w: 150, h: 90, rows: 4 },
  { key: "q5", label: "5. What do you look forward to the most during your day?", pageIndex: 7, x: 490, y: 382, w: 165, h: 90, rows: 4 },
  { key: "q6", label: "6. What makes you lose track of time?", pageIndex: 7, x: 545, y: 88, w: 150, h: 90, rows: 4 },
  { key: "q7", label: "7. Which strengths empower you in your free time?", pageIndex: 7, x: 615, y: 242, w: 145, h: 90, rows: 4 },
  { key: "q8", label: "8. Which strengths come to school when you arrive?", pageIndex: 7, x: 665, y: 382, w: 145, h: 90, rows: 4 },
  { key: "q9", label: "9. Which strengths do you appreciate the most in yourself?", pageIndex: 7, x: 690, y: 78, w: 120, h: 90, rows: 4 },
  { key: "garbage", label: "Garbage list", pageIndex: 8, x: 75, y: 130, w: 670, h: 260, rows: 8 },
  { key: "wishlist", label: "Top list: wishlist", pageIndex: 9, x: 55, y: 295, w: 690, h: 110, rows: 5 },
  { key: "notice", label: "Top list: what do you notice?", pageIndex: 9, x: 55, y: 105, w: 690, h: 125, rows: 5 },
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

    if (line) lines.push(line);
    if (!paragraph.trim()) lines.push("");
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
    const fontSize = 11;
    const lineHeight = 14;

    for (const field of fields) {
      const value = values[field.key]?.trim();
      if (!value) continue;

      const page = pdfDoc.getPage(field.pageIndex);
      const maxChars = Math.max(18, Math.floor(field.w / 5.4));
      const lines = wrapText(value, maxChars);
      const maxLines = Math.floor(field.h / lineHeight);

      lines.slice(0, maxLines).forEach((line, index) => {
        page.drawText(line, {
          x: field.x,
          y: field.y + field.h - 18 - index * lineHeight,
          size: fontSize,
          font,
          color: rgb(0.1, 0.1, 0.1),
          maxWidth: field.w,
        });
      });
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
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
            The original PDF is included in this app. Fill the fields, generate a preview,
            and download the completed PDF.
          </p>
        </div>

        <div style={styles.actions}>
          <a href={PDF_URL} target="_blank" style={styles.secondaryButton}>
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
              opacity: filledPdfUrl ? 1 : 0.45,
              cursor: filledPdfUrl ? "pointer" : "not-allowed",
            }}
          >
            Download filled PDF
          </button>
        </div>
      </section>

      <section style={styles.grid}>
        <aside style={styles.formPanel}>
          <h2 style={styles.panelTitle}>Fill answers</h2>
          <p style={styles.helper}>{answeredCount} of {fields.length} sections filled</p>

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
            <h2 style={styles.panelTitle}>
              {filledPdfUrl ? "Filled PDF preview" : "Original PDF preview"}
            </h2>
            <p style={styles.helper}>{status || "Your PDF preview appears here."}</p>
          </div>

          <iframe
            title="PDF preview"
            src={filledPdfUrl ?? PDF_URL}
            style={styles.iframe}
          />
        </section>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#ffe074",
    color: "#24212a",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
    padding: 24,
  },
  header: {
    maxWidth: 1380,
    margin: "0 auto 24px",
    display: "flex",
    justifyContent: "space-between",
    gap: 20,
    alignItems: "flex-end",
    flexWrap: "wrap",
  },
  eyebrow: {
    color: "#6d56a5",
    fontWeight: 800,
    margin: "0 0 8px",
  },
  title: {
    margin: 0,
    fontSize: 40,
    lineHeight: 1.1,
  },
  subtitle: {
    maxWidth: 650,
    lineHeight: 1.6,
    color: "#4b3e62",
  },
  actions: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
  primaryButton: {
    border: 0,
    borderRadius: 14,
    padding: "12px 16px",
    fontSize: 15,
    fontWeight: 800,
    background: "#7357b7",
    color: "#ffffff",
  },
  secondaryButton: {
    borderRadius: 14,
    padding: "12px 16px",
    fontSize: 15,
    fontWeight: 800,
    background: "#ffffff",
    color: "#7357b7",
    textDecoration: "none",
  },
  grid: {
    maxWidth: 1380,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "minmax(340px, 460px) 1fr",
    gap: 24,
  },
  formPanel: {
    background: "#ffffff",
    borderRadius: 24,
    padding: 22,
    boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
    maxHeight: "calc(100vh - 170px)",
    overflow: "auto",
  },
  previewPanel: {
    background: "#ffffff",
    borderRadius: 24,
    padding: 16,
    boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
    minHeight: 720,
  },
  previewHeader: {
    padding: "4px 6px 12px",
  },
  panelTitle: {
    margin: 0,
    fontSize: 22,
  },
  helper: {
    margin: "6px 0 0",
    color: "#6b6575",
    fontSize: 14,
  },
  fields: {
    display: "grid",
    gap: 16,
    marginTop: 18,
  },
  label: {
    display: "grid",
    gap: 8,
    fontWeight: 800,
    fontSize: 14,
  },
  textarea: {
    border: "1px solid #d8d1e8",
    borderRadius: 14,
    padding: 12,
    fontSize: 15,
    lineHeight: 1.45,
    resize: "vertical",
    fontFamily: "inherit",
  },
  iframe: {
    width: "100%",
    height: "calc(100vh - 235px)",
    minHeight: 650,
    border: "1px solid #ddd7eb",
    borderRadius: 18,
    background: "#f8f6ff",
  },
};