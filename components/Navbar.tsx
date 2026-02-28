"use client";

import Link from "next/link";
import arrowdown from "@/assets/icons/down-arrow.png";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

const CATEGORIES = [
  { label: "Shoes", href: "/products?category=shoes" },
  { label: "Clothing", href: "/products?category=clothing" },
  { label: "Watches", href: "/products?category=watches" },
  { label: "Accessories", href: "/products?category=accessories" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;

  const [catOpen, setCatOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);

  const catRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      const t = e.target as Node;

      if (catRef.current && !catRef.current.contains(t)) setCatOpen(false);
      if (profileRef.current && !profileRef.current.contains(t)) setProfileOpen(false);
      if (menuRef.current && !menuRef.current.contains(t)) {
        setMenuOpen(false);
        setMobileCatOpen(false);
      }
    }

    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("mousedown", onDown);
    };
  }, []);

  return (
    <header className="w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-neutral-900 hover:opacity-80 transition"
          onClick={() => {
            setMenuOpen(false);
            setMobileCatOpen(false);
          }}
        >
          ShopKart
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-700">
          <Link href="/" className="hover:text-black transition">Home</Link>
          <Link href="/products" className="hover:text-black transition">Shop</Link>

          <div className="relative" ref={catRef}>
            <button
              type="button"
              onClick={() => {
                setCatOpen((v) => !v);
                setProfileOpen(false);
              }}
              className="flex items-center gap-2 hover:text-black transition"
            >
              Categories
              <span className={`text-xs transition ${catOpen ? "rotate-180" : ""}`}>
                <img
                  src={arrowdown.src}
                  alt="Down"
                  width={16}
                  height={16}
                  className="h-4 w-4 object-contain"
                />
              </span>
            </button>

            {catOpen && (
              <div className="absolute top-full mt-3 w-56 rounded-xl border border-neutral-200 bg-white shadow-lg overflow-hidden">
                <div className="px-3 py-2 text-xs font-semibold text-neutral-500">
                  Browse Categories
                </div>

                <div className="h-px bg-neutral-200" />

                <div className="py-2">
                  {CATEGORIES.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      onClick={() => setCatOpen(false)}
                      className="block px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-100 transition"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link href="/" className="hover:text-black transition">Help</Link>
        </nav>

        <div className="flex items-center gap-3">
          <div className="relative md:hidden" ref={menuRef}>
            <button
              type="button"
              onClick={() => {
                setMenuOpen((v) => !v);
                setProfileOpen(false);
                setCatOpen(false);
              }}
              className="inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white px-3 py-2 hover:bg-neutral-100 transition"
              aria-label="Open menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-3 w-64 rounded-xl border border-neutral-200 bg-white shadow-lg overflow-hidden">
                <div className="py-2">
                  <Link
                    href="/"
                    onClick={() => {
                      setMenuOpen(false);
                      setMobileCatOpen(false);
                    }}
                    className="block px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-100 transition"
                  >
                    Home
                  </Link>

                  <Link
                    href="/products"
                    onClick={() => {
                      setMenuOpen(false);
                      setMobileCatOpen(false);
                    }}
                    className="block px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-100 transition"
                  >
                    Shop
                  </Link>

                  <button
                    type="button"
                    onClick={() => setMobileCatOpen((v) => !v)}
                    className="w-full flex items-center justify-between px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-100 transition"
                  >
                    <span>Categories</span>
                    <span className={`transition ${mobileCatOpen ? "rotate-180" : ""}`}>
                      <img
                        src={arrowdown.src}
                        alt="Down"
                        width={16}
                        height={16}
                        className="h-4 w-4 object-contain"
                      />
                    </span>
                  </button>

                  {mobileCatOpen && (
                    <div className="pb-2">
                      {CATEGORIES.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          onClick={() => {
                            setMenuOpen(false);
                            setMobileCatOpen(false);
                          }}
                          className="block pl-8 pr-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  )}

                  <Link
                    href="/"
                    onClick={() => {
                      setMenuOpen(false);
                      setMobileCatOpen(false);
                    }}
                    className="block px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-100 transition"
                  >
                    Help
                  </Link>

                  <div className="h-px bg-neutral-200 my-2" />

                  {!user ? (
                    <div className="px-4 pb-2 flex gap-2">
                      <Link
                        href="/signin"
                        onClick={() => setMenuOpen(false)}
                        className="flex-1 text-center px-3 py-2 rounded-lg border border-neutral-300 text-sm font-medium hover:bg-neutral-100 transition"
                      >
                        Login
                      </Link>
                      <Link
                        href="/signup"
                        onClick={() => setMenuOpen(false)}
                        className="flex-1 text-center px-3 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-neutral-800 transition"
                      >
                        Signup
                      </Link>
                    </div>
                  ) : (
                    <div className="px-4 pb-2 space-y-2">
                      <Link
                        href="/account"
                        onClick={() => setMenuOpen(false)}
                        className="block px-3 py-2 rounded-lg text-sm text-neutral-800 hover:bg-neutral-100 transition"
                      >
                        Account
                      </Link>

                      <button
                        type="button"
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                <Link
                  href="/signin"
                  className="px-4 py-2 rounded-lg border border-neutral-300 text-sm font-medium hover:bg-neutral-100 transition"
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-neutral-800 transition"
                >
                  Signup
                </Link>
              </>
            ) : (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen((v) => !v);
                    setCatOpen(false);
                    setMenuOpen(false);
                    setMobileCatOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-full hover:bg-neutral-100 px-2 py-1 transition"
                >
                  <div className="h-9 w-9 rounded-full overflow-hidden border border-neutral-200 bg-neutral-100 flex items-center justify-center">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt="Profile"
                        width={36}
                        height={36}
                        className="h-9 w-9 object-cover"
                      />
                    ) : (
                      <span className="text-sm font-semibold text-neutral-700">
                        {(user.name?.[0] || user.email?.[0] || "U").toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="hidden sm:flex flex-col items-start leading-tight">
                    <span className="text-xs text-neutral-500">Signed in</span>
                    <span className="text-sm font-medium text-neutral-900 max-w-35 truncate">
                      {user.name || user.email}
                    </span>
                  </div>

                  <span className={`transition ${profileOpen ? "rotate-180" : ""}`}>
                    <img
                      src={arrowdown.src}
                      alt="Down"
                      width={16}
                      height={16}
                      className="h-4 w-4 object-contain"
                    />
                  </span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-3 w-56 rounded-xl border border-neutral-200 bg-white shadow-lg overflow-hidden">
                    <div className="px-4 py-3">
                      <div className="text-sm font-semibold text-neutral-900 truncate">
                        {user.name || "Account"}
                      </div>
                      <div className="text-xs text-neutral-500 truncate">
                        {user.email}
                      </div>
                    </div>

                    <div className="h-px bg-neutral-200" />

                    <div className="py-2">
                      <Link
                        href="/account"
                        onClick={() => setProfileOpen(false)}
                        className="block px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-100 transition"
                      >
                        Account
                      </Link>

                      <button
                        type="button"
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}