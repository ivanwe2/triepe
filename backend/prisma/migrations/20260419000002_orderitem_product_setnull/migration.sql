-- Make productId nullable so products with past orders can be deleted
ALTER TABLE "OrderItem" ALTER COLUMN "productId" DROP NOT NULL;

-- Replace FK constraint with SET NULL on delete
ALTER TABLE "OrderItem" DROP CONSTRAINT IF EXISTS "OrderItem_productId_fkey";
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey"
  FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
