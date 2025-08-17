/*
  Warnings:

  - You are about to drop the `Movimentacao` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Movimentacao" DROP CONSTRAINT "Movimentacao_insumoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Movimentacao" DROP CONSTRAINT "Movimentacao_usuarioId_fkey";

-- DropTable
DROP TABLE "public"."Movimentacao";

-- CreateTable
CREATE TABLE "public"."Entrada" (
    "id" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validade" TIMESTAMP(3),
    "insumoId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,

    CONSTRAINT "Entrada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Saida" (
    "id" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "destino" TEXT NOT NULL,
    "insumoId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,

    CONSTRAINT "Saida_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Entrada" ADD CONSTRAINT "Entrada_insumoId_fkey" FOREIGN KEY ("insumoId") REFERENCES "public"."Insumo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Entrada" ADD CONSTRAINT "Entrada_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Saida" ADD CONSTRAINT "Saida_insumoId_fkey" FOREIGN KEY ("insumoId") REFERENCES "public"."Insumo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Saida" ADD CONSTRAINT "Saida_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
