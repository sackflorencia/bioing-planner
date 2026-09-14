import { useState } from 'react';
import type { SubjectWithStatus } from '../../interfaces/Subject';
import { FINAL_PASSING_GRADE, GRADE_MAX, GRADE_MIN, passesFinal } from '../../utils/academicUtils';
import styles from './AcademicRecordSection.module.css';

interface AcademicRecordSectionProps {
  subject: SubjectWithStatus;
  onAddPartial: () => void;
  onRemovePartial: (partialId: string) => void;
  onChangePartial: (partialId: string, value: number | null) => void;
  onRegisterFinal: (grade: number) => void;
  onPromote: () => void;
  onUnmarkInProgress: () => void;
}

function parseGradeInput(raw: string): number | null {
  if (raw.trim() === '') return null;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return null;
  return Math.min(GRADE_MAX, Math.max(GRADE_MIN, parsed));
}

/** "Modalidad de aprobación" que le corresponde a la materia, tanto
 *  mientras se está cursando (preview de lo que le espera) como una
 *  vez aprobada (cómo se terminó aprobando). */
function approvalModeLabel(subject: SubjectWithStatus): string {
  if (subject.status === 'approved') {
    if (!subject.academicRecord) return 'Aprobada directamente';
    if (subject.academicRecord.passedByPromotion === true) return 'Promocionada';
    if (subject.academicRecord.passedByPromotion === false) return 'Aprobada por final';
    return 'Aprobada directamente';
  }
  return subject.isPromotable ? 'Promocionable' : 'Final obligatorio';
}

export default function AcademicRecordSection({
  subject,
  onAddPartial,
  onRemovePartial,
  onChangePartial,
  onRegisterFinal,
  onPromote,
  onUnmarkInProgress,
}: AcademicRecordSectionProps) {
  const [finalDraft, setFinalDraft] = useState('');

  const record = subject.academicRecord;
  const isInProgress = subject.status === 'in_progress';
  const isApproved = subject.status === 'approved';

  if (!record) return null;

  const registeredFinal = record.finalGrade;

  function handleRegisterFinal() {
    const value = parseGradeInput(finalDraft);
    if (value === null) return;
    onRegisterFinal(value);
    setFinalDraft('');
  }

  return (
    <section className={styles.wrapper}>
      <div className={styles.divider} />

      <h3 className={styles.sectionTitle}>Evaluación</h3>

      <div className={styles.partialsList}>
        {record.partialGrades.length === 0 ? (
          <p className={styles.emptyText}>Todavía no cargaste parciales.</p>
        ) : (
          record.partialGrades.map((partial) => (
            <div key={partial.id} className={styles.partialRow}>
              <span className={styles.partialLabel}>{partial.label}</span>
              <input
                type="number"
                min={GRADE_MIN}
                max={GRADE_MAX}
                step={0.1}
                className={styles.gradeInput}
                value={partial.value ?? ''}
                disabled={isApproved}
                onChange={(event) => onChangePartial(partial.id, parseGradeInput(event.target.value))}
                aria-label={partial.label}
              />
              {!isApproved ? (
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => onRemovePartial(partial.id)}
                  aria-label={`Quitar ${partial.label}`}
                >
                  ×
                </button>
              ) : null}
            </div>
          ))
        )}
      </div>

      {!isApproved ? (
        <button type="button" className={styles.addButton} onClick={onAddPartial}>
          + Agregar parcial
        </button>
      ) : null}

      <p className={styles.averageLine}>
        Promedio:{' '}
        {subject.partialAverage !== null ? (
          <strong>{subject.partialAverage}</strong>
        ) : (
          <span className={styles.emptyText}>sin notas cargadas</span>
        )}
      </p>

      <div className={styles.divider} />

      <h3 className={styles.sectionTitle}>Promoción</h3>
      <p className={styles.modeLine}>
        Modalidad de aprobación: <strong>{approvalModeLabel(subject)}</strong>
      </p>

      {subject.isPromotable ? (
        subject.promotionAverage !== undefined ? (
          <>
            <p className={styles.promotionInfo}>Promedio mínimo para promocionar: {subject.promotionAverage}</p>
            {isInProgress ? (
              <>
                <p className={subject.meetsPromotionRequirement ? styles.meets : styles.pending}>
                  {subject.meetsPromotionRequirement
                    ? '✓ Cumple requisito de promoción'
                    : subject.partialAverage === null
                      ? 'Todavía no hay notas suficientes para evaluar la promoción.'
                      : 'No promociona con el promedio actual (podés rendir final igual).'}
                </p>
                <button
                  type="button"
                  className={styles.promoteButton}
                  disabled={!subject.meetsPromotionRequirement}
                  onClick={onPromote}
                >
                  Promocionar materia
                </button>
              </>
            ) : null}
          </>
        ) : (
          <p className={styles.emptyText}>
            Todavía no se configuró el promedio mínimo de esta materia (promotionAverage).
          </p>
        )
      ) : (
        <p className={styles.emptyText}>Esta materia no es promocionable: se aprueba únicamente por final.</p>
      )}

      <div className={styles.divider} />

      <h3 className={styles.sectionTitle}>Final</h3>
      {registeredFinal !== null ? (
        <p className={passesFinal(registeredFinal) ? styles.meets : styles.pending}>
          Nota registrada: <strong>{registeredFinal}</strong>{' '}
          {passesFinal(registeredFinal)
            ? '· aprobado'
            : `· no alcanza (mínimo ${FINAL_PASSING_GRADE})`}
        </p>
      ) : isInProgress ? (
        <div className={styles.finalRow}>
          <input
            type="number"
            min={GRADE_MIN}
            max={GRADE_MAX}
            step={0.1}
            className={styles.gradeInput}
            placeholder="Nota"
            value={finalDraft}
            onChange={(event) => setFinalDraft(event.target.value)}
            aria-label="Nota del final"
          />
          <button type="button" className={styles.promoteButton} onClick={handleRegisterFinal}>
            Registrar final
          </button>
        </div>
      ) : (
        <p className={styles.emptyText}>Todavía no se registró una nota de final.</p>
      )}

      {isInProgress ? (
        <button type="button" className={styles.stopButton} onClick={onUnmarkInProgress}>
          Dejar de cursar
        </button>
      ) : null}
    </section>
  );
}