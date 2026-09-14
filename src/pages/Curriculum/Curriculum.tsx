import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCurriculum } from '../../hooks/useCurriculum';
import CurriculumGraph from '../../components/graph/CurriculumGraph';
import GraphLegend from '../../components/graph/GraphLegend';
import SubjectDetailsPanel from '../../components/subjects/SubjectDetailsPanel';
import styles from './Curriculum.module.css';

export default function Curriculum() {
  const {
    subjects,
    markApproved,
    unmarkApproved,
    markInProgress,
    unmarkInProgress,
    addPartialGrade,
    removePartialGrade,
    setPartialGradeValue,
    registerFinalGrade,
    promoteSubject,
  } = useCurriculum();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

  // Permite deep-linking desde el Dashboard: /plan-de-estudios?subject=<id>
  useEffect(() => {
    const subjectParam = searchParams.get('subject');
    if (subjectParam) {
      setSelectedSubjectId(subjectParam);
    }
  }, [searchParams]);

  function handleSelectSubject(subjectId: string) {
    setSelectedSubjectId(subjectId);
  }

  function handleCloseDetails() {
    setSelectedSubjectId(null);
    if (searchParams.get('subject')) {
      const next = new URLSearchParams(searchParams);
      next.delete('subject');
      setSearchParams(next, { replace: true });
    }
  }

  const selectedSubject = selectedSubjectId
    ? subjects.find((subject) => subject.id === selectedSubjectId) ?? null
    : null;

  return (
    <div className="page">
      <div className="pageHeader">
        <h1 className="pageTitle">Plan de estudios</h1>
        <p className="pageSubtitle">
          Cada flecha va desde una correlativa hacia la materia que la requiere. Hacé click en una
          materia para ver el detalle.
        </p>
      </div>

      <GraphLegend />

      <div className={styles.graphWrapper}>
        <CurriculumGraph
          subjects={subjects}
          selectedSubjectId={selectedSubjectId}
          onSelectSubject={handleSelectSubject}
        />
      </div>

      {selectedSubject ? (
        <SubjectDetailsPanel
          subject={selectedSubject}
          allSubjects={subjects}
          onClose={handleCloseDetails}
          onMarkApproved={markApproved}
          onUnmarkApproved={unmarkApproved}
          onMarkInProgress={markInProgress}
          onUnmarkInProgress={unmarkInProgress}
          onAddPartial={addPartialGrade}
          onRemovePartial={removePartialGrade}
          onChangePartial={setPartialGradeValue}
          onRegisterFinal={registerFinalGrade}
          onPromote={promoteSubject}
        />
      ) : null}
    </div>
  );
}