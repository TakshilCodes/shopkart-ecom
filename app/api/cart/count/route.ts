import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // adjust if your prisma import path differs
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // adjust path to your NextAuth options

export async function GET() {
    const session = await getServerSession(authOptions);
    const user = session?.user.id

    if (!user) {
        return NextResponse.json({ count: 0 });
    }

    const rows = await prisma.cart.findMany({
        where: {
            userId: user
        },
        select: {
            quantity: true
        },
    });

    const count = rows.reduce((sum, r) => sum + (r.quantity ?? 0), 0);

    return NextResponse.json({ count });
}