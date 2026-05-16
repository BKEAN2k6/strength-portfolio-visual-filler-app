"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent } from "react";

type TextBox = {
  id: string;
  pageIndex: number;
  x: number;
  y: number;
  w: number;
  h: number;
  text: string;
};

type DragState = {
  id: string;
  startClientX: number;
  startClientY: number;
  startX: number;
  startY: number;
};

const PDF_URL = "/strength-portfolio.pdf";
const PDF_LOAD_TIMEOUT_MS = 8000;
const PDF_PAGE_WIDTH = 612;
const PDF_PAGE_HEIGHT = 792;
const PDF_RENDER_SCALE = 1.35;
const DEFAULT_PAGE = 1;
const PRESET_TEXT_BOXES: TextBox[] = [
  { id: "p8-q1", pageIndex: 7, x: 0.17, y: 0.28, w: 0.20, h: 0.12, text: "" },
  { id: "p8-q2", pageIndex: 7, x: 0.18, y: 0.65, w: 0.21, h: 0.12, text: "" },
  { id: "p8-q3", pageIndex: 7, x: 0.37, y: 0.65, w: 0.22, h: 0.12, text: "" },
  { id: "p8-q4", pageIndex: 7, x: 0.38, y: 0.39, w: 0.22, h: 0.12, text: "" },
  { id: "p8-q5", pageIndex: 7, x: 0.62, y: 0.08, w: 0.18, h: 0.12, text: "" },
  { id: "p8-q6", pageIndex: 7, x: 0.56, y: 0.65, w: 0.20, h: 0.12, text: "" },
  { id: "p8-q7", pageIndex: 7, x: 0.68, y: 0.39, w: 0.21, h: 0.12, text: "" },
  { id: "p8-q8", pageIndex: 7, x: 0.78, y: 0.08, w: 0.18, h: 0.12, text: "" },
  { id: "p8-q9", pageIndex: 7, x: 0.76, y: 0.65, w: 0.20, h: 0.12, text: "" },
  { id: "p9-q1", pageIndex: 8, x: 0.14, y: 0.20, w: 0.30, h: 0.12, text: "" },
  { id: "p9-q2", pageIndex: 8, x: 0.56, y: 0.20, w: 0.30, h: 0.12, text: "" },
  { id: "p9-q3", pageIndex: 8, x: 0.14, y: 0.42, w: 0.30, h: 0.12, text: "" },
  { id: "p9-q4", pageIndex: 8, x: 0.56, y: 0.42, w: 0.30, h: 0.12, text: "" },
  { id: "p9-q5", pageIndex: 8, x: 0.14, y: 0.64, w: 0.30, h: 0.12, text: "" },
  { id: "p9-q6", pageIndex: 8, x: 0.56, y: 0.64, w: 0.30, h: 0.12, text: "" },
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

function withTimeout<T>(promise: Promise<T>, message: string) {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      window.setTimeout(() => reject(new Error(message)), PDF_LOAD_TIMEOUT_MS);
    }),
  ]);
}

