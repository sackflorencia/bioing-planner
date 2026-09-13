/**
 * Un plan de cuatrimestre independiente. El usuario puede tener varios
 * (por ejemplo "1er cuatrimestre 2027", "Verano 2027") y elegir cuál
 * está activo. Cada uno guarda simplemente los ids de las materias
 * que el usuario quiere cursar.
 */
export interface SemesterPlan {
  id: string;
  name: string;
  subjectIds: string[];
  createdAt: string;
}

/**
 * Totales calculados de un plan (o de cualquier conjunto de ids de
 * materias). Se recalcula siempre a partir de data/curriculum.ts, no
 * se guarda persistido.
 */
export interface SemesterPlanSummary {
  subjectCount: number;
  totalWeeklyHours: number;
  totalHours: number;
}
