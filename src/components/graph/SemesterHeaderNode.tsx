import type { Node, NodeProps } from '@xyflow/react';
import styles from './SemesterHeaderNode.module.css';

export interface SemesterHeaderNodeData extends Record<string, unknown> {
  label: string;
}

export type SemesterHeaderFlowNode = Node<SemesterHeaderNodeData, 'semesterHeader'>;

export default function SemesterHeaderNode({ data }: NodeProps<SemesterHeaderFlowNode>) {
  return <div className={styles.header}>{data.label}</div>;
}
