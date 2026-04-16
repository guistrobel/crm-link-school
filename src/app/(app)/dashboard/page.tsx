import { prisma } from "@/lib/prisma";
import { subMonths, startOfMonth, endOfMonth } from "date-fns";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { STAGE_LABELS } from "@/lib/constants";
import Link from "next/link";

async function getDashboardData() {
  const now = new Date();

  const [
    totalAlunos,
    alunosPorStatus,
    alunosPorCanal,
    mentoriasEsteMes,
    npsData,
    alertasPendentes,
    aprovados,
    totalMentores,
  ] = await Promise.all([
    prisma.aluno.count(),
    prisma.aluno.groupBy({ by: ["status"], _count: { id: true } }),
    prisma.aluno.groupBy({ by: ["canalOrigem"], _count: { id: true } }),
    prisma.mentoria.count({
      where: {
        status: "REALIZADA",
        dataRealizada: { gte: startOfMonth(now), lte: endOfMonth(now) },
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

  // Last 6 months
  const mensal = [];
  for (let i = 5; i >= 0; i--) {
    const month = subMonths(now, i);
    const count = await prisma.mentoria.count({
      where: {
        status: "REALIZADA",
        dataRealizada: { gte: startOfMonth(month), lte: endOfMonth(month) },
      },
    });
    mensal.push({
      month: month.toLocaleDateString("pt-BR", { month: "short" }),
      mentorias: count,
    });
  }

  const ativos = alunosPorStatus
    .filter((s) =>
      ["ATIVO_PREP","ATIVO_CASE","ATIVO_ENTREVISTA","ODP_OKRS_DEFINIDOS","ODP_EM_ANDAMENTO","ODP_PITCH_FINAL"].includes(s.status)
    )
    .reduce((sum, s) => sum + s._count.id, 0);

  const emRisco = alunosPorStatus
    .filter((s) => s.status === "INSCRITO_ONBOARDING")
    .reduce((sum, s) => sum + s._count.id, 0);

  return {
    totalAlunos,
    ativos,
    aprovados,
    emRisco,
    npsMedio: npsData._avg.npsScore ? Math.round(npsData._avg.npsScore * 10) / 10 : null,
    mentoriasEsteMes,
    alertasPendentes,
    totalMentores,
    alunosPorStatus: alunosPorStatus.map((s) => ({
      name: STAGE_LABELS[s.status] ?? s.status,
      value: s._count.id,
      status: s.status,
    })),
    alunosPorCanal: alunosPorCanal
      .filter((c) => c.canalOrigem)
      .map((c) => ({ name: c.canalOrigem ?? "Outro", value: c._count.id })),
    mensal,
  };
}

function MetricCard({
  title,
  value,
  subtitle,
  color,
  href,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  color: string;
  href?: string;
}) {
  const card = (
    <div className={`bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow`}>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className={`text-3xl font-bold mt-1 ${color}`}>{value ?? "—"}</p>
      {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
    </div>
  );
  if (href) return <Link href={href}>{card}</Link>;
  return card;
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Visão geral do programa Simplificando a Jornada</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Total de Alunos" value={data.totalAlunos} color="text-slate-900" href="/alunos" />
        <MetricCard title="Alunos Ativos" value={data.ativos} subtitle="Em etapas do programa" color="text-blue-700" href="/alunos" />
        <MetricCard title="Aprovados Link" value={data.aprovados} color="text-emerald-600" href="/alunos?status=APROVADO" />
        <MetricCard title="Alertas Pendentes" value={data.alertasPendentes} subtitle="Requerem atenção" color={data.alertasPendentes > 0 ? "text-red-600" : "text-slate-900"} href="/alertas" />
        <MetricCard title="NPS Médio" value={data.npsMedio ?? "—"} subtitle="Satisfação dos alunos" color="text-indigo-700" />
        <MetricCard title="Mentorias (mês)" value={data.mentoriasEsteMes} color="text-violet-700" href="/mentorias" />
        <MetricCard title="Mentores Ativos" value={data.totalMentores} color="text-orange-700" href="/mentores" />
        <MetricCard title="Em Onboarding" value={data.emRisco} subtitle="Aguardando primeira mentoria" color="text-amber-700" />
      </div>

      <DashboardCharts
        alunosPorStatus={data.alunosPorStatus}
        alunosPorCanal={data.alunosPorCanal}
        mensal={data.mensal}
      />
    </div>
  );
}
