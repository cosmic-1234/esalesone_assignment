/*
  Warnings:

  - You are about to drop the column `cardNumber` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `cvv` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `expiryDate` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `zip` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the `Variant` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cardLast4` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipCode` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Variant" DROP CONSTRAINT "Variant_productId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "cardNumber",
DROP COLUMN "cvv",
DROP COLUMN "expiryDate",
DROP COLUMN "zip",
ADD COLUMN     "cardLast4" TEXT NOT NULL,
ADD COLUMN     "zipCode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "price";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "colors" TEXT[],
ADD COLUMN     "inventory" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN     "sizes" TEXT[];

-- DropTable
DROP TABLE "Variant";
