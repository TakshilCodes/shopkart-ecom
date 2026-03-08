"use server";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export type UpdateProfileState = {
  error?: string;
  success?: string;
};

export async function updateProfileAction(
  prevState: UpdateProfileState,
  formData: FormData
): Promise<UpdateProfileState> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { error: "You must be signed in." };
  }

  const displayName = String(formData.get("displayName") || "").trim();
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();

  if (!displayName) {
    return { error: "Full name is required." };
  }

  if (displayName.length < 2) {
    return { error: "Full name must be at least 2 characters." };
  }

  if (!email) {
    return { error: "Email is required." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  const existingUser = await prisma.users.findFirst({
    where: {
      email,
      NOT: {
        id: session.user.id,
      },
    },
    select: {
      id: true,
    },
  });

  if (existingUser) {
    return { error: "This email is already in use." };
  }

  await prisma.users.update({
    where: {
      id: session.user.id,
    },
    data: {
      DisplayName: displayName,
      email,
    },
  });

  revalidatePath("/profile");
  revalidatePath("/profile/edit");

  return { success: "Profile updated successfully." };
}