import { useMemo, useState } from 'react';
import type { SubjectWithStatus } from '../../interfaces/Subject';
import { formatSemesterLabel } from '../../utils/curriculumUtils';
import styles from './PlannerSubjectPicker.module.css';

interface PlannerSubjectPickerProps {
  subjects: SubjectWithStatus[];
  selectedIds: string[];
  onToggle: (subjectId: string) => void;
}

export default function PlannerSubjectPicker({
  subjects,
  selectedIds,
  onToggle,
}: PlannerSubjectPickerProps) {
  const [onlyAvailable, setOnlyAvailable] = useState(true);
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const visibleSubjects = useMemo(() => {
    const base = onlyAvailable
      ? subjects.filter((s) => s.status === 'available' || selectedSet.has(s.id))
      : subjects;
    return [...base].sort((a, b) => a.semester - b.semester || a.code.localeCompare(b.code));
  }, [subjects, onlyAvailable, selectedSet]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3 className={styles.title}>Elegí las materias del cuatrimestre</h3>
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={(event) => setOnlyAvailable(event.target.checked)}
          />
          Mostrar sólo disponibles
        </label>
      </div>

      <ul className={styles.list}>
        {visibleSubjects.map((subject) => {
          const checked = selectedSet.has(subject.id);
          return (
            <li key={subject.id} className={styles.item}>
              <label className={`${styles.itemLabel} ${styles[subject.status]}`}>
                <input type="checkbox" checked={checked} onChange={() => onToggle(subject.id)} />
                <div className={styles.itemText}>
                  <span className={styles.itemName}>{subject.name}</span>
                  <span className={styles.itemMeta}>
                    {formatSemesterLabel(subject.semester)} · {subject.weeklyHours} h/sem ·{' '}
                    {subject.totalHours} h totales
                  </span>
                </div>
              </label>
            </li>
          );
        })}
        {visibleSubjects.length === 0 ? (
          <p className={styles.emptyText}>No hay materias que coincidan con este filtro.</p>
        ) : null}
      </ul>
    </div>
  );
}
