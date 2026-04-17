import type { KeyResult, OKR } from "@prisma/client";

export interface KeyResultWithProgress extends KeyResult {
  calculatedAtingimento: number;
}

export interface OKRWithProgress extends OKR {
  keyResults: KeyResultWithProgress[];
  atingimento: number;
}

/**
 * Calcula o atingimento de um Key Result com base nos resultados inseridos.
 * Usa o resultado mais recente disponível (M3 > M2 > M1 > 0).
 * O atingimento é a % da meta numérica atingida, limitado a 100%.
 */
export function calculateKRAtingimento(kr: KeyResult): number {
  const resultado = kr.resultadoM3 ?? kr.resultadoM2 ?? kr.resultadoM1 ?? 0;
  if (!kr.meta || kr.meta === "0" || kr.meta === "") return 0;

  const metaNum = parseFloat(kr.meta);
  if (isNaN(metaNum) || metaNum === 0) return resultado > 0 ? 100 : 0;

  return Math.min(100, (resultado / metaNum) * 100);
}

/**
 * Calcula o atingimento geral de um OKR com base nos pesos dos KRs.
 * Soma ponderada: sum(atingimento_kr * peso_kr)
 */
export function calculateOKRAtingimento(
  okr: OKR & { keyResults: KeyResult[] }
): number {
  if (!okr.keyResults.length) return 0;

  const totalWeight = okr.keyResults.reduce((sum, kr) => sum + kr.peso, 0);
  if (totalWeight === 0) return 0;

  const weightedSum = okr.keyResults.reduce((sum, kr) => {
    const atingimento = calculateKRAtingimento(kr);
    return sum + atingimento * (kr.peso / totalWeight);
  }, 0);

  return Math.round(weightedSum * 10) / 10;
}

/**
 * Calcula o score geral de um aluno com base nos dois OKRs (Business + Acadêmico/Pessoal).
 * Score = (business_atingimento * 0.5) + (academico_atingimento * 0.5)
 */
export function calculateStudentOKRScore(
  okrs: (OKR & { keyResults: KeyResult[] })[]
): number {
  if (!okrs.length) return 0;

  const totalWeight = okrs.reduce((sum, okr) => sum + okr.peso, 0);
  if (totalWeight === 0) return 0;

  const weightedSum = okrs.reduce((sum, okr) => {
    const atingimento = calculateOKRAtingimento(okr);
    return sum + atingimento * (okr.peso / totalWeight);
  }, 0);

  return Math.round(weightedSum * 10) / 10;
}

/**
 * Valida se os pesos dos KRs somam 100% (tolerância de 0.1%)
 */
export function validateKRWeights(weights: number[]): boolean {
  const sum = weights.reduce((a, b) => a + b, 0);
  return Math.abs(sum - 1.0) < 0.001;
}

/**
 * Enriquece OKRs com dados calculados de atingimento.
 */
export function enrichOKRs(
  okrs: (OKR & { keyResults: KeyResult[] })[]
): OKRWithProgress[] {
  return okrs.map((okr) => ({
    ...okr,
    keyResults: okr.keyResults.map((kr) => ({
      ...kr,
      calculatedAtingimento: calculateKRAtingimento(kr),
    })),
    atingimento: calculateOKRAtingimento(okr),
  }));
}
