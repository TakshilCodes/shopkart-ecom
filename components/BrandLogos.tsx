import nikelogo from "@/assets/nikelogo.png";
import adidaslogo from "@/assets/adidaslogo.png";
import pumalogo from "@/assets/pumalogo.png";
import newbalancelogo from "@/assets/newbalancelogo.png";
import reeboklogo from "@/assets/reeboklogo.png";
import Image from "next/image";

const brands = [
    { name: "Nike", logo: nikelogo },
    { name: "Adidas", logo: adidaslogo },
    { name: "Puma", logo: pumalogo },
    { name: "New Balance", logo: newbalancelogo },
    { name: "Reebok", logo: reeboklogo },
];

const marqueeBrands = [...brands, ...brands];

export default function BrandLogos() {
    return (
        <section className="mx-auto w-full max-w-7xl px-6 py-20 overflow-hidden">
            <div className="text-center">
                <p className="text-sm font-medium text-neutral-500">
                    Trusted by top brands
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-black sm:text-4xl">
                    Premium Brands We Offer
                </h2>
            </div>

            <div className="relative mt-12 overflow-hidden">
                {/* left fade */}
                <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-linear-to-r from-white to-transparent" />

                {/* right fade */}
                <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-linear-to-l from-white to-transparent" />

                <div className="flex w-max animate-marquee gap-16">
                    {marqueeBrands.map((brand, index) => (
                        <div
                            key={`${brand.name}-${index}`}
                            className="flex min-w-35 items-center justify-center opacity-60 transition hover:opacity-100"
                        >
                            <Image
                                src={brand.logo}
                                alt={brand.name}
                                width={120}
                                height={40}
                                className="h-10 w-auto object-contain grayscale transition hover:grayscale-0"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}