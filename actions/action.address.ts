"use server";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface AddressInput {
  fullName: string;
  Country: string;
  AddressLine1: string;
  AddressLine2?: string;
  City: string;
  State: string;
  pincode: string;
  PhoneNumber: string;
  isDefault: boolean;
}

type UpdateAddressInput = {
  id: string;
  fullName: string;
  phoneNumber: string;
  Country: string;
  AddressLine1: string;
  AddressLine2?: string;
  City: string;
  State: string;
  pincode: string;
  isDefault: boolean;
};

export async function AddAddress(data: AddressInput) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;

    if (!userId) {
      redirect("/signin");
    }

    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    await prisma.address.create({
      data: {
        userId,
        fullName: data.fullName,
        Country: data.Country,
        AddressLine1: data.AddressLine1,
        AddressLine2: data.AddressLine2 || null,
        City: data.City,
        State: data.State,
        pincode: data.pincode,
        isDefault: data.isDefault,
        phoneNumber: data.PhoneNumber,
      },
    });

    revalidatePath("/profile");
    return { ok: true, error: null };
  } catch (e: any) {
    return { ok: false, error: e.message };
  }
}

export async function deleteAddress(addressId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { ok: false, message: "Please sign in again" };
    }

    const address = await prisma.address.findUnique({
      where: { id: addressId },
      select: {
        id: true,
        userId: true,
        isDefault: true,
      },
    });

    if (!address || address.userId !== session.user.id) {
      return { ok: false, message: "Address not found" };
    }

    const linkedOrder = await prisma.order.findFirst({
      where: { addressId },
      select: { id: true },
    });

    if (linkedOrder) {
      return {
        ok: false,
        message: "This address cannot be deleted because it is used in an order",
      };
    }

    await prisma.$transaction(async (tx) => {
      await tx.address.delete({
        where: { id: addressId },
      });

      if (address.isDefault) {
        const latestAddress = await tx.address.findFirst({
          where: { userId: session.user.id },
          orderBy: { createdAt: "desc" },
          select: { id: true },
        });

        if (latestAddress) {
          await tx.address.update({
            where: { id: latestAddress.id },
            data: { isDefault: true },
          });
        }
      }
    });

    revalidatePath("/profile");

    return { ok: true, message: "Address deleted successfully" };
  } catch (e) {
    return { ok: false, message: "Something went wrong" };
  }
}

export async function updateAddress(data: UpdateAddressInput) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;

    if (!userId) {
      redirect("/signin");
    }

    const existingAddress = await prisma.address.findUnique({
      where: { id: data.id },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!existingAddress || existingAddress.userId !== userId) {
      return { ok: false, message: "Address not found" };
    }

    await prisma.$transaction(async (tx) => {
      if (data.isDefault) {
        await tx.address.updateMany({
          where: {
            userId,
          },
          data: {
            isDefault: false,
          },
        });
      }

      await tx.address.update({
        where: { id: data.id },
        data: {
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
          Country: data.Country,
          AddressLine1: data.AddressLine1,
          AddressLine2: data.AddressLine2 || null,
          City: data.City,
          State: data.State,
          pincode: data.pincode,
          isDefault: data.isDefault,
        },
      });
    });

    revalidatePath("/profile");
    revalidatePath(`/address/${data.id}/edit`);

    return { ok: true, message: "Address updated successfully" };
  } catch (e: any) {
    return { ok: false, message: e.message || "Something went wrong" };
  }
}