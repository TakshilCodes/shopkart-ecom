import Button from "@/components/Button";
import prisma from "@/lib/prisma";
import Link from "next/link";
import ArrowLeft from '@/assets/icons/left-arrow.png'
import { redirect } from "next/navigation";

export default async function ProductDetail({ searchParams, params }: { params: any, searchParams?: { [key: string]: string }; }) {

    const slug = (await params).slug;

    const query = await searchParams;

    const currSize = query?.size;

    const product = await prisma.product.findUnique({
        where: {
            slug: slug
        }
    })

    const category = await prisma.category.findFirst({
        where: {
            id: product?.categoryId
        },
        select: {
            name: true
        }
    })
    const sizes = product?.Sizes

    return (
        <div className="max-w-6xl mx-auto px-6 py-10">
            {product ? (
                <div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 mb-6">
                        <Link href={`/products`} className="p-2 rounded-full hover:bg-gray-100 transition"><img src={ArrowLeft.src} alt="Back" className="w-5 h-5 object-contain"/></Link>
                        <div className="font-medium text-gray-700">{category?.name}</div>
                        <div className="text-gray-400">|</div>
                        <div className="text-gray-900 font-medium truncate">{product.name}</div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-12 mt-15">
                        <div className="flex-1">
                            <img src={product.prodImage} alt="Product-Image" className="w-full max-h-125 object-cover rounded-xl border border-gray-200" />
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
                                    <p className={`text-sm ${product.inStock ? "text-green-600" : "text-red-500"}`}>{product.inStock ? "In Stock" : "Not in stock"}</p>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    {Array.isArray(sizes) ? (
                                        sizes.map((size) => (
                                            <Link
                                                key={String(size)}
                                                href={`/products/${slug}?size=${size}`}
                                                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${currSize && currSize == size ? "bg-black text-white" : "border border-gray-300 hover:border-black"}`}
                                            >
                                                {String(size)}
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="text-sm text-gray-500">
                                            No sizes available
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4">
                                {product.inStock ? (<Button disabled={false}>Add to cart</Button>) : (<Button disabled={true}>Add to cart</Button>)}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 text-gray-500">
                    Product not found
                </div>
            )}
        </div>
    )
}