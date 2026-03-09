import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

function slugify(text: string) {
    return text
        .trim()
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { ok: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        if (session.user.role !== "Admin") {
            return NextResponse.json(
                { ok: false, error: "Forbidden" },
                { status: 403 }
            );
        }

        const id = req.nextUrl.searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { ok: false, error: "Category id is required" },
                { status: 400 }
            );
        }

        const existingCategory = await prisma.category.findUnique({
            where: { id },
            select: {
                id: true,
                _count: {
                    select: {
                        products: true,
                    },
                },
            },
        });

        if (!existingCategory) {
            return NextResponse.json(
                { ok: false, error: "Category not found" },
                { status: 404 }
            );
        }

        if (existingCategory._count.products > 0) {
            return NextResponse.json(
                {
                    ok: false,
                    error:
                        "This category cannot be deleted because products are assigned to it.",
                },
                { status: 409 }
            );
        }

        await prisma.category.delete({
            where: { id },
        });

        return NextResponse.json(
            {
                ok: true,
                error: null,
            },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            {
                ok: false,
                error: error?.message || "Failed to delete category",
            },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { ok: false, categories: null, error: "Unauthorized" },
                { status: 401 }
            );
        }

        if (session.user.role !== "Admin") {
            return NextResponse.json(
                { ok: false, categories: null, error: "Forbidden" },
                { status: 403 }
            );
        }

        const search = req.nextUrl.searchParams.get("q")?.trim() || "";

        const categories = await prisma.category.findMany({
            where: search
                ? {
                    OR: [
                        {
                            name: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            slug: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    ],
                }
                : undefined,
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                name: true,
                slug: true,
                createdAt: true,
                _count: {
                    select: {
                        products: true,
                    },
                },
            },
        });

        return NextResponse.json(
            {
                ok: true,
                categories,
                error: null,
            },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            {
                ok: false,
                categories: null,
                error: error?.message || "Failed to fetch categories",
            },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { ok: false, category: null, error: "Unauthorized" },
                { status: 401 }
            );
        }

        if (session.user.role !== "Admin") {
            return NextResponse.json(
                { ok: false, category: null, error: "Forbidden" },
                { status: 403 }
            );
        }

        const body = await req.json();
        const rawName = body?.name?.trim();

        if (!rawName) {
            return NextResponse.json(
                { ok: false, category: null, error: "Category name is required" },
                { status: 400 }
            );
        }

        const slug = slugify(rawName);

        const existing = await prisma.category.findFirst({
            where: {
                OR: [{ name: rawName }, { slug }],
            },
        });

        if (existing) {
            return NextResponse.json(
                { ok: false, category: null, error: "Category already exists" },
                { status: 409 }
            );
        }

        const category = await prisma.category.create({
            data: {
                name: rawName,
                slug,
            },
            select: {
                id: true,
                name: true,
                slug: true,
                createdAt: true,
                _count: {
                    select: {
                        products: true,
                    },
                },
            },
        });

        return NextResponse.json(
            {
                ok: true,
                category,
                error: null,
            },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            {
                ok: false,
                category: null,
                error: error?.message || "Failed to create category",
            },
            { status: 500 }
        );
    }
}