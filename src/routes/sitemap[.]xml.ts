import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = "https://glass-morph-vision.lovable.app";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "daily", priority: "1.0" },
          { path: "/search", changefreq: "weekly", priority: "0.6" },
          { path: "/privacy", changefreq: "yearly", priority: "0.3" },
          { path: "/terms", changefreq: "yearly", priority: "0.3" },
        ];

        try {
          const supabase = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_PUBLISHABLE_KEY!,
            { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
          );
          const [{ data: products }, { data: categories }, { data: budgets }] = await Promise.all([
            supabase.from("products").select("id, created_at"),
            supabase.from("categories").select("id, created_at"),
            supabase.from("budgets").select("id, created_at"),
          ]);
          for (const p of products ?? []) {
            entries.push({ path: `/product/${p.id}`, lastmod: p.created_at?.slice(0, 10), changefreq: "weekly", priority: "0.8" });
          }
          for (const c of categories ?? []) {
            entries.push({ path: `/category/${c.id}`, lastmod: c.created_at?.slice(0, 10), changefreq: "weekly", priority: "0.7" });
          }
          for (const b of budgets ?? []) {
            entries.push({ path: `/budget/${b.id}`, lastmod: b.created_at?.slice(0, 10), changefreq: "weekly", priority: "0.5" });
          }
        } catch {
          // If DB is unreachable, fall through with static entries only.
        }

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ].filter(Boolean).join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
