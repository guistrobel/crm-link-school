import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { STAGE_LABELS, STAGE_COLORS } from "@/lib/constants";

async function getMentores() {
  return prisma.mentor.findMany({
    include: {
      alunos: {
        include: { tags: true },
        orderBy: { nome: "asc" },
        where: { status: { notIn: ["APROVADO", "REPROVADO", "DESISTIU"] } },
      },
      _count: { select: { alunos: true, mentorias: true } },
    },
    orderBy: { nome: "asc" },
  });
}

export default async function MentoresPage() {
  const mentores = await getMentores();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mentores</h1>
          <p className="text-slate-500 text-sm mt-1">{mentores.length} mentor{mentores.length !== 1 ? "es" : ""} ativos</p>
        </div>
        <Link href="/mentores/novo" className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800">
          + Novo Mentor
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {mentores.map((mentor) => (
          <div key={mentor.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                  {mentor.nome.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{mentor.nome}</h3>
                  <p className="text-xs text-slate-400">{mentor.especialidade ?? "Mentor"}</p>
                </div>
              </div>
              <Link href={`/mentores/${mentor.id}`} className="text-blue-600 text-sm hover:underline">
                Ver →
              </Link>
            </div>
            <div className="flex gap-4 text-center mb-4 bg-slate-50 rounded-lg p-3">
              <div className="flex-1">
                <p className="text-lg font-bold text-slate-900">{(mentor as any)._count?.alunos ?? 0}</p>
                <p className="text-xs text-slate-400">Alunos</p>
              </div>
              <div className="flex-1">
                <p className="text-lg font-bold text-slate-900">{(mentor as any)._count?.mentorias ?? 0}</p>
                <p className="text-xs text-slate-400">Mentorias</p>
              </div>
              <div className="flex-1">
                <p className="text-lg font-bold text-slate-900">{mentor.alunos.length}</p>
                <p className="text-xs text-slate-400">Ativos</p>
              </div>
            </div>
            <div className="space-y-1.5">
              {mentor.alunos.slice(0, 3).map((aluno) => (
                <div key={aluno.id} className="flex items-center justify-between">
                  <Link href={`/alunos/${aluno.id}`} className="text-sm text-slate-700 hover:text-blue-600 truncate">
                    {aluno.nome}
                  </Link>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${STAGE_COLORS[aluno.status]}`}>
                    {STAGE_LABELS[aluno.status]?.split(" ")[0]}
                  </span>
                </div>
              ))}
              {mentor.alunos.length > 3 && (
                <p className="text-xs text-slate-400">+{mentor.alunos.length - 3} outros alunos</p>
              )}
            </div>
          </div>
        ))}
        {mentores.length === 0 && (
          <div className="col-span-3 text-center py-12 text-slate-400">Nenhum mentor cadastrado.</div>
        )}
      </div>
    </div>
  );
}