export default function Home() {
  const [textBoxes, setTextBoxes] = useState<TextBox[]>(PRESET_TEXT_BOXES);
  const [filledPdfUrl, setFilledPdfUrl] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [pageNumber, setPageNumber] = useState(DEFAULT_PAGE);
  const [pageCount, setPageCount] = useState(12);
  const [selectedTextBoxId, setSelectedTextBoxId] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState({ width: PDF_PAGE_WIDTH, height: PDF_PAGE_HEIGHT });
  const [renderSize, setRenderSize] = useState({
    width: PDF_PAGE_WIDTH * PDF_RENDER_SCALE,
    height: PDF_PAGE_HEIGHT * PDF_RENDER_SCALE,
  });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dragRef = useRef<DragState | null>(null);

  const filledCount = useMemo(() => textBoxes.filter((box) => box.text.trim()).length, [textBoxes]);

  function updateTextBox(id: string, text: string) {
    setTextBoxes((current) => current.map((box) => (box.id === id ? { ...box, text } : box)));
  }

  function addTextBox(x = 80, y = 120) {
    const id = crypto.randomUUID();
    setSelectedTextBoxId(id);
    setTextBoxes((current) => [
      ...current,
      {
        id,
        pageIndex: pageNumber - 1,
        x,
        y,
        w: 0.24,
        h: 0.08,
        text: "",
      },
    ]);
  }

  function deleteSelectedTextBox() {
    if (!selectedTextBoxId) return;
    setTextBoxes((current) => current.filter((box) => box.id !== selectedTextBoxId));
    setSelectedTextBoxId(null);
  }

  function startDragging(event: MouseEvent<HTMLTextAreaElement>, box: TextBox) {
    if (!isAdminMode) return;
    setSelectedTextBoxId(box.id);
    dragRef.current = {
      id: box.id,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startX: box.x,
      startY: box.y,
    };
  }

  function addTextBoxAtPoint(event: MouseEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget && event.target !== canvasRef.current) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / renderSize.width));
    const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / renderSize.height));
    addTextBox(x, y);
  }

  useEffect(() => {
    setIsAdminMode(new URLSearchParams(window.location.search).get("admin") === "1");
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function renderPdfPage() {
      try {
        setStatus((current) => current || "Loading PDF...");
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.mjs",
          import.meta.url
        ).toString();

        const pdf = await pdfjs.getDocument(PDF_URL).promise;
        setPageCount(pdf.numPages);
        const page = await pdf.getPage(pageNumber);
        const baseViewport = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({ scale: PDF_RENDER_SCALE });
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        if (!canvas || !context || cancelled) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        setPageSize({ width: baseViewport.width, height: baseViewport.height });
        setRenderSize({ width: viewport.width, height: viewport.height });

        await page.render({ canvasContext: context, viewport }).promise;
        if (!cancelled) setStatus("");
      } catch (error) {
        if (!cancelled) {
          setStatus(error instanceof Error ? error.message : "Could not render the PDF.");
        }
      }
    }

    renderPdfPage();

    return () => {
      cancelled = true;
    };
  }, [pageNumber]);

  useEffect(() => {
    function moveSelectedBox(event: globalThis.MouseEvent) {
      const drag = dragRef.current;
      if (!drag) return;

      const nextX = drag.startX + (event.clientX - drag.startClientX) / renderSize.width;
      const nextY = drag.startY + (event.clientY - drag.startClientY) / renderSize.height;

      setTextBoxes((current) =>
        current.map((box) => {
          if (box.id !== drag.id) return box;

          return {
            ...box,
            x: Math.min(Math.max(0, nextX), Math.max(0, 1 - box.w)),
            y: Math.min(Math.max(0, nextY), Math.max(0, 1 - box.h)),
          };
        })
      );
    }

    function stopDragging() {
      dragRef.current = null;
    }

    window.addEventListener("mousemove", moveSelectedBox);
    window.addEventListener("mouseup", stopDragging);

    return () => {
      window.removeEventListener("mousemove", moveSelectedBox);
      window.removeEventListener("mouseup", stopDragging);
    };
  }, [pageSize.height, pageSize.width, renderSize.height, renderSize.width]);

  async function createFilledPdf() {
    try {
      setStatus("Creating your filled PDF...");
      if (filledPdfUrl) {
        URL.revokeObjectURL(filledPdfUrl);
        setFilledPdfUrl(null);
      }

      const response = await fetch(PDF_URL);
      if (!response.ok) {
        throw new Error(`Cannot load source PDF (${response.status}).`);
      }

      const existingPdfBytes = await response.arrayBuffer();
      if (existingPdfBytes.byteLength === 0) {
        throw new Error("Source PDF is empty. Replace public/strength-portfolio.pdf with the real PDF file.");
      }

      const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
      const pdfDoc = await withTimeout(
        PDFDocument.load(existingPdfBytes, { ignoreEncryption: true }),
        "This PDF takes too long to process. Re-export or compress public/strength-portfolio.pdf, then try again."
      );
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontSize = 12;
      const lineHeight = 16;

      for (const box of textBoxes) {
        const value = box.text.trim();
        if (!value) continue;

        const page = pdfDoc.getPage(box.pageIndex);
        const pageWidth = page.getWidth();
        const pageHeight = page.getHeight();
        const boxX = box.x * pageWidth;
        const boxY = box.y * pageHeight;
        const boxWidth = box.w * pageWidth;
        const boxHeight = box.h * pageHeight;
        const maxChars = Math.max(18, Math.floor(boxWidth / 6));
        const lines = wrapText(value, maxChars);
        const maxLines = Math.floor(boxHeight / lineHeight);

        lines.slice(0, maxLines).forEach((line, index) => {
          page.drawText(line, {
            x: boxX,
            y: pageHeight - boxY - fontSize - index * lineHeight,
            size: fontSize,
            font,
            color: rgb(0.1, 0.1, 0.1),
            maxWidth: boxWidth,
          });
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setFilledPdfUrl(url);
      setStatus("Preview updated. You can now download the filled PDF.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not create the filled PDF.");
    }
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
          {isAdminMode && (
            <>
              <button onClick={() => addTextBox(0.1, 0.12)} style={styles.secondaryButton}>
                Tạo text box
              </button>
              <button
                onClick={deleteSelectedTextBox}
                disabled={!selectedTextBoxId}
                style={{
                  ...styles.secondaryButton,
                  opacity: selectedTextBoxId ? 1 : 0.5,
                  cursor: selectedTextBoxId ? "pointer" : "not-allowed",
                }}
              >
                Xoá text box
              </button>
            </>
          )}
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
        <section style={styles.previewPanel}>
          <div style={styles.previewHeader}>
            <div style={styles.previewTitleRow}>
              <h2 style={styles.panelTitle}>Fill directly on page {pageNumber}</h2>
              <div style={styles.pageControls}>
                <button
                  onClick={() => setPageNumber((page) => Math.max(1, page - 1))}
                  style={styles.smallButton}
                >
                  Prev
                </button>
                <span style={styles.pageBadge}>{pageNumber} / {pageCount}</span>
                <button
                  onClick={() => setPageNumber((page) => Math.min(pageCount, page + 1))}
                  style={styles.smallButton}
                >
                  Next
                </button>
              </div>
            </div>
            <p style={styles.helper}>
              {status ||
                (isAdminMode
                  ? `Admin mode: double-click to add boxes, select and drag to move. ${filledCount} boxes filled.`
                  : `${filledCount} fields filled. Use page 8 and 9 for the prepared fill areas.`)}
            </p>
          </div>
          <div style={styles.pdfScroller}>
            <div
              onDoubleClick={isAdminMode ? addTextBoxAtPoint : undefined}
              style={{
                ...styles.pdfPage,
                width: renderSize.width,
                height: renderSize.height,
              }}
            >
              <canvas ref={canvasRef} style={styles.canvas} />
              {textBoxes
                .filter((box) => box.pageIndex === pageNumber - 1)
                .map((box) => {
                const top = box.y * renderSize.height;
                const left = box.x * renderSize.width;
                const width = box.w * renderSize.width;
                const height = box.h * renderSize.height;

                return (
                  <textarea
                    key={box.id}
                    value={box.text}
                    onMouseDown={(event) => startDragging(event, box)}
                    onFocus={() => setSelectedTextBoxId(box.id)}
                    onClick={() => setSelectedTextBoxId(box.id)}
                    onChange={(event) => updateTextBox(box.id, event.target.value)}
                    placeholder="Type here"
                    style={{
                      ...styles.overlayField,
                      ...(isAdminMode ? styles.adminOverlayField : {}),
                      ...(selectedTextBoxId === box.id ? styles.selectedOverlayField : {}),
                      top,
                      left,
                      width,
                      height,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: 28,
    background: "#f3f4f6",
    fontFamily: "Inter, system-ui, sans-serif",
    color: "#111827",
  },
  header: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 24,
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
    fontSize: 36,
    lineHeight: 1.1,
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
    alignItems: "center",
  },
  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 44,
    padding: "0 16px",
    borderRadius: 8,
    background: "white",
    color: "#111827",
    textDecoration: "none",
    border: "1px solid #d1d5db",
    fontWeight: 600,
  },
  primaryButton: {
    minHeight: 44,
    padding: "0 16px",
    borderRadius: 8,
    background: "#4f46e5",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 24,
    alignItems: "start",
  },
  formPanel: {
    background: "white",
    borderRadius: 14,
    padding: 24,
    boxShadow: "0 24px 50px rgba(15, 23, 42, 0.08)",
  },
  panelTitle: {
    margin: 0,
    fontSize: 22,
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
    minHeight: 110,
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
    background: "white",
    borderRadius: 14,
    padding: 24,
    boxShadow: "0 24px 50px rgba(15, 23, 42, 0.08)",
    display: "flex",
    flexDirection: "column",
  },
  previewHeader: {
    marginBottom: 20,
  },
  previewTitleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    flexWrap: "wrap",
  },
  pageControls: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  smallButton: {
    minHeight: 34,
    padding: "0 12px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    background: "white",
    color: "#111827",
    cursor: "pointer",
    fontWeight: 600,
  },
  pageBadge: {
    minWidth: 58,
    textAlign: "center",
    color: "#374151",
    fontWeight: 600,
  },
  pdfScroller: {
    width: "100%",
    maxHeight: "calc(100vh - 260px)",
    minHeight: 620,
    overflow: "auto",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    background: "#2f3136",
    padding: 24,
  },
  pdfPage: {
    position: "relative",
    margin: "0 auto",
    background: "white",
    boxShadow: "0 14px 36px rgba(0, 0, 0, 0.28)",
  },
  canvas: {
    display: "block",
    width: "100%",
    height: "100%",
  },
  overlayField: {
    position: "absolute",
    padding: 10,
    borderRadius: 6,
    border: "1px solid rgba(79, 70, 229, 0.55)",
    background: "rgba(255, 255, 255, 0.9)",
    color: "#111827",
    fontSize: 14,
    fontFamily: "Inter, system-ui, sans-serif",
    resize: "none",
    boxSizing: "border-box",
    outline: "none",
    cursor: "text",
  },
  adminOverlayField: {
    cursor: "move",
  },
  selectedOverlayField: {
    border: "2px solid #4f46e5",
    boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.18)",
  },
};
