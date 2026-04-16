import { prisma } from "@/lib/prisma";
import { subDays, subHours } from "date-fns";
import { calculateStudentOKRScore } from "./okr-calculator";

/**
 * Checks all alert rules and creates new alerts for triggered conditions.
 * Returns the count of new alerts created.
 */
export async function runAlertEngine(): Promise<number> {
  let created = 0;

  const [
    semMentoria,
    okrBaixo,
    mentoriaPerdida,
    concluidos,
    resultados,
    semEntregaveis,
  ] = await Promise.all([
    checkSemMentoria15Dias(),
    checkOKRAbaixo20Midpoint(),
    checkMentoriaPerdida48h(),
    checkAlunoConcluido(),
    checkResultadoRecebido(),
    checkChurnSemEntregaveis(),
  ]);

  const allAlerts = [
    ...semMentoria,
    ...okrBaixo,
    ...mentoriaPerdida,
    ...concluidos,
    ...resultados,
    ...semEntregaveis,
  ];

  for (const alert of allAlerts) {
    // Deduplicate: skip if already exists
    const existing = await prisma.alerta.findFirst({
      where: {
        alunoId: alert.alunoId,
        tipo: alert.tipo,
        status: { in: ["PENDENTE", "VISUALIZADO"] },
      },
    });
    if (!existing) {
      await prisma.alerta.create({ data: alert });
      created++;
    }
  }

  return created;
}

// ── Rule 1: Student without mentoria for 15+ days ───────────────────────────

async function checkSemMentoria15Dias() {
  const cutoff = subDays(new Date(), 15);
  const ativos = await prisma.aluno.findMany({
    where: {
      status: {
        notIn: ["LEAD_FRIO", "CONCLUIDO", "APROVADO", "REPROVADO", "DESISTIU"],
      },
    },
    include: {
      mentorias: {
        where: { status: "REALIZADA" },
        orderBy: { dataRealizada: "desc" },
        take: 1,
      },
    },
  });

  return ativos
    .filter((aluno) => {
      const last = aluno.mentorias[0]?.dataRealizada;
      return !last || new Date(last) < cutoff;
    })
    .map((aluno) => ({
      alunoId: aluno.id,
      tipo: "SEM_MENTORIA_15_DIAS",
      status: "PENDENTE",
      mensagem: `${aluno.nome} está há mais de 15 dias sem realizar uma mentoria.`,
    }));
}

// ── Rule 2: OKR < 20% at midpoint ───────────────────────────────────────────

async function checkOKRAbaixo20Midpoint() {
  const atMidpoint = await prisma.aluno.findMany({
    where: {
      status: { in: ["ODP_EM_ANDAMENTO", "ODP_PITCH_FINAL"] },
    },
    include: {
      okrs: { include: { keyResults: true } },
    },
  });

  return atMidpoint
    .filter((aluno) => {
      const score = calculateStudentOKRScore(aluno.okrs);
      return aluno.okrs.length > 0 && score < 20;
    })
    .map((aluno) => ({
      alunoId: aluno.id,
      tipo: "OKR_ABAIXO_20_MIDPOINT",
      status: "PENDENTE",
      mensagem: `${aluno.nome} está com OKRs abaixo de 20% de atingimento no meio do ciclo.`,
    }));
}

// ── Rule 3: Missed mentoria without rescheduling in 48h ─────────────────────

async function checkMentoriaPerdida48h() {
  const cutoff = subHours(new Date(), 48);
  const perdidas = await prisma.mentoria.findMany({
    where: {
      status: "NAO_REALIZADA",
      dataAgendada: { lt: cutoff },
    },
    include: { aluno: true },
  });

  return perdidas.map((m) => ({
    alunoId: m.alunoId,
    tipo: "MENTORIA_PERDIDA_48H",
    status: "PENDENTE",
    mensagem: `${m.aluno.nome} perdeu uma mentoria de ${m.tipo} sem reagendamento em 48h.`,
  }));
}

// ── Rule 4: Student concluded — request NPS ──────────────────────────────────

async function checkAlunoConcluido() {
  const concluidos = await prisma.aluno.findMany({
    where: {
      status: { in: ["CONCLUIDO", "APROVADO", "REPROVADO"] },
      npsScore: null,
    },
  });

  return concluidos.map((aluno) => ({
    alunoId: aluno.id,
    tipo: "ALUNO_CONCLUIDO_NPS",
    status: "PENDENTE",
    mensagem: `${aluno.nome} concluiu o programa. Solicite o NPS e feedback.`,
  }));
}

// ── Rule 5: Link result received — request testimonial ───────────────────────

async function checkResultadoRecebido() {
  const comResultado = await prisma.aluno.findMany({
    where: {
      resultadoLink: { not: null },
    },
  });

  return comResultado.map((aluno) => ({
    alunoId: aluno.id,
    tipo: "RESULTADO_RECEBIDO_DEPOIMENTO",
    status: "PENDENTE",
    mensagem: `${aluno.nome} recebeu resultado da Jornada Link. Solicite depoimento/indicação.`,
  }));
}

// ── Rule 6: 3+ mentorings with no deliverables ───────────────────────────────

async function checkChurnSemEntregaveis() {
  const alunos = await prisma.aluno.findMany({
    include: {
      mentorias: {
        where: { status: "REALIZADA" },
      },
    },
  });

  return alunos
    .filter((aluno) => {
      const realizadas = aluno.mentorias.filter(
        (m) => m.status === "REALIZADA"
      );
      return (
        realizadas.length >= 3 &&
        realizadas.every((m) => !m.entregaveisRecebidos)
      );
    })
    .map((aluno) => ({
      alunoId: aluno.id,
      tipo: "CHURN_SEM_ENTREGAVEIS",
      status: "PENDENTE",
      mensagem: `${aluno.nome} realizou 3+ mentorias sem entregar nenhum material. Risco crítico de churn.`,
    }));
}
