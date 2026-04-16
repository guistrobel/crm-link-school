import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { subMonths, startOfMonth, endOfMonth } from "date-fns";

export async function GET() {
  const now = new Date();

  const [
    totalAlunos,
    alunosPorStatus,
    alunosPorCanal,
    mentoriasEsteMes,
    mentoriasUltimoMes,
    npsData,
    alertasPendentes,
    aprovados,
    mentores,
  ] = await Promise.all([
    prisma.aluno.count(),
    prisma.aluno.groupBy({ by: ["status"], _count: { id: true } }),
    prisma.aluno.groupBy({ by: ["canalOrigem"], _count: { id: true } }),
    prisma.mentoria.count({
      where: {
        status: "REALIZADA",
        dataRealizada: {
          gte: startOfMonth(now),
          lte: endOfMonth(now),
        },
      },
    }),
    prisma.mentoria.count({
      where: {
        status: "REALIZADA",
        dataRealizada: {
          gte: startOfMonth(subMonths(now, 1)),
          lte: endOfMonth(subMonths(now, 1)),
        },
      },
    }),
    prisma.aluno.aggregate({
      where: { npsScore: { not: null } },
      _avg: { npsScore: true },
      _count: { npsScore: true },
    }),
    prisma.alerta.count({ where: { status: "PENDENTE" } }),
    prisma.aluno.count({ where: { status: "APROVADO" } }),
    prisma.mentor.count(),
  ]);

  // Build last 6 months mentoria data
  const last6Months = [];
  for (let i = 5; i >= 0; i--) {
    const month = subMonths(now, i);
    const count = await prisma.mentoria.count({
      where: {
        status: "REALIZADA",
        dataRealizada: {
          gte: startOfMonth(month),
          lte: endOfMonth(month),
        },
      },
    });
    last6Months.push({
      month: month.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" }),
      mentorias: count,
    });
  }

  const ativos = alunosPorStatus
    .filter((s) =>
      [
        "ATIVO_PREP",
        "ATIVO_CASE",
        "ATIVO_ENTREVISTA",
        "ODP_OKRS_DEFINIDOS",
        "ODP_EM_ANDAMENTO",
        "ODP_PITCH_FINAL",
      ].includes(s.status)
    )
    .reduce((sum, s) => sum + s._count.id, 0);

  return NextResponse.json({
    totalAlunos,
    ativos,
    aprovados,
    npsMedio: npsData._avg.npsScore
      ? Math.round(npsData._avg.npsScore * 10) / 10
      : null,
    mentoriasEsteMes,
    mentoriasUltimoMes,
    alertasPendentes,
    totalMentores: mentores,
    alunosPorStatus: alunosPorStatus.map((s) => ({
      status: s.status,
      count: s._count.id,
    })),
    alunosPorCanal: alunosPorCanal
      .filter((c) => c.canalOrigem)
      .map((c) => ({
        canal: c.canalOrigem,
        count: c._count.id,
      })),
    menторіasHistory: last6Months,
  });
}
