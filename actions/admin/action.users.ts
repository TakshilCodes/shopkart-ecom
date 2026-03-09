"use server";

import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function deleteUserAction(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  if (session.user.role !== "Admin") {
    throw new Error("Forbidden");
  }

  const userId = String(formData.get("userId") || "").trim();

  if (!userId) {
    throw new Error("User id is required");
  }

  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
      email: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Safety 1: do not allow deleting admins from this basic page
  if (user.role === "Admin") {
    throw new Error("Admin users cannot be deleted from here");
  }

  // Safety 2: do not allow deleting yourself
  if (session.user.id && user.id === session.user.id) {
    throw new Error("You cannot delete your own account");
  }

  await prisma.users.delete({
    where: {
      id: userId,
    },
  });

  revalidatePath("/admin/users");
}