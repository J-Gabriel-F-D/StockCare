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

const getInsumosCriticos = async (req: Request, res: Response) => {
  try {
    const { insumo } = req.query;

    const filtros: any = {};

    if (insumo) {
      filtros.insumoId = parseInt(insumo as string);
    }

    // Busca todos os insumos com movimentações filtradas
    const insumos = await prisma.insumo.findMany({
      where: insumo ? { id: filtros.insumoId } : {},
      include: {
        Movimentacao: true,
        fornecedor: true,
      },
    });

    // Calcula os saldos
    const criticos = insumos
      .map((insumo) => {
        const entradas = insumo.Movimentacao.filter(
          (mov) => mov.tipo === "entrada"
        ).reduce((acc, mov) => acc + mov.quantidade, 0);
        const saidas = insumo.Movimentacao.filter(
          (mov) => mov.tipo === "saida"
        ).reduce((acc, mov) => acc + mov.quantidade, 0);

        const saldo = entradas - saidas;

        if (saldo < insumo.quantidadeMinima) {
          return {
            nome: insumo.nome,
            unidade: insumo.unidadeMedida,
            atual: saldo,
            minimo: insumo.quantidadeMinima,
            fornecedor: insumo.fornecedor?.nome ?? "N/A",
          };
        }

        return null;
      })
      .filter(Boolean);

    res.status(200).json(criticos);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao buscar insumos críticos: " + error });
  }
};

const exportInsumosCriticos = async (req: Request, res: Response) => {
  try {
    const formato = req.query.formato?.toString();
    const insumoId = req.query.insumoId
      ? parseInt(req.query.insumoId as string)
      : undefined;

    if (!formato || !["pdf", "xlsx"].includes(formato)) {
      return res.status(400).json({
        error: "Formato inválido ou ausente. Use ?formato=pdf ou ?formato=xlsx",
      });
    }

    const insumos = await prisma.insumo.findMany({
      where: insumoId ? { id: insumoId.toString() } : {},
      include: {
        Movimentacao: true,
        fornecedor: true,
      },
    });

    const criticos = insumos
      .map((insumo) => {
        const entradas = insumo.Movimentacao.filter(
          (m) => m.tipo === "entrada"
        ).reduce((acc, m) => acc + m.quantidade, 0);
        const saidas = insumo.Movimentacao.filter(
          (m) => m.tipo === "saida"
        ).reduce((acc, m) => acc + m.quantidade, 0);
        const saldo = entradas - saidas;

        if (saldo < insumo.quantidadeMinima) {
          return {
            nome: insumo.nome,
            unidade: insumo.unidadeMedida,
            atual: saldo,
            minimo: insumo.quantidadeMinima,
            fornecedor: insumo.fornecedor?.nome ?? "N/A",
          };
        }
        return null;
      })
      .filter(Boolean);

    if (formato === "xlsx") {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Insumos Críticos");

      sheet.columns = [
        { header: "Insumo", key: "nome" },
        { header: "Unidade", key: "unidade" },
        { header: "Qtd Atual", key: "atual" },
        { header: "Qtd Mínima", key: "minimo" },
        { header: "Fornecedor", key: "fornecedor" },
      ];

      sheet.addRows(criticos);

      const filePath = path.join(
        __dirname,
        "../../exports/relatorio-insumos-criticos.xlsx"
      );
      await workbook.xlsx.writeFile(filePath);

      return res.download(filePath);
    }

    if (formato === "pdf") {
      const doc = new PDFDocument();
      const filePath = path.join(
        __dirname,
        "../../exports/relatorio-insumos-criticos.pdf"
      );
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      doc
        .fontSize(16)
        .text("Relatório de Insumos Críticos", { align: "center" });
      doc.moveDown();

      criticos.forEach((item) => {
        if (item) {
          doc
            .fontSize(12)
            .text(`Insumo: ${item.nome}`)
            .text(`Unidade: ${item.unidade}`)
            .text(`Qtd Atual: ${item.atual}`)
            .text(`Qtd Mínima: ${item.minimo}`)
            .text(`Fornecedor: ${item.fornecedor}`)
            .moveDown();
        }
      });

      doc.end();

      writeStream.on("finish", () => res.download(filePath));
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao exportar insumos críticos: " + error });
  }
};

export const RelatoriosController = {
  getRelatorioMovimentacoes,
  createRelatorio,
  getInsumosCriticos,
  exportInsumosCriticos,
};
