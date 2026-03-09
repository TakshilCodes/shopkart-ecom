import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import CategoriesClient from "@/components/admin/CategoriesClient";

export default async function CategoriesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/admin/signin");
  }

  if (session.user.role !== "Admin") {
    redirect("/");
  }

  return <CategoriesClient />;
}