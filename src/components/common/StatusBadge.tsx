import type { SubjectStatus } from '../../interfaces/Subject';
import styles from './StatusBadge.module.css';

const LABELS: Record<SubjectStatus, string> = {
  locked: 'No cursada',
  available: 'Disponible',
  in_progress: 'Cursando',
  approved: 'Aprobada',
};

interface StatusBadgeProps {
  status: SubjectStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`${styles.badge} ${styles[status]}`}>{LABELS[status]}</span>;
}