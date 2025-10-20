/*
  Warnings:

  - Added the required column `codigoBarras` to the `Insumo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Insumo" ADD COLUMN     "codigoBarras" INTEGER NOT NULL;
