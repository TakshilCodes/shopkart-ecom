import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://shopkartsite.vercel.app",
      lastModified: new Date(),
    },
    {
      url: "https://shopkartsite.vercel.app/products",
      lastModified: new Date(),
    },
  ];
}