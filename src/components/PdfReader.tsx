import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Loader2, RefreshCw, FileText, ExternalLink } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
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

const LazyPdfPage = memo(function LazyPdfPage({
  pageNumber,
  numPages,
  width,
}: {
  pageNumber: number;
  numPages: number;
  width: number;
}) {
  const [isVisible, setIsVisible] = useState(pageNumber <= 2);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (pageNumber <= 2) return;
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "800px 0px 800px 0px", // Preload pages 800px ahead before entering viewport
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [pageNumber]);

  const estimatedHeight = Math.floor(width * 1.414);

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center py-2"
      style={{ minHeight: isVisible ? undefined : estimatedHeight }}
    >
      {isVisible ? (
        <Page
          pageNumber={pageNumber}
          width={width}
          renderAnnotationLayer={false}
          renderTextLayer={false}
          renderMode="canvas"
          loading={
            <div
              style={{ width, height: estimatedHeight }}
              className="flex items-center justify-center rounded-xl bg-secondary/30 text-xs text-muted-foreground animate-pulse"
            >
              Loading page {pageNumber} of {numPages}…
            </div>
          }
        />
      ) : (
        <div
          style={{ width, height: estimatedHeight }}
          className="flex items-center justify-center rounded-xl border border-dashed border-border/40 bg-card/20 text-xs text-muted-foreground/60"
        >
          Page {pageNumber} of {numPages}
        </div>
      )}
    </div>
  );
});

type Props = {
  fileUrl: string;
  driveId?: string | null;
  footer?: React.ReactNode;
  onFail?: () => void;
};

export function PdfReader({ fileUrl, driveId, footer, onFail }: Props) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [width, setWidth] = useState<number>(800);
  const [retryKey, setRetryKey] = useState(0);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [useDriveEmbed, setUseDriveEmbed] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const { t } = useI18n();

  const fileProp = useMemo(() => ({ url: fileUrl }), [fileUrl]);

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

  if (useDriveEmbed && driveId) {
    return (
      <div className="mx-auto max-w-4xl px-2">
        <div
          className="relative h-[85vh] sm:h-[90vh] w-full overflow-hidden rounded-2xl border border-border/60 bg-black shadow-lg select-none"
          onContextMenu={(e) => e.preventDefault()}
        >
          {/* Top header shield: blocks Google Drive pop-out & title bar */}
          <div className="absolute inset-x-0 top-0 z-20 flex h-12 items-center justify-between border-b border-white/10 bg-black/95 px-4 backdrop-blur-md">
            <span className="flex items-center gap-2 text-xs font-semibold text-foreground/90">
              <FileText className="h-4 w-4 text-primary" /> Gravure Photobook Reader
            </span>
          </div>
          <iframe
            src={`https://drive.google.com/file/d/${driveId}/preview`}
            title="PDF Document"
            className="h-full w-full border-0 pt-10"
            sandbox="allow-scripts allow-same-origin allow-forms"
            allow="autoplay"
          />
        </div>
        {footer}
      </div>
    );
  }

  return (
    <div
      ref={wrapRef}
      className="mx-auto max-w-4xl px-2 select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      <Document
        key={retryKey}
        file={fileProp}
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
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border/60 bg-card/40 p-10 text-center">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-destructive">
                Không thể tải trực tiếp PDF trong trình đọc.
              </p>
              <p className="text-xs text-muted-foreground">
                Bạn có thể thử lại hoặc chuyển sang trình xem Google Drive.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground transition hover:border-primary hover:text-primary"
              >
                <RefreshCw className="h-3.5 w-3.5" /> {t("reader.retry")}
              </button>
              {driveId && (
                <button
                  onClick={() => setUseDriveEmbed(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:opacity-90 shadow-glow"
                >
                  <FileText className="h-3.5 w-3.5" /> {t("reader.switchDriveViewer")}
                </button>
              )}
            </div>
          </div>
        }
      >
        {numPages && numPages > 0 && (
          <>
            <div className="h-4" />
            {Array.from({ length: numPages }, (_, i) => (
              <LazyPdfPage
                key={i + 1}
                pageNumber={i + 1}
                numPages={numPages}
                width={width}
              />
            ))}
            {footer}
          </>
        )}
      </Document>
    </div>
  );
}
