import type { CurriculumStats } from '../../utils/curriculumUtils';
import styles from './StatsSummary.module.css';

interface StatsSummaryProps {
  stats: CurriculumStats;
}

export default function StatsSummary({ stats }: StatsSummaryProps) {
  const cards = [
    { label: 'Materias aprobadas', value: `${stats.approvedCount} / ${stats.totalSubjects}`, tone: 'approved' as const },
    { label: 'Materias disponibles', value: stats.availableCount, tone: 'available' as const },
    { label: 'Materias bloqueadas', value: stats.lockedCount, tone: 'locked' as const },
    { label: 'Horas aprobadas', value: `${stats.approvedHours} h`, tone: 'neutral' as const },
    { label: 'Horas restantes', value: `${stats.remainingHours} h`, tone: 'neutral' as const },
  ];

  return (
    <div className={styles.grid}>
      {cards.map((card) => (
        <div key={card.label} className={`${styles.card} ${styles[card.tone]}`}>
          <span className={styles.value}>{card.value}</span>
          <span className={styles.label}>{card.label}</span>
        </div>
      ))}
    </div>
  );
}
