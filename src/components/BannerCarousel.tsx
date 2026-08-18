// components/BannerCarousel.tsx
import { useRef } from "react";

interface Banner {
  title: string;
  subtitle: string;
  imageSrc: string;
  onClick?: () => void;
}

interface BannerCarouselProps {
  banners: Banner[];
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
 <button
  key={i}
  onClick={banner.onClick}
  className="group relative h-40 w-[85%] flex-shrink-0 snap-center rounded-2xl overflow-hidden shadow-sm transition-all duration-300 active:scale-[0.98] text-left"
  style={{ WebkitTransform: "translateZ(0)", transform: "translateZ(0)" }}
>
  <img
    src={banner.imageSrc}
    alt={banner.title}
    loading="eager"
    decoding="async"
    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
    style={{ WebkitBackfaceVisibility: "hidden", backfaceVisibility: "hidden" }}
    onError={(e) => console.warn("banner img failed:", banner.imageSrc, e)}
  />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F1E3D]/90 via-[#0F1E3D]/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="font-bold text-white text-base leading-snug drop-shadow-sm">{banner.title}</p>
              <p className="text-white/80 text-xs mt-0.5">{banner.subtitle}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}