# Strength portfolio visual PDF filler

This app includes the uploaded Strength portfolio PDF and shows it visually in the browser.

Users can:
1. See the original PDF preview.
2. Fill answers in a side form.
3. Generate a filled PDF preview.
4. Download the completed PDF.

## Run locally

```bash
npm install
npm run dev
```

Open:

```bash
http://localhost:3000
```

## Deploy on Vercel

1. Upload this folder to GitHub.
2. Import the GitHub repository into Vercel.
3. Deploy.

## Included file

The PDF is included at:

```bash
public/strength-portfolio.pdf
```

## Important note

This PDF appears visually fillable, but browser PDF libraries do not detect usable AcroForm fields from it. Because of that, this app writes text onto the blank areas using fixed coordinates.# strength-portfolio-visual-filler-app
