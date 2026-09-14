import { useCallback, useEffect, useState } from 'react';
import * as storageService from '../services/storageService';
import { createEmptyAcademicRecord } from '../interfaces/AcademicRecord';
import type { AcademicRecord } from '../interfaces/AcademicRecord';
import { isValidGrade, nextPartialGrade, withUpdatedGrade } from '../utils/academicUtils';

/**
 * Maneja las dos piezas de estado nuevas: qué materias están
 * "Cursando" y el registro académico (parciales/final/promoción) de
 * cada una. Sigue el mismo patrón que useCompletedSubjects.ts: estado
 * en memoria + useEffect que persiste automáticamente, para que
 * recargar la página nunca pierda nada.
 *
 * A propósito NO calcula el estado final de la materia (eso lo sigue
 * haciendo utils/curriculumUtils.ts a partir de esto + de
 * useCompletedSubjects), para no duplicar la única fuente de verdad.
 */
export function useAcademicProgress() {
  const [inProgressIds, setInProgressIds] = useState<string[]>(() =>
    storageService.getInProgressSubjects()
  );
  const [academicRecords, setAcademicRecords] = useState<Record<string, AcademicRecord>>(() =>
    storageService.getAcademicRecords()
  );

  useEffect(() => {
    storageService.setInProgressSubjects(inProgressIds);
  }, [inProgressIds]);

  useEffect(() => {
    storageService.setAcademicRecords(academicRecords);
  }, [academicRecords]);

  function ensureRecord(records: Record<string, AcademicRecord>, subjectId: string) {
    if (records[subjectId]) return records;
    return { ...records, [subjectId]: createEmptyAcademicRecord(subjectId) };
  }

  /** Marca una materia como "Cursando" y le crea un registro académico
   *  vacío si todavía no tenía uno (por ejemplo, la primera vez que se
   *  empieza a cursar). */
  const markInProgress = useCallback((subjectId: string) => {
    setInProgressIds((prev) => (prev.includes(subjectId) ? prev : [...prev, subjectId]));
    setAcademicRecords((prev) => ensureRecord(prev, subjectId));
  }, []);

  /** Vuelve la materia a "Disponible" (o lo que corresponda según sus
   *  correlativas). Las notas ya cargadas NO se borran, por si el
   *  usuario retoma la cursada más adelante. */
  const unmarkInProgress = useCallback((subjectId: string) => {
    setInProgressIds((prev) => prev.filter((id) => id !== subjectId));
  }, []);

  const addPartialGrade = useCallback((subjectId: string) => {
    setAcademicRecords((prev) => {
      const withRecord = ensureRecord(prev, subjectId);
      const record = withRecord[subjectId];
      return {
        ...withRecord,
        [subjectId]: {
          ...record,
          partialGrades: [...record.partialGrades, nextPartialGrade(record.partialGrades)],
        },
      };
    });
  }, []);

  const removePartialGrade = useCallback((subjectId: string, partialId: string) => {
    setAcademicRecords((prev) => {
      const record = prev[subjectId];
      if (!record) return prev;
      return {
        ...prev,
        [subjectId]: {
          ...record,
          partialGrades: record.partialGrades.filter((grade) => grade.id !== partialId),
        },
      };
    });
  }, []);

  /** value === null borra la nota cargada (campo vacío). Cualquier
   *  otro valor se valida contra la escala 0–10 antes de guardarse. */
  const setPartialGradeValue = useCallback((subjectId: string, partialId: string, value: number | null) => {
    if (value !== null && !isValidGrade(value)) return;
    setAcademicRecords((prev) => {
      const withRecord = ensureRecord(prev, subjectId);
      return { ...withRecord, [subjectId]: withUpdatedGrade(withRecord[subjectId], partialId, value) };
    });
  }, []);

  const setFinalGrade = useCallback((subjectId: string, value: number | null) => {
    if (value !== null && !isValidGrade(value)) return;
    setAcademicRecords((prev) => {
      const withRecord = ensureRecord(prev, subjectId);
      return { ...withRecord, [subjectId]: { ...withRecord[subjectId], finalGrade: value } };
    });
  }, []);

  const setPassedByPromotion = useCallback((subjectId: string, passedByPromotion: boolean) => {
    setAcademicRecords((prev) => {
      const withRecord = ensureRecord(prev, subjectId);
      return { ...withRecord, [subjectId]: { ...withRecord[subjectId], passedByPromotion } };
    });
  }, []);

  const resetAcademicProgress = useCallback(() => {
    setInProgressIds([]);
    setAcademicRecords({});
  }, []);

  return {
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
  };
}