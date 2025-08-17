import e, { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { startOfYear } from "date-fns";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const getRelatorioMovimentacoes = async (req: Request, res: Response) => {
  try {
    const { tipo, insumo, inicio, fim, destino } = req.query;

    const dataInicio = inicio
      ? new Date(inicio as string)
      : startOfYear(new Date());
    const dataFim = fim ? new Date(fim as string) : new Date();

    // Filtros comuns
    const filtrosComuns: any = {
      data: {
        gte: dataInicio,
        lte: dataFim,
      },
    };

    if (insumo) {
      filtrosComuns.insumoId = insumo as string;
    }

    // Filtros específicos para saída
    const filtrosSaida = { ...filtrosComuns };
    if (destino) {
      filtrosSaida["destino"] = {
        contains: destino as string,
        mode: "insensitive",
      };
    }

    let entradas: any[] = [];
    let saidas: any[] = [];

    if (!tipo || tipo === "entrada") {
      entradas = await prisma.entrada.findMany({
        where: filtrosComuns,
        include: {
          insumo: { include: { fornecedor: true } },
        },
        orderBy: { data: "desc" },
      });
    }

    if (!tipo || tipo === "saida") {
      saidas = await prisma.saida.findMany({
        where: filtrosSaida,
        include: {
          insumo: { include: { fornecedor: true } },
        },
        orderBy: { data: "desc" },
      });
    }

    // Normaliza os dados para formato único
    const resultado = [
      ...entradas.map((e) => ({
        id: e.id,
        tipo: "entrada",
        data: e.data,
        quantidade: e.quantidade,
        destino: "N/A",
        insumo: e.insumo?.nome || "N/A",
        unidadeMedida: e.insumo?.unidadeMedida || "N/A",
        fornecedor: e.insumo?.fornecedor?.nome || "N/A",
      })),
      ...saidas.map((s) => ({
        id: s.id,
        tipo: "saida",
        data: s.data,
        quantidade: s.quantidade,
        destino: s.destino || "N/A",
        insumo: s.insumo?.nome || "N/A",
        unidadeMedida: s.insumo?.unidadeMedida || "N/A",
        fornecedor: s.insumo?.fornecedor?.nome || "N/A",
      })),
    ].sort((a, b) => b.data.getTime() - a.data.getTime()); // Ordena por data desc

    res.status(200).json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao gerar relatório: " + error });
  }
};

const createRelatorio = async (req: Request, res: Response) => {
  try {
    const { tipo, insumo, inicio, fim, destino, formato } = req.query;

    const exportDir = path.resolve(__dirname, "../../exports");
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    const dataInicio = inicio
      ? new Date(inicio as string)
      : startOfYear(new Date());
    const dataFim = fim ? new Date(fim as string) : new Date();

    const filtrosComuns: any = {
      insumoId: insumo ? String(insumo) : undefined,
      data: { gte: dataInicio, lte: dataFim },
    };

    let entradas: any[] = [];
    let saidas: any[] = [];

    if (!tipo || tipo === "entrada") {
      entradas = await prisma.entrada.findMany({
        where: filtrosComuns,
        include: {
          insumo: { include: { fornecedor: true } },
          usuario: { select: { nome: true, email: true, matricula: true } },
        },
        orderBy: { data: "desc" },
      });
    }

    if (!tipo || tipo === "saida") {
      const filtrosSaida = { ...filtrosComuns };
      if (destino) {
        filtrosSaida.destino = {
          contains: destino as string,
          mode: "insensitive",
        };
      }
      saidas = await prisma.saida.findMany({
        where: filtrosSaida,
        include: {
          insumo: { include: { fornecedor: true } },
          usuario: { select: { nome: true, email: true, matricula: true } },
        },
        orderBy: { data: "desc" },
      });
    }

    const dados = [
      ...entradas.map((e) => ({
        id: e.id,
        tipo: "entrada",
        data: e.data.toISOString().split("T")[0],
        quantidade: e.quantidade,
        destino: "N/A",
        insumo: e.insumo?.nome || "N/A",
        unidade: e.insumo?.unidadeMedida || "N/A",
        fornecedor: e.insumo?.fornecedor?.nome || "N/A",
      })),
      ...saidas.map((s) => ({
        id: s.id,
        tipo: "saida",
        data: s.data.toISOString().split("T")[0],
        quantidade: s.quantidade,
        destino: s.destino || "N/A",
        insumo: s.insumo?.nome || "N/A",
        unidade: s.insumo?.unidadeMedida || "N/A",
        fornecedor: s.insumo?.fornecedor?.nome || "N/A",
      })),
    ].sort((a, b) => (a.data < b.data ? 1 : -1));

    const formatoArquivo = (formato as string)?.toLowerCase();
    if (!formatoArquivo || !["xlsx", "pdf"].includes(formatoArquivo)) {
      return res.status(400).json({
        error:
          "O parâmetro 'formato' é obrigatório e deve ser 'xlsx' ou 'pdf'.",
      });
    }

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

      const filePath = path.join(exportDir, "relatorio.xlsx");
      await workbook.xlsx.writeFile(filePath);
      return res.download(filePath, "relatorio.xlsx");
    }

    if (formatoArquivo === "pdf") {
      const doc = new PDFDocument({ margin: 30 });
      const filePath = path.join(exportDir, "relatorio.pdf");
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
  } catch (error) {
    console.error("Erro ao exportar relatório:", error);
    res.status(500).json({ error: "Erro ao exportar relatório: " + error });
  }
};

const getInsumosCriticos = async (req: Request, res: Response) => {
  try {
    const { insumo } = req.query;

    const whereInsumo = insumo ? { id: insumo as string } : {};

    // Busca insumos com entradas e saídas associadas
    const insumos = await prisma.insumo.findMany({
      where: whereInsumo,
      include: {
        Entrada: true,
        Saida: true,
        fornecedor: true,
      },
    });

    // Calcula saldo e filtra insumos críticos
    const criticos = insumos
      .map((insumo) => {
        const totalEntradas = insumo.Entrada.reduce(
          (acc, e) => acc + e.quantidade,
          0
        );
        const totalSaidas = insumo.Saida.reduce(
          (acc, s) => acc + s.quantidade,
          0
        );

        const saldo = totalEntradas - totalSaidas;

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
      .filter((item) => item !== null);

    res.status(200).json(criticos);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erro ao buscar insumos críticos: " + error });
  }
};

const exportInsumosCriticos = async (req: Request, res: Response) => {
  try {
    const formato = req.query.formato?.toString();
    const insumoId = req.query.insumoId
      ? (req.query.insumoId as string)
      : undefined;

    if (!formato || !["pdf", "xlsx"].includes(formato)) {
      return res.status(400).json({
        error: "Formato inválido ou ausente. Use ?formato=pdf ou ?formato=xlsx",
      });
    }

    const exportDir = path.join(__dirname, "../../exports");
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    // Agora busca entradas e saídas separadas
    const insumos = await prisma.insumo.findMany({
      where: insumoId ? { id: insumoId } : {},
      include: {
        Entrada: true,
        Saida: true,
        fornecedor: true,
      },
    });

    const criticos = insumos
      .map((insumo) => {
        const entradasTotal = insumo.Entrada.reduce(
          (acc, e) => acc + e.quantidade,
          0
        );
        const saidasTotal = insumo.Saida.reduce(
          (acc, s) => acc + s.quantidade,
          0
        );
        const saldo = entradasTotal - saidasTotal;

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
      .filter((item): item is NonNullable<typeof item> => Boolean(item));

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

      const filePath = path.join(exportDir, "relatorio-insumos-criticos.xlsx");
      await workbook.xlsx.writeFile(filePath);

      return res.download(filePath);
    }

    if (formato === "pdf") {
      const doc = new PDFDocument();
      const filePath = path.join(exportDir, "relatorio-insumos-criticos.pdf");
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      doc
        .fontSize(16)
        .text("Relatório de Insumos Críticos", { align: "center" });
      doc.moveDown();

      criticos.forEach((item) => {
        doc
          .fontSize(12)
          .text(`Insumo: ${item.nome}`)
          .text(`Unidade: ${item.unidade}`)
          .text(`Qtd Atual: ${item.atual}`)
          .text(`Qtd Mínima: ${item.minimo}`)
          .text(`Fornecedor: ${item.fornecedor}`)
          .moveDown();
      });

      doc.end();

      writeStream.on("finish", () => res.download(filePath));
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erro ao exportar insumos críticos: " + error });
  }
};

const getInventario = async (req: Request, res: Response) => {
  try {
    const insumos = await prisma.insumo.findMany({
      include: {
        Entrada: true,
        Saida: true,
        fornecedor: true,
      },
    });

    const inventario = insumos.map((insumo) => {
      const totalEntradas = insumo.Entrada.reduce(
        (acc, entrada) => acc + entrada.quantidade,
        0
      );

      const totalSaidas = insumo.Saida.reduce(
        (acc, saida) => acc + saida.quantidade,
        0
      );

      return {
        id: insumo.id,
        nome: insumo.nome,
        unidade: insumo.unidadeMedida,
        quantidadeAtual: totalEntradas - totalSaidas,
        fornecedor: insumo.fornecedor?.nome ?? "N/A",
      };
    });

    res.status(200).json(inventario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar inventário: " + error });
  }
};

const exportInventario = async (req: Request, res: Response) => {
  try {
    const formato = req.query.formato?.toString();
    if (!formato || !["xlsx", "pdf"].includes(formato)) {
      return res
        .status(400)
        .json({ error: "Formato inválido. Use 'xlsx' ou 'pdf'." });
    }

    // Cria diretório de exportação caso não exista
    const exportDir = path.join(__dirname, "../../exports");
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    // Busca os insumos incluindo entradas, saidas e fornecedor
    const insumos = await prisma.insumo.findMany({
      include: {
        Entrada: true,
        Saida: true,
        fornecedor: true,
      },
    });

    // Calcula o inventário atual
    const inventario = insumos.map((insumo) => {
      const totalEntradas = insumo.Entrada.reduce(
        (acc, entrada) => acc + entrada.quantidade,
        0
      );

      const totalSaidas = insumo.Saida.reduce(
        (acc, saida) => acc + saida.quantidade,
        0
      );

      return {
        nome: insumo.nome,
        unidade: insumo.unidadeMedida,
        quantidadeAtual: totalEntradas - totalSaidas,
        fornecedor: insumo.fornecedor?.nome ?? "N/A",
      };
    });

    const nomeArquivo = `relatorio_inventario.${formato}`;
    const caminho = path.join(exportDir, nomeArquivo);

    if (formato === "xlsx") {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Inventário");

      sheet.columns = [
        { header: "Nome do Insumo", key: "nome", width: 30 },
        { header: "Unidade", key: "unidade", width: 15 },
        { header: "Quantidade Atual", key: "quantidadeAtual", width: 20 },
        { header: "Fornecedor", key: "fornecedor", width: 30 },
      ];

      inventario.forEach((item) => {
        sheet.addRow(item);
      });

      await workbook.xlsx.writeFile(caminho);
      // Envia arquivo após salvar
      return res.download(caminho, nomeArquivo);
    }

    if (formato === "pdf") {
      const doc = new PDFDocument({ margin: 30 });
      const writeStream = fs.createWriteStream(caminho);
      doc.pipe(writeStream);

      doc.fontSize(16).text("Relatório de Inventário", { align: "center" });
      doc.moveDown();

      inventario.forEach((item) => {
        doc.fontSize(12).text(`Insumo: ${item.nome}`);
        doc.text(`Unidade: ${item.unidade}`);
        doc.text(`Quantidade Atual: ${item.quantidadeAtual}`);
        doc.text(`Fornecedor: ${item.fornecedor}`);
        doc.moveDown();
      });

      doc.end();

      // Aguarda o término da escrita para enviar
      writeStream.on("finish", () => {
        return res.download(caminho, nomeArquivo);
      });

      writeStream.on("error", (err) => {
        console.error("Erro ao escrever PDF:", err);
        return res.status(500).json({ error: "Erro ao gerar PDF." });
      });

      return;
    }
  } catch (error) {
    console.error("Erro exportInventario:", error);
    return res
      .status(500)
      .json({ error: "Erro ao exportar relatório: " + error });
  }
};

export const RelatoriosController = {
  getRelatorioMovimentacoes,
  createRelatorio,
  getInsumosCriticos,
  exportInsumosCriticos,
  getInventario,
  exportInventario,
};
