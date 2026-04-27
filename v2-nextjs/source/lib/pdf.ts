type ExportPdfOptions = {
  containerId?: string;
  title?: string;
};

async function waitForPrintWindow(printWindow: Window) {
  await new Promise<void>((resolve) => {
    const finish = () => resolve();
    if (printWindow.document.readyState === 'complete') {
      finish();
      return;
    }

    printWindow.addEventListener('load', () => finish(), { once: true });
    window.setTimeout(() => finish(), 800);
  });

  if ('fonts' in printWindow.document && printWindow.document.fonts) {
    try {
      await printWindow.document.fonts.ready;
    } catch {
      // ignore font-load failure and continue with layout fitting
    }
  }

  await new Promise<void>((resolve) => {
    printWindow.requestAnimationFrame(() => {
      printWindow.requestAnimationFrame(() => resolve());
    });
  });
}

function fitPrintPages(doc: Document) {
  const fitBoxes = Array.from(doc.querySelectorAll<HTMLElement>('.pdf-export-fit-box'));

  fitBoxes.forEach((fitBox) => {
    const content = fitBox.querySelector<HTMLElement>('.pdf-export-content');
    if (!content) {
      return;
    }

    content.style.transform = 'scale(1)';
    content.style.width = '100%';

    const availableWidth = fitBox.clientWidth;
    const availableHeight = fitBox.clientHeight;
    const naturalWidth = content.scrollWidth;
    const naturalHeight = content.scrollHeight;

    if (!availableWidth || !availableHeight || !naturalWidth || !naturalHeight) {
      return;
    }

    const maxScale = Number.parseFloat(content.dataset.pdfMaxScale ?? '1');
    const scale = Math.min(
      Number.isFinite(maxScale) ? maxScale : 1,
      availableWidth / naturalWidth,
      availableHeight / naturalHeight,
    );
    content.style.transform = `scale(${scale})`;
    content.style.width = `${100 / scale}%`;
  });
}

function collectDocumentStyles() {
  return Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map((node) => node.outerHTML)
    .join('\n');
}

function createPrintFrame(html: string) {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.tabIndex = -1;
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.opacity = '0';
  iframe.style.pointerEvents = 'none';

  document.body.appendChild(iframe);

  const printWindow = iframe.contentWindow;
  if (!printWindow) {
    iframe.remove();
    throw new Error('Failed to create the print frame');
  }

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  return { iframe, printWindow };
}

export async function exportToPdf(options: ExportPdfOptions = {}) {
  const { containerId = 'pdf-export-root', title = 'Rorschach Structural Summary' } = options;
  const container = document.getElementById(containerId);

  if (!container) {
    throw new Error('PDF export container not found');
  }

  const pageMarkup = container.innerHTML.trim();
  if (!pageMarkup) {
    throw new Error('No printable PDF pages available');
  }

  const styles = collectDocumentStyles();
  const html = `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${title}</title>
        ${styles}
        <style>
          @page {
            size: A4 portrait;
            margin: 2mm;
          }

          html, body {
            background: #ffffff;
            color: #0f172a;
            width: 210mm;
            min-height: 297mm;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          body {
            margin: 0;
            font-family: "Segoe UI", Arial, sans-serif;
          }

          .pdf-print-root {
            width: 204mm;
            margin: 0 auto;
          }

          .pdf-print-root,
          .pdf-print-root * {
            box-sizing: border-box;
          }

          [data-pdf-page="true"] {
            width: 204mm !important;
            height: 291mm;
            min-height: 291mm;
            max-height: 291mm;
            display: grid;
            grid-template-rows: 145mm 145mm;
            gap: 1mm;
            overflow: hidden;
            break-after: page;
            page-break-after: always;
            break-inside: avoid;
            page-break-inside: avoid;
          }

          [data-pdf-page="true"]:last-child {
            break-after: auto;
            page-break-after: auto;
          }

          .pdf-export-page--first {
            grid-template-rows: 166mm 124mm !important;
          }

          .pdf-export-page--second {
            grid-template-rows: 139mm 150mm !important;
          }

          .pdf-export-half {
            height: 145mm;
            min-height: 145mm;
            max-height: 145mm;
            overflow: hidden !important;
            display: flex;
            flex-direction: column;
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .pdf-export-page--first .pdf-export-half:first-child {
            height: 166mm;
            min-height: 166mm;
            max-height: 166mm;
          }

          .pdf-export-page--first .pdf-export-half:last-child {
            height: 124mm;
            min-height: 124mm;
            max-height: 124mm;
          }

          .pdf-export-page--second .pdf-export-half:first-child {
            height: 139mm;
            min-height: 139mm;
            max-height: 139mm;
          }

          .pdf-export-page--second .pdf-export-half:last-child {
            height: 150mm;
            min-height: 150mm;
            max-height: 150mm;
          }

          .pdf-export-half--titled .pdf-export-half-label {
            flex: 0 0 10mm;
            min-height: 10mm;
            padding: 3mm 2.6mm 2mm;
            display: flex;
            align-items: flex-end;
            justify-content: flex-start;
            pointer-events: none;
          }

          .pdf-section-title {
            font-family: "Segoe UI", Arial, sans-serif;
            font-size: 14px !important;
            line-height: 1.1 !important;
            font-weight: 600 !important;
            letter-spacing: 0 !important;
            color: #1e293b !important;
            text-transform: none !important;
          }

          .pdf-export-fit-box {
            flex: 1 1 auto;
            min-height: 0;
            overflow: hidden !important;
          }

          .pdf-export-fit-box > .pdf-export-content {
            width: 100% !important;
            min-height: 0;
            transform-origin: top left;
            will-change: transform;
          }

          .pdf-export-content--lower #Lower_Section {
            grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
            gap: 6px !important;
          }

          .pdf-export-content--special #Special_Indices {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
            gap: 6px !important;
          }

          .pdf-export-content--upper th,
          .pdf-export-content--upper td,
          .pdf-export-content--lower th,
          .pdf-export-content--lower td,
          .pdf-export-content--special th,
          .pdf-export-content--special td {
            line-height: 1.2 !important;
          }

          .pdf-export-content--upper #Upper_Section {
            gap: 4px !important;
          }

          .pdf-export-content--upper #Upper_Section > * + * {
            margin-top: 4px !important;
          }

          .pdf-export-content--upper #Upper_Section > .grid {
            gap: 4px !important;
          }

          .pdf-export-content--upper #Upper_Section h3 {
            padding-top: 4px !important;
            padding-bottom: 4px !important;
            font-size: 10px !important;
          }

          .pdf-export-content--upper #Upper_Section th,
          .pdf-export-content--upper #Upper_Section td {
            padding: 2px 3px !important;
            font-size: 9px !important;
            line-height: 1.1 !important;
          }

          .pdf-export-content--responses .pdf-response-title {
            margin: 0 0 3mm 0 !important;
          }

          .pdf-export-content--responses .pdf-response-list {
            margin-top: 0 !important;
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 2.4mm !important;
            align-content: start !important;
          }

          .pdf-export-content--responses .pdf-response-item {
            padding: 2.2mm !important;
            border-radius: 2.5mm !important;
            break-inside: avoid;
            page-break-inside: avoid;
            min-height: 0 !important;
          }

          .pdf-export-content--responses .pdf-response-card-label {
            font-size: 8px !important;
            line-height: 1.2 !important;
          }

          .pdf-export-content--responses .pdf-response-card-list {
            margin: 1mm 0 0 !important;
            padding: 0 !important;
            list-style: none !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 0.8mm !important;
          }

          .pdf-export-content--responses .pdf-response-card-entry {
            margin: 0 !important;
            padding: 0 !important;
            list-style: none !important;
            line-height: 1.15 !important;
          }

          .pdf-export-content--responses .pdf-response-entry-divider {
            height: 1px !important;
            margin: 2.2mm 2mm !important;
            background: #dbe4ef !important;
            border: 0 !important;
            border-radius: 999px !important;
          }

          .pdf-export-content--responses .pdf-response-card-text {
            font-size: 9px !important;
            line-height: 1.15 !important;
            display: block !important;
          }

          .pdf-export-content--responses .pdf-response-card-empty {
            min-height: 8mm !important;
          }

          .pdf-export-content--responses .pdf-response-empty {
            margin-top: 0 !important;
            font-size: 10px !important;
          }
        </style>
      </head>
      <body>
        <div class="pdf-print-root">${pageMarkup}</div>
      </body>
    </html>
  `;

  const { iframe, printWindow } = createPrintFrame(html);

  await waitForPrintWindow(printWindow);
  fitPrintPages(printWindow.document);

  await new Promise<void>((resolve) => {
    printWindow.requestAnimationFrame(() => resolve());
  });

  let cleaned = false;
  const cleanup = () => {
    if (cleaned) {
      return;
    }
    cleaned = true;
    iframe.remove();
    window.focus();
  };

  const cleanupTimer = window.setTimeout(cleanup, 60_000);
  printWindow.addEventListener(
    'afterprint',
    () => {
      window.clearTimeout(cleanupTimer);
      cleanup();
    },
    { once: true },
  );

  printWindow.focus();
  printWindow.print();
}
