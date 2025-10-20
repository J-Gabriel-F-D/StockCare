/*
  Warnings:

  - A unique constraint covering the columns `[codigoBarras]` on the table `Insumo` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Insumo" ALTER COLUMN "codigoBarras" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Insumo_codigoBarras_key" ON "public"."Insumo"("codigoBarras");
