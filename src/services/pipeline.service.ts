import { PIPELINE_STAGES, STAGE_LABELS, STAGE_COLORS } from "@/lib/constants";

export { STAGE_LABELS, STAGE_COLORS };

const TERMINAL_STAGES = ["APROVADO", "REPROVADO", "DESISTIU"];

/**
 * Returns the next stage in the pipeline, or null if at terminal stage.
 */
export function getNextStatus(current: string): string | null {
  if (TERMINAL_STAGES.includes(current)) return null;
  const idx = PIPELINE_STAGES.indexOf(current as any);
  if (idx === -1 || idx >= PIPELINE_STAGES.length - 1) return null;
  return PIPELINE_STAGES[idx + 1];
}

/**
 * Returns the previous stage in the pipeline, or null if at first stage.
 */
export function getPrevStatus(current: string): string | null {
  if (TERMINAL_STAGES.includes(current)) return "CONCLUIDO";
  const idx = PIPELINE_STAGES.indexOf(current as any);
  if (idx <= 0) return null;
  return PIPELINE_STAGES[idx - 1];
}

/**
 * Returns the index position of a stage (used for progress calculation).
 */
export function getStageIndex(stage: string): number {
  return PIPELINE_STAGES.indexOf(stage as any);
}

/**
 * Returns progress percentage through the pipeline (0-100).
 */
export function getStageProgress(stage: string): number {
  const idx = getStageIndex(stage);
  if (idx === -1) return 0;
  return Math.round((idx / (PIPELINE_STAGES.length - 1)) * 100);
}

/**
 * Groups students by their pipeline stage.
 */
export function groupByStage<T extends { status: string }>(
  students: T[]
): Record<string, T[]> {
  const groups: Record<string, T[]> = {};
  for (const stage of PIPELINE_STAGES) {
    groups[stage] = [];
  }
  for (const student of students) {
    if (groups[student.status]) {
      groups[student.status].push(student);
    }
  }
  return groups;
}
