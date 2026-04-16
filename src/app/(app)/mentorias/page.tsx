import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { TIPO_MENTORIA_LABELS, STATUS_MENTORIA_LABELS, STATUS_MENTORIA_COLORS } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";

async function getMentorias(status: string) {
  const where: any = {};
  if (status) where.status = status;
  return prisma.mentoria.findMany({
    where,
    include: {
      aluno: { select: { id: true, nome: true } },
      mentor: { select: { id: true, nome: true } },
    },
    orderBy: { dataAgendada: "desc" },
    take: 100,
  });
}

export default async function MentoriasPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const status = sp.status ?? "";
  const mentorias = await getMentorias(status);

  const STATUSES = ["AGENDADA","REALIZADA","CANCELADA","NAO_REALIZADA","REAGENDADA"];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mentorias</h1>
          <p className="text-slate-500 text-sm mt-1">{mentorias.length} sessões encontradas</p>
        </div>
        <Link href="/mentorias/nova" className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800">
          + Nova Mentoria
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        <Link href="/mentorias" className={`px-3 py-1.5 rounded-full text-sm font-medium border ${!status ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}>
          Todas
        </Link>
        {STATUSES.map((s) => (
          <Link key={s} href={`/mentorias?status=${s}`}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border ${status === s ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}>
            {STATUS_MENTORIA_LABELS[s]}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Aluno</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tipo</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Mentor</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Data</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Nota</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Entregáveis</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mentorias.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link href={`/alunos/${m.aluno.id}`} className="text-sm font-medium text-blue-700 hover:underline">
                    {m.aluno.nome}
                  </Link>
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">{TIPO_MENTORIA_LABELS[m.tipo] ?? m.tipo}</td>
                <td className="px-4 py-3 text-sm text-slate-500 hidden md:table-cell">{m.mentor?.nome ?? "—"}</td>
                <td className="px-4 py-3 text-sm text-slate-500">{formatDateTime(m.dataAgendada)}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_MENTORIA_COLORS[m.status] ?? "bg-slate-100"}`}>
                    {STATUS_MENTORIA_LABELS[m.status] ?? m.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-500 hidden lg:table-cell">
                  {m.notaMentor ? `⭐ ${m.notaMentor}/5` : "—"}
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  {m.entregaveisRecebidos ? (
                    <span className="text-xs text-emerald-600 font-medium">✓ Sim</span>
                  ) : (
                    <span className="text-xs text-slate-400">Não</span>
                  )}
                </td>
              </tr>
            ))}
            {mentorias.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-slate-400 text-sm">Nenhuma mentoria encontrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
