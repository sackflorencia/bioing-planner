import { useCallback, useEffect, useState } from 'react';
import * as storageService from '../services/storageService';

/**
 * Maneja exclusivamente el conjunto de materias aprobadas por el
 * usuario. No sabe nada del grafo ni de los estados derivados
 * (eso lo calcula useCurriculum a partir de este hook); su única
 * responsabilidad es el CRUD + persistencia de "qué aprobé".
 */
export function useCompletedSubjects() {
  const [completedIds, setCompletedIds] = useState<string[]>(() =>
    storageService.getCompletedSubjects()
  );

  // Cualquier cambio en completedIds se persiste automáticamente.
  // Esto es lo que garantiza que recargar la página no borre el
  // progreso, y que no haga falta llamar a storageService desde cada
  // acción por separado.
  useEffect(() => {
    storageService.setCompletedSubjects(completedIds);
  }, [completedIds]);

  const markApproved = useCallback((subjectId: string) => {
    setCompletedIds((prev) => (prev.includes(subjectId) ? prev : [...prev, subjectId]));
  }, []);

  const unmarkApproved = useCallback((subjectId: string) => {
    setCompletedIds((prev) => prev.filter((id) => id !== subjectId));
  }, []);

  const toggleApproved = useCallback((subjectId: string) => {
    setCompletedIds((prev) =>
      prev.includes(subjectId) ? prev.filter((id) => id !== subjectId) : [...prev, subjectId]
    );
  }, []);

  const resetProgress = useCallback(() => {
    setCompletedIds([]);
  }, []);

  return { completedIds, markApproved, unmarkApproved, toggleApproved, resetProgress };
}
