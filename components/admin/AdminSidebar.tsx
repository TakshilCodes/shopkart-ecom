"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FolderTree,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Users", href: "/admin/users", icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const userInitial = session?.user?.name?.charAt(0)?.toUpperCase() || "A";

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-67.5 shrink-0 flex-col justify-between border-r border-white/10 bg-zinc-950 text-white md:flex">
        <div>
          <div className="border-b border-white/10 px-6 py-6">
            <Link href="/admin" className="block">
              <h1 className="text-2xl font-bold tracking-tight">ShopKart</h1>
              <p className="mt-1 text-sm text-zinc-400">Admin Panel</p>
            </Link>
          </div>

          <div className="mx-6 mt-6 flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black font-semibold text-white">
              {userInitial}
            </div>

            <div className="min-w-0 flex flex-col">
              <p className="truncate text-sm font-semibold text-gray-900">
                {session?.user?.name || "Admin"}
              </p>
              <p className="truncate text-xs text-gray-500">
                {session?.user?.email || "admin@example.com"}
              </p>
            </div>
          </div>

          <nav className="space-y-2 px-4 py-6">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));

              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-white text-black shadow-sm"
                      : "text-zinc-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon
                    size={18}
                    className={
                      isActive
                        ? "text-black"
                        : "text-zinc-400 group-hover:text-white"
                    }
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-white/10 p-4">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white"
          >
            <LogOut size={18} className="text-zinc-400" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile floating menu button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-40 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-300 bg-white text-zinc-700 shadow-md transition hover:bg-zinc-100 md:hidden"
      >
        <Menu size={20} />
      </button>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 md:hidden ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />

        <aside
          className={`absolute left-0 top-0 flex h-full w-70 flex-col justify-between bg-zinc-950 text-white shadow-2xl transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div>
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">ShopKart</h1>
                <p className="mt-1 text-sm text-zinc-400">Admin Panel</p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-zinc-300 transition hover:bg-white/5 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mx-6 mt-6 flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black font-semibold text-white">
                {userInitial}
              </div>

              <div className="min-w-0 flex flex-col">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {session?.user?.name || "Admin"}
                </p>
                <p className="truncate text-xs text-gray-500">
                  {session?.user?.email || "admin@example.com"}
                </p>
              </div>
            </div>

            <nav className="space-y-2 px-4 py-6">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href));

                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-white text-black shadow-sm"
                        : "text-zinc-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon
                      size={18}
                      className={
                        isActive
                          ? "text-black"
                          : "text-zinc-400 group-hover:text-white"
                      }
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="border-t border-white/10 p-4">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white"
            >
              <LogOut size={18} className="text-zinc-400" />
              <span>Logout</span>
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}