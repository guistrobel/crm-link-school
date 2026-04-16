import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { STAGE_LABELS, STAGE_COLORS, TAG_COLORS, TAG_LABELS, CANAL_ORIGEM_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

async function getAlunos(search: string, status: string, mentorId: string) {
  const where: any = {};
  if (search) {
    where.OR = [
      { nome: { contains: search } },
      { email: { contains: search } },
    ];
  }
  if (status) where.status = status;
  if (mentorId) where.mentorId = mentorId;

  return prisma.aluno.findMany({
    where,
    include: {
      mentor: { select: { id: true, nome: true } },
      tags: true,
      alertas: { where: { status: "PENDENTE" }, select: { id: true } },
      _count: { select: { mentorias: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

async function getMentores() {
  return prisma.mentor.findMany({ select: { id: true, nome: true }, orderBy: { nome: "asc" } });
}

export default async function AlunosPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; mentorId?: string }>;
}) {
  const sp = await searchParams;
  const search = sp.search ?? "";
  const status = sp.status ?? "";
  const mentorId = sp.mentorId ?? "";

  const [alunos, mentores] = await Promise.all([
    getAlunos(search, status, mentorId),
    getMentores(),
  ]);

  const STAGES = [
    "LEAD_FRIO","INSCRITO_ONBOARDING","ATIVO_PREP","ATIVO_CASE","ATIVO_ENTREVISTA",
    "ODP_OKRS_DEFINIDOS","ODP_EM_ANDAMENTO","ODP_PITCH_FINAL","CONCLUIDO",
    "APROVADO","REPROVADO","DESISTIU",
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Alunos</h1>
          <p className="text-slate-500 text-sm mt-1">{alunos.length} aluno{alunos.length !== 1 ? "s" : ""} encontrado{alunos.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/alunos/novo"
          className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors"
        >
          + Novo Aluno
        </Link>
      </div>

      {/* Filters */}
      <form method="GET" className="flex flex-wrap gap-3 mb-6 bg-white p-4 rounded-xl border border-slate-200">
        <input
          name="search"
          defaultValue={search}
          placeholder="Buscar por nome ou email..."
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm flex-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          name="status"
          defaultValue={status}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos os estágios</option>
          {STAGES.map((s) => (
            <option key={s} value={s}>{STAGE_LABELS[s]}</option>
          ))}
        </select>
        <select
          name="mentorId"
          defaultValue={mentorId}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos os mentores</option>
          {mentores.map((m) => (
            <option key={m.id} value={m.id}>{m.nome}</option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700"
        >
          Filtrar
        </button>
        <Link href="/alunos" className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700">
          Limpar
        </Link>
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nome</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Mentor</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Canal</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Tags</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden xl:table-cell">Mentorias</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden xl:table-cell">Matrícula</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {alunos.map((aluno) => (
              <tr key={aluno.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {(aluno.alertas?.length ?? 0) > 0 && (
                      <span className="text-orange-500 text-sm" title="Alertas pendentes">⚠</span>
                    )}
                    <div>
                      <p className="text-sm font-medium text-slate-900">{aluno.nome}</p>
                      <p className="text-xs text-slate-400">{aluno.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium border ${STAGE_COLORS[aluno.status] ?? "bg-slate-100 text-slate-600"}`}>
                    {STAGE_LABELS[aluno.status] ?? aluno.status}
                  </span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-sm text-slate-600">
                  {(aluno as any).mentor?.nome ?? "—"}
                </td>
                <td className="px-4 py-3 hidden lg:table-cell text-sm text-slate-500">
                  {CANAL_ORIGEM_LABELS[(aluno as any).canalOrigem ?? ""] ?? "—"}
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {(aluno as any).tags?.slice(0, 2).map((t: any) => (
                      <span key={t.tag} className={`text-xs px-1.5 py-0.5 rounded-full ${TAG_COLORS[t.tag] ?? "bg-slate-100"}`}>
                        {TAG_LABELS[t.tag]?.split(" ")[0]}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 hidden xl:table-cell text-sm text-slate-600 text-center">
                  {(aluno as any)._count?.mentorias ?? 0}
                </td>
                <td className="px-4 py-3 hidden xl:table-cell text-sm text-slate-500">
                  {formatDate((aluno as any).dataMatricula)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/alunos/${aluno.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Ver →
                  </Link>
                </td>
              </tr>
            ))}
            {alunos.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-slate-400 text-sm">
                  Nenhum aluno encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
