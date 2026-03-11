import Link from "next/link";
import prisma from "@/lib/prisma";
import ArrowRight from "@/assets/icons/right-arrow.png";

export default async function TopSellingProducts() {
    const topSelling = await prisma.orderItem.groupBy({
        by: ["productId"],
        _sum: {
            quantity: true,
        },
        where: {
            order: {
                status: "PAID",
            },
        },
        orderBy: {
            _sum: {
                quantity: "desc",
            },
        },
        take: 3,
    });

    const productIds = topSelling.map((item) => item.productId);

    const products = await prisma.product.findMany({
        where: {
            id: { in: productIds },
            isPublished: true,
        },
        select: {
            id: true,
            name: true,
            slug: true,
            prodImage: true,
            price: true,
            category: {
                select: {
                    name: true,
                },
            },
        },
    });

    const orderedProducts = productIds
        .map((id) => {
            const product = products.find((p) => p.id === id);
            const sales = topSelling.find((item) => item.productId === id)?._sum.quantity ?? 0;

            if (!product) return null;

            return {
                ...product,
                sales,
            };
        })
        .filter(Boolean);

    if (orderedProducts.length === 0) {
        return null;
    }

    return (
        <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-end justify-between">
                <div>
                    <p className="text-sm font-medium text-neutral-500">Most Loved Picks</p>
                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-black sm:text-4xl">
                        Top Selling Products
                    </h2>
                </div>

                <Link
                    href="/products"
                    className="hidden text-sm font-medium text-neutral-600 transition hover:text-black sm:inline-flex sm:items-center"
                >
                    <span>View all products</span>
                    <img
                        src={ArrowRight.src}
                        alt=">"
                        className="w-4 h-4"
                    />
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {orderedProducts.map((product) => (
                    <Link
                        key={product!.id}
                        href={`/products/${product!.slug}`}
                        className="group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                        <div className="relative mb-6 h-65 overflow-hidden rounded-3xl bg-[#f5f5f5]">
                            <img
                                src={product!.prodImage}
                                alt={product!.name}
                                className="h-full w-full object-cover scale-125 transition duration-500 group-hover:scale-[1.35]"
                            />
                        </div>

                        {/* Product Info */}
                        <div className="space-y-2">

                            <p className="text-sm text-neutral-500">
                                {product!.category.name}
                            </p>

                            <h3 className="text-lg font-semibold text-black leading-tight">
                                {product!.name}
                            </h3>

                            <div className="flex items-center justify-between pt-2">

                                <p className="text-lg font-semibold text-black">
                                    ₹{Number(product!.price).toLocaleString("en-IN")}
                                </p>

                                <span className="text-xs text-neutral-500">
                                    {product!.sales} sold
                                </span>

                            </div>

                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}