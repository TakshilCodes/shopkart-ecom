import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ProfileEditForm from "@/components/ProfileEditForm";

export default async function EditProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const user = await prisma.users.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      DisplayName: true,
      email: true,
    },
  });

  if (!user) {
    redirect("/signin");
  }

  return (
    <main className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 pt-45">
        <div className="mb-8">
          <p className="text-sm text-gray-500">Account</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-black">
            Edit Profile
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Update your name and email address.
          </p>
        </div>

        <ProfileEditForm
          defaultDisplayName={user.DisplayName || ""}
          defaultEmail={user.email}
        />
      </div>
    </main>
  );
}