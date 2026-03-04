import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);
    const user = session?.user.id

    if (!user) {
        return NextResponse.json({ count: 0 });
    }

    const result = await prisma.cart.aggregate({
        where: {
            userId: user
        },
        _sum: {
            quantity: true
        },
    });

    const count = result._sum.quantity ?? 0;

    return NextResponse.json({ count });
}