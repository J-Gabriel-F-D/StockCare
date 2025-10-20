/*
  Warnings:

  - The primary key for the `Fornecedor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Insumo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Movimentacao` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Insumo" DROP CONSTRAINT "Insumo_fornecedorId_fkey";

-- DropForeignKey
ALTER TABLE "Movimentacao" DROP CONSTRAINT "Movimentacao_insumoId_fkey";

-- AlterTable
ALTER TABLE "Fornecedor" DROP CONSTRAINT "Fornecedor_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Fornecedor_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Fornecedor_id_seq";

-- AlterTable
ALTER TABLE "Insumo" DROP CONSTRAINT "Insumo_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "fornecedorId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Insumo_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Insumo_id_seq";

-- AlterTable
ALTER TABLE "Movimentacao" DROP CONSTRAINT "Movimentacao_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "insumoId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Movimentacao_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Movimentacao_id_seq";

-- AddForeignKey
ALTER TABLE "Insumo" ADD CONSTRAINT "Insumo_fornecedorId_fkey" FOREIGN KEY ("fornecedorId") REFERENCES "Fornecedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimentacao" ADD CONSTRAINT "Movimentacao_insumoId_fkey" FOREIGN KEY ("insumoId") REFERENCES "Insumo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
