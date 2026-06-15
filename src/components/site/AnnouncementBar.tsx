import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const ANNOUNCEMENTS = [
  "✨ Free instant delivery on all digital keys — worldwide",
  "🔥 Flash sale: Up to 60% OFF on premium software keys",
  "🎮 New game keys added daily — check the trending section",
  "💎 Premium subscriptions starting at just ₹399",
];

export function AnnouncementBar() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % ANNOUNCEMENTS.length), 4000);
    return () => clearInterval(t);
  }, []);
  const prev = () => setI((p) => (p - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length);
  const next = () => setI((p) => (p + 1) % ANNOUNCEMENTS.length);
  return (
    <div className="w-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 text-white text-[12px] py-2 px-4 flex items-center justify-center gap-3 relative overflow-hidden">
      <Sparkles className="w-3.5 h-3.5 animate-pulse hidden sm:block" />
      <button onClick={prev} aria-label="Previous" className="hover:bg-white/15 rounded-full p-0.5 transition">
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>
      <div className="overflow-hidden h-4 min-w-[240px] md:min-w-[420px] text-center">
        <div className="transition-transform duration-500 ease-out" style={{ transform: `translateY(-${i * 16}px)` }}>
          {ANNOUNCEMENTS.map((a, k) => (
            <div key={k} className="h-4 leading-4 whitespace-nowrap font-medium tracking-wide">{a}</div>
          ))}
        </div>
      </div>
      <button onClick={next} aria-label="Next" className="hover:bg-white/15 rounded-full p-0.5 transition">
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
