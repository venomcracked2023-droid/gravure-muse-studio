import { useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Loader2, RefreshCw } from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configure PDF.js worker with bundled asset URL
if (typeof window !== "undefined") {
  try {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();
  } catch {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
  }
}

type Props = { fileUrl: string; Footer: React.ComponentType; onFail?: () => void };

export function PdfReader({ fileUrl, Footer, onFail }: Props) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [width, setWidth] = useState<number>(800);
  const [retryKey, setRetryKey] = useState(0);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const documentOptions = useMemo(
    () => ({
      cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
      cMapPacked: true,
      standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
    }),
    []
  );

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setWidth(Math.min(el.clientWidth || 800, 1200));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleRetry = () => {
    setErrorOccurred(false);
    setRetryKey((k) => k + 1);
  };

  return (
    <div ref={wrapRef} className="mx-auto max-w-3xl px-2">
      <Document
        key={retryKey}
        file={fileUrl}
        options={documentOptions}
        onLoadSuccess={({ numPages }) => {
          setNumPages(numPages);
          setErrorOccurred(false);
        }}
        onLoadError={(err) => {
          console.error("PDF load error:", err);
          setErrorOccurred(true);
          onFail?.();
        }}
        loading={
          <div className="flex flex-col items-center justify-center gap-3 p-16 text-center text-muted-foreground">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
            <span className="text-sm font-medium">Loading high-resolution photobook…</span>
          </div>
        }
        error={
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border/60 bg-card/40 p-12 text-center">
            <p className="text-sm text-destructive">Failed to load PDF photobook.</p>
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground transition hover:border-primary hover:text-primary"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Try Again
            </button>
          </div>
        }
      >
        {numPages && numPages > 0 && (
          <>
            <div className="h-8" />
            {Array.from({ length: numPages }, (_, i) => (
              <div key={i} className="flex flex-col items-center justify-center py-2">
                <Page
                  pageNumber={i + 1}
                  width={width}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  renderMode="canvas"
                  loading={
                    <div
                      style={{ width, height: width * 1.4 }}
                      className="flex items-center justify-center rounded-lg bg-secondary/30 text-xs text-muted-foreground animate-pulse"
                    >
                      Loading page {i + 1} of {numPages}…
                    </div>
                  }
                />
              </div>
            ))}
            <Footer />
          </>
        )}
      </Document>
    </div>
  );
}
