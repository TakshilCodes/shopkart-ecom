"use client";

import { motion } from "framer-motion";
import ArrowRight from "@/assets/icons/right-arrow.png";
import shoe1 from "@/assets/shoe1.png";
import shoe2 from "@/assets/shoe2.png";
import shoe3 from "@/assets/shoe3.png";
import shoe4 from "@/assets/shoe4.png";
import Link from "next/link";

export default function LandingPageHero() {
  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Soft radial glow behind hero */}
      <div className="absolute left-1/2 top-[42%] -z-10 h-125 w-225 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.04)_30%,rgba(255,255,255,0)_70%)]" />

      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 pt-32 sm:px-6 lg:px-8">
        {/* Top Center Shoe */}
        <motion.div
          animate={{ y: [0, -18, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute top-[14%] left-1/2 z-10 w-28 -translate-x-1/2 -rotate-18
          sm:top-[16%] sm:w-36
          md:top-[17%] md:w-44
          lg:top-[18%] lg:w-52"
        >
          <div className="absolute inset-0 -z-10 rounded-full bg-black/10 blur-2xl" />
          <img src={shoe1.src} alt="shoe1" className="h-auto w-full object-contain drop-shadow-[0_18px_24px_rgba(0,0,0,0.18)]" />
        </motion.div>

        {/* Upper Left Shoe */}
        <motion.div
          animate={{ y: [0, 18, 0] }}
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
          className="absolute left-[8%] top-[24%] z-10 w-24 -rotate-28
          sm:left-[10%] sm:top-[26%] sm:w-32
          md:left-[12%] md:top-[28%] md:w-40
          lg:left-[16%] lg:top-[26%] lg:w-48"
        >
          <div className="absolute inset-0 -z-10 rounded-full bg-black/10 blur-2xl" />
          <img src={shoe4.src} alt="shoe4" className="h-auto w-full object-contain drop-shadow-[0_18px_24px_rgba(0,0,0,0.18)]" />
        </motion.div>

        {/* Lower Left Shoe */}
        <motion.div
          animate={{ y: [0, 22, 0] }}
          transition={{ repeat: Infinity, duration: 6.8, ease: "easeInOut" }}
          className="absolute left-[6%] top-[58%] z-10 w-24 -rotate-24
          sm:left-[8%] sm:top-[60%] sm:w-32
          md:left-[10%] md:top-[60%] md:w-40
          lg:left-[14%] lg:top-[58%] lg:w-48"
        >
          <div className="absolute inset-0 -z-10 rounded-full bg-black/10 blur-2xl" />
          <img src={shoe3.src} alt="shoe3" className="h-auto w-full object-contain drop-shadow-[0_18px_24px_rgba(0,0,0,0.18)]" />
        </motion.div>

        {/* Right Shoe */}
        <motion.div
          animate={{ y: [0, -22, 0] }}
          transition={{ repeat: Infinity, duration: 6.2, ease: "easeInOut" }}
          className="absolute right-[6%] top-[52%] z-10 w-24 rotate-22
          sm:right-[8%] sm:top-[50%] sm:w-32
          md:right-[10%] md:top-[50%] md:w-40
          lg:right-[14%] lg:top-[48%] lg:w-48"
        >
          <div className="absolute inset-0 -z-10 rounded-full bg-black/10 blur-2xl" />
          <img src={shoe2.src} alt="shoe2" className="h-auto w-full object-contain drop-shadow-[0_18px_24px_rgba(0,0,0,0.18)]" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-20 max-w-300 text-center font-bold tracking-tight leading-none
          bg-linear-to-b from-black via-neutral-700 to-neutral-500 bg-clip-text text-transparent
          text-4xl sm:text-6xl md:text-7xl lg:text-[96px] xl:text-[110px] 2xl:text-[120px]"
        >
          Find Your Perfect Pair
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="relative z-20 mt-4 max-w-2xl text-center text-sm leading-6 text-neutral-600 sm:text-base"
        >
          Discover lightweight performance shoes built for comfort, speed, and everyday wear.
        </motion.p>

        {/* CTA Row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="relative z-20 mt-10 flex flex-col items-center gap-4 sm:mt-12 sm:flex-row"
        >
          <Link href={'/products'} className="group inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-8 py-3 text-sm font-medium text-black shadow-sm 
          transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            Get Started
            <img
              src={ArrowRight.src}
              alt=">"
              className="w-4 transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>

          <Link href={'/products?category=puma-nitro-collection'} className="inline-flex items-center rounded-full px-6 py-3 text-sm font-medium text-neutral-600 transition hover:text-black">
            Puma Nitro Collection
          </Link>
        </motion.div>

        {/* Trust / Features Row */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="relative z-20 mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-neutral-500 sm:mt-10 sm:text-sm"
        >
          <span>Free shipping</span>
          <span className="hidden sm:inline">•</span>
          <span>Easy returns</span>
          <span className="hidden sm:inline">•</span>
          <span>Secure checkout</span>
        </motion.div>
      </section>
    </div>
  );
}