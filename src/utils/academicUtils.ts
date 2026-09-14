import type { Subject } from '../interfaces/Subject';
import type { AcademicRecord, PartialGrade } from '../interfaces/AcademicRecord';

/**
 * Reglas de evaluación (notas, promedio, promoción, final). Es lógica
 * de dominio pura, igual que curriculumUtils.ts: no toca React ni
 * localStorage, sólo recibe datos y devuelve datos/booleanos.
 */

/** Escala académica 0–10. Si el sistema usara otra escala, sólo hay
 *  que tocar estas dos constantes. */
export const GRADE_MIN = 0;
export const GRADE_MAX = 10;

/**
 * Nota mínima para aprobar un final. Es un valor configurable: la
 * convención más común (UBA) es 4, pero se puede ajustar acá sin
 * tocar el resto de la lógica ni el modelo de datos.
 */
export const FINAL_PASSING_GRADE = 4;

export function isValidGrade(value: number): boolean {
  return Number.isFinite(value) && value >= GRADE_MIN && value <= GRADE_MAX;
}

/** Redondea a 2 decimales para no arrastrar errores de punto flotante
 *  en el promedio (ej. 7.166666...). */
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Promedio de los parciales CARGADOS únicamente. Si no hay ninguna
 * nota cargada todavía, devuelve null (nunca 0) para no mostrar un
 * promedio incorrecto, tal como pidió la consigna.
 *
 * Decisión académica: un parcial vacío ("Parcial 3: [ ]") no cuenta
 * como un 0 ni resta del promedio; simplemente todavía no existe. Si
 * mañana se quisiera la otra convención (parcial vacío = ausente = 0),
 * sería un cambio de una sola línea acá, sin tocar el resto de la app.
 */
export function calculateAverage(partialGrades: PartialGrade[]): number | null {
  const loaded = partialGrades.map((grade) => grade.value).filter((value): value is number => value !== null);
  if (loaded.length === 0) return null;
  const sum = loaded.reduce((acc, value) => acc + value, 0);
  return round2(sum / loaded.length);
}

/**
 * ¿La materia cumple el requisito de promedio para promocionar?
 * Requiere que la materia sea promocionable, que tenga un
 * `promotionAverage` configurado, y que el promedio actual lo
 * alcance. No mira el estado de la materia (eso lo decide quien
 * llama, junto con la acción explícita de "Promocionar").
 */
export function meetsPromotionRequirement(subject: Subject, average: number | null): boolean {
  if (!subject.isPromotable || subject.promotionAverage === undefined) return false;
  if (average === null) return false;
  return average >= subject.promotionAverage;
}

/** ¿La nota de final ingresada alcanza para aprobar? */
export function passesFinal(finalGrade: number | null): boolean {
  return finalGrade !== null && finalGrade >= FINAL_PASSING_GRADE;
}

/** Genera el siguiente parcial ("Parcial N") a partir de los que ya
 *  existen en el registro, para que agregar uno nuevo desde la UI no
 *  dependa de que el componente sepa numerar. */
export function nextPartialGrade(existing: PartialGrade[]): PartialGrade {
  return {
    id: `partial-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    label: `Parcial ${existing.length + 1}`,
    value: null,
  };
}

export function withUpdatedGrade(
  record: AcademicRecord,
  partialId: string,
  value: number | null
): AcademicRecord {
  return {
    ...record,
    partialGrades: record.partialGrades.map((grade) =>
      grade.id === partialId ? { ...grade, value } : grade
    ),
  };
}