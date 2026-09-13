import { useState } from 'react';
import type { SemesterPlan } from '../../interfaces/SemesterPlan';
import styles from './PlannerPlanTabs.module.css';

interface PlannerPlanTabsProps {
  plans: SemesterPlan[];
  activePlanId: string | null;
  onSelect: (planId: string) => void;
  onCreate: (name: string) => void;
  onRename: (planId: string, name: string) => void;
  onDelete: (planId: string) => void;
}

export default function PlannerPlanTabs({
  plans,
  activePlanId,
  onSelect,
  onCreate,
  onRename,
  onDelete,
}: PlannerPlanTabsProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');

  function startEditing(plan: SemesterPlan) {
    setEditingId(plan.id);
    setDraftName(plan.name);
  }

  function commitEditing() {
    if (editingId) {
      onRename(editingId, draftName);
    }
    setEditingId(null);
  }

  return (
    <div className={styles.wrapper}>
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={`${styles.tab} ${plan.id === activePlanId ? styles.tabActive : ''}`}
        >
          {editingId === plan.id ? (
            <input
              autoFocus
              className={styles.renameInput}
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
              onBlur={commitEditing}
              onKeyDown={(event) => {
                if (event.key === 'Enter') commitEditing();
                if (event.key === 'Escape') setEditingId(null);
              }}
            />
          ) : (
            <button type="button" className={styles.tabButton} onClick={() => onSelect(plan.id)}>
              {plan.name}
            </button>
          )}

          <button
            type="button"
            className={styles.iconButton}
            title="Renombrar plan"
            onClick={() => startEditing(plan)}
          >
            ✎
          </button>
          {plans.length > 1 ? (
            <button
              type="button"
              className={styles.iconButton}
              title="Eliminar plan"
              onClick={() => onDelete(plan.id)}
            >
              ×
            </button>
          ) : null}
        </div>
      ))}

      <button
        type="button"
        className={styles.newPlanButton}
        onClick={() => onCreate(`Cuatrimestre ${plans.length + 1}`)}
      >
        + Nuevo plan
      </button>
    </div>
  );
}
