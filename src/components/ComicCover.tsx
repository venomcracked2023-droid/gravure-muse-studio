import { driveImageUrl, driveImageFallbackUrl } from "@/lib/drive";

export function ComicCover({
  id,
  title,
  alt,
  priority = false,
  className,
}: {
  id?: string;
  title: string;
  alt?: string;
  priority?: boolean;
  className?: string;
}) {
  if (!id) {
    return (
      <div
        className={
          "flex aspect-[3/4] items-center justify-center bg-gradient-to-br from-secondary to-muted text-muted-foreground " +
          (className ?? "")
        }
      >
        <span className="px-3 text-center text-sm font-medium">{title}</span>
      </div>
    );
  }

  const src600 = driveImageUrl(id, 600);
  const src800 = driveImageUrl(id, 800);

  return (
    <img
      src={src600}
      srcSet={`${src600} 400w, ${src800} 800w`}
      sizes="(max-width: 640px) 240px, (max-width: 1024px) 300px, 400px"
      alt={alt || `Gravure model ${title} — profile photo`}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      width={600}
      height={800}
      className={"aspect-[3/4] h-full w-full object-cover " + (className ?? "")}
      onError={(e) => {
        const imgEl = e.currentTarget as HTMLImageElement;
        if (!imgEl.dataset.fallback) {
          imgEl.dataset.fallback = "1";
          imgEl.src = driveImageFallbackUrl(id, 600);
        }
      }}
    />
  );
}
