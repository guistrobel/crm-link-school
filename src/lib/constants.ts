// ── Pipeline Stages ──────────────────────────────────────────────────────────

export const PIPELINE_STAGES = [
  "LEAD_FRIO",
  "INSCRITO_ONBOARDING",
  "ATIVO_PREP",
  "ATIVO_CASE",
  "ATIVO_ENTREVISTA",
  "ODP_OKRS_DEFINIDOS",
  "ODP_EM_ANDAMENTO",
  "ODP_PITCH_FINAL",
  "CONCLUIDO",
  "APROVADO",
  "REPROVADO",
  "DESISTIU",
] as const;

export type PipelineStage = (typeof PIPELINE_STAGES)[number];

export const STAGE_LABELS: Record<string, string> = {
  LEAD_FRIO: "Lead Frio",
  INSCRITO_ONBOARDING: "Inscrito / Onboarding",
  ATIVO_PREP: "Ativo — PREP",
  ATIVO_CASE: "Ativo — Case",
  ATIVO_ENTREVISTA: "Ativo — Entrevista",
  ODP_OKRS_DEFINIDOS: "ODP — OKRs Definidos",
  ODP_EM_ANDAMENTO: "ODP — Em Andamento",
  ODP_PITCH_FINAL: "ODP — Pitch Final",
  CONCLUIDO: "Concluído",
  APROVADO: "Aprovado",
  REPROVADO: "Reprovado",
  DESISTIU: "Desistiu",
};

export const STAGE_COLORS: Record<string, string> = {
  LEAD_FRIO: "bg-slate-100 text-slate-700 border-slate-200",
  INSCRITO_ONBOARDING: "bg-blue-100 text-blue-700 border-blue-200",
  ATIVO_PREP: "bg-indigo-100 text-indigo-700 border-indigo-200",
  ATIVO_CASE: "bg-violet-100 text-violet-700 border-violet-200",
  ATIVO_ENTREVISTA: "bg-purple-100 text-purple-700 border-purple-200",
  ODP_OKRS_DEFINIDOS: "bg-amber-100 text-amber-700 border-amber-200",
  ODP_EM_ANDAMENTO: "bg-orange-100 text-orange-700 border-orange-200",
  ODP_PITCH_FINAL: "bg-rose-100 text-rose-700 border-rose-200",
  CONCLUIDO: "bg-green-100 text-green-700 border-green-200",
  APROVADO: "bg-emerald-100 text-emerald-700 border-emerald-200",
  REPROVADO: "bg-red-100 text-red-700 border-red-200",
  DESISTIU: "bg-zinc-100 text-zinc-700 border-zinc-200",
};

export const STAGE_DOT_COLORS: Record<string, string> = {
  LEAD_FRIO: "bg-slate-400",
  INSCRITO_ONBOARDING: "bg-blue-500",
  ATIVO_PREP: "bg-indigo-500",
  ATIVO_CASE: "bg-violet-500",
  ATIVO_ENTREVISTA: "bg-purple-500",
  ODP_OKRS_DEFINIDOS: "bg-amber-500",
  ODP_EM_ANDAMENTO: "bg-orange-500",
  ODP_PITCH_FINAL: "bg-rose-500",
  CONCLUIDO: "bg-green-500",
  APROVADO: "bg-emerald-500",
  REPROVADO: "bg-red-500",
  DESISTIU: "bg-zinc-400",
};

// ── Canal Origem ─────────────────────────────────────────────────────────────

export const CANAL_ORIGEM_LABELS: Record<string, string> = {
  INDICACAO: "Indicação",
  INSTAGRAM: "Instagram",
  LINKEDIN: "LinkedIn",
  EVENTO: "Evento",
  GOOGLE: "Google",
  OUTRO: "Outro",
};

// ── Mentoria Types ────────────────────────────────────────────────────────────

export const TIPO_MENTORIA_LABELS: Record<string, string> = {
  PREP: "PREP — Vídeo + Portfólio",
  CASE: "Case de Negócios",
  ENTREVISTA: "Simulação de Entrevista",
  ODP_OKR: "ODP — Definição de OKRs",
  ODP_ACOMPANHAMENTO: "ODP — Acompanhamento",
  ODP_PITCH: "ODP — Pitch Final",
};

export const STATUS_MENTORIA_LABELS: Record<string, string> = {
  AGENDADA: "Agendada",
  REALIZADA: "Realizada",
  CANCELADA: "Cancelada",
  NAO_REALIZADA: "Não Realizada",
  REAGENDADA: "Reagendada",
};

export const STATUS_MENTORIA_COLORS: Record<string, string> = {
  AGENDADA: "bg-blue-100 text-blue-700",
  REALIZADA: "bg-green-100 text-green-700",
  CANCELADA: "bg-red-100 text-red-700",
  NAO_REALIZADA: "bg-orange-100 text-orange-700",
  REAGENDADA: "bg-yellow-100 text-yellow-700",
};

// ── Tags ─────────────────────────────────────────────────────────────────────

export const TAG_LABELS: Record<string, string> = {
  FIT_EMPREENDEDOR: "Fit Empreendedor",
  INGLES_FORTE: "Inglês Forte",
  AUTONOMO: "Autônomo",
  PRECISA_SUPORTE: "Precisa de Suporte",
  CASO_ESPECIAL: "Caso Especial",
  AMBASSADOR_POTENCIAL: "Ambassador Potencial",
  EM_RISCO: "Em Risco",
  CHURN_CRITICO: "Churn Crítico",
};

export const TAG_COLORS: Record<string, string> = {
  FIT_EMPREENDEDOR: "bg-emerald-100 text-emerald-700",
  INGLES_FORTE: "bg-blue-100 text-blue-700",
  AUTONOMO: "bg-violet-100 text-violet-700",
  PRECISA_SUPORTE: "bg-yellow-100 text-yellow-700",
  CASO_ESPECIAL: "bg-indigo-100 text-indigo-700",
  AMBASSADOR_POTENCIAL: "bg-pink-100 text-pink-700",
  EM_RISCO: "bg-orange-100 text-orange-700",
  CHURN_CRITICO: "bg-red-100 text-red-700",
};

// ── Alert Types ───────────────────────────────────────────────────────────────

export const ALERTA_LABELS: Record<string, string> = {
  SEM_MENTORIA_15_DIAS: "Sem mentoria há 15+ dias",
  OKR_ABAIXO_20_MIDPOINT: "OKR abaixo de 20% no meio do ciclo",
  MENTORIA_PERDIDA_48H: "Mentoria perdida sem reagendamento",
  ALUNO_CONCLUIDO_NPS: "Aluno concluiu — solicitar NPS",
  RESULTADO_RECEBIDO_DEPOIMENTO: "Resultado recebido — solicitar depoimento",
  CHURN_SEM_ENTREGAVEIS: "3 mentorias sem nenhum entregável",
};

export const ALERTA_SEVERITY: Record<string, string> = {
  SEM_MENTORIA_15_DIAS: "orange",
  OKR_ABAIXO_20_MIDPOINT: "yellow",
  MENTORIA_PERDIDA_48H: "orange",
  ALUNO_CONCLUIDO_NPS: "blue",
  RESULTADO_RECEBIDO_DEPOIMENTO: "green",
  CHURN_SEM_ENTREGAVEIS: "red",
};

// ── Roles ─────────────────────────────────────────────────────────────────────

export const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administrador",
  COORDINATOR: "Coordenação",
  MENTOR: "Mentor",
};

// ── OKR Defaults ─────────────────────────────────────────────────────────────

export const OKR_DEFAULT_KR_WEIGHTS = [0.4, 0.4, 0.2];
export const OKR_OBJECTIVE_LABELS: Record<string, string> = {
  BUSINESS: "Objetivo de Negócios",
  ACADEMICO_PESSOAL: "Objetivo Acadêmico/Pessoal",
};
