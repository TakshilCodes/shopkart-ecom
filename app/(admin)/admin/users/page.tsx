import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import UserSearch from "@/components/admin/UserSearch";
import DeleteUserButton from "@/components/admin/DeleteUserButton";
import { deleteUserAction } from "@/actions/admin/action.users";

type UsersPageProps = {
  searchParams?: Promise<{
    q?: string;
  }>;
};

export default async function AdminUsersPage({
  searchParams,
}: UsersPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/admin/signin");
  }

  if (session.user.role !== "Admin") {
    redirect("/");
  }

  const params = await searchParams;
  const query = params?.q?.trim() || "";

  const users = await prisma.users.findMany({
    where: query
      ? {
          OR: [
            {
              email: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              DisplayName: {
                contains: query,
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
      DisplayName: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          orders: true,
          cart: true,
          address: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-zinc-50 p-6 md:p-8">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Users
        </h1>
        <p className="text-sm text-zinc-500">
          Search, view and manage registered users.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-200 px-5 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900">All Users</h2>
              <p className="text-sm text-zinc-500">
                Showing {users.length} user{users.length === 1 ? "" : "s"}
              </p>
            </div>

            <div className="w-full sm:w-80">
              <UserSearch />
            </div>
          </div>
        </div>

        <div className="p-5">
          {users.length === 0 ? (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-500">
              No users found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-zinc-50">
                  <tr className="text-sm text-zinc-500">
                    <th className="rounded-l-xl px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Orders</th>
                    <th className="px-4 py-3 font-medium">Cart</th>
                    <th className="px-4 py-3 font-medium">Addresses</th>
                    <th className="px-4 py-3 font-medium">Joined</th>
                    <th className="rounded-r-xl px-4 py-3 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => {
                    const isSelf =
                      session.user.id && user.id === session.user.id;
                    const isAdmin = user.role === "Admin";
                    const disableDelete = isAdmin || Boolean(isSelf);

                    return (
                      <tr
                        key={user.id}
                        className="border-b border-zinc-100 text-sm"
                      >
                        <td className="px-4 py-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-zinc-900">
                              {user.DisplayName || "Unnamed User"}
                            </span>
                            <span className="text-xs text-zinc-500">
                              {user.email}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              isAdmin
                                ? "bg-purple-100 text-purple-700"
                                : "bg-zinc-100 text-zinc-700"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-zinc-700">
                          {user._count.orders}
                        </td>

                        <td className="px-4 py-4 text-zinc-700">
                          {user._count.cart}
                        </td>

                        <td className="px-4 py-4 text-zinc-700">
                          {user._count.address}
                        </td>

                        <td className="px-4 py-4 text-zinc-500">
                          {new Date(user.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>

                        <td className="px-4 py-4">
                          <form action={deleteUserAction}>
                            <input type="hidden" name="userId" value={user.id} />
                            <DeleteUserButton disabled={disableDelete} />
                          </form>

                          {isAdmin ? (
                            <p className="mt-1 text-xs text-zinc-400">
                              Admin protected
                            </p>
                          ) : isSelf ? (
                            <p className="mt-1 text-xs text-zinc-400">
                              Current account
                            </p>
                          ) : null}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}