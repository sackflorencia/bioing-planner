import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  percentBySubjects: number;
  percentByHours: number;
}

export default function ProgressBar({ percentBySubjects, percentByHours }: ProgressBarProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.headerRow}>
        <h3 className={styles.title}>Progreso de la carrera</h3>
        <span className={styles.percent}>{percentBySubjects}%</span>
      </div>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${percentBySubjects}%` }} />
      </div>
      <p className={styles.hint}>
        Por materias: {percentBySubjects}% · Por horas de cursada: {percentByHours}%
      </p>
    </div>
  );
}
