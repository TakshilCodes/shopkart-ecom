import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  const products = await prisma.product.findMany({
    select: { slug: true }
  });

  const productUrls = products.map((p) => ({
    url: `https://shopkartsite.vercel.app/products/${p.slug}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: "https://shopkartsite.vercel.app",
      lastModified: new Date(),
    },
    {
      url: "https://shopkartsite.vercel.app/products",
      lastModified: new Date(),
    },
    ...productUrls
  ];
}