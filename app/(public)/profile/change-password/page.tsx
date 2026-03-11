import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ChangePasswordForm from "@/components/ChangePasswordForm";

export default async function ChangePasswordPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const user = await prisma.users.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
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
            Change Password
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            You can either change your password using your current password or reset it with an OTP on your email.
          </p>
        </div>

        <ChangePasswordForm email={user.email} />
      </div>
    </main>
  );
}