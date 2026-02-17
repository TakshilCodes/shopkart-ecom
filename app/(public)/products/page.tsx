import prisma from "@/lib/prisma"
import Link from "next/link";

export default async function Products({
    searchParams,
}: {
    searchParams?: { [key: string]: string | string[] | undefined };
}) {

    const totalproducts = await prisma.product.count();

    const totalpages = Math.ceil(totalproducts / 25);

    const totalpages_array = Array.from({ length: totalpages }, (_, i) => i + 1);

    const params = await searchParams;
    const currentpage = params?.page ?? 1

    const toSkipItems = (Number(currentpage) - 1) * 25;

    const products = await prisma.product.findMany({
        where:{
            isPublished:true
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
    })

    return (
        <div className="m-20">
            <main>
                <div>
                    <p className="text-2xl">Products</p>
                </div>

                <div className="flex justify-center items-center flex-wrap cursor-pointer">
                    {products.map((product) => (
                        <div key={product.slug}>
                                <div className="p-5 w-70">
                                    <img src={product.prodImage} alt={product.Name} />
                                    <div className=" overflow-auto">
                                        <p className="text-sm font-bold text-center">{product.Name.length > 20 ? product.Name.slice(0, 22) + "..." : product.Name}</p>
                                        <div className="flex justify-between items-center p-3 mx-5">
                                            <p className="font-bold">₹{String(product.price)}</p>
                                            <button disabled={!product.inStock} className={`${product.inStock ? 'bg-black cursor-pointer' : 'bg-gray-400 cursor-not-allowed'} text-white py-0.5 px-3 rounded-2xl`}>Add to cart</button>
                                        </div>
                                    </div>
                                </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center mt-20">
                    <Link href={`/products?page=${Number(currentpage) - 1}`}>Prev</Link>
                    {totalpages_array.map((page) => (
                        <div key={page} >
                            <Link className="cursor-pointer p-0.5 px-2 m-2 border" href={`/products?page=${page}`}>{page}</Link>
                        </div>
                    ))}
                    <Link href={`/products?page=${Number(currentpage) + 1}`}>Next</Link>
                </div>
            </main>
        </div>
    )
}