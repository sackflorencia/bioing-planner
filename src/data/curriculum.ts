import type { Subject } from '../interfaces/Subject';

/**
 * Ids de las 6 materias del CBC. Se definen acá para poder referenciar
 * "todo el CBC" como correlativa de las materias de 3er cuatrimestre
 * sin hardcodear la lista en cada materia.
 */
export const CBC_SUBJECT_IDS: string[] = [
  'cbc-sociedad-estado',
  'cbc-pensamiento-cientifico',
  'cbc-analisis-matematico-a',
  'cbc-algebra-a',
  'cbc-fisica',
  'cbc-pensamiento-computacional',
];

/**
 * Plan de estudios de Bioingeniería.
 *
 * Notas de modelado (ver también la sección "Inconsistencias y
 * decisiones de modelado" de la respuesta):
 *
 * 1. CBC: se modela como 6 materias individuales (semester: 0). Toda
 *    materia de 3er cuatrimestre que requiere "CBC" lista los 6 ids
 *    como prerequisites. La lógica de disponibilidad es 100% genérica
 *    (no hay ningún "if" especial para el CBC).
 *
 * 2. "100 créditos" (Legislación y Ejercicio Profesional): no es una
 *    materia, así que se modela con el campo `creditsRequired: 100` y
 *    `prerequisites: []`. El motor de estados suma weeklyHours de las
 *    materias aprobadas y lo compara contra ese número.
 *
 * 3. Tesis / Trabajo Profesional: la fuente la lista igual en 10º y
 *    11º cuatrimestre (mismo nombre, mismas correlativas). Se modela
 *    como UNA sola materia (misma instancia curricular) con
 *    `semester: 10` y `alternateSemesters: [11]`, en vez de duplicar
 *    el nodo. Esto evita dos ids distintos para lo mismo, pero implica
 *    que los "totales por cuatrimestre" de la fuente (que la cuentan
 *    en ambas columnas) no se replican tal cual; se explica en la
 *    respuesta.
 *
 * 4. Electivas/Optativas (10º y 11º): se modelan como "casilleros"
 *    (`isElectivePlaceholder: true`) sin correlativas, pensados para
 *    que en el futuro se agreguen materias electivas reales que
 *    referencien a "electivas-10" / "electivas-11" si hiciera falta.
 *
 * 5. Códigos: la fuente sólo da códigos oficiales para el CBC. Para el
 *    resto de las materias no hay código provisto, así que se generó
 *    uno sintético con el formato "<cuatrimestre>-<orden>" (por
 *    ejemplo "5-02"). Esto está señalado explícitamente para que se
 *    pueda reemplazar por los códigos reales de la UBA sin tocar la
 *    lógica de la app.
 */
export const curriculum: Subject[] = [
  // ---------------------------------------------------------------
  // CBC — Ciclo Básico Común (1º y 2º cuatrimestre)
  // ---------------------------------------------------------------
  {
    id: 'cbc-sociedad-estado',
    code: '24',
    name: 'Introducción al Conocimiento de la Sociedad y el Estado',
    semester: 0,
    weeklyHours: 4,
    totalHours: 64,
    prerequisites: [],
  },
  {
    id: 'cbc-pensamiento-cientifico',
    code: '40',
    name: 'Introducción al Pensamiento Científico',
    semester: 0,
    weeklyHours: 4,
    totalHours: 64,
    prerequisites: [],
  },
  {
    id: 'cbc-analisis-matematico-a',
    code: '66',
    name: 'Análisis Matemático A',
    semester: 0,
    weeklyHours: 9,
    totalHours: 144,
    prerequisites: [],
  },
  {
    id: 'cbc-algebra-a',
    code: '62',
    name: 'Álgebra A',
    semester: 0,
    weeklyHours: 9,
    totalHours: 144,
    prerequisites: [],
  },
  {
    id: 'cbc-fisica',
    code: '03',
    name: 'Física',
    semester: 0,
    weeklyHours: 6,
    totalHours: 96,
    prerequisites: [],
  },
  {
    id: 'cbc-pensamiento-computacional',
    code: '90',
    name: 'Pensamiento Computacional',
    semester: 0,
    weeklyHours: 6,
    totalHours: 96,
    prerequisites: [],
  },

  // ---------------------------------------------------------------
  // 3° cuatrimestre
  // ---------------------------------------------------------------
  {
    id: 'analisis-matematico-ii',
    code: '3-01',
    name: 'Análisis Matemático II',
    semester: 3,
    weeklyHours: 8,
    totalHours: 128,
    prerequisites: [...CBC_SUBJECT_IDS],
  },
  {
    id: 'quimica-basica',
    code: '3-02',
    name: 'Química Básica',
    semester: 3,
    weeklyHours: 6,
    totalHours: 96,
    prerequisites: [...CBC_SUBJECT_IDS],
  },
  {
    id: 'introduccion-bioingenieria',
    code: '3-03',
    name: 'Introducción a la Bioingeniería',
    semester: 3,
    weeklyHours: 6,
    totalHours: 96,
    prerequisites: [...CBC_SUBJECT_IDS],
  },
  {
    id: 'anatomia-histologia-funcional',
    code: '3-04',
    name: 'Anatomía e Histología Funcional',
    semester: 3,
    weeklyHours: 4,
    totalHours: 64,
    prerequisites: [...CBC_SUBJECT_IDS],
  },

  // ---------------------------------------------------------------
  // 4° cuatrimestre
  // ---------------------------------------------------------------
  {
    id: 'fisica-sistemas-particulas',
    code: '4-01',
    name: 'Física de los Sistemas de Partículas',
    semester: 4,
    weeklyHours: 6,
    totalHours: 96,
    prerequisites: [...CBC_SUBJECT_IDS],
  },
  {
    id: 'algoritmos-programacion',
    code: '4-02',
    name: 'Algoritmos y Programación',
    semester: 4,
    weeklyHours: 6,
    totalHours: 96,
    prerequisites: [...CBC_SUBJECT_IDS],
  },
  {
    id: 'planificacion-proyectos',
    code: '4-03',
    name: 'Planificación de Proyectos',
    semester: 4,
    weeklyHours: 2,
    totalHours: 32,
    prerequisites: ['introduccion-bioingenieria'],
  },
  {
    id: 'algebra-lineal',
    code: '4-04',
    name: 'Álgebra Lineal',
    semester: 4,
    weeklyHours: 8,
    totalHours: 128,
    prerequisites: [...CBC_SUBJECT_IDS],
  },

  // ---------------------------------------------------------------
  // 5° cuatrimestre
  // ---------------------------------------------------------------
  {
    id: 'quimica-compuestos-organicos',
    code: '5-01',
    name: 'Química de los Compuestos Orgánicos',
    semester: 5,
    weeklyHours: 6,
    totalHours: 96,
    prerequisites: ['quimica-basica'],
  },
  {
    id: 'probabilidad-estadistica',
    code: '5-02',
    name: 'Probabilidad y Estadística',
    semester: 5,
    weeklyHours: 6,
    totalHours: 96,
    prerequisites: ['analisis-matematico-ii', 'algebra-lineal'],
  },
  {
    id: 'senales-sistemas',
    code: '5-03',
    name: 'Señales y Sistemas',
    semester: 5,
    weeklyHours: 6,
    totalHours: 96,
    prerequisites: ['analisis-matematico-ii', 'algebra-lineal'],
  },
  {
    id: 'electricidad-magnetismo-calor',
    code: '5-04',
    name: 'Electricidad, Magnetismo y Calor',
    semester: 5,
    weeklyHours: 6,
    totalHours: 96,
    prerequisites: ['analisis-matematico-ii', 'fisica-sistemas-particulas'],
  },

  // ---------------------------------------------------------------
  // 6° cuatrimestre
  // ---------------------------------------------------------------
  {
    id: 'sistemas-moleculares-celulares-tisulares',
    code: '6-01',
    name: 'Sistemas Moleculares, Celulares y Tisulares',
    semester: 6,
    weeklyHours: 6,
    totalHours: 96,
    prerequisites: ['quimica-compuestos-organicos', 'anatomia-histologia-funcional'],
  },
  {
    id: 'fisica-solidos-nuclear',
    code: '6-02',
    name: 'Física de Sólidos y Nuclear',
    semester: 6,
    weeklyHours: 6,
    totalHours: 96,
    prerequisites: ['electricidad-magnetismo-calor', 'quimica-basica', 'probabilidad-estadistica'],
  },
  {
    id: 'control-automatico',
    code: '6-03',
    name: 'Control Automático',
    semester: 6,
    weeklyHours: 6,
    totalHours: 96,
    prerequisites: ['electricidad-magnetismo-calor', 'senales-sistemas'],
  },
  {
    id: 'analisis-circuitos',
    code: '6-04',
    name: 'Análisis de Circuitos',
    semester: 6,
    weeklyHours: 6,
    totalHours: 96,
    prerequisites: ['introduccion-bioingenieria', 'electricidad-magnetismo-calor'],
  },

  // ---------------------------------------------------------------
  // 7° cuatrimestre
  // ---------------------------------------------------------------
  {
    id: 'procesos-estocasticos',
    code: '7-01',
    name: 'Procesos Estocásticos',
    semester: 7,
    weeklyHours: 6,
    totalHours: 96,
    prerequisites: ['probabilidad-estadistica', 'senales-sistemas'],
  },
  {
    id: 'introduccion-dispositivos-electronicos',
    code: '7-02',
    name: 'Introducción a los Dispositivos Electrónicos',
    semester: 7,
    weeklyHours: 4,
    totalHours: 64,
    prerequisites: ['introduccion-bioingenieria'],
  },
  {
    id: 'sistemas-fisiologicos-modelos',
    code: '7-03',
    name: 'Sistemas Fisiológicos y sus Modelos',
    semester: 7,
    weeklyHours: 8,
    totalHours: 128,
    prerequisites: ['sistemas-moleculares-celulares-tisulares', 'control-automatico'],
  },
  {
    id: 'introduccion-mecanica-continuo',
    code: '7-04',
    name: 'Introducción a la Mecánica del Continuo',
    semester: 7,
    weeklyHours: 6,
    totalHours: 96,
    prerequisites: ['algebra-lineal', 'electricidad-magnetismo-calor'],
  },

  // ---------------------------------------------------------------
  // 8° cuatrimestre
  // ---------------------------------------------------------------
  {
    id: 'taller-procesamiento-senales',
    code: '8-01',
    name: 'Taller de Procesamiento de Señales',
    semester: 8,
    weeklyHours: 6,
    totalHours: 96,
    prerequisites: ['procesos-estocasticos'],
  },
  {
    id: 'circuitos-microelectronicos',
    code: '8-02',
    name: 'Circuitos Microelectrónicos',
    semester: 8,
    weeklyHours: 6,
    totalHours: 96,
    prerequisites: ['introduccion-dispositivos-electronicos', 'analisis-circuitos'],
  },
  {
    id: 'introduccion-sistemas-embebidos',
    code: '8-03',
    name: 'Introducción a los Sistemas Embebidos',
    semester: 8,
    weeklyHours: 6,
    totalHours: 96,
    prerequisites: ['algoritmos-programacion', 'analisis-circuitos'],
  },
  {
    id: 'gestion-proyectos',
    code: '8-04',
    name: 'Gestión de Proyectos',
    semester: 8,
    weeklyHours: 6,
    totalHours: 96,
    prerequisites: ['planificacion-proyectos'],
  },
  {
    id: 'legislacion-ejercicio-profesional',
    code: '8-05',
    name: 'Legislación y Ejercicio Profesional',
    semester: 8,
    weeklyHours: 2,
    totalHours: 32,
    prerequisites: [],
    creditsRequired: 100,
    notes: 'Requisito: 100 créditos (suma de horas semanales) de materias aprobadas. No depende de una materia puntual.',
  },

  // ---------------------------------------------------------------
  // 9° cuatrimestre
  // ---------------------------------------------------------------
  {
    id: 'introduccion-biomecanica',
    code: '9-01',
    name: 'Introducción a la Biomecánica',
    semester: 9,
    weeklyHours: 4,
    totalHours: 64,
    prerequisites: ['sistemas-fisiologicos-modelos', 'introduccion-mecanica-continuo'],
  },
  {
    id: 'instrumentacion-equipamiento-diagnostico-tratamiento',
    code: '9-02',
    name: 'Instrumentación y Equipamiento para Diagnóstico y Tratamiento',
    semester: 9,
    weeklyHours: 6,
    totalHours: 96,
    prerequisites: ['sistemas-fisiologicos-modelos', 'circuitos-microelectronicos'],
  },
  {
    id: 'introduccion-biomateriales',
    code: '9-03',
    name: 'Introducción a los Biomateriales',
    semester: 9,
    weeklyHours: 4,
    totalHours: 64,
    prerequisites: ['sistemas-fisiologicos-modelos', 'fisica-solidos-nuclear'],
  },
  {
    id: 'analisis-procesamiento-senales-bioingenieria',
    code: '9-04',
    name: 'Análisis y Procesamiento de Señales en Bioingeniería',
    semester: 9,
    weeklyHours: 6,
    totalHours: 96,
    prerequisites: ['sistemas-fisiologicos-modelos', 'procesos-estocasticos'],
  },
  {
    id: 'higiene-seguridad',
    code: '9-05',
    name: 'Higiene y Seguridad',
    semester: 9,
    weeklyHours: 2,
    totalHours: 32,
    prerequisites: ['quimica-basica'],
  },

  // ---------------------------------------------------------------
  // 10° cuatrimestre
  // ---------------------------------------------------------------
  {
    id: 'imagenes-bioingenieria',
    code: '10-01',
    name: 'Imágenes en Bioingeniería',
    semester: 10,
    weeklyHours: 6,
    totalHours: 96,
    prerequisites: ['sistemas-fisiologicos-modelos', 'senales-sistemas', 'fisica-solidos-nuclear'],
  },
  {
    id: 'tecnologia-asistencia-protesis',
    code: '10-02',
    name: 'Tecnología de Asistencia y Prótesis',
    semester: 10,
    weeklyHours: 6,
    totalHours: 96,
    prerequisites: [
      'introduccion-biomecanica',
      'introduccion-biomateriales',
      'introduccion-sistemas-embebidos',
      'circuitos-microelectronicos',
    ],
  },
  {
    id: 'tesis-bioingenieria',
    code: '10-03',
    name: 'Tesis de Bioingeniería o Trabajo Profesional de Bioingeniería',
    semester: 10,
    weeklyHours: 6,
    totalHours: 96,
    prerequisites: [
      'gestion-proyectos',
      'instrumentacion-equipamiento-diagnostico-tratamiento',
      'taller-procesamiento-senales',
      'introduccion-biomateriales',
    ],
    alternateSemesters: [11],
    notes: 'El plan original la lista igual en 10º y 11º cuatrimestre: se modela como una única instancia curricular que puede cursarse en cualquiera de los dos.',
  },
  {
    id: 'electivas-10',
    code: '10-04',
    name: 'Electivas / Optativas (10°)',
    semester: 10,
    weeklyHours: 6,
    totalHours: 96,
    prerequisites: [],
    isElectivePlaceholder: true,
    notes: 'Casillero genérico para materias electivas. Reemplazar o expandir cuando se defina la oferta real de optativas.',
  },

  // ---------------------------------------------------------------
  // 11° cuatrimestre
  // ---------------------------------------------------------------
  {
    id: 'ingenieria-clinica-hospitalaria',
    code: '11-01',
    name: 'Ingeniería Clínica y Hospitalaria',
    semester: 11,
    weeklyHours: 6,
    totalHours: 96,
    prerequisites: [
      'instrumentacion-equipamiento-diagnostico-tratamiento',
      'legislacion-ejercicio-profesional',
      'higiene-seguridad',
      'imagenes-bioingenieria',
    ],
  },
  {
    id: 'electivas-11',
    code: '11-02',
    name: 'Electivas / Optativas (11°)',
    semester: 11,
    weeklyHours: 10,
    totalHours: 160,
    prerequisites: [],
    isElectivePlaceholder: true,
    notes: 'Casillero genérico para materias electivas. Reemplazar o expandir cuando se defina la oferta real de optativas.',
  },
];
