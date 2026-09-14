import { useState } from 'react';
import { useCurriculum } from '../../hooks/useCurriculum';
import { useSemesterPlanner } from '../../hooks/useSemesterPlanner';
import StatsSummary from '../../components/dashboard/StatsSummary';
import ProgressBar from '../../components/dashboard/ProgressBar';
import UpcomingSubjects from '../../components/dashboard/UpcomingSubjects';
import SemesterProgressTable from '../../components/dashboard/SemesterProgressTable';
import CurrentAverages from '../../components/dashboard/CurrentAverages';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { stats, resetProgress } = useCurriculum();
  const { activePlan, getPlanSummary, resetPlans } = useSemesterPlanner();
  const [showResetDialog, setShowResetDialog] = useState(false);

  const activePlanSummary = activePlan ? getPlanSummary(activePlan.id) : null;

  function handleConfirmReset() {
    resetProgress();
    resetPlans();
    setShowResetDialog(false);
  }

  return (
    <div className="page">
      <div className={styles.headerRow}>
        <div className="pageHeader">
          <h1 className="pageTitle">Dashboard</h1>
          <p className="pageSubtitle">Un vistazo rápido a tu avance en la carrera.</p>
        </div>
        <button type="button" className={styles.resetButton} onClick={() => setShowResetDialog(true)}>
          Restablecer progreso
        </button>
      </div>

      <StatsSummary stats={stats} />

      <div className={styles.grid}>
        <div className={styles.column}>
          <ProgressBar percentBySubjects={stats.percentBySubjects} percentByHours={stats.percentByHours} />
          <CurrentAverages subjects={stats.inProgressSubjects} />
          <SemesterProgressTable rows={stats.approvedBySemester} />
        </div>

        <div className={styles.column}>
          <UpcomingSubjects subjects={stats.nextAvailable} />

          <div className={styles.plannedCard}>
            <h3 className={styles.plannedTitle}>Cuatrimestre planificado</h3>
            {activePlan && activePlanSummary && activePlanSummary.subjectCount > 0 ? (
              <>
                <p className={styles.plannedName}>{activePlan.name}</p>
                <p className={styles.plannedStat}>
                  {activePlanSummary.subjectCount} materias · {activePlanSummary.totalWeeklyHours} h/semana ·{' '}
                  {activePlanSummary.totalHours} h totales
                </p>
              </>
            ) : (
              <p className={styles.plannedEmpty}>
                Todavía no armaste tu próximo cuatrimestre. Andá a "Planificar cuatrimestre" para
                empezar.
              </p>
            )}
          </div>
        </div>
      </div>

      {showResetDialog ? (
        <ConfirmDialog
          title="Restablecer progreso"
          message="Esto borra todas las materias aprobadas y todos los planes de cuatrimestre guardados. No se puede deshacer. ¿Confirmás?"
          confirmLabel="Sí, borrar todo"
          danger
          onConfirm={handleConfirmReset}
          onCancel={() => setShowResetDialog(false)}
        />
      ) : null}
    </div>
  );
}