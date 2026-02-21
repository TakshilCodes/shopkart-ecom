import Button from "@/components/Button";
import Filter from "@/components/Filter";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function Products({
    searchParams,
}: {
    searchParams?: { [key: string]: string | string[] | undefined };
}) {

    const params = await searchParams;
    const currentpage = params?.page ?? 1;
    const rawPrice = params?.price;

    const price = typeof rawPrice === "string" ? Number(rawPrice) : Array.isArray(rawPrice) ? Number(rawPrice[0]) : 200000;

    const safePrice = Number.isFinite(price) ? price : 200000;

    const toSkipItems = (Number(currentpage) - 1) * 25;

    const totalproducts = await prisma.product.count({
        where: {
            isPublished: true,
            price: {
                lte: safePrice,
            },
        },
    });

    const totalpages = Math.ceil(totalproducts / 25);

    const totalpages_array = Array.from({ length: totalpages }, (_, i) => i + 1);

    const products = await prisma.product.findMany({
        where: {
            isPublished: true,
            price: {
                lte: safePrice,
            },
        },
        select: {
            Name: true,
            prodImage: true,
            price: true,
            isPublished: true,
            inStock: true,
            slug: true
        },
        skip: toSkipItems,
        take: 25
    });

    return (
        <div className="bg-neutral-50 min-h-screen px-20 py-10">
            <main>
                <div className="flex justify-between items-center">
                    <Filter />
                    <p className="text-5xl">Products</p>
                </div>

                {products ?
                    <div><div className="flex justify-center items-center flex-wrap gap-6 cursor-pointer py-10">
                        {products.map((product) => (
                            <div key={product.slug}> 
                                <div className="p-5 w-full sm:w-72 md:w-80 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 transition-all ease-in-out duration-300 rounded-3xl">
                                    <img src={product.prodImage} alt={product.Name}/>
                                    <div className=" overflow-auto">
                                        <p className="text-sm font-bold text-center">
                                            {product.Name.length > 20
                                                ? product.Name.slice(0, 22) + "..."
                                                : product.Name}
                                        </p>
                                        <div className="flex justify-between items-center p-3 mx-5">
                                            <p className="font-bold">₹{String(product.price)}</p>
                                            <Button disabled={!product.inStock}>Add to cart</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                        <div className="flex justify-center mt-20">
                            <Link href={`/products?page=${Number(currentpage) - 1}`}>Prev</Link>
                            {totalpages_array.map((page) => (
                                <div key={page}>
                                    <Link
                                        className="cursor-pointer p-0.5 px-2 m-2 border"
                                        href={`/products?page=${page}`}
                                    >
                                        {page}
                                    </Link>
                                </div>
                            ))}
                            <Link href={`/products?page=${Number(currentpage) + 1}`}>Next</Link>
                        </div>
                    </div>
                    :

                    <div>No products.</div>

                }
            </main>
        </div>
    );
}
