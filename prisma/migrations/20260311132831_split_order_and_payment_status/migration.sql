-- 1) Create new enum for payment status
CREATE TYPE "PaymentStatus_new" AS ENUM (
  'PENDING_PAYMENT',
  'PAID',
  'FAILED',
  'CANCELLED'
);

-- 2) Create new enum for order lifecycle
CREATE TYPE "OrderStatus_new" AS ENUM (
  'Order_Received',
  'In_Transit',
  'Out_of_delivery',
  'Delivered'
);

-- 3) Add the new orderStatus column with a safe default
ALTER TABLE "Order"
ADD COLUMN "orderStatus" "OrderStatus_new" NOT NULL DEFAULT 'Order_Received';

-- 4) Convert old "status" column from old enum type to the new payment enum
ALTER TABLE "Order"
ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "Order"
ALTER COLUMN "status" TYPE "PaymentStatus_new"
USING (
  CASE "status"::text
    WHEN 'PENDING_PAYMENT' THEN 'PENDING_PAYMENT'::"PaymentStatus_new"
    WHEN 'PAID' THEN 'PAID'::"PaymentStatus_new"
    WHEN 'FAILED' THEN 'FAILED'::"PaymentStatus_new"
    WHEN 'CANCELLED' THEN 'CANCELLED'::"PaymentStatus_new"
  END
);

ALTER TABLE "Order"
ALTER COLUMN "status" SET DEFAULT 'PENDING_PAYMENT'::"PaymentStatus_new";

-- 5) Remove old enum type (it was previously called OrderStatus)
DROP TYPE "OrderStatus";

-- 6) Rename temp enums to final Prisma names
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";