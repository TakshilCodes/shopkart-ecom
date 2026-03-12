import { deleteAddress } from "@/actions/action.address";
import DeleteAddressButton from "@/components/DeleteAddressButton";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProfilePage() {

    const session = await getServerSession(authOptions)

    if (!session?.user.id) {
        redirect('/signin')
    }

    const user = await prisma.users.findUnique({
        where: { id: session.user.id },
        select: {
            DisplayName: true,
            email: true,
            address: {
                orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
                select: {
                    id: true,
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
            },
        },
    });

    const addresses = user?.address ?? [];

    return (
        <main className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 pt-45">
                {/* Header */}
                <div className="mb-8">
                    <p className="text-sm text-gray-500">Account</p>
                    <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-black">
                        My Profile
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Manage your personal information, password, and saved addresses.
                    </p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <section className="xl:col-span-2 space-y-6">
                        {/* Personal Info */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-black">
                                        Personal Information
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Update your profile details and account information.
                                    </p>
                                </div>

                                <Link
                                    href="/profile/edit"
                                    className="inline-flex items-center justify-center h-10 px-4 rounded-xl border border-gray-300 text-sm font-medium text-black hover:border-black hover:bg-gray-50 transition"
                                >
                                    Edit Profile
                                </Link>
                            </div>

                            <div className="p-5 sm:p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                                    <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
                                        {session.user.image ? (
                                            <img
                                                src={session.user.image}
                                                alt={user?.DisplayName ?? "Profile"}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-2xl font-semibold text-gray-500">
                                                {(user?.DisplayName?.[0] || user?.email?.[0] || "U").toUpperCase()}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-2xl font-semibold text-black">
                                            {user?.DisplayName || "User"}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">{user?.email}</p>

                                        <div className="mt-4 flex flex-wrap gap-3">
                                            <Link
                                                href="/profile/edit"
                                                className="inline-flex items-center justify-center h-10 px-4 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-900 transition"
                                            >
                                                Change Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="rounded-2xl border border-gray-200 bg-[#fafafa] p-4">
                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Full Name
                                        </p>
                                        <p className="mt-2 text-base font-medium text-black">
                                            {user?.DisplayName || "Not added"}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-gray-200 bg-[#fafafa] p-4">
                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Email Address
                                        </p>
                                        <p className="mt-2 text-base font-medium text-black">
                                            {user?.email}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-black">Security</h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Keep your account secure by updating your password regularly.
                                    </p>
                                </div>

                                <Link
                                    href="/profile/change-password"
                                    className="inline-flex items-center justify-center h-10 px-4 rounded-xl border border-gray-300 text-sm font-medium text-black hover:border-black hover:bg-gray-50 transition"
                                >
                                    Change Password
                                </Link>
                            </div>

                            <div className="p-5 sm:p-6">
                                <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-[#fafafa] p-4">
                                    <div>
                                        <p className="text-sm font-medium text-black">Password</p>
                                        <p className="mt-1 text-sm text-gray-500">
                                            ••••••••••••
                                        </p>
                                    </div>

                                    <Link
                                        href="/profile/change-password"
                                        className="inline-flex items-center justify-center h-10 px-4 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-900 transition"
                                    >
                                        Update
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Addresses */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-semibold text-black">
                                        Saved Addresses
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Manage delivery addresses for faster checkout.
                                    </p>
                                </div>

                                <Link
                                    href="/address"
                                    className="inline-flex items-center justify-center h-10 px-4 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-900 transition"
                                >
                                    Add Address
                                </Link>
                            </div>

                            <div className="p-5 sm:p-6">
                                {addresses.length > 0 ? (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        {addresses.map((address) => (
                                            <div
                                                key={address.id}
                                                className="rounded-2xl border border-gray-200 p-5 hover:border-gray-300 transition"
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <p className="text-base font-semibold text-black">
                                                                {address.fullName}
                                                            </p>

                                                            {address.isDefault && (
                                                                <span className="inline-flex items-center rounded-full bg-black px-2.5 py-1 text-xs font-medium text-white">
                                                                    Default
                                                                </span>
                                                            )}
                                                        </div>

                                                        <p className="mt-2 text-sm text-gray-600 leading-6">
                                                            {address.phoneNumber}
                                                        </p>
                                                        <p className="text-sm text-gray-600 leading-6">
                                                            {address.AddressLine1}
                                                        </p>
                                                        {address.AddressLine2 ? (
                                                            <p className="text-sm text-gray-600 leading-6">
                                                                {address.AddressLine2}
                                                            </p>
                                                        ) : null}
                                                        <p className="text-sm text-gray-600 leading-6">
                                                            {address.City}, {address.State} - {address.pincode}
                                                        </p>
                                                        <p className="text-sm text-gray-600 leading-6">
                                                            {address.Country}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mt-5 flex flex-wrap gap-3">
                                                    <Link
                                                        href={`/address/${address.id}/edit`}
                                                        className="inline-flex items-center justify-center h-10 px-4 rounded-xl border border-gray-300 text-sm font-medium text-black hover:border-black hover:bg-gray-50 transition"
                                                    >
                                                        Edit
                                                    </Link>

                                                    <DeleteAddressButton id={address.id} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center">
                                        <div className="mx-auto w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                                            <svg
                                                className="w-6 h-6 text-gray-500"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                            </svg>
                                        </div>

                                        <h3 className="mt-4 text-lg font-semibold text-black">
                                            No addresses saved
                                        </h3>
                                        <p className="mt-2 text-sm text-gray-500">
                                            Add your first delivery address for a faster checkout experience.
                                        </p>

                                        <Link
                                            href="/address"
                                            className="inline-flex items-center justify-center mt-5 h-11 px-5 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-900 transition"
                                        >
                                            Add Address
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Right Column */}
                    <aside className="xl:col-span-1">
                        <div className="sticky top-6 space-y-6">
                            {/* Account Overview */}
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
                                <h2 className="text-lg font-semibold text-black">
                                    Account Overview
                                </h2>

                                <div className="mt-5 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">Name</span>
                                        <span className="text-sm font-medium text-black">
                                            {user?.DisplayName || "Not set"}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-sm text-gray-500">Email</span>
                                        <span className="text-sm font-medium text-black text-right break-all">
                                            {user?.email}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">Addresses</span>
                                        <span className="text-sm font-medium text-black">
                                            {addresses.length}
                                        </span>
                                    </div>

                                    <div className="border-t border-gray-100 pt-4">
                                        <Link
                                            href="/orders"
                                            className="inline-flex w-full items-center justify-center h-11 rounded-xl border border-gray-300 text-sm font-medium text-black hover:border-black hover:bg-gray-50 transition"
                                        >
                                            View Orders
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
                                <h2 className="text-lg font-semibold text-black">
                                    Quick Actions
                                </h2>

                                <div className="mt-5 flex flex-col gap-3">
                                    <Link
                                        href="/profile/edit"
                                        className="inline-flex items-center justify-center h-11 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-900 transition"
                                    >
                                        Edit Profile
                                    </Link>

                                    <Link
                                        href="/profile/change-password"
                                        className="inline-flex items-center justify-center h-11 rounded-xl border border-gray-300 text-sm font-medium text-black hover:border-black hover:bg-gray-50 transition"
                                    >
                                        Change Password
                                    </Link>

                                    <Link
                                        href="/address"
                                        className="inline-flex items-center justify-center h-11 rounded-xl border border-gray-300 text-sm font-medium text-black hover:border-black hover:bg-gray-50 transition"
                                    >
                                        Add New Address
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}