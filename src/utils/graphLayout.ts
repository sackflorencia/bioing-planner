import type { SubjectWithStatus } from '../interfaces/Subject';

/**
 * Layout manual y determinístico del grafo: una columna por
 * cuatrimestre, materias apiladas verticalmente dentro de su columna.
 *
 * Se eligió esto en vez de un algoritmo de auto-layout (dagre, elk,
 * etc.) porque el propio plan de estudios ya define el orden natural
 * (el cuatrimestre de cada materia) y evita sumar una dependencia más
 * al proyecto sólo para calcular posiciones.
 */

export const COLUMN_WIDTH = 260;
export const NODE_WIDTH = 220;
export const ROW_HEIGHT = 118;
export const ROW_GAP = 24;
export const HEADER_HEIGHT = 56;
export const COLUMN_START_X = 24;
export const ROW_START_Y = HEADER_HEIGHT + 32;

export interface Point {
  x: number;
  y: number;
}

export interface SemesterHeaderPosition extends Point {
  semester: number;
}

export interface GraphLayoutResult {
  subjectPositions: Map<string, Point>;
  headerPositions: SemesterHeaderPosition[];
  /** Ancho y alto totales ocupados, útil para dimensionar contenedores. */
  width: number;
  height: number;
}

export function computeGraphLayout(subjects: SubjectWithStatus[]): GraphLayoutResult {
  const semesters = Array.from(new Set(subjects.map((s) => s.semester))).sort((a, b) => a - b);

  const subjectPositions = new Map<string, Point>();
  const headerPositions: SemesterHeaderPosition[] = [];
  let maxRows = 0;

  semesters.forEach((semester, columnIndex) => {
    const x = COLUMN_START_X + columnIndex * COLUMN_WIDTH;
    headerPositions.push({ semester, x, y: 0 });

    const subjectsInColumn = subjects
      .filter((s) => s.semester === semester)
      .sort((a, b) => a.code.localeCompare(b.code));

    subjectsInColumn.forEach((subject, rowIndex) => {
      subjectPositions.set(subject.id, {
        x,
        y: ROW_START_Y + rowIndex * (ROW_HEIGHT + ROW_GAP),
      });
    });

    maxRows = Math.max(maxRows, subjectsInColumn.length);
  });

  return {
    subjectPositions,
    headerPositions,
    width: COLUMN_START_X * 2 + semesters.length * COLUMN_WIDTH,
    height: ROW_START_Y + maxRows * (ROW_HEIGHT + ROW_GAP),
  };
}
