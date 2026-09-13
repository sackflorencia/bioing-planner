import type { SemesterProgress } from '../../utils/curriculumUtils';
import styles from './SemesterProgressTable.module.css';

interface SemesterProgressTableProps {
  rows: SemesterProgress[];
}

/**
 * La fuente del plan de estudios no define "ciclos" formales (ciclo
 * básico / ciclo profesional / etc.), así que en vez de inventar esos
 * límites se muestra el progreso agrupado por cuatrimestre, que sí
 * está definido explícitamente en los datos.
 */
export default function SemesterProgressTable({ rows }: SemesterProgressTableProps) {
  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Aprobadas por cuatrimestre</h3>
      <div className={styles.rows}>
        {rows.map((row) => {
          const percent = row.total === 0 ? 0 : Math.round((row.approved / row.total) * 100);
          return (
            <div key={row.semester} className={styles.row}>
              <span className={styles.label}>{row.label}</span>
              <div className={styles.track}>
                <div className={styles.fill} style={{ width: `${percent}%` }} />
              </div>
              <span className={styles.count}>
                {row.approved}/{row.total}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
