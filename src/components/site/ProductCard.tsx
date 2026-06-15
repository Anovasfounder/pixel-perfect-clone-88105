import { Link } from "@tanstack/react-router";
import { ShoppingCart, Plus } from "lucide-react";
import { useBundle } from "./BundleContext";

const PRODUCT_IMG = "https://i.ibb.co/F1zdP7n/Rectangle-207.png";

export type ProductCardData = {
  id: string;
  title: string;
  subtitle: string;
  oldPrice: string;
  price: string;
  image?: string;
};

export const defaultProduct: ProductCardData = {
  id: "linkedin-recruiter-lite",
  title: "LinkedIn Recruiter Lite",
  subtitle: "LinkedIn Premium Sales Navigator",
  oldPrice: "₹3,299",
  price: "₹2,499",
};

export function parseINR(s: string) {
  return Number(s.replace(/[^\d]/g, "")) || 0;
}

export function ProductCard({ product = defaultProduct }: { product?: ProductCardData }) {
  const { add, open } = useBundle();
  const img = product.image ?? PRODUCT_IMG;
  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    add({ id: product.id, title: product.subtitle, subtitle: product.title, price: parseINR(product.price), image: img });
    open();
  };
  return (
    <div className="group relative bg-white border border-gray-200/80 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 p-3 flex flex-col rounded-2xl">
      <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 bg-gray-50">
        <img
          src={img}
          alt={product.subtitle}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <button
          onClick={handleAdd}
          aria-label="Add to bundle"
          className="absolute bottom-2 right-2 w-8 h-8 rounded-full grid place-items-center bg-white/85 backdrop-blur-md border border-white/70 shadow-md text-gray-900 hover:bg-fuchsia-600 hover:text-white transition"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <p className="text-[13px] font-semibold text-gray-900 leading-tight">{product.subtitle}</p>
      <p className="text-[11px] text-gray-500 mt-0.5">{product.title}</p>
      <div className="flex items-center gap-2 mt-1.5 text-[13px]">
        <span className="line-through text-gray-400">{product.oldPrice}</span>
        <span className="text-red-500 font-semibold">{product.price}</span>
      </div>
      <Link
        to="/product/$id"
        params={{ id: product.id }}
        className="mt-3 w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-full text-[12px] font-semibold tracking-wide text-gray-900 bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 hover:opacity-90 transition"
      >
        <ShoppingCart className="w-3.5 h-3.5" /> BUY NOW
      </Link>
    </div>
  );
}
