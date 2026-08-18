// components/BannerCarousel.tsx
import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronRight } from "lucide-react";

interface Banner {
  title: string;
  subtitle: string;
  imageSrc: string;
  onClick?: () => void;
}

interface BannerCarouselProps {
  banners: Banner[];
}

function BannerImage({ src, alt, className, style }: { src: string; alt: string; className?: string; style?: React.CSSProperties }) {
  const [bust, setBust] = useState(0);
  const retriesRef = useRef(0);

  const finalSrc = bust === 0 ? src : `${src}${src.includes("?") ? "&" : "?"}retry=${bust}`;

  const forceReload = useCallback(() => {
    if (retriesRef.current >= 3) return;
    retriesRef.current += 1;
    setBust(Date.now());
  }, []);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        retriesRef.current = 0;
        forceReload();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pageshow", handleVisibility);
    window.addEventListener("focus", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pageshow", handleVisibility);
      window.removeEventListener("focus", handleVisibility);
    };
  }, [forceReload]);

  return (
    <img
      src={finalSrc}
      alt={alt}
      loading="eager"
      decoding="async"
      className={className}
      style={style}
      onLoad={(e) => {
        const img = e.currentTarget;
        if (img.naturalWidth === 0) forceReload();
      }}
      onError={() => forceReload()}
    />
  );
}

export default function BannerCarousel({ banners }: BannerCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="mt-6">
      <h2 className="mb-3 px-6 text-xs font-bold uppercase tracking-wider text-slate-400">Para vos</h2>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto px-6 pb-2 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
      >
        {banners.map((banner, i) => (
          <div
            key={i}
            className="group relative h-40 w-[85%] flex-shrink-0 snap-center rounded-2xl overflow-hidden shadow-sm text-left"
            style={{ WebkitTransform: "translateZ(0)", transform: "translateZ(0)" }}
          >
            <BannerImage
              src={banner.imageSrc}
              alt={banner.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              style={{ WebkitBackfaceVisibility: "hidden", backfaceVisibility: "hidden" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F1E3D]/90 via-[#0F1E3D]/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="font-bold text-white text-base leading-snug drop-shadow-sm">{banner.title}</p>
              <p className="text-white/80 text-xs mt-0.5">{banner.subtitle}</p>
              {banner.onClick && (
                <button
                  onClick={banner.onClick}
                  className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[#0F1E3D] text-xs font-bold shadow-lg active:scale-95 transition"
                >
                  Ver detalle
                  <ChevronRight size={12} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}