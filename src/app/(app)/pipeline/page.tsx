import { prisma } from "@/lib/prisma";
import { PIPELINE_STAGES, STAGE_LABELS, STAGE_COLORS, STAGE_DOT_COLORS, TAG_COLORS, TAG_LABELS } from "@/lib/constants";
import Link from "next/link";
import { groupByStage } from "@/services/pipeline.service";

async function getPipelineData() {
  const alunos = await prisma.aluno.findMany({
    include: {
      mentor: { select: { nome: true } },
      tags: true,
      alertas: { where: { status: "PENDENTE" }, select: { id: true } },
      _count: { select: { mentorias: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
  return groupByStage(alunos as any);
}

export default async function PipelinePage() {
  const groups = await getPipelineData();

  return (
    <div className="p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pipeline</h1>
          <p className="text-slate-500 text-sm mt-1">Jornada dos alunos pelas 12 etapas do programa</p>
        </div>
        <Link
          href="/alunos/novo"
          className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors"
        >
          + Novo Aluno
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {PIPELINE_STAGES.map((stage) => {
          const alunos = groups[stage] ?? [];
          return (
            <div key={stage} className="flex-shrink-0 w-52">
              <div className="flex items-center gap-2 mb-2 px-1">
                <div className={`w-2 h-2 rounded-full ${STAGE_DOT_COLORS[stage]}`} />
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide truncate">
                  {STAGE_LABELS[stage]}
                </span>
                <span className="ml-auto bg-slate-100 text-slate-600 text-xs rounded-full px-1.5 py-0.5 font-medium">
                  {alunos.length}
                </span>
              </div>
              <div className="space-y-2 min-h-24">
                {alunos.map((aluno: any) => (
                  <Link
                    key={aluno.id}
                    href={`/alunos/${aluno.id}`}
                    className={`block bg-white border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer ${
                      aluno.alertas?.length > 0 ? "border-orange-300" : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <p className="text-sm font-medium text-slate-900 truncate">{aluno.nome}</p>
                      {aluno.alertas?.length > 0 && (
                        <span className="text-orange-500 text-xs">⚠</span>
                      )}
                    </div>
                    {aluno.mentor && (
                      <p className="text-xs text-slate-400 mt-0.5 truncate">{aluno.mentor.nome}</p>
                    )}
                    {aluno.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {aluno.tags.slice(0, 2).map((t: any) => (
                          <span
                            key={t.tag}
                            className={`text-xs px-1.5 py-0.5 rounded-full ${TAG_COLORS[t.tag] ?? "bg-slate-100 text-slate-600"}`}
                          >
                            {TAG_LABELS[t.tag]?.split(" ")[0] ?? t.tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-slate-400 mt-1.5">
                      {aluno._count?.mentorias ?? 0} mentoria{aluno._count?.mentorias !== 1 ? "s" : ""}
                    </p>
                  </Link>
                ))}
                {alunos.length === 0 && (
                  <div className="border-2 border-dashed border-slate-100 rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-300">Vazio</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
