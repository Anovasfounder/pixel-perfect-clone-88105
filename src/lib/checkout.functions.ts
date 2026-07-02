import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Public checkout endpoint. Runs entirely server-side so the price and payment
// link come from the database (server-authoritative), never from the client /
// URL params. The sale is recorded with the service role, so the sales table
// needs no public/anon INSERT policy.
export const createCheckout = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      productId: z.string().uuid(),
      name: z.string().trim().min(2).max(80),
      email: z.string().trim().email().max(160),
    }),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: product, error } = await supabaseAdmin
      .from("products")
      .select("id,title,price,payment_link")
      .eq("id", data.productId)
      .maybeSingle();

    if (error || !product) {
      throw new Error("Product not found");
    }

    // Record the sale with the authoritative amount from the DB.
    await supabaseAdmin.from("sales").insert({
      product_id: product.id,
      product_title: product.title,
      customer_name: data.name,
      customer_email: data.email,
      amount: product.price,
    });

    const link = typeof product.payment_link === "string" ? product.payment_link : "";
    const validLink = /^https:\/\//i.test(link) ? link : "";

    return {
      paymentLink: validLink,
      price: Number(product.price),
      title: product.title,
    };
  });
