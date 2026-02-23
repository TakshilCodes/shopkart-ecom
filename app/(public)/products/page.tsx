import Button from "@/components/Button";
import Filter from "@/components/Filter";
import Search from "@/components/Search";
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

    const rawSearch = params?.search ?? '';
    const search = Array.isArray(rawSearch) ? String(rawSearch[0]) : rawSearch;

    const rawCategory = params?.category ?? null;
    const hasCategory = typeof rawCategory === "string" && rawCategory.trim().length > 0;

    const categorys = await prisma.category.findMany({
        select: {
            id: true,
            name: true,
            slug: true
        }
    })

    const toSkipItems = (Number(currentpage) - 1) * 25;

    const where = {
        isPublished: true,
        price: {
            lte: safePrice,
        },
        name: {
            contains: search,
            mode: "insensitive" as const,
        },
        ...(hasCategory ? { category: { slug: String(rawCategory) } } : {})
    }

    const totalproducts = await prisma.product.count({
        where,
    });

    const totalpages = Math.ceil(totalproducts / 25);

    const totalpages_array = Array.from({ length: totalpages }, (_, i) => i + 1);

    const products = await prisma.product.findMany({
        where,
        select: {
            name: true,
            prodImage: true,
            price: true,
            isPublished: true,
            inStock: true,
            slug: true,
            category: {
                select: {
                    name: true
                }
            }
        },
        skip: toSkipItems,
        take: 25
    });

    return (
        <div className="bg-neutral-50 min-h-screen px-20 py-10">
            <main>
                <Search />
                <div className="flex justify-between items-center">
                    <Filter />
                    <p className="text-5xl">Products</p>
                </div>

                {categorys.length > 0 ? <div className="flex justify-center items-center flex-wrap space-x-10 py-10">
                    <Link className="py-2 px-5 border-2 rounded-xl" href={`/products`}>All</Link>
                    {categorys.map((category) => (
                        <div key={category.slug}>
                            <Link className="py-3 px-4 border-2  rounded-xl" href={`/products?category=${category.slug}`}>
                                {category.name}
                            </Link>
                        </div>
                    ))}
                </div> : null}

                {products.length > 0 ?
                    <div>
                        <div className="flex justify-center items-center flex-wrap gap-6 cursor-pointer py-10">
                            {products.map((product) => (
                                <div key={product.slug}>
                                    <div className="p-5 w-full sm:w-72 md:w-80 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 transition-all ease-in-out duration-300 rounded-3xl">
                                        <img src={product.prodImage} alt={product.name} />
                                        <div className=" overflow-auto pt-3">
                                            <p className="text-sm font-bold text-center">
                                                {product.name.length > 20 ? product.name.slice(0, 22) + "..." : product.name}
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
                            {Number(currentpage) > 1 ?
                                search ? <Link href={`/products?page=${Number(currentpage) - 1}&search=${search}`}>Prev</Link> :
                                    <Link href={`/products?page=${Number(currentpage) - 1}`}>Prev</Link> :
                                <button disabled>Prev</button>
                            }
                            {totalpages_array.map((page) => (
                                <div key={page}>
                                    {search
                                        ? hasCategory
                                            ? (
                                                <Link
                                                    className="cursor-pointer p-0.5 px-2 m-2 border"
                                                    href={`/products?page=${page}&search=${search}&category=${rawCategory}`}
                                                >
                                                    {page}
                                                </Link>
                                            )
                                            : (
                                                <Link
                                                    className="cursor-pointer p-0.5 px-2 m-2 border"
                                                    href={`/products?page=${page}&search=${search}`}
                                                >
                                                    {page}
                                                </Link>
                                            )
                                        : (
                                            <Link
                                                className="cursor-pointer p-0.5 px-2 m-2 border"
                                                href={`/products?page=${page}${hasCategory ? `&category=${rawCategory}` : ""}`}
                                            >
                                                {page}
                                            </Link>
                                        )
                                    }
                                </div>
                            ))}
                            {totalpages > 1 && Number(currentpage) !== totalpages ?
                                search ? <Link href={`/products?page=${Number(currentpage) + 1}&search=${search}`}>Next</Link> :
                                    <Link href={`/products?page=${Number(currentpage) + 1}`}>Next</Link> :
                                <button disabled>Next</button>
                            }
                        </div>
                    </div>
                    :

                    search ? <div className="flex justify-center items-center py-40"><div className="text-lg">No products matching{" "} <span className="font-bold text-blue-700">{search}</span>.</div></div>
                        : <div className="flex justify-center items-center py-40">No products.</div>

                }
            </main>
        </div>
    );
}
