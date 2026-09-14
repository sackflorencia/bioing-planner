/**
 * Una nota de parcial (o, en general, de cualquier instancia de
 * evaluación parcial). La cantidad de parciales por materia es libre:
 * se agregan o quitan dinámicamente desde la UI, no hay un número
 * fijo hardcodeado en ningún lado.
 */
export interface PartialGrade {
  id: string;
  /** Etiqueta editable, ej. "Parcial 1". */
  label: string;
  /** null = todavía no se cargó la nota. */
  value: number | null;
}

/**
 * Información académica de una materia que el usuario está cursando o
 * ya cursó. Se guarda separada del estado general (SubjectStatus)
 * para no mezclar "en qué etapa está la materia respecto del plan"
 * (bloqueada/disponible/cursando/aprobada) con "qué notas sacó".
 *
 * Notar que acá NO se guarda el promedio: se calcula siempre a partir
 * de `partialGrades` (utils/academicUtils.ts › calculateAverage), tal
 * como pidió la consigna, para no duplicar un dato derivado.
 */
export interface AcademicRecord {
  subjectId: string;
  partialGrades: PartialGrade[];
  /** null = todavía no se rindió/registró el final. */
  finalGrade: number | null;
  /** true si la materia terminó aprobándose por promoción, false si
   *  se aprobó por final. undefined mientras la materia no está
   *  aprobada (o si se aprobó "directamente", sin cursar). */
  passedByPromotion?: boolean;
}

export function createEmptyAcademicRecord(subjectId: string): AcademicRecord {
  return {
    subjectId,
    partialGrades: [],
    finalGrade: null,
    passedByPromotion: undefined,
  };
}