import { ShieldCheck, Truck, CreditCard, Headphones } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Fast Shipping",
    description: "Get your order delivered quickly with reliable shipping across India.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Shopping",
    description: "Your payments and personal information are protected with trusted security.",
  },
  {
    icon: CreditCard,
    title: "Easy Payments",
    description: "Pay smoothly with multiple payment options for a simple checkout experience.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Need help? Our support team is always available to assist you anytime.",
  },
];

export default function FeatureCards() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <p className="text-sm font-medium text-neutral-500">Why ShopKart</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-black sm:text-4xl">
          Built for a Better Shopping Experience
        </h2>
        <p className="mt-4 text-sm leading-6 text-neutral-600 sm:text-base">
          Premium products, secure checkout, and smooth delivery — everything designed
          to make your shopping experience simple and reliable.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100">
                <Icon className="h-6 w-6 text-black" />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-black">
                {feature.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-neutral-600">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}