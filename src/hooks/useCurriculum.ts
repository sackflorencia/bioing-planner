import { useMemo } from 'react';
import { curriculum } from '../data/curriculum';
import { computeAllSubjectStatuses, computeDashboardStats } from '../utils/curriculumUtils';
import { useCompletedSubjects } from './useCompletedSubjects';
import type { SubjectWithStatus } from '../interfaces/Subject';

/**
 * Hook principal que usan las páginas: combina los datos estáticos del
 * plan (data/curriculum.ts) con el progreso del usuario
 * (useCompletedSubjects) y devuelve el plan "enriquecido" con estados
 * ya calculados, listo para renderizar en el grafo, el dashboard o el
 * planificador.
 */
export function useCurriculum() {
  const { completedIds, markApproved, unmarkApproved, toggleApproved, resetProgress } =
    useCompletedSubjects();

  const subjects: SubjectWithStatus[] = useMemo(
    () => computeAllSubjectStatuses(curriculum, completedIds),
    [completedIds]
  );

  const stats = useMemo(() => computeDashboardStats(subjects), [subjects]);

  const getSubject = (id: string): SubjectWithStatus | undefined =>
    subjects.find((subject) => subject.id === id);

  return {
    subjects,
    stats,
    completedIds,
    markApproved,
    unmarkApproved,
    toggleApproved,
    resetProgress,
    getSubject,
  };
}
