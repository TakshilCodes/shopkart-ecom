"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    FolderTree,
    Users,
    LogOut,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

const navItems = [
    {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        label: "Products",
        href: "/admin/products",
        icon: Package,
    },
    {
        label: "Orders",
        href: "/admin/orders",
        icon: ShoppingCart,
    },
    {
        label: "Categories",
        href: "/admin/categories",
        icon: FolderTree,
    },
    {
        label: "Users",
        href: "/admin/users",
        icon: Users,
    }
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const session = useSession()

    return (
        <aside className="w-67.5 h-screen sticky top-0 bg-zinc-950 text-white border-r border-white/10 flex flex-col justify-between">
            <div>
                <div className="px-6 py-6 border-b border-white/10">
                    <Link href="/admin" className="block">
                        <h1 className="text-2xl font-bold tracking-tight">ShopKart</h1>
                        <p className="text-sm text-zinc-400 mt-1">Admin Panel</p>
                    </Link>
                </div>

                <div className="flex items-center mx-6 gap-3 bg-white rounded-xl p-3 shadow-sm border border-gray-200 w-fit">

                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white font-semibold">
                        A
                    </div>

                    <div className="flex flex-col">
                        <p className="text-sm font-semibold text-gray-900">{session.data?.user.name}</p>
                        <p className="text-xs text-gray-500">{session.data?.user.email}</p>
                    </div>

                </div>

                <nav className="px-4 py-6 space-y-2">
                    {navItems.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            (item.href !== "/admin" && pathname.startsWith(item.href));

                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${isActive
                                        ? "bg-white text-black shadow-sm"
                                        : "text-zinc-300 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <Icon
                                    size={18}
                                    className={`transition ${isActive
                                            ? "text-black"
                                            : "text-zinc-400 group-hover:text-white"
                                        }`}
                                />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="p-4 border-t border-white/10">
                <button onClick={() => signOut({callbackUrl: '/'})} className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-white transition-all duration-200">
                    <LogOut size={18} className="text-zinc-400" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}