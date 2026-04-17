import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { STAGE_LABELS, STAGE_COLORS, TAG_LABELS, TAG_COLORS, TIPO_MENTORIA_LABELS, STATUS_MENTORIA_LABELS, STATUS_MENTORIA_COLORS, ALERTA_LABELS, CANAL_ORIGEM_LABELS } from "@/lib/constants";
import { formatDate, formatDateTime, formatRelative } from "@/lib/utils";
import { calculateStudentOKRScore } from "@/services/okr-calculator";

async function getAluno(id: string) {
  return prisma.aluno.findUnique({
    where: { id },
    include: {
      mentor: { select: { id: true, nome: true, email: true } },
      tags: true,
      mentorias: {
        orderBy: { dataAgendada: "desc" },
        include: { mentor: { select: { nome: true } } },
      },
      okrs: { include: { keyResults: { orderBy: { peso: "desc" } } } },
      alertas: { orderBy: { criadoEm: "desc" } },
    },
  });
}

export default async function AlunoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const aluno = await getAluno(id);
  if (!aluno) notFound();

  const okrScore = calculateStudentOKRScore(aluno.okrs);
  const pendingAlerts = aluno.alertas.filter((a: any) => a.status === "PENDENTE");

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
            <Link href="/alunos" className="hover:text-blue-600">Alunos</Link>
            <span>/</span>
            <span className="text-slate-600">{aluno.nome}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{aluno.nome}</h1>
          <p className="text-slate-500 text-sm mt-0.5">{aluno.email}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/alunos/${id}/editar`}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50"
          >
            Editar
          </Link>
          <Link
            href={`/mentorias/nova?alunoId=${id}`}
            className="px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800"
          >
            + Mentoria
          </Link>
        </div>
      </div>

      {/* Alert Banner */}
      {pendingAlerts.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
          <p className="text-sm font-semibold text-orange-800 mb-1">
            ⚠ {pendingAlerts.length} alerta{pendingAlerts.length > 1 ? "s" : ""} pendente{pendingAlerts.length > 1 ? "s" : ""}
          </p>
          {pendingAlerts.slice(0, 2).map((a) => (
            <p key={a.id} className="text-xs text-orange-700">{a.mensagem}</p>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: info */}
        <div className="space-y-4">
          {/* Status Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Status</h3>
            <span className={`text-sm px-3 py-1 rounded-full border font-medium ${STAGE_COLORS[aluno.status]}`}>
              {STAGE_LABELS[aluno.status] ?? aluno.status}
            </span>
          </div>

          {/* Info Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Informações</h3>
            {aluno.telefone && (
              <div>
                <p className="text-xs text-slate-400">Telefone</p>
                <p className="text-sm text-slate-700">{aluno.telefone}</p>
              </div>
            )}
            {aluno.cursoInteresse && (
              <div>
                <p className="text-xs text-slate-400">Curso de interesse</p>
                <p className="text-sm text-slate-700">{aluno.cursoInteresse}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-slate-400">Matrícula</p>
              <p className="text-sm text-slate-700">{formatDate(aluno.dataMatricula)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Canal de origem</p>
              <p className="text-sm text-slate-700">{CANAL_ORIGEM_LABELS[aluno.canalOrigem ?? ""] ?? "—"}</p>
            </div>
            {aluno.npsScore != null && (
              <div>
                <p className="text-xs text-slate-400">NPS</p>
                <p className="text-sm font-bold text-slate-700">{aluno.npsScore}/10</p>
              </div>
            )}
            {aluno.resultadoLink && (
              <div>
                <p className="text-xs text-slate-400">Resultado Link</p>
                <p className="text-sm font-medium text-slate-700 capitalize">{aluno.resultadoLink}</p>
              </div>
            )}
          </div>

          {/* Mentor */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Mentor</h3>
            {aluno.mentor ? (
              <Link href={`/mentores/${aluno.mentor.id}`} className="text-sm text-blue-700 font-medium hover:underline">
                {aluno.mentor.nome}
              </Link>
            ) : (
              <p className="text-sm text-slate-400">Não atribuído</p>
            )}
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Tags</h3>
            <div className="flex flex-wrap gap-1.5">
              {aluno.tags.map((t) => (
                <span key={t.tag} className={`text-xs px-2 py-1 rounded-full font-medium ${TAG_COLORS[t.tag] ?? "bg-slate-100 text-slate-600"}`}>
                  {TAG_LABELS[t.tag] ?? t.tag}
                </span>
              ))}
              {aluno.tags.length === 0 && <p className="text-sm text-slate-400">Sem tags</p>}
            </div>
          </div>

          {/* OKR Score */}
          {aluno.okrs.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Score OKR</h3>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-slate-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${okrScore >= 70 ? "bg-emerald-500" : okrScore >= 40 ? "bg-amber-500" : "bg-red-500"}`}
                    style={{ width: `${Math.min(100, okrScore)}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-slate-700">{okrScore.toFixed(0)}%</span>
              </div>
              <Link href={`/alunos/${id}/okrs`} className="text-xs text-blue-600 hover:underline mt-2 inline-block">
                Ver OKRs →
              </Link>
            </div>
          )}

          {/* Observações */}
          {aluno.observacoes && (
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Observações</h3>
              <p className="text-sm text-slate-700 leading-relaxed">{aluno.observacoes}</p>
            </div>
          )}
        </div>

        {/* Right column: mentorias */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Histórico de Mentorias</h3>
              <Link
                href={`/mentorias/nova?alunoId=${id}`}
                className="text-xs text-blue-600 hover:underline"
              >
                + Agendar
              </Link>
            </div>
            {aluno.mentorias.length === 0 ? (
              <p className="text-sm text-slate-400 py-6 text-center">Nenhuma mentoria registrada.</p>
            ) : (
              <div className="space-y-3">
                {aluno.mentorias.map((m) => (
                  <div key={m.id} className="border border-slate-100 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-900">
                        {TIPO_MENTORIA_LABELS[m.tipo] ?? m.tipo}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_MENTORIA_COLORS[m.status] ?? "bg-slate-100"}`}>
                        {STATUS_MENTORIA_LABELS[m.status] ?? m.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                      <span>{formatDateTime(m.dataAgendada)}</span>
                      {m.notaMentor && <span>⭐ {m.notaMentor}/5</span>}
                      {m.entregaveisRecebidos && <span className="text-emerald-600">✓ Entregáveis</span>}
                    </div>
                    {m.feedbackQualitativo && (
                      <p className="text-xs text-slate-500 mt-2 italic">"{m.feedbackQualitativo}"</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Alertas */}
          {aluno.alertas.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-900 mb-3">Alertas</h3>
              <div className="space-y-2">
                {aluno.alertas.map((a) => (
                  <div key={a.id} className={`p-3 rounded-lg text-sm border ${
                    a.status === "PENDENTE" ? "bg-orange-50 border-orange-200" : "bg-slate-50 border-slate-200"
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-700">{ALERTA_LABELS[a.tipo] ?? a.tipo}</span>
                      <span className="text-xs text-slate-400">{formatRelative(a.criadoEm)}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{a.mensagem}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
