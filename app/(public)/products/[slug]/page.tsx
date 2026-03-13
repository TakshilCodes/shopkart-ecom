import Button from "@/components/Button";
import prisma from "@/lib/prisma";
import Link from "next/link";
import ArrowLeft from "@/assets/icons/left-arrow.png";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ProductOptions from "@/components/ProductOptions";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetail(
  props: PageProps<"/products/[slug]">
) {
  const { slug } = await props.params;
  const searchParams = await props.searchParams;

  const currSize = Array.isArray(searchParams?.size)
    ? searchParams.size[0]
    : searchParams?.size;

  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  const product = await prisma.product.findUnique({
    where: { slug },
    select: {
      id: true,
      categoryId: true,
      name: true,
      prodImage: true,
      price: true,
      slug: true,
      isPublished: true,
      productvariant: {
        select: {
          id: true,
          size: true,
          stockQuantity: true,
        },
        orderBy: {
          size: "asc",
        },
      },
    },
  });

  if (!product) {
    return (
      <div className="text-center px-20 pb-10 pt-45 text-gray-500">
        Product not found
      </div>
    );
  }

  const category = await prisma.category.findFirst({
    where: { id: product.categoryId },
    select: { name: true },
  });

  let cartItems: { productVariantId: string; quantity: number }[] = [];

  if (userId) {
    const variantIds = product.productvariant.map((v) => v.id);

    cartItems = await prisma.cart.findMany({
      where: {
        userId,
        productVariantId: { in: variantIds },
      },
      select: {
        productVariantId: true,
        quantity: true,
      },
    });
  }

  return (
    <div className="max-w-6xl mx-auto px-6 pb-10 pt-45">
      <div className="flex items-center gap-3 text-sm text-gray-600 mb-6">
        <Link
          href="/products"
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          <img
            src={ArrowLeft.src}
            alt="Back"
            className="w-5 h-5 object-contain"
          />
        </Link>
        <div className="font-medium text-gray-700">{category?.name}</div>
        <div className="text-gray-400">|</div>
        <div className="text-gray-900 font-medium truncate">{product.name}</div>
      </div>

      <div className="flex flex-col md:flex-row gap-12 mt-15">
        <div className="flex-1">
          <img
            src={product.prodImage}
            alt="Product-Image"
            className="w-full max-h-125 object-cover rounded-xl border border-gray-200"
          />
        </div>

        <div className="flex-1 flex flex-col space-y-6">
          <div className="space-y-2">
            <p className="text-2xl font-semibold tracking-tight">{product.name}</p>
            <p className="text-xl font-medium">₹{String(product.price)}</p>
            <p className="text-sm text-gray-500">Prices include GST</p>
          </div>

          <ProductOptions
            slug={product.slug}
            variants={product.productvariant}
            initialSize={currSize ?? null}
            cartItems={cartItems}
          />
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    select: {
      name: true,
      slug: true,
      prodImage: true,
    },
  });

  if (!product) {
    return {
      title: "Product Not Found | ShopKart",
    };
  }

  return {
    title: `${product.name} | ShopKart`,
    description: `Buy ${product.name} online at ShopKart.`,
    alternates: {
      canonical: `https://shopkartsite.vercel.app/products/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | ShopKart`,
      description: `Buy ${product.name} online at ShopKart.`,
      url: `https://shopkartsite.vercel.app/products/${product.slug}`,
      siteName: "ShopKart",
      images: [
        {
          url: product.prodImage,
        },
      ],
      type: "website",
    },
  };
}