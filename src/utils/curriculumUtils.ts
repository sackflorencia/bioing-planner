import type { Subject, SubjectStatus, SubjectWithStatus } from '../interfaces/Subject';

/**
 * Lógica de negocio "pura" del plan de estudios: no sabe nada de React,
 * de localStorage ni de la UI. Recibe datos y devuelve datos, lo que la
 * hace fácil de testear y de reutilizar (por ejemplo, el día de mañana,
 * en un backend).
 */

export function getSubjectById(subjects: Subject[], id: string): Subject | undefined {
  return subjects.find((subject) => subject.id === id);
}

/** Créditos = suma de weeklyHours de las materias aprobadas. Es lo que
 *  usa el requisito de "100 créditos" de Legislación y Ejercicio
 *  Profesional. */
export function computeApprovedCredits(subjects: Subject[], completedIds: string[]): number {
  const completedSet = new Set(completedIds);
  return subjects
    .filter((subject) => completedSet.has(subject.id))
    .reduce((sum, subject) => sum + subject.weeklyHours, 0);
}

export function getMissingPrerequisites(subject: Subject, completedIds: string[]): string[] {
  const completedSet = new Set(completedIds);
  return subject.prerequisites.filter((id) => !completedSet.has(id));
}

/**
 * Determina el estado de una materia:
 *  - "approved" si el usuario ya la marcó como tal.
 *  - "locked" si falta aprobar alguna correlativa, o si no llega al
 *    mínimo de creditsRequired (cuando la materia lo define).
 *  - "available" en cualquier otro caso (incluidas las materias sin
 *    correlativas, que están disponibles desde el comienzo).
 *
 * Esta función es completamente genérica: no tiene ningún caso
 * especial hardcodeado por materia. El CBC "funciona solo" porque sus
 * materias dependientes listan los 6 ids de CBC en `prerequisites`; el
 * requisito de créditos de Legislación funciona porque compara
 * `approvedCredits` contra `creditsRequired`.
 */
export function computeSubjectStatus(
  subject: Subject,
  completedIds: string[],
  approvedCredits: number
): SubjectStatus {
  const completedSet = new Set(completedIds);
  if (completedSet.has(subject.id)) {
    return 'approved';
  }

  const hasMissingPrerequisites = getMissingPrerequisites(subject, completedIds).length > 0;
  const hasMissingCredits =
    subject.creditsRequired !== undefined && approvedCredits < subject.creditsRequired;

  if (hasMissingPrerequisites || hasMissingCredits) {
    return 'locked';
  }

  return 'available';
}

/** Materias que tienen a `subjectId` como correlativa DIRECTA. Se
 *  recalcula siempre recorriendo el plan completo: nunca se guarda a
 *  mano, para que nunca quede desincronizado de `prerequisites`. */
function getDirectUnlocks(subjectId: string, allSubjects: Subject[]): string[] {
  return allSubjects
    .filter((subject) => subject.prerequisites.includes(subjectId))
    .map((subject) => subject.id);
}

/** Enriquece todo el plan de estudios con el estado calculado para el
 *  progreso actual del usuario. Es la función "central" que consumen
 *  el grafo, el dashboard y el planificador. */
export function computeAllSubjectStatuses(
  subjects: Subject[],
  completedIds: string[]
): SubjectWithStatus[] {
  const approvedCredits = computeApprovedCredits(subjects, completedIds);

  return subjects.map((subject) => ({
    ...subject,
    status: computeSubjectStatus(subject, completedIds, approvedCredits),
    missingPrerequisites: getMissingPrerequisites(subject, completedIds),
    unlocks: getDirectUnlocks(subject.id, subjects),
    approvedCreditsSoFar: approvedCredits,
  }));
}

export function groupBySemester(
  subjects: SubjectWithStatus[]
): Map<number, SubjectWithStatus[]> {
  const map = new Map<number, SubjectWithStatus[]>();
  subjects.forEach((subject) => {
    const list = map.get(subject.semester) ?? [];
    list.push(subject);
    map.set(subject.semester, list);
  });
  return map;
}

/** 0 -> "CBC", cualquier otro número -> "3° cuatrimestre", etc. */
export function formatSemesterLabel(semester: number): string {
  if (semester === 0) return 'CBC';
  return `${semester}° cuatrimestre`;
}

export interface SemesterProgress {
  semester: number;
  label: string;
  approved: number;
  total: number;
}

export interface CurriculumStats {
  totalSubjects: number;
  approvedCount: number;
  availableCount: number;
  lockedCount: number;
  totalHours: number;
  approvedHours: number;
  remainingHours: number;
  /** Progreso en % según cantidad de materias aprobadas / total. */
  percentBySubjects: number;
  /** Progreso en % según horas aprobadas / horas totales. */
  percentByHours: number;
  approvedBySemester: SemesterProgress[];
  /** Próximas materias disponibles (no aprobadas todavía), ordenadas
   *  por cuatrimestre. */
  nextAvailable: SubjectWithStatus[];
}

export function computeDashboardStats(subjects: SubjectWithStatus[]): CurriculumStats {
  const totalSubjects = subjects.length;
  const approvedCount = subjects.filter((s) => s.status === 'approved').length;
  const availableCount = subjects.filter((s) => s.status === 'available').length;
  const lockedCount = subjects.filter((s) => s.status === 'locked').length;

  const totalHours = subjects.reduce((sum, s) => sum + s.totalHours, 0);
  const approvedHours = subjects
    .filter((s) => s.status === 'approved')
    .reduce((sum, s) => sum + s.totalHours, 0);
  const remainingHours = totalHours - approvedHours;

  const percentBySubjects = totalSubjects === 0 ? 0 : Math.round((approvedCount / totalSubjects) * 100);
  const percentByHours = totalHours === 0 ? 0 : Math.round((approvedHours / totalHours) * 100);

  const semesters = Array.from(new Set(subjects.map((s) => s.semester))).sort((a, b) => a - b);
  const approvedBySemester: SemesterProgress[] = semesters.map((semester) => {
    const inSemester = subjects.filter((s) => s.semester === semester);
    return {
      semester,
      label: formatSemesterLabel(semester),
      approved: inSemester.filter((s) => s.status === 'approved').length,
      total: inSemester.length,
    };
  });

  const nextAvailable = subjects
    .filter((s) => s.status === 'available')
    .sort((a, b) => a.semester - b.semester || a.code.localeCompare(b.code));

  return {
    totalSubjects,
    approvedCount,
    availableCount,
    lockedCount,
    totalHours,
    approvedHours,
    remainingHours,
    percentBySubjects,
    percentByHours,
    approvedBySemester,
    nextAvailable,
  };
}
