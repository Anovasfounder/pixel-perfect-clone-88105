import { MessageCircle } from "lucide-react";

// Update this number to your WhatsApp business number (with country code, no +).
const WHATSAPP_NUMBER = "919265743274";
const PREFILLED = encodeURIComponent("Hi BundleByte! I'd like to know more about your products.");

export function WhatsAppButton() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${PREFILLED}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label="Chat on WhatsApp"
      className="fixed z-50 right-4 bottom-4 sm:right-6 sm:bottom-6 group"
    >
      <span className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center">
        {/* Pulse rings */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
        <span
          className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40 animate-ping"
          style={{ animationDelay: "0.6s" }}
        />
        {/* Icon */}
        <span className="relative inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-[0_10px_30px_-8px_rgba(16,185,129,0.6)] ring-2 ring-white/80 group-hover:scale-105 transition-transform">
          <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7 fill-white" />
        </span>
      </span>
    </a>
  );
}
