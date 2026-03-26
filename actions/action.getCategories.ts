"use server"

import prisma from "@/lib/prisma";

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    return {
      ok: true,
      data: categories,
      error: null,
    };
  } catch (error) {
    return {
      ok: false,
      data: null,
      error: "Failed to fetch categories",
    };
  }
}