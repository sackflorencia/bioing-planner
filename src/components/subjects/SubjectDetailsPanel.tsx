import { useMemo } from 'react';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import AcademicRecordSection from './AcademicRecordSection';
import type { SubjectWithStatus } from '../../interfaces/Subject';
import { formatSemesterLabel } from '../../utils/curriculumUtils';
import styles from './SubjectDetailsPanel.module.css';

interface SubjectDetailsPanelProps {
  subject: SubjectWithStatus;
  allSubjects: SubjectWithStatus[];
  onClose: () => void;
  onMarkApproved: (subjectId: string) => void;
  onUnmarkApproved: (subjectId: string) => void;
  onMarkInProgress: (subjectId: string) => void;
  onUnmarkInProgress: (subjectId: string) => void;
  onAddPartial: (subjectId: string) => void;
  onRemovePartial: (subjectId: string, partialId: string) => void;
  onChangePartial: (subjectId: string, partialId: string, value: number | null) => void;
  onRegisterFinal: (subjectId: string, grade: number) => void;
  onPromote: (subjectId: string) => void;
}

function subjectName(allSubjects: SubjectWithStatus[], id: string): string {
  return allSubjects.find((subject) => subject.id === id)?.name ?? id;
}

export default function SubjectDetailsPanel({
  subject,
  allSubjects,
  onClose,
  onMarkApproved,
  onUnmarkApproved,
  onMarkInProgress,
  onUnmarkInProgress,
  onAddPartial,
  onRemovePartial,
  onChangePartial,
  onRegisterFinal,
  onPromote,
}: SubjectDetailsPanelProps) {
  const prerequisiteNames = useMemo(
    () => subject.prerequisites.map((id) => subjectName(allSubjects, id)),
    [subject.prerequisites, allSubjects]
  );

  const unlockNames = useMemo(
    () => subject.unlocks.map((id) => subjectName(allSubjects, id)),
    [subject.unlocks, allSubjects]
  );

  const missingNames = useMemo(
    () => subject.missingPrerequisites.map((id) => subjectName(allSubjects, id)),
    [subject.missingPrerequisites, allSubjects]
  );

  const missingCredits =
    subject.creditsRequired !== undefined
      ? Math.max(subject.creditsRequired - subject.approvedCreditsSoFar, 0)
      : 0;

  return (
    <Modal title={subject.name} onClose={onClose}>
      <div className={styles.headerRow}>
        <span className={styles.code}>Código {subject.code}</span>
        <StatusBadge status={subject.status} />
      </div>

      <dl className={styles.factGrid}>
        <div>
          <dt>Cuatrimestre</dt>
          <dd>
            {formatSemesterLabel(subject.semester)}
            {subject.alternateSemesters?.length
              ? ` (también ${subject.alternateSemesters.map(formatSemesterLabel).join(', ')})`
              : ''}
          </dd>
        </div>
        <div>
          <dt>Carga horaria semanal</dt>
          <dd>{subject.weeklyHours} h</dd>
        </div>
        <div>
          <dt>Horas totales</dt>
          <dd>{subject.totalHours} h</dd>
        </div>
      </dl>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Correlativas</h3>
        {prerequisiteNames.length === 0 && subject.creditsRequired === undefined ? (
          <p className={styles.emptyText}>No tiene correlativas.</p>
        ) : (
          <ul className={styles.list}>
            {prerequisiteNames.map((name, index) => {
              const isMissing = missingNames.includes(name);
              return (
                <li key={subject.prerequisites[index]} className={isMissing ? styles.missing : ''}>
                  {name}
                  {isMissing ? ' · pendiente' : ''}
                </li>
              );
            })}
            {subject.creditsRequired !== undefined ? (
              <li className={missingCredits > 0 ? styles.missing : ''}>
                {subject.creditsRequired} créditos acumulados
                {missingCredits > 0
                  ? ` · te faltan ${missingCredits} (llevás ${subject.approvedCreditsSoFar})`
                  : ' · cumplido'}
              </li>
            ) : null}
          </ul>
        )}
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Desbloquea directamente</h3>
        {unlockNames.length === 0 ? (
          <p className={styles.emptyText}>No es correlativa de ninguna otra materia.</p>
        ) : (
          <ul className={styles.list}>
            {unlockNames.map((name, index) => (
              <li key={subject.unlocks[index]}>{name}</li>
            ))}
          </ul>
        )}
      </section>

      {subject.notes ? <p className={styles.notes}>{subject.notes}</p> : null}

      <div className={styles.actions}>
        {subject.status === 'available' ? (
          <>
            <button
              type="button"
              className={styles.approveButton}
              onClick={() => onMarkInProgress(subject.id)}
            >
              Marcar como cursando
            </button>
            <button
              type="button"
              className={styles.secondaryTextButton}
              onClick={() => onMarkApproved(subject.id)}
            >
              Marcar como aprobada directamente
            </button>
          </>
        ) : null}

        {subject.status === 'approved' ? (
          <button
            type="button"
            className={styles.unapproveButton}
            onClick={() => onUnmarkApproved(subject.id)}
          >
            Desmarcar aprobada
          </button>
        ) : null}

        {subject.status === 'locked' ? (
          <p className={styles.lockedHint}>
            Todavía no está disponible: aprobá primero las correlativas pendientes.
          </p>
        ) : null}
      </div>

      {subject.status === 'in_progress' || (subject.status === 'approved' && subject.academicRecord) ? (
        <AcademicRecordSection
          subject={subject}
          onAddPartial={() => onAddPartial(subject.id)}
          onRemovePartial={(partialId) => onRemovePartial(subject.id, partialId)}
          onChangePartial={(partialId, value) => onChangePartial(subject.id, partialId, value)}
          onRegisterFinal={(grade) => onRegisterFinal(subject.id, grade)}
          onPromote={() => onPromote(subject.id)}
          onUnmarkInProgress={() => onUnmarkInProgress(subject.id)}
        />
      ) : null}
    </Modal>
  );
}