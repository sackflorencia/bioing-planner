import styles from './GraphLegend.module.css';

const ITEMS: { status: 'locked' | 'available' | 'approved'; label: string }[] = [
  { status: 'locked', label: 'No cursada / bloqueada' },
  { status: 'available', label: 'Disponible' },
  { status: 'approved', label: 'Aprobada' },
];

export default function GraphLegend() {
  return (
    <div className={styles.legend}>
      {ITEMS.map((item) => (
        <div key={item.status} className={styles.item}>
          <span className={`${styles.dot} ${styles[item.status]}`} />
          {item.label}
        </div>
      ))}
    </div>
  );
}
