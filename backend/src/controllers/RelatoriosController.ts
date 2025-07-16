import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { startOfYear } from "date-fns";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const getRelatorioMovimentacoes = async (req: Request, res: Response) => {
  try {
    const { tipo, insumo, inicio, fim, destino } = req.query;

    const filtros: any = {};

    if (tipo && (tipo === "entrada" || tipo === "saida")) {
      filtros.tipo = tipo;
    }

    if (insumo) {
      filtros.insumoId = parseInt(insumo as string);
    }

    const dataInicio = inicio
      ? new Date(inicio as string)
      : startOfYear(new Date());
    const dataFim = fim ? new Date(fim as string) : new Date();

    if (destino) {
      filtros.destino = {
        contains: destino as string,
        mode: "insensitive",
      };
    }

    filtros.data = {
      gte: dataInicio,
      lte: dataFim,
    };

    console.log(tipo, insumo, inicio, fim, destino, "\n", filtros);

    const movimentacoes = await prisma.movimentacao.findMany({
      where: filtros,
      include: {
        insumo: {
          include: {
            fornecedor: true,
          },
        },
      },
      orderBy: {
        data: "desc",
      },
    });

    const resultado = movimentacoes.map((mov) => ({
      id: mov.id,
      tipo: mov.tipo,
      data: mov.data,
      quantidade: mov.quantidade,
      destino: mov.destino || "N/A",
      insumo: mov.insumo?.nome || "N/A",
      unidadeMedida: mov.insumo?.unidadeMedida || "N/A",
      fornecedor: mov.insumo?.fornecedor?.nome || "N/A",
    }));

    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: "Erro ao gerar relatório: " + error });
  }
};

const createRelatorio = async (req: Request, res: Response) => {
  try {
    const { tipo, insumo, inicio, fim, destino, formato } = req.query;

    const exportDir = path.resolve(__dirname, "../../exports");
    console.log(exportDir);

    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    const filtros: any = {};

    if (tipo && (tipo === "entrada" || tipo === "saida")) {
      filtros.tipo = tipo;
    }

    if (insumo) {
      filtros.insumoId = parseInt(insumo as string);
    }

    const dataInicio = inicio
      ? new Date(inicio as string)
      : startOfYear(new Date());
    const dataFim = fim ? new Date(fim as string) : new Date();

    if (destino) {
      filtros.destino = {
        contains: destino as string,
        mode: "insensitive",
      };
    }
    filtros.data = { gte: dataInicio, lte: dataFim };

    const movimentacoes = await prisma.movimentacao.findMany({
      where: filtros,
      include: {
        insumo: {
          include: {
            fornecedor: true,
          },
        },
      },
      orderBy: { data: "desc" },
    });

    const dados = movimentacoes.map((mov) => ({
      id: mov.id,
      tipo: mov.tipo,
      data: mov.data.toISOString().split("T")[0],
      quantidade: mov.quantidade,
      destino: mov.destino || "N/A",
      insumo: mov.insumo?.nome || "N/A",
      unidade: mov.insumo?.unidadeMedida || "N/A",
      fornecedor: mov.insumo?.fornecedor?.nome || "N/A",
    }));

    const formatoArquivo = (formato as string)?.toLowerCase();

    if (!formatoArquivo || !["xlsx", "pdf"].includes(formatoArquivo)) {
      return res.status(400).json({
        error:
          "O parâmetro 'formato' é obrigatório e deve ser 'xlsx' ou 'pdf'.",
      });
    }

    // Caso o formato seja XLSX
    if (formatoArquivo === "xlsx") {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Relatório de Movimentações");
      sheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Tipo", key: "tipo", width: 12 },
        { header: "Data", key: "data", width: 15 },
        { header: "Quantidade", key: "quantidade", width: 12 },
        { header: "Destino", key: "destino", width: 20 },
        { header: "Insumo", key: "insumo", width: 25 },
        { header: "Unidade", key: "unidade", width: 15 },
        { header: "Fornecedor", key: "fornecedor", width: 25 },
      ];
      sheet.addRows(dados);

      const filePath = path.resolve(__dirname, "../../exports/relatorio.xlsx");
      await workbook.xlsx.writeFile(filePath);
      return res.download(filePath, "relatorio.xlsx");
    }

    // Caso o formato seja PDF
    if (formatoArquivo === "pdf") {
      const doc = new PDFDocument({ margin: 30 });
      const filePath = path.resolve(__dirname, "../../exports/relatorio.pdf");
      const writeStream = fs.createWriteStream(filePath);

      doc.pipe(writeStream);

      doc.fontSize(18).text("Relatório de Movimentações", { align: "center" });
      doc.moveDown();

      dados.forEach((mov) => {
        doc
          .fontSize(10)
          .text(
            `ID: ${mov.id} | Tipo: ${mov.tipo} | Data: ${mov.data} | Qtde: ${mov.quantidade} | Destino: ${mov.destino}`
          );
        doc
          .fontSize(10)
          .text(
            `Insumo: ${mov.insumo} | Unidade: ${mov.unidade} | Fornecedor: ${mov.fornecedor}`
          );
        doc.moveDown();
      });

      doc.end();

      writeStream.on("finish", () => {
        res.download(filePath, "relatorio.pdf");
      });

      return;
    }

    return res
      .status(400)
      .json({ error: "Formato inválido. Use ?formato=pdf ou ?formato=xlsx" });
  } catch (error) {
    console.error("Erro ao exportar relatório:", error);
    res.status(500).json({ error: "Erro ao exportar relatório: " + error });
  }
};

export const RelatoriosController = {
  getRelatorioMovimentacoes,
  createRelatorio,
};
