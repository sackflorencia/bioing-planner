import type { SubjectWithStatus } from '../../interfaces/Subject';
import styles from './CurrentAverages.module.css';

interface CurrentAveragesProps {
  subjects: SubjectWithStatus[];
}

/** Muestra el promedio actual de cada materia que se está cursando.
 *  Sólo lista las que ya tienen al menos un parcial cargado, para no
 *  llenar la tarjeta de "—" sin información útil. */
export default function CurrentAverages({ subjects }: CurrentAveragesProps) {
  const withAverage = subjects.filter((subject) => subject.partialAverage !== null);

  if (withAverage.length === 0) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Promedios actuales</h3>
      <ul className={styles.list}>
        {withAverage.map((subject) => (
          <li key={subject.id} className={styles.item}>
            <span className={styles.name}>{subject.name}</span>
            <span
              className={
                subject.meetsPromotionRequirement ? `${styles.average} ${styles.meets}` : styles.average
              }
            >
              {subject.partialAverage}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}