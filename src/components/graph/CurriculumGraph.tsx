import { useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  ReactFlowProvider,
} from '@xyflow/react';
import type { Node, Edge, NodeMouseHandler } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import type { SubjectWithStatus } from '../../interfaces/Subject';
import { computeGraphLayout } from '../../utils/graphLayout';
import { formatSemesterLabel } from '../../utils/curriculumUtils';
import SubjectNode, { type SubjectFlowNode, type SubjectNodeData } from './SubjectNode';
import SemesterHeaderNode, {
  type SemesterHeaderFlowNode,
  type SemesterHeaderNodeData,
} from './SemesterHeaderNode';
import styles from './CurriculumGraph.module.css';

const nodeTypes = {
  subject: SubjectNode,
  semesterHeader: SemesterHeaderNode,
};

interface CurriculumGraphProps {
  subjects: SubjectWithStatus[];
  selectedSubjectId?: string | null;
  onSelectSubject: (subjectId: string) => void;
}

function CurriculumGraphInner({
  subjects,
  selectedSubjectId = null,
  onSelectSubject,
}: CurriculumGraphProps) {
  const layout = useMemo(() => computeGraphLayout(subjects), [subjects]);

  const subjectNodes: SubjectFlowNode[] = useMemo(
    () =>
      subjects.map((subject) => ({
        id: subject.id,
        type: 'subject',
        position: layout.subjectPositions.get(subject.id) ?? { x: 0, y: 0 },
        data: {
          subject,
          selected: subject.id === selectedSubjectId,
        } satisfies SubjectNodeData,
        draggable: false,
        connectable: false,
      })),
    [subjects, layout, selectedSubjectId]
  );

  const headerNodes: SemesterHeaderFlowNode[] = useMemo(
    () =>
      layout.headerPositions.map((header) => ({
        id: `header-${header.semester}`,
        type: 'semesterHeader',
        position: { x: header.x, y: header.y },
        data: { label: formatSemesterLabel(header.semester) } satisfies SemesterHeaderNodeData,
        draggable: false,
        selectable: false,
        connectable: false,
      })),
    [layout]
  );

  const nodes: Node[] = useMemo(() => [...headerNodes, ...subjectNodes], [headerNodes, subjectNodes]);

  const edges: Edge[] = useMemo(() => {
    const list: Edge[] = [];
    subjects.forEach((subject) => {
      subject.prerequisites.forEach((prerequisiteId) => {
        list.push({
          id: `${prerequisiteId}--${subject.id}`,
          source: prerequisiteId,
          target: subject.id,
          type: 'smoothstep',
          animated: subject.status === 'available',
          markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--color-edge)' },
          style: {
            stroke: subject.status === 'locked' ? 'var(--color-edge)' : 'var(--color-edge-active)',
            strokeWidth: 1.5,
          },
        });
      });
    });
    return list;
  }, [subjects]);

  const handleNodeClick = useCallback<NodeMouseHandler>(
    (_event, node) => {
      if (node.type === 'subject') {
        onSelectSubject(node.id);
      }
    },
    [onSelectSubject]
  );

  return (
    <div className={styles.graphContainer}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.15}
        maxZoom={1.75}
        nodesDraggable={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={24} color="var(--color-border)" />
        <Controls showInteractive={false} position="bottom-left" />
        <MiniMap
          pannable
          zoomable
          position="bottom-right"
          nodeColor={(node) => {
            if (node.type !== 'subject') return 'var(--color-border)';
            const status = (node.data as SubjectNodeData).subject.status;
            if (status === 'approved') return 'var(--color-approved)';
            if (status === 'in_progress') return 'var(--color-in-progress)';
            if (status === 'available') return 'var(--color-available)';
            return 'var(--color-locked)';
          }}
        />
      </ReactFlow>
    </div>
  );
}

/** Envuelve el grafo en su propio ReactFlowProvider para que pueda
 *  usarse en cualquier página sin depender de un provider global. */
export default function CurriculumGraph(props: CurriculumGraphProps) {
  return (
    <ReactFlowProvider>
      <CurriculumGraphInner {...props} />
    </ReactFlowProvider>
  );
}