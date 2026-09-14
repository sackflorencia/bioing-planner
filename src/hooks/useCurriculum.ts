import { useCallback, useMemo } from 'react';
import { curriculum } from '../data/curriculum';
import { computeAllSubjectStatuses, computeDashboardStats } from '../utils/curriculumUtils';
import { passesFinal } from '../utils/academicUtils';
import { useCompletedSubjects } from './useCompletedSubjects';
import { useAcademicProgress } from './useAcademicProgress';
import type { SubjectWithStatus } from '../interfaces/Subject';

/**
 * Hook principal que usan las páginas: combina
 *  - los datos estáticos del plan (data/curriculum.ts),
 *  - las materias aprobadas (useCompletedSubjects),
 *  - las materias cursando + sus registros académicos (useAcademicProgress)
 * en un único cálculo (computeAllSubjectStatuses) y expone el plan ya
 * enriquecido, listo para el grafo, el dashboard, el planificador y el
 * panel de detalle.
 *
 * Como el grafo, el dashboard y el planificador llaman los tres a
 * useCurriculum(), y useCurriculum() a su vez llama siempre a las
 * mismas dos fuentes de estado, es imposible que una materia figure
 * "Cursando" en un lugar y "Disponible" en otro: hay una única fuente
 * de verdad.
 */
export function useCurriculum() {
  const {
    completedIds,
    markApproved: markApprovedDirect,
    unmarkApproved: unmarkApprovedDirect,
    resetProgress: resetApprovedProgress,
  } = useCompletedSubjects();

  const {
    inProgressIds,
    academicRecords,
    markInProgress,
    unmarkInProgress,
    addPartialGrade,
    removePartialGrade,
    setPartialGradeValue,
    setFinalGrade,
    setPassedByPromotion,
    resetAcademicProgress,
  } = useAcademicProgress();

  const subjects: SubjectWithStatus[] = useMemo(
    () => computeAllSubjectStatuses(curriculum, completedIds, inProgressIds, academicRecords),
    [completedIds, inProgressIds, academicRecords]
  );

  const stats = useMemo(() => computeDashboardStats(subjects), [subjects]);

  const getSubject = useCallback(
    (id: string): SubjectWithStatus | undefined => subjects.find((subject) => subject.id === id),
    [subjects]
  );

  /** Acción "Marcar como aprobada" directa (sin pasar por cursando).
   *  Se conserva del comportamiento anterior: sirve para cargar
   *  materias ya rendidas antes de usar la app, equivalencias, etc.
   *  Si la materia tenía un registro académico (estaba cursando), se
   *  la saca de "cursando" para no dejarla en dos estados a la vez. */
  const markApproved = useCallback(
    (subjectId: string) => {
      markApprovedDirect(subjectId);
      unmarkInProgress(subjectId);
    },
    [markApprovedDirect, unmarkInProgress]
  );

  /** Deshace una aprobación. Si la materia tiene registro académico
   *  (parciales/final cargados), vuelve a "Cursando" en vez de caer
   *  directo a "Disponible": el usuario está corrigiendo un error de
   *  aprobación, no anotándose de cero. */
  const unmarkApproved = useCallback(
    (subjectId: string) => {
      unmarkApprovedDirect(subjectId);
      if (academicRecords[subjectId]) {
        markInProgress(subjectId);
      }
    },
    [unmarkApprovedDirect, academicRecords, markInProgress]
  );

  /** Confirma la promoción: requiere una acción explícita del usuario
   *  (no se aprueba solo al llegar al promedio). Vuelve a validar el
   *  requisito acá por seguridad, aunque el botón que la dispara ya
   *  debería estar deshabilitado si no corresponde. */
  const promoteSubject = useCallback(
    (subjectId: string) => {
      const subject = getSubject(subjectId);
      if (!subject || !subject.meetsPromotionRequirement) return;
      setPassedByPromotion(subjectId, true);
      markApprovedDirect(subjectId);
      unmarkInProgress(subjectId);
    },
    [getSubject, setPassedByPromotion, markApprovedDirect, unmarkInProgress]
  );

  /** Registra la nota del final y, si alcanza para aprobar, confirma
   *  la aprobación por esa vía (no por promoción). */
  const registerFinalGrade = useCallback(
    (subjectId: string, grade: number) => {
      setFinalGrade(subjectId, grade);
      if (passesFinal(grade)) {
        setPassedByPromotion(subjectId, false);
        markApprovedDirect(subjectId);
        unmarkInProgress(subjectId);
      }
    },
    [setFinalGrade, setPassedByPromotion, markApprovedDirect, unmarkInProgress]
  );

  const resetProgress = useCallback(() => {
    resetApprovedProgress();
    resetAcademicProgress();
  }, [resetApprovedProgress, resetAcademicProgress]);

  return {
    subjects,
    stats,
    completedIds,
    inProgressIds,
    getSubject,
    // ciclo de vida general
    markApproved,
    unmarkApproved,
    markInProgress,
    unmarkInProgress,
    resetProgress,
    // evaluación
    addPartialGrade,
    removePartialGrade,
    setPartialGradeValue,
    registerFinalGrade,
    promoteSubject,
  };
}