"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
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

type Role = "user" | "admin";

const PDF_URL = "/strength-portfolio.pdf";
const ADMIN_TOKEN_STORAGE_KEY = "strengthPortfolioAdminJwt";
const PDF_LOAD_TIMEOUT_MS = 8000;
const PDF_PAGE_WIDTH = 612;
const PDF_PAGE_HEIGHT = 792;
const PDF_RENDER_SCALE = 1.35;
const DEFAULT_PAGE = 1;
const PRESET_TEXT_BOXES: TextBox[] = [
  { id: "p8-q1", pageIndex: 7, x: 0.105, y: 0.390, w: 0.185, h: 0.090, text: "" },
  { id: "p8-q2", pageIndex: 7, x: 0.115, y: 0.790, w: 0.185, h: 0.095, text: "" },
  { id: "p8-q3", pageIndex: 7, x: 0.325, y: 0.815, w: 0.185, h: 0.080, text: "" },
  { id: "p8-q4", pageIndex: 7, x: 0.365, y: 0.530, w: 0.185, h: 0.080, text: "" },
  { id: "p8-q5", pageIndex: 7, x: 0.525, y: 0.275, w: 0.155, h: 0.080, text: "" },
  { id: "p8-q6", pageIndex: 7, x: 0.575, y: 0.815, w: 0.170, h: 0.080, text: "" },
  { id: "p8-q7", pageIndex: 7, x: 0.715, y: 0.625, w: 0.175, h: 0.090, text: "" },
  { id: "p8-q8", pageIndex: 7, x: 0.735, y: 0.285, w: 0.160, h: 0.080, text: "" },
  { id: "p8-q9", pageIndex: 7, x: 0.785, y: 0.820, w: 0.165, h: 0.080, text: "" },
  { id: "p9-main", pageIndex: 8, x: 0.215, y: 0.420, w: 0.520, h: 0.250, text: "" },
  { id: "p10-wishlist", pageIndex: 9, x: 0.120, y: 0.305, w: 0.620, h: 0.235, text: "" },
  { id: "p10-notice", pageIndex: 9, x: 0.120, y: 0.620, w: 0.620, h: 0.245, text: "" },
];

function encodeBase64Url(value: string) {
  return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  return atob(padded);
}

function createDemoAdminJwt() {
  const header = encodeBase64Url(JSON.stringify({ alg: "none", typ: "JWT" }));
  const payload = encodeBase64Url(
    JSON.stringify({
      role: "admin",
      name: "Admin Editor",
      iat: Math.floor(Date.now() / 1000),
    })
  );

  return `${header}.${payload}.`;
}

function getRoleFromJwt(token: string | null): Role {
  if (!token) return "user";

  try {
    const payload = JSON.parse(decodeBase64Url(token.split(".")[1] || ""));
    return payload.role === "admin" ? "admin" : "user";
  } catch {
    return "user";
  }
}

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
  const [role, setRole] = useState<Role>("user");
  const [jwtToken, setJwtToken] = useState("");
  const [selectedTextBoxId, setSelectedTextBoxId] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(DEFAULT_PAGE);
  const [pageCount, setPageCount] = useState(12);
  const [renderSize, setRenderSize] = useState({
    width: PDF_PAGE_WIDTH * PDF_RENDER_SCALE,
    height: PDF_PAGE_HEIGHT * PDF_RENDER_SCALE,
  });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textBoxRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});
  const dragRef = useRef<DragState | null>(null);

  const isAdminMode = role === "admin";
  const filledCount = useMemo(() => textBoxes.filter((box) => box.text.trim()).length, [textBoxes]);
  const currentPageBoxes = useMemo(
    () =>
      textBoxes
        .filter((box) => box.pageIndex === pageNumber - 1)
        .map(({ id, pageIndex, x, y, w, h }) => ({
          id,
          pageIndex,
          x: Number(x.toFixed(3)),
          y: Number(y.toFixed(3)),
          w: Number(w.toFixed(3)),
          h: Number(h.toFixed(3)),
          text: "",
        })),
    [pageNumber, textBoxes]
  );

  function updateTextBox(id: string, text: string) {
    setTextBoxes((current) => current.map((box) => (box.id === id ? { ...box, text } : box)));
  }

  function addTextBox() {
    const id = `p${pageNumber}-custom-${Date.now()}`;
    const nextBox: TextBox = {
      id,
      pageIndex: pageNumber - 1,
      x: 0.22,
      y: 0.34,
      w: 0.34,
      h: 0.12,
      text: "",
    };

    setTextBoxes((current) => [...current, nextBox]);
    setSelectedTextBoxId(id);
    setStatus(`Added text box on page ${pageNumber}.`);
  }

  function deleteSelectedTextBox() {
    if (!selectedTextBoxId) {
      setStatus("Select a text box first, then delete it.");
      return;
    }

    setTextBoxes((current) => current.filter((box) => box.id !== selectedTextBoxId));
    setSelectedTextBoxId(null);
    setStatus("Deleted selected text box.");
  }

  function syncTextBoxSize(id: string) {
    const element = textBoxRefs.current[id];
    if (!element || !isAdminMode) return;

    setTextBoxes((current) =>
      current.map((box) =>
        box.id === id
          ? {
              ...box,
              w: Math.max(0.04, element.offsetWidth / renderSize.width),
              h: Math.max(0.04, element.offsetHeight / renderSize.height),
            }
          : box
      )
    );
  }

  function startDragging(event: MouseEvent<HTMLElement>, box: TextBox) {
    if (!isAdminMode) return;

    syncTextBoxSize(box.id);
    setSelectedTextBoxId(box.id);
    dragRef.current = {
      id: box.id,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startX: box.x,
      startY: box.y,
    };
  }

  async function copyCurrentPageBoxes() {
    const json = JSON.stringify(currentPageBoxes, null, 2);
    await navigator.clipboard.writeText(json);
    setStatus(`Copied ${currentPageBoxes.length} boxes from page ${pageNumber}.`);
  }

  function exitAdminMode() {
    window.localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
    setJwtToken("");
    setRole("user");
    setSelectedTextBoxId(null);
    setStatus("Switched back to user role.");
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let token = params.get("token") || window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) || "";

    if (params.get("admin") === "1" && !token) {
      token = createDemoAdminJwt();
    }

    const nextRole = getRoleFromJwt(token);
    setJwtToken(token);
    setRole(nextRole);

    if (token) {
      window.localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token);
    }
    if (nextRole === "admin" && !params.get("page")) {
      setPageNumber(8);
    }
    if (params.get("page")) {
      setPageNumber(Math.max(1, Number(params.get("page")) || DEFAULT_PAGE));
    }
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
  }, [renderSize.height, renderSize.width]);

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
          {isAdminMode && (
            <>
              <span style={styles.roleBadge}>JWT role: admin</span>
              <button onClick={exitAdminMode} style={styles.secondaryButton}>
                Exit admin
              </button>
            </>
          )}
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
                  ? `Admin editor: drag boxes to move, resize from the corner. ${currentPageBoxes.length} boxes on this page.`
                  : `${filledCount} fields filled. Fill the prepared areas on pages 8, 9, and 10.`)}
            </p>
          </div>
          <div style={styles.pdfScroller}>
            <div
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
                  <Fragment key={box.id}>
                  <textarea
                    ref={(element) => {
                      textBoxRefs.current[box.id] = element;
                    }}
                    value={box.text}
                    onFocus={() => setSelectedTextBoxId(box.id)}
                    onBlur={() => syncTextBoxSize(box.id)}
                    onMouseUp={() => syncTextBoxSize(box.id)}
                    onChange={(event) => updateTextBox(box.id, event.target.value)}
                    placeholder=""
                    style={{
                      ...styles.overlayField,
                      ...(isAdminMode ? styles.adminOverlayField : {}),
                      ...(selectedTextBoxId === box.id && isAdminMode ? styles.selectedOverlayField :