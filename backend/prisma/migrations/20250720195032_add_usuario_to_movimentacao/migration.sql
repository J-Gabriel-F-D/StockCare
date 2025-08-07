/*
  Warnings:

  - You are about to drop the `_MovimentacaoToUsuario` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `usuarioId` to the `Movimentacao` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_MovimentacaoToUsuario" DROP CONSTRAINT "_MovimentacaoToUsuario_A_fkey";

-- DropForeignKey
ALTER TABLE "_MovimentacaoToUsuario" DROP CONSTRAINT "_MovimentacaoToUsuario_B_fkey";

-- AlterTable
ALTER TABLE "Movimentacao" ADD COLUMN     "usuarioId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_MovimentacaoToUsuario";

-- AddForeignKey
ALTER TABLE "Movimentacao" ADD CONSTRAINT "Movimentacao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
