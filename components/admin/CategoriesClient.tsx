"use client";

import { useEffect, useState } from "react";

type CategoryItem = {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
    _count: {
        products: number;
    };
};

type CategoriesResponse = {
    ok: boolean;
    categories: CategoryItem[] | null;
    error: string | null;
};

type CreateCategoryResponse = {
    ok: boolean;
    category: CategoryItem | null;
    error: string | null;
};

export default function CategoriesClient() {
    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [search, setSearch] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState("");
    const [createError, setCreateError] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);

    async function fetchCategories(query: string) {
        try {
            setLoading(true);
            setError("");

            const res = await fetch(
                `/api/admin/categories${query ? `?q=${encodeURIComponent(query)}` : ""}`,
                {
                    method: "GET",
                    cache: "no-store",
                }
            );

            const data: CategoriesResponse = await res.json();

            if (!res.ok || !data.ok) {
                throw new Error(data.error || "Failed to fetch categories");
            }

            setCategories(data.categories || []);
        } catch (err: any) {
            setError(err?.message || "Something went wrong");
            setCategories([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCategories("");
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchValue.trim());
        }, 400);

        return () => clearTimeout(timer);
    }, [searchValue]);

    useEffect(() => {
        fetchCategories(search);
    }, [search]);

    async function handleCreateCategory(e: React.FormEvent) {
        e.preventDefault();

        if (!newCategory.trim()) {
            setCreateError("Category name is required");
            return;
        }

        try {
            setCreating(true);
            setCreateError("");

            const res = await fetch("/api/admin/categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: newCategory.trim(),
                }),
            });

            const data: CreateCategoryResponse = await res.json();

            if (!res.ok || !data.ok) {
                throw new Error(data.error || "Failed to create category");
            }

            setNewCategory("");
            await fetchCategories(search);
        } catch (err: any) {
            setCreateError(err?.message || "Something went wrong");
        } finally {
            setCreating(false);
        }
    }

    async function handleDeleteCategory(id: string, productCount: number) {
        if (productCount > 0) {
            setError("This category cannot be deleted because products are assigned to it.");
            return;
        }

        const confirmed = window.confirm("Are you sure you want to delete this category?");
        if (!confirmed) return;

        try {
            setDeletingId(id);
            setError("");

            const res = await fetch(`/api/admin/categories?id=${id}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (!res.ok || !data.ok) {
                throw new Error(data.error || "Failed to delete category");
            }

            await fetchCategories(search);
        } catch (err: any) {
            setError(err?.message || "Something went wrong");
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="min-h-screen bg-zinc-50 p-6 md:p-8">
            <div className="mb-8 flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                    Categories
                </h1>
                <p className="text-sm text-zinc-500">
                    Manage product categories for your ShopKart store.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="xl:col-span-2 rounded-2xl border border-zinc-200 bg-white shadow-sm">
                    <div className="border-b border-zinc-200 px-5 py-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-zinc-900">
                                    All Categories
                                </h2>
                                <p className="text-sm text-zinc-500">
                                    Search and view all available categories.
                                </p>
                            </div>

                            <div className="w-full sm:w-72">
                                <input
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    placeholder="Search category..."
                                    className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none transition focus:border-zinc-400"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-5">
                        {loading ? (
                            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-500">
                                Loading categories...
                            </div>
                        ) : error ? (
                            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                {error}
                            </div>
                        ) : categories.length === 0 ? (
                            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-500">
                                No categories found.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left">
                                    <thead className="bg-zinc-50">
                                        <tr className="text-sm text-zinc-500">
                                            <th className="rounded-l-xl px-4 py-3 font-medium">Name</th>
                                            <th className="px-4 py-3 font-medium">Slug</th>
                                            <th className="px-4 py-3 font-medium">Products</th>
                                            <th className="px-4 py-3 font-medium">Created</th>
                                            <th className="rounded-r-xl px-4 py-3 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.map((category) => (
                                            <tr
                                                key={category.id}
                                                className="border-b border-zinc-100 text-sm"
                                            >
                                                <td className="px-4 py-4 font-medium text-zinc-900">
                                                    {category.name}
                                                </td>
                                                <td className="px-4 py-4 text-zinc-600">
                                                    {category.slug}
                                                </td>
                                                <td className="px-4 py-4 text-zinc-700">
                                                    {category._count.products}
                                                </td>
                                                <td className="px-4 py-4 text-zinc-500">
                                                    {new Date(category.createdAt).toLocaleDateString("en-IN", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDeleteCategory(category.id, category._count.products)
                                                        }
                                                        disabled={deletingId === category.id || category._count.products > 0}
                                                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {deletingId === category.id ? "Deleting..." : "Delete"}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
                    <div className="border-b border-zinc-200 px-5 py-4">
                        <h2 className="text-lg font-semibold text-zinc-900">
                            Add Category
                        </h2>
                        <p className="text-sm text-zinc-500">
                            Create a new category for your products.
                        </p>
                    </div>

                    <form onSubmit={handleCreateCategory} className="space-y-4 p-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">
                                Category Name
                            </label>
                            <input
                                type="text"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="e.g. Shoes"
                                className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none transition focus:border-zinc-400"
                            />
                        </div>

                        {createError && (
                            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                {createError}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={creating}
                            className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-black px-5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {creating ? "Creating..." : "Create Category"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}