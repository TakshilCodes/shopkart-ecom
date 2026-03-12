import Button from "@/components/Button";
import prisma from "@/lib/prisma";
import Link from "next/link";
import ArrowLeft from "@/assets/icons/left-arrow.png";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function ProductDetail(
  props: PageProps<"/products/[slug]">
) {
  const { slug } = await props.params;
  const searchParams = await props.searchParams;

  const currSize = Array.isArray(searchParams?.size)
    ? searchParams.size[0]
    : searchParams?.size;

  const session = await getServerSession(authOptions);
  const user = session?.user.id;

  const product = await prisma.product.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
      categoryId: true,
      name: true,
      prodImage: true,
      price: true,
      productvariant: {
        select: {
          id: true,
          size: true,
          stockQuantity: true,
        },
      },
      isPublished: true,
      slug: true,
    },
  });

  if (!product) {
    return (
      <div className="text-center px-20 pb-10 pt-45 text-gray-500">
        Product not found
      </div>
    );
  }

  const selectedVariant = currSize
    ? await prisma.productVariant.findFirst({
        where: {
          productId: product.id,
          size: currSize,
        },
      })
    : null;

  let cart = null;

  if (selectedVariant && user) {
    cart = await prisma.cart.findUnique({
      where: {
        userId_productVariantId: {
          userId: user,
          productVariantId: selectedVariant.id,
        },
      },
    });
  }

  const category = await prisma.category.findFirst({
    where: {
      id: product.categoryId,
    },
    select: {
      name: true,
    },
  });

  const initialQuantity = cart?.quantity ?? 0;
  const canAdd = !!selectedVariant && selectedVariant.stockQuantity > 0;

  return (
    <div className="max-w-6xl mx-auto px-6 pb-10 pt-45">
      <div>
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

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="font-medium">Size</p>
                {currSize ? (
                  product.productvariant.length >= 1 ? (
                    product.productvariant.map((size) =>
                      size.size === currSize ? (
                        <div key={size.id} className="text-green-600">
                          In stock: {size.stockQuantity}
                        </div>
                      ) : null
                    )
                  ) : (
                    <div className="text-sm text-gray-500">No stock</div>
                  )
                ) : (
                  <div className="text-sm text-gray-500">Select a size</div>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                {product.productvariant.length >= 1 ? (
                  product.productvariant.map((size) => (
                    <Link
                      key={String(size.size)}
                      href={`/products/${slug}?size=${size.size}`}
                      className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        currSize && currSize === size.size
                          ? "bg-black text-white"
                          : "border border-gray-300 hover:border-black"
                      }`}
                    >
                      {size.size}
                    </Link>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">No sizes available</div>
                )}
              </div>

              <div>
                <Button
                  disabled={!canAdd}
                  initialquantity={initialQuantity}
                  productvariantId={selectedVariant?.id}
                  max={selectedVariant?.stockQuantity}
                >
                  Add to cart
                </Button>

                {!currSize && (
                  <p className="text-sm text-gray-500 mt-2">Please select a size</p>
                )}

                {currSize &&
                  selectedVariant &&
                  selectedVariant.stockQuantity <= 0 && (
                    <p className="text-sm text-red-500 mt-2">
                      Selected size is out of stock
                    </p>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}