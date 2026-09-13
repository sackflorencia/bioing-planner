import { Link } from 'react-router-dom';
import type { SubjectWithStatus } from '../../interfaces/Subject';
import { formatSemesterLabel } from '../../utils/curriculumUtils';
import styles from './UpcomingSubjects.module.css';

interface UpcomingSubjectsProps {
  subjects: SubjectWithStatus[];
  limit?: number;
}

export default function UpcomingSubjects({ subjects, limit = 6 }: UpcomingSubjectsProps) {
  const visible = subjects.slice(0, limit);

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Próximas materias disponibles</h3>
      {visible.length === 0 ? (
        <p className={styles.emptyText}>
          No hay materias disponibles todavía. Revisá el plan de estudios para ver qué te falta.
        </p>
      ) : (
        <ul className={styles.list}>
          {visible.map((subject) => (
            <li key={subject.id} className={styles.item}>
              <Link to={`/plan-de-estudios?subject=${subject.id}`} className={styles.link}>
                <span className={styles.name}>{subject.name}</span>
                <span className={styles.meta}>
                  {formatSemesterLabel(subject.semester)} · {subject.weeklyHours} h/sem
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
