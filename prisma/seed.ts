// prisma/seed.ts
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

// Controlled randomness: base stock per size + small variation
function stockForSize(size: string) {
  const baseBySize: Record<string, number> = {
    "6": 4,
    "7": 7,
    "8": 10,
    "9": 8,
    "10": 6,
    "11": 3,
  };

  const base = baseBySize[size] ?? 5;
  const variation = Math.floor(Math.random() * 5) - 2; // -2..+2
  return Math.max(0, Math.min(20, base + variation));
}

async function main() {
  const products = await prisma.product.findMany({ select: { id: true } });

  const sizes = ["7", "8", "9", "10", "11"];

  const data = products.flatMap((p) =>
    sizes.map((size) => ({
      productId: p.id,
      size,
      stockQuantity: stockForSize(size),
    }))
  );

  await prisma.productVariant.createMany({
    data,
    skipDuplicates: true,
  });

  console.log(
    `✅ Seeded ProductVariant: ${products.length} products × ${sizes.length} sizes = ${
      products.length * sizes.length
    } rows (skipDuplicates on).`
  );
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });