import { useCallback, useEffect, useMemo, useState } from 'react';
import * as storageService from '../services/storageService';
import { curriculum } from '../data/curriculum';
import type { SemesterPlan, SemesterPlanSummary } from '../interfaces/SemesterPlan';

function createEmptyPlan(name: string): SemesterPlan {
  return {
    id: `plan-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    subjectIds: [],
    createdAt: new Date().toISOString(),
  };
}

function summarize(subjectIds: string[]): SemesterPlanSummary {
  const subjectsInPlan = curriculum.filter((subject) => subjectIds.includes(subject.id));
  return {
    subjectCount: subjectsInPlan.length,
    totalWeeklyHours: subjectsInPlan.reduce((sum, s) => sum + s.weeklyHours, 0),
    totalHours: subjectsInPlan.reduce((sum, s) => sum + s.totalHours, 0),
  };
}

/**
 * Maneja la sección "Planificar cuatrimestre": el usuario puede tener
 * varios planes independientes (uno por cuatrimestre real) y elegir
 * cuál está activo. Todo se persiste en localStorage a través de
 * services/storageService.ts.
 */
export function useSemesterPlanner() {
  const [plans, setPlans] = useState<SemesterPlan[]>(() => storageService.getSemesterPlans());
  const [activePlanId, setActivePlanIdState] = useState<string | null>(() =>
    storageService.getActivePlanId()
  );

  useEffect(() => {
    storageService.setSemesterPlans(plans);
  }, [plans]);

  useEffect(() => {
    storageService.setActivePlanId(activePlanId);
  }, [activePlanId]);

  // Garantiza que siempre haya al menos un plan y que activePlanId
  // apunte a un plan que realmente existe (por ejemplo, la primera
  // vez que se abre la app, o después de borrar el plan activo).
  useEffect(() => {
    if (plans.length === 0) {
      const initialPlan = createEmptyPlan('Cuatrimestre 1');
      setPlans([initialPlan]);
      setActivePlanIdState(initialPlan.id);
      return;
    }
    if (!activePlanId || !plans.some((plan) => plan.id === activePlanId)) {
      setActivePlanIdState(plans[0].id);
    }
  }, [plans, activePlanId]);

  const activePlan = useMemo(
    () => plans.find((plan) => plan.id === activePlanId) ?? null,
    [plans, activePlanId]
  );

  const createPlan = useCallback((name: string) => {
    const newPlan = createEmptyPlan(name.trim() || 'Nuevo plan');
    setPlans((prev) => [...prev, newPlan]);
    setActivePlanIdState(newPlan.id);
  }, []);

  const renamePlan = useCallback((planId: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setPlans((prev) => prev.map((plan) => (plan.id === planId ? { ...plan, name: trimmed } : plan)));
  }, []);

  const deletePlan = useCallback((planId: string) => {
    setPlans((prev) => prev.filter((plan) => plan.id !== planId));
  }, []);

  const selectPlan = useCallback((planId: string) => {
    setActivePlanIdState(planId);
  }, []);

  const addSubjectToPlan = useCallback((planId: string, subjectId: string) => {
    setPlans((prev) =>
      prev.map((plan) =>
        plan.id === planId && !plan.subjectIds.includes(subjectId)
          ? { ...plan, subjectIds: [...plan.subjectIds, subjectId] }
          : plan
      )
    );
  }, []);

  const removeSubjectFromPlan = useCallback((planId: string, subjectId: string) => {
    setPlans((prev) =>
      prev.map((plan) =>
        plan.id === planId
          ? { ...plan, subjectIds: plan.subjectIds.filter((id) => id !== subjectId) }
          : plan
      )
    );
  }, []);

  /** Borra todos los planes guardados; el efecto de arriba se encarga
   *  de recrear un plan vacío por defecto en el siguiente render. */
  const resetPlans = useCallback(() => {
    setPlans([]);
    setActivePlanIdState(null);
  }, []);

  const getPlanSummary = useCallback(
    (planId: string): SemesterPlanSummary => {
      const plan = plans.find((p) => p.id === planId);
      return summarize(plan?.subjectIds ?? []);
    },
    [plans]
  );

  return {
    plans,
    activePlan,
    activePlanId,
    createPlan,
    renamePlan,
    deletePlan,
    selectPlan,
    addSubjectToPlan,
    removeSubjectFromPlan,
    resetPlans,
    getPlanSummary,
  };
}
