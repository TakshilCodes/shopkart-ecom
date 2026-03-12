"use client";

import { updateAddress } from "@/actions/action.address";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type AddressType = {
  id: string;
  fullName: string;
  phoneNumber: string;
  Country: string;
  AddressLine1: string;
  AddressLine2: string | null;
  City: string;
  State: string;
  pincode: string;
  isDefault: boolean;
};

export default function EditAddressForm({ address }: { address: AddressType }) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    id: address.id,
    fullName: address.fullName,
    phoneNumber: address.phoneNumber,
    Country: address.Country,
    AddressLine1: address.AddressLine1,
    AddressLine2: address.AddressLine2 || "",
    City: address.City,
    State: address.State,
    pincode: address.pincode,
    isDefault: address.isDefault,
  });

  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const res = await updateAddress(formData);

    if (res.ok) {
      toast.success(res.message);
      router.push("/profile");
      router.refresh();
    } else {
      toast.error(res.message);
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Full Name
          </label>
          <input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            type="text"
            required
            className="w-full h-11 rounded-xl border border-gray-300 px-4 outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Phone Number
          </label>
          <input
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            type="text"
            required
            className="w-full h-11 rounded-xl border border-gray-300 px-4 outline-none focus:border-black"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-black mb-2">
          Country
        </label>
        <input
          name="Country"
          value={formData.Country}
          onChange={handleChange}
          type="text"
          required
          className="w-full h-11 rounded-xl border border-gray-300 px-4 outline-none focus:border-black"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-black mb-2">
          Address Line 1
        </label>
        <input
          name="AddressLine1"
          value={formData.AddressLine1}
          onChange={handleChange}
          type="text"
          required
          className="w-full h-11 rounded-xl border border-gray-300 px-4 outline-none focus:border-black"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-black mb-2">
          Address Line 2
        </label>
        <input
          name="AddressLine2"
          value={formData.AddressLine2}
          onChange={handleChange}
          type="text"
          className="w-full h-11 rounded-xl border border-gray-300 px-4 outline-none focus:border-black"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            City
          </label>
          <input
            name="City"
            value={formData.City}
            onChange={handleChange}
            type="text"
            required
            className="w-full h-11 rounded-xl border border-gray-300 px-4 outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-2">
            State
          </label>
          <input
            name="State"
            value={formData.State}
            onChange={handleChange}
            type="text"
            required
            className="w-full h-11 rounded-xl border border-gray-300 px-4 outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Pincode
          </label>
          <input
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            type="text"
            required
            className="w-full h-11 rounded-xl border border-gray-300 px-4 outline-none focus:border-black"
          />
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          name="isDefault"
          checked={formData.isDefault}
          onChange={handleChange}
          className="h-4 w-4"
        />
        <span className="text-sm text-black">Set as default address</span>
      </label>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center h-11 px-5 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-900 transition disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>

        <Link
          href="/profile"
          className="inline-flex items-center justify-center h-11 px-5 rounded-xl border border-gray-300 text-sm font-medium text-black hover:border-black hover:bg-gray-50 transition"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}