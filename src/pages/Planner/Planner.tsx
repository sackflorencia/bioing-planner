import { useMemo } from 'react';
import { useCurriculum } from '../../hooks/useCurriculum';
import { useSemesterPlanner } from '../../hooks/useSemesterPlanner';
import PlannerPlanTabs from '../../components/planner/PlannerPlanTabs';
import PlannerSubjectPicker from '../../components/planner/PlannerSubjectPicker';
import PlannerSummary from '../../components/planner/PlannerSummary';
import styles from './Planner.module.css';

export default function Planner() {
  const { subjects } = useCurriculum();
  const {
    plans,
    activePlan,
    activePlanId,
    createPlan,
    renamePlan,
    deletePlan,
    selectPlan,
    addSubjectToPlan,
    removeSubjectFromPlan,
    getPlanSummary,
  } = useSemesterPlanner();

  const selectedIds = activePlan?.subjectIds ?? [];

  const selectedSubjects = useMemo(
    () => subjects.filter((subject) => selectedIds.includes(subject.id)),
    [subjects, selectedIds]
  );

  const summary = activePlan
    ? getPlanSummary(activePlan.id)
    : { subjectCount: 0, totalWeeklyHours: 0, totalHours: 0 };

  function handleToggle(subjectId: string) {
    if (!activePlan) return;
    if (activePlan.subjectIds.includes(subjectId)) {
      removeSubjectFromPlan(activePlan.id, subjectId);
    } else {
      addSubjectToPlan(activePlan.id, subjectId);
    }
  }

  function handleRemove(subjectId: string) {
    if (!activePlan) return;
    removeSubjectFromPlan(activePlan.id, subjectId);
  }

  return (
    <div className="page">
      <div className="pageHeader">
        <h1 className="pageTitle">Planificar cuatrimestre</h1>
        <p className="pageSubtitle">
          Armá el próximo cuatrimestre y mirá en vivo cuánta carga horaria estás sumando.
        </p>
      </div>

      <PlannerPlanTabs
        plans={plans}
        activePlanId={activePlanId}
        onSelect={selectPlan}
        onCreate={createPlan}
        onRename={renamePlan}
        onDelete={deletePlan}
      />

      <div className={styles.columns}>
        <PlannerSubjectPicker subjects={subjects} selectedIds={selectedIds} onToggle={handleToggle} />
        <PlannerSummary
          planName={activePlan?.name ?? 'Plan'}
          summary={summary}
          selectedSubjects={selectedSubjects}
          onRemove={handleRemove}
        />
      </div>
    </div>
  );
}
