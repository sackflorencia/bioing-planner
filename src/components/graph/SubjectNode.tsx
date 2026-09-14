import { Handle, Position } from '@xyflow/react';
import type { Node, NodeProps } from '@xyflow/react';
import type { SubjectWithStatus } from '../../interfaces/Subject';
import styles from './SubjectNode.module.css';

/**
 * Los "data" de un nodo de React Flow deben poder asignarse a
 * Record<string, unknown>; por eso la interfaz lo extiende
 * explícitamente en vez de depender de la inferencia estructural.
 */
export interface SubjectNodeData extends Record<string, unknown> {
  subject: SubjectWithStatus;
  selected: boolean;
}

export type SubjectFlowNode = Node<SubjectNodeData, 'subject'>;

const STATUS_ICON: Record<SubjectWithStatus['status'], string> = {
  locked: '🔒',
  available: '🟦',
  in_progress: '📖',
  approved: '✅',
};

export default function SubjectNode({ data }: NodeProps<SubjectFlowNode>) {
  const { subject, selected } = data;

  return (
    <div
      className={[styles.node, styles[subject.status], selected ? styles.selected : ''].join(' ')}
    >
      <Handle type="target" position={Position.Left} className={styles.handle} />

      <div className={styles.topRow}>
        <span className={styles.code}>{subject.code}</span>
        <span className={styles.statusIcon} aria-hidden="true">
          {STATUS_ICON[subject.status]}
        </span>
      </div>

      <div className={styles.name} title={subject.name}>
        {subject.name}
      </div>

      <div className={styles.meta}>
        <span>{subject.weeklyHours} h/sem</span>
        {subject.creditsRequired ? <span>· {subject.creditsRequired} créditos</span> : null}
        {subject.status === 'in_progress' && subject.partialAverage !== null ? (
          <span>· prom. {subject.partialAverage}</span>
        ) : null}
      </div>

      {subject.isElectivePlaceholder ? (
        <div className={styles.electiveTag}>Casillero de electiva</div>
      ) : null}

      <Handle type="source" position={Position.Right} className={styles.handle} />
    </div>
  );
}