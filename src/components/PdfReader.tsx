import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Virtuoso } from "react-virtuoso";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type Props = { fileUrl: string; Footer: React.ComponentType; onFail?: () => void };

export function PdfReader({ fileUrl, Footer, onFail }: Props) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [width, setWidth] = useState<number>(800);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setWidth(Math.min(el.clientWidth || 800, 1200));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Mobile: render lower resolution + disable on-device caching of all pages.
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const renderScale = isMobile ? 1 : 1.5;

  return (
    <div ref={wrapRef} className="mx-auto max-w-3xl px-2">
      <Document
        file={fileUrl}
        options={{
          // Stream pages instead of downloading whole PDF; lower memory on mobile.
          disableAutoFetch: true,
          disableStream: false,
          cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
          cMapPacked: true,
        }}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        onLoadError={(err) => { console.error("PDF load error", err); onFail?.(); }}
        loading={<div className="p-10 text-center text-muted-foreground">Đang tải PDF…</div>}
        error={<div className="p-10 text-center text-destructive">Không tải được PDF.</div>}>
        {numPages && (
          <Virtuoso
            useWindowScroll
            totalCount={numPages}
            increaseViewportBy={{ top: 800, bottom: 1200 }}
            components={{ Header: () => <div className="h-14" />, Footer }}
            itemContent={(i) => (
              <div className="flex justify-center py-2">
                <Page
                  pageNumber={i + 1}
                  width={width}
                  scale={renderScale}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  loading={<div style={{ width, height: width * 1.4 }} className="bg-secondary/40" />}
                />
              </div>
            )}
          />
        )}
      </Document>
    </div>
  );
}