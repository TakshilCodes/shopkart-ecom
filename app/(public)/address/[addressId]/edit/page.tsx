import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import EditAddressForm from "@/components/EditAddressForm";

export default async function EditAddressPage({
  params,
}: {
  params: Promise<{ addressId: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const { addressId } = await params;

  const address = await prisma.address.findUnique({
    where: { id: addressId },
    select: {
      id: true,
      userId: true,
      fullName: true,
      phoneNumber: true,
      Country: true,
      AddressLine1: true,
      AddressLine2: true,
      City: true,
      State: true,
      pincode: true,
      isDefault: true,
    },
  });

  if (!address || address.userId !== session.user.id) {
    redirect("/profile");
  }

  return (
    <main className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        <div className="mb-8">
          <p className="text-sm text-gray-500">Account / Addresses</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-black">
            Edit Address
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Update your saved delivery address details.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5 sm:p-6">
          <EditAddressForm address={address} />
        </div>
      </div>
    </main>
  );
}