module.exports = [
"[project]/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/pdf-lib/es/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$PDFDocument$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PDFDocument$3e$__ = __turbopack_context__.i("[project]/node_modules/pdf-lib/es/api/PDFDocument.js [app-ssr] (ecmascript) <export default as PDFDocument>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$colors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/pdf-lib/es/api/colors.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$StandardFonts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/pdf-lib/es/api/StandardFonts.js [app-ssr] (ecmascript)");
"use client";
;
;
;
const PDF_URL = "/strength-portfolio.pdf";
const fields = [
    {
        key: "q1",
        label: "1. What makes you excited?",
        pageIndex: 7,
        x: 95,
        y: 312,
        w: 165,
        h: 90,
        rows: 4
    },
    {
        key: "q2",
        label: "2. What feels easy to do?",
        pageIndex: 7,
        x: 65,
        y: 80,
        w: 155,
        h: 95,
        rows: 4
    },
    {
        key: "q3",
        label: "3. For which character strengths do you receive praise and feedback from others?",
        pageIndex: 7,
        x: 270,
        y: 78,
        w: 165,
        h: 90,
        rows: 4
    },
    {
        key: "q4",
        label: "4. What do you love doing in your free time?",
        pageIndex: 7,
        x: 315,
        y: 268,
        w: 150,
        h: 90,
        rows: 4
    },
    {
        key: "q5",
        label: "5. What do you look forward to the most during your day?",
        pageIndex: 7,
        x: 490,
        y: 382,
        w: 165,
        h: 90,
        rows: 4
    },
    {
        key: "q6",
        label: "6. What makes you lose track of time?",
        pageIndex: 7,
        x: 545,
        y: 88,
        w: 150,
        h: 90,
        rows: 4
    },
    {
        key: "q7",
        label: "7. Which strengths empower you in your free time?",
        pageIndex: 7,
        x: 615,
        y: 242,
        w: 145,
        h: 90,
        rows: 4
    },
    {
        key: "q8",
        label: "8. Which strengths come to school when you arrive?",
        pageIndex: 7,
        x: 665,
        y: 382,
        w: 145,
        h: 90,
        rows: 4
    },
    {
        key: "q9",
        label: "9. Which strengths do you appreciate the most in yourself?",
        pageIndex: 7,
        x: 690,
        y: 78,
        w: 120,
        h: 90,
        rows: 4
    },
    {
        key: "garbage",
        label: "Garbage list",
        pageIndex: 8,
        x: 75,
        y: 130,
        w: 670,
        h: 260,
        rows: 8
    },
    {
        key: "wishlist",
        label: "Top list: wishlist",
        pageIndex: 9,
        x: 55,
        y: 295,
        w: 690,
        h: 110,
        rows: 5
    },
    {
        key: "notice",
        label: "Top list: what do you notice?",
        pageIndex: 9,
        x: 55,
        y: 105,
        w: 690,
        h: 125,
        rows: 5
    }
];
function wrapText(text, maxChars) {
    const lines = [];
    for (const paragraph of text.split("\n")){
        const words = paragraph.split(/\s+/).filter(Boolean);
        let line = "";
        for (const word of words){
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
function Home() {
    const [values, setValues] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [filledPdfUrl, setFilledPdfUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const answeredCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>Object.values(values).filter((value)=>value.trim()).length, [
        values
    ]);
    function updateField(key, value) {
        setValues((current)=>({
                ...current,
                [key]: value
            }));
    }
    async function createFilledPdf() {
        setStatus("Creating your filled PDF...");
        if (filledPdfUrl) {
            URL.revokeObjectURL(filledPdfUrl);
            setFilledPdfUrl(null);
        }
        const existingPdfBytes = await fetch(PDF_URL).then((res)=>res.arrayBuffer());
        const pdfDoc = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$PDFDocument$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PDFDocument$3e$__["PDFDocument"].load(existingPdfBytes);
        const font = await pdfDoc.embedFont(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$StandardFonts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StandardFonts"].Helvetica);
        const fontSize = 11;
        const lineHeight = 14;
        for (const field of fields){
            const value = values[field.key]?.trim();
            if (!value) continue;
            const page = pdfDoc.getPage(field.pageIndex);
            const maxChars = Math.max(18, Math.floor(field.w / 5.4));
            const lines = wrapText(value, maxChars);
            const maxLines = Math.floor(field.h / lineHeight);
            lines.slice(0, maxLines).forEach((line, index)=>{
                page.drawText(line, {
                    x: field.x,
                    y: field.y + field.h - 18 - index * lineHeight,
                    size: fontSize,
                    font,
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$colors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rgb"])(0.1, 0.1, 0.1),
                    maxWidth: field.w
                });
            });
        }
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([
            pdfBytes
        ], {
            type: "application/pdf"
        });
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        style: styles.page,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                style: styles.header,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: styles.eyebrow,
                                children: "See the Good!"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 130,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                style: styles.title,
                                children: "Strength portfolio PDF filler"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 131,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: styles.subtitle,
                                children: "The original PDF is included in this app. Fill the fields, generate a preview, and download the completed PDF."
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 132,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 129,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: styles.actions,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: PDF_URL,
                                target: "_blank",
                                style: styles.secondaryButton,
                                children: "Open original PDF"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 139,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: createFilledPdf,
                                style: styles.primaryButton,
                                children: "Generate filled PDF"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 142,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: downloadFilledPdf,
                                disabled: !filledPdfUrl,
                                style: {
                                    ...styles.primaryButton,
                                    opacity: filledPdfUrl ? 1 : 0.45,
                                    cursor: filledPdfUrl ? "pointer" : "not-allowed"
                                },
                                children: "Download filled PDF"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 145,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 138,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 128,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                style: styles.grid,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        style: styles.formPanel,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                style: styles.panelTitle,
                                children: "Fill answers"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 161,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: styles.helper,
                                children: [
                                    answeredCount,
                                    " of ",
                                    fields.length,
                                    " sections filled"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 162,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: styles.fields,
                                children: fields.map((field)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        style: styles.label,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: field.label
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 167,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                rows: field.rows,
                                                value: values[field.key] ?? "",
                                                onChange: (event)=>updateField(field.key, event.target.value),
                                                style: styles.textarea,
                                                placeholder: "Type your answer here"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 168,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, field.key, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 166,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 164,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 160,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        style: styles.previewPanel,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: styles.previewHeader,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        style: styles.panelTitle,
                                        children: filledPdfUrl ? "Filled PDF preview" : "Original PDF preview"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 182,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: styles.helper,
                                        children: status || "Your PDF preview appears here."
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 185,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 181,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("iframe", {
                                title: "PDF preview",
                                src: filledPdfUrl ?? PDF_URL,
                                style: styles.iframe
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 188,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 180,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 159,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 127,
        columnNumber: 5
    }, this);
}
const styles = {
    page: {
        minHeight: "100vh",
        background: "#ffe074",
        color: "#24212a",
        fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        padding: 24
    },
    header: {
        maxWidth: 1380,
        margin: "0 auto 24px",
        display: "flex",
        justifyContent: "space-between",
        gap: 20,
        alignItems: "flex-end",
        flexWrap: "wrap"
    },
    eyebrow: {
        color: "#6d56a5",
        fontWeight: 800,
        margin: "0 0 8px"
    },
    title: {
        margin: 0,
        fontSize: 40,
        lineHeight: 1.1
    },
    subtitle: {
        maxWidth: 650,
        lineHeight: 1.6,
        color: "#4b3e62"
    },
    actions: {
        display: "flex",
        gap: 10,
        flexWrap: "wrap"
    },
    primaryButton: {
        border: 0,
        borderRadius: 14,
        padding: "12px 16px",
        fontSize: 15,
        fontWeight: 800,
        background: "#7357b7",
        color: "#ffffff"
    },
    secondaryButton: {
        borderRadius: 14,
        padding: "12px 16px",
        fontSize: 15,
        fontWeight: 800,
        background: "#ffffff",
        color: "#7357b7",
        textDecoration: "none"
    },
    grid: {
        maxWidth: 1380,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "minmax(340px, 460px) 1fr",
        gap: 24
    },
    formPanel: {
        background: "#ffffff",
        borderRadius: 24,
        padding: 22,
        boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
        maxHeight: "calc(100vh - 170px)",
        overflow: "auto"
    },
    previewPanel: {
        background: "#ffffff",
        borderRadius: 24,
        padding: 16,
        boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
        minHeight: 720
    },
    previewHeader: {
        padding: "4px 6px 12px"
    },
    panelTitle: {
        margin: 0,
        fontSize: 22
    },
    helper: {
        margin: "6px 0 0",
        color: "#6b6575",
        fontSize: 14
    },
    fields: {
        display: "grid",
        gap: 16,
        marginTop: 18
    },
    label: {
        display: "grid",
        gap: 8,
        fontWeight: 800,
        fontSize: 14
    },
    textarea: {
        border: "1px solid #d8d1e8",
        borderRadius: 14,
        padding: 12,
        fontSize: 15,
        lineHeight: 1.45,
        resize: "vertical",
        fontFamily: "inherit"
    },
    iframe: {
        width: "100%",
        height: "calc(100vh - 235px)",
        minHeight: 650,
        border: "1px solid #ddd7eb",
        borderRadius: 18,
        background: "#f8f6ff"
    }
};
}),
];

//# sourceMappingURL=app_page_tsx_0es_sk2._.js.map