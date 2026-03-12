import Link from "next/link";

export default function Footer() {
    return (
        <footer className="mt-32 border-t border-neutral-200 bg-white">
            <div className="mx-auto max-w-7xl px-6 py-16">

                <div className="grid grid-cols-1 gap-12 md:grid-cols-4">

                    <div>
                        <h2 className="text-xl font-bold text-black">ShopKart</h2>
                        <p className="mt-4 text-sm text-neutral-600 leading-relaxed">
                            Discover performance shoes designed for comfort, speed and everyday wear.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-black">Shop</h3>
                        <ul className="mt-4 space-y-3 text-sm text-neutral-600">
                            <li><Link href="/products">All Products</Link></li>
                            <li><Link href="/products?category=sneakers">Sneakers</Link></li>
                            <li><Link href="/products?category=puma-nitro-collection">Puma Nitro Collection</Link></li>
                            <li><Link href="/products?category=cricket">Cricket</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-black">Company</h3>
                        <ul className="mt-4 space-y-3 text-sm text-neutral-600">
                            <li><Link href="#">About</Link></li>
                            <li><Link href="#">Contact</Link></li>
                            <li><Link href="#">Careers</Link></li>
                            <li><Link href="#">Press</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-black">Help</h3>
                        <ul className="mt-4 space-y-3 text-sm text-neutral-600">
                            <li><Link href="#">Shipping</Link></li>
                            <li><Link href="#">Privacy Policy</Link></li>
                            <li><Link href="#">Terms</Link></li>
                        </ul>
                    </div>

                </div>

                <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-neutral-200 pt-6 text-sm text-neutral-500 md:flex-row">
                    <p>© {new Date().getFullYear()} ShopKart. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="https://www.instagram.com/imtakshil/?hl=en"
                            target="_blank"
                            rel="noopener noreferrer">
                            Instagram
                        </Link>
                        <Link href="https://x.com/TakshilDev"
                            target="_blank"
                            rel="noopener noreferrer">
                            Twitter
                        </Link>
                        <Link href="https://www.linkedin.com/in/takshilpandya/"
                            target="_blank"
                            rel="noopener noreferrer">
                            Linkedin
                        </Link>
                    </div>
                </div>

            </div>
        </footer>
    );
}