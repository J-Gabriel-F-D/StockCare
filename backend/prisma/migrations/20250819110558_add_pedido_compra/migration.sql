-- CreateTable
CREATE TABLE "public"."PedidoCompra" (
    "id" TEXT NOT NULL,
    "insumoId" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PedidoCompra_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."PedidoCompra" ADD CONSTRAINT "PedidoCompra_insumoId_fkey" FOREIGN KEY ("insumoId") REFERENCES "public"."Insumo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
