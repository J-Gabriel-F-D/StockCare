-- DropForeignKey
ALTER TABLE "public"."Entrada" DROP CONSTRAINT "Entrada_insumoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Saida" DROP CONSTRAINT "Saida_insumoId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Entrada" ADD CONSTRAINT "Entrada_insumoId_fkey" FOREIGN KEY ("insumoId") REFERENCES "public"."Insumo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Saida" ADD CONSTRAINT "Saida_insumoId_fkey" FOREIGN KEY ("insumoId") REFERENCES "public"."Insumo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
