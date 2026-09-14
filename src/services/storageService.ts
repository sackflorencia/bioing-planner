import type { SemesterPlan } from '../interfaces/SemesterPlan';
import type { AcademicRecord } from '../interfaces/AcademicRecord';

/**
 * Capa de persistencia única de la aplicación.
 *
 * Ningún componente ni hook debería llamar a `window.localStorage`
 * directamente: todos pasan por acá. Esto es lo que permite, el día
 * de mañana, reemplazar LocalStorage por llamadas a una API/backend
 * sin tener que tocar componentes ni hooks (sólo este archivo).
 *
 * Todas las funciones son "safe": si localStorage no está disponible
 * (SSR, modo privado, cuota excedida, etc.) o el contenido guardado
 * está corrupto, se loguea un warning y se devuelve un valor por
 * defecto en vez de romper la aplicación.
 */

/**
 * Compatibilidad con datos ya guardados: `completedSubjects`,
 * `semesterPlans` y `activePlanId` conservan exactamente la misma
 * clave y la misma forma (string[] / SemesterPlan[] / string) que
 * tenían antes de agregar "Cursando" y las notas. Un usuario con
 * progreso viejo simplemente sigue teniendo sus materias aprobadas y
 * sus planes intactos.
 *
 * `inProgressSubjects` y `academicRecords` son claves NUEVAS. Para un
 * usuario existente no existen todavía en localStorage, y
 * `safeGetItem` ya devuelve `null` en ese caso → las funciones de
 * abajo devuelven `[]` / `{}` por defecto. Es decir: no hace falta
 * ninguna migración explícita, el propio patrón "safe get con
 * default" que ya usaba el resto del servicio alcanza para que la
 * nueva versión cargue datos viejos sin romperse.
 */
const STORAGE_KEYS = {
  completedSubjects: 'bioing:completedSubjects:v1',
  semesterPlans: 'bioing:semesterPlans:v1',
  activePlanId: 'bioing:activePlanId:v1',
  inProgressSubjects: 'bioing:inProgressSubjects:v1',
  academicRecords: 'bioing:academicRecords:v1',
} as const;

function safeGetItem(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    console.warn(`[storageService] No se pudo leer "${key}" de localStorage.`, error);
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    console.warn(`[storageService] No se pudo escribir "${key}" en localStorage.`, error);
  }
}

function safeRemoveItem(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.warn(`[storageService] No se pudo eliminar "${key}" de localStorage.`, error);
  }
}

// ---------------------------------------------------------------------
// Materias aprobadas
// ---------------------------------------------------------------------

export function getCompletedSubjects(): string[] {
  const raw = safeGetItem(STORAGE_KEYS.completedSubjects);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === 'string');
  } catch (error) {
    console.warn('[storageService] No se pudieron parsear las materias aprobadas guardadas.', error);
    return [];
  }
}

export function setCompletedSubjects(ids: string[]): void {
  safeSetItem(STORAGE_KEYS.completedSubjects, JSON.stringify(Array.from(new Set(ids))));
}

// ---------------------------------------------------------------------
// Planificación de cuatrimestres
// ---------------------------------------------------------------------

export function getSemesterPlans(): SemesterPlan[] {
  const raw = safeGetItem(STORAGE_KEYS.semesterPlans);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as SemesterPlan[];
  } catch (error) {
    console.warn('[storageService] No se pudieron parsear los planes de cuatrimestre guardados.', error);
    return [];
  }
}

export function setSemesterPlans(plans: SemesterPlan[]): void {
  safeSetItem(STORAGE_KEYS.semesterPlans, JSON.stringify(plans));
}

/** Atajo equivalente a "setSemesterPlan": crea o reemplaza un único
 *  plan dentro de la lista completa, sin tener que leer/escribir la
 *  lista entera desde el llamador. */
export function upsertSemesterPlan(plan: SemesterPlan): void {
  const plans = getSemesterPlans();
  const index = plans.findIndex((existing) => existing.id === plan.id);
  if (index === -1) {
    setSemesterPlans([...plans, plan]);
  } else {
    const next = [...plans];
    next[index] = plan;
    setSemesterPlans(next);
  }
}

export function getActivePlanId(): string | null {
  return safeGetItem(STORAGE_KEYS.activePlanId);
}

export function setActivePlanId(id: string | null): void {
  if (id === null) {
    safeRemoveItem(STORAGE_KEYS.activePlanId);
  } else {
    safeSetItem(STORAGE_KEYS.activePlanId, id);
  }
}

// ---------------------------------------------------------------------
// Materias cursando
// ---------------------------------------------------------------------

export function getInProgressSubjects(): string[] {
  const raw = safeGetItem(STORAGE_KEYS.inProgressSubjects);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === 'string');
  } catch (error) {
    console.warn('[storageService] No se pudieron parsear las materias cursando guardadas.', error);
    return [];
  }
}

export function setInProgressSubjects(ids: string[]): void {
  safeSetItem(STORAGE_KEYS.inProgressSubjects, JSON.stringify(Array.from(new Set(ids))));
}

// ---------------------------------------------------------------------
// Registros académicos (parciales, final, promoción) por materia
// ---------------------------------------------------------------------

export function getAcademicRecords(): Record<string, AcademicRecord> {
  const raw = safeGetItem(STORAGE_KEYS.academicRecords);
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return parsed as Record<string, AcademicRecord>;
  } catch (error) {
    console.warn('[storageService] No se pudieron parsear los registros académicos guardados.', error);
    return {};
  }
}

export function setAcademicRecords(records: Record<string, AcademicRecord>): void {
  safeSetItem(STORAGE_KEYS.academicRecords, JSON.stringify(records));
}

// ---------------------------------------------------------------------
// Reset general
// ---------------------------------------------------------------------

export function clearUserData(): void {
  safeRemoveItem(STORAGE_KEYS.completedSubjects);
  safeRemoveItem(STORAGE_KEYS.semesterPlans);
  safeRemoveItem(STORAGE_KEYS.activePlanId);
  safeRemoveItem(STORAGE_KEYS.inProgressSubjects);
  safeRemoveItem(STORAGE_KEYS.academicRecords);
}