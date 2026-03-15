"use client";

import { useMemo, useState } from "react";
import { ChevronDown, HelpCircle, Package, CreditCard, User, ShieldCheck, Search, Mail } from "lucide-react";

type FAQItem = {
  id: number;
  question: string;
  answer: string;
  category: "Orders" | "Payments" | "Account" | "Policies";
};

const faqs: FAQItem[] = [
  {
    id: 1,
    category: "Orders",
    question: "How do I place an order?",
    answer:
      "Browse products, choose your preferred size or variant, add the item to your cart, and proceed to checkout. After entering your shipping details and completing payment, your order will be confirmed.",
  },
  {
    id: 2,
    category: "Orders",
    question: "Where can I see my orders?",
    answer:
      "You can check your order history from your account after signing in. This helps you track past purchases and current order details.",
  },
  {
    id: 3,
    category: "Orders",
    question: "Can I cancel my order after placing it?",
    answer:
      "Order cancellation depends on whether your order has already been processed. If you need help, contact support as soon as possible.",
  },
  {
    id: 4,
    category: "Payments",
    question: "What payment methods are accepted?",
    answer:
      "ShopKart supports secure online payments such as UPI, cards, and net banking through the integrated payment gateway.",
  },
  {
    id: 5,
    category: "Payments",
    question: "Is my payment secure?",
    answer:
      "Yes. Payments are processed through a secure encrypted payment gateway to help protect your payment information.",
  },
  {
    id: 6,
    category: "Payments",
    question: "What should I do if my payment fails?",
    answer:
      "If your payment fails, first check your bank account or payment app. If money was deducted but the order was not confirmed, contact support with your payment details.",
  },
  {
    id: 7,
    category: "Account",
    question: "Do I need an account to place an order?",
    answer:
      "Yes. You need an account to place an order so your purchases, addresses, and order details can be managed properly.",
  },
  {
    id: 8,
    category: "Account",
    question: "I forgot my password. What should I do?",
    answer:
      "Use the password reset option from the login page. Follow the instructions sent to your email to set a new password.",
  },
  {
    id: 9,
    category: "Policies",
    question: "Do you offer returns or refunds?",
    answer:
      "No. ShopKart currently does not offer returns or refunds. Please check product details, pricing, and size selection carefully before placing an order.",
  },
  {
    id: 10,
    category: "Policies",
    question: "Why is there no return policy?",
    answer:
      "ShopKart currently follows a no-return and no-refund policy. Customers should review all product information carefully before checkout.",
  },
];

const categories = [
  {
    name: "All",
    icon: HelpCircle,
    description: "View all help topics",
  },
  {
    name: "Orders",
    icon: Package,
    description: "Order placement and tracking",
  },
  {
    name: "Payments",
    icon: CreditCard,
    description: "Payment and checkout help",
  },
  {
    name: "Account",
    icon: User,
    description: "Login and account support",
  },
  {
    name: "Policies",
    icon: ShieldCheck,
    description: "Rules, returns, and refunds",
  },
] as const;

export default function HelpPage() {
  const [selectedCategory, setSelectedCategory] = useState<
    "All" | "Orders" | "Payments" | "Account" | "Policies"
  >("All");
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<number | null>(1);

  const filteredFaqs = useMemo(() => {
    return faqs.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;

      const term = search.trim().toLowerCase();
      const matchesSearch =
        !term ||
        item.question.toLowerCase().includes(term) ||
        item.answer.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, search]);

  return (
    <main className="min-h-screen text-neutral-900 py-40">
      <section className="">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1 text-sm font-medium text-neutral-700">
              ShopKart Help Center
            </span>

            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              How can we help you?
            </h1>

            <p className="mt-4 text-base leading-7 text-neutral-600 sm:text-lg">
              Find answers about orders, payments, account issues, and store
              policies.
            </p>

            <div className="mt-8 relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search help articles, questions, payments, orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-neutral-200 bg-white py-4 pl-12 pr-4 text-sm outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category) => {
            const Icon = category.icon;
            const active = selectedCategory === category.name;

            return (
              <button
                key={category.name}
                onClick={() =>
                  setSelectedCategory(
                    category.name as
                      | "All"
                      | "Orders"
                      | "Payments"
                      | "Account"
                      | "Policies"
                  )
                }
                className={`rounded-2xl border p-5 text-left transition ${
                  active
                    ? "border-neutral-900 bg-neutral-900 text-white shadow-lg"
                    : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm"
                }`}
              >
                <div
                  className={`mb-4 inline-flex rounded-xl p-3 ${
                    active ? "bg-white/10" : "bg-neutral-100"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      active ? "text-white" : "text-neutral-700"
                    }`}
                  />
                </div>

                <h2 className="text-base font-semibold">{category.name}</h2>
                <p
                  className={`mt-2 text-sm ${
                    active ? "text-neutral-200" : "text-neutral-600"
                  }`}
                >
                  {category.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-16 lg:grid-cols-[1.6fr_0.8fr]">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-2 border-b border-neutral-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-2xl font-semibold">Frequently Asked Questions</h3>
              <p className="mt-1 text-sm text-neutral-600">
                {filteredFaqs.length} result{filteredFaqs.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <div className="text-sm text-neutral-500">
              Category: <span className="font-medium text-neutral-800">{selectedCategory}</span>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((item) => {
                const isOpen = openId === item.id;

                return (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50"
                  >
                    <button
                      onClick={() => setOpenId(isOpen ? null : item.id)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    >
                      <div>
                        <span className="mb-2 inline-block rounded-full bg-white px-2.5 py-1 text-xs font-medium text-neutral-600 border border-neutral-200">
                          {item.category}
                        </span>
                        <h4 className="text-base font-semibold text-neutral-900">
                          {item.question}
                        </h4>
                      </div>

                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-neutral-500 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="border-t border-neutral-200 bg-white px-5 py-4">
                        <p className="text-sm leading-7 text-neutral-700">
                          {item.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-12 text-center">
                <h4 className="text-lg font-semibold">No matching help articles</h4>
                <p className="mt-2 text-sm text-neutral-600">
                  Try a different keyword or switch to another category.
                </p>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold">Important Policy</h3>
            <p className="mt-3 text-sm leading-7 text-neutral-600">
              ShopKart follows a strict{" "}
              <span className="font-semibold text-neutral-900">
                no return and no refund policy
              </span>
              . Please verify product details, size, quantity, and payment
              information before confirming your order.
            </p>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-neutral-100 p-3">
                <Mail className="h-5 w-5 text-neutral-700" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Need more help?</h3>
                <p className="text-sm text-neutral-600">
                  Contact ShopKart support
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-sm text-neutral-700">
              <p>
                Email:{" "}
                <a
                  href="mailto:support@shopkart.com"
                  className="font-medium underline underline-offset-4"
                >
                  support@shopkart.com
                </a>
              </p>
              <p>Response time: 24–48 hours</p>
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-gradient-to-br from-neutral-900 to-neutral-700 p-6 text-white shadow-sm">
            <h3 className="text-xl font-semibold">Before you checkout</h3>
            <ul className="mt-4 space-y-3 text-sm text-neutral-200">
              <li>• Confirm your selected size or variant</li>
              <li>• Double-check your shipping address</li>
              <li>• Ensure payment details are correct</li>
              <li>• Review product details carefully</li>
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}