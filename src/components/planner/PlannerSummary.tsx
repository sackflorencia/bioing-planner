import type { Subject } from '../../interfaces/Subject';
import type { SemesterPlanSummary } from '../../interfaces/SemesterPlan';
import styles from './PlannerSummary.module.css';

interface PlannerSummaryProps {
  planName: string;
  summary: SemesterPlanSummary;
  selectedSubjects: Subject[];
  onRemove: (subjectId: string) => void;
}

export default function PlannerSummary({
  planName,
  summary,
  selectedSubjects,
  onRemove,
}: PlannerSummaryProps) {
  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>{planName}</h3>

      {selectedSubjects.length === 0 ? (
        <p className={styles.emptyText}>Todavía no seleccionaste ninguna materia.</p>
      ) : (
        <ul className={styles.list}>
          {selectedSubjects.map((subject) => (
            <li key={subject.id} className={styles.item}>
              <span className={styles.itemName}>{subject.name}</span>
              <span className={styles.itemHours}>{subject.weeklyHours} h/sem</span>
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => onRemove(subject.id)}
                aria-label={`Quitar ${subject.name} del plan`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className={styles.totals}>
        <div className={styles.totalRow}>
          <span>Materias</span>
          <strong>{summary.subjectCount}</strong>
        </div>
        <div className={styles.totalRow}>
          <span>Total semanal</span>
          <strong>{summary.totalWeeklyHours} h/semana</strong>
        </div>
        <div className={styles.totalRow}>
          <span>Total horas</span>
          <strong>{summary.totalHours} h</strong>
        </div>
      </div>
    </div>
  );
}
