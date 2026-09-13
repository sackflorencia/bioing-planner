/**
 * Estado calculado de una materia en función del progreso del usuario.
 *
 * - "locked"    -> le faltan correlativas (o créditos) por aprobar.
 * - "available" -> cumple todos los requisitos, todavía no fue aprobada.
 * - "approved"  -> el usuario ya la marcó como aprobada.
 */
export type SubjectStatus = 'locked' | 'available' | 'approved';

/**
 * Representa una materia del plan de estudios tal como está definida
 * en los datos "fuente" (data/curriculum.ts). Es el dato crudo, sin
 * ningún cálculo derivado del progreso del usuario.
 */
export interface Subject {
  /** Identificador estable y único (kebab-case). Nunca cambia, aunque
   *  cambie el nombre visible de la materia. Las correlativas se
   *  referencian siempre por este id. */
  id: string;
  /** Código visible de la materia. Para las materias del CBC es el
   *  código oficial provisto por la UBA. Para el resto (2º ciclo) el
   *  plan de estudios original no incluye códigos, así que se generó
   *  un código sintético "<cuatrimestre>-<orden>" (ver README /
   *  sección "Inconsistencias" de la respuesta). */
  code: string;
  /** Nombre visible de la materia. */
  name: string;
  /** Cuatrimestre en el que se dicta. 0 = CBC (1º y 2º cuatrimestre,
   *  tratado como bloque único porque la fuente no especifica en cuál
   *  de los dos se cursa cada materia). 3..11 = cuatrimestre numerado. */
  semester: number;
  /** Carga horaria semanal (también usada como "créditos" para el
   *  requisito de Legislación y Ejercicio Profesional). */
  weeklyHours: number;
  /** Horas totales de cursada. */
  totalHours: number;
  /** Ids de las materias que deben estar TODAS aprobadas para que esta
   *  materia pase a estar disponible. Array vacío = sin correlativas. */
  prerequisites: string[];
  /** Requisito adicional expresado en créditos acumulados (suma de
   *  weeklyHours de materias aprobadas), independiente de prerequisites.
   *  Lo usa únicamente "Legislación y Ejercicio Profesional" (100
   *  créditos), que no correlativiza con una materia puntual. */
  creditsRequired?: number;
  /** true para los "casilleros" de Electivas/Optativas: no representan
   *  una materia curricular fija sino un espacio para que, en el
   *  futuro, se agreguen materias electivas reales. */
  isElectivePlaceholder?: boolean;
  /** Otros cuatrimestres en los que también figura la misma instancia
   *  curricular. Lo usa "Tesis de Bioingeniería / Trabajo Profesional",
   *  que el plan original lista igual en 10º y 11º cuatrimestre. */
  alternateSemesters?: number[];
  /** Aclaraciones libres que se muestran en el panel de detalle. */
  notes?: string;
}

/**
 * Una materia enriquecida con el estado calculado a partir del
 * progreso del usuario (materias aprobadas). Se genera en runtime con
 * utils/curriculumUtils.ts, nunca se guarda en data/curriculum.ts.
 */
export interface SubjectWithStatus extends Subject {
  status: SubjectStatus;
  /** Ids de correlativas que todavía faltan aprobar (subconjunto de
   *  prerequisites). Vacío si status !== 'locked' por prerequisites. */
  missingPrerequisites: string[];
  /** Ids de las materias que tienen a esta materia como correlativa
   *  directa. Se calcula automáticamente recorriendo todo el plan. */
  unlocks: string[];
  /** Créditos (horas semanales) acumulados aprobados al momento del
   *  cálculo. Útil para mostrar el progreso hacia creditsRequired. */
  approvedCreditsSoFar: number;
}
