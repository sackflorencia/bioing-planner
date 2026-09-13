# Bioengineering Curriculum Planner

Aplicación web interactiva desarrollada en **React + TypeScript** para visualizar, organizar y planificar el plan de estudios de la carrera de **Bioingeniería** de la Universidad de Buenos Aires.

La aplicación representa el plan de estudios como un **grafo dirigido de correlatividades**, permite registrar materias aprobadas, identificar automáticamente las materias disponibles y planificar cuatrimestres calculando su carga horaria.

El proyecto está diseñado con una arquitectura modular y escalable, preparada para incorporar funcionalidades adicionales en el futuro.

---

## Tabla de contenidos

* [Descripción](#descripción)
* [Funcionalidades](#funcionalidades)

  * [Grafo de correlatividades](#grafo-de-correlatividades)
  * [Estados de las materias](#estados-de-las-materias)
  * [Materias aprobadas](#materias-aprobadas)
  * [Información de las materias](#información-de-las-materias)
  * [Planificador de cuatrimestres](#planificador-de-cuatrimestres)
  * [Dashboard](#dashboard)
  * [Persistencia](#persistencia)
* [Tecnologías](#tecnologías)
* [Arquitectura](#arquitectura)
* [Estructura del proyecto](#estructura-del-proyecto)
* [Modelo de datos](#modelo-de-datos)
* [Lógica de correlatividades](#lógica-de-correlatividades)
* [Plan de estudios](#plan-de-estudios)
* [Casos especiales](#casos-especiales)
* [Carga horaria](#carga-horaria)
* [Instalación](#instalación)
* [Ejecución](#ejecución)
* [Persistencia de datos](#persistencia-de-datos)
* [Diseño y UX](#diseño-y-ux)
* [Escalabilidad](#escalabilidad)
* [Funcionalidades futuras](#funcionalidades-futuras)

---

# Descripción

**Bioengineering Curriculum Planner** es una herramienta para organizar y visualizar el recorrido académico de la carrera de Bioingeniería.

El objetivo principal es representar las relaciones de correlatividad entre las materias de la carrera de forma visual y permitir que el usuario pueda realizar un seguimiento de su progreso.

La aplicación permite:

* visualizar todas las materias del plan;
* observar las correlatividades mediante un grafo dirigido;
* registrar materias aprobadas;
* identificar automáticamente qué materias se encuentran disponibles;
* consultar información detallada de cada materia;
* planificar un cuatrimestre;
* calcular automáticamente la carga horaria;
* guardar el progreso y las planificaciones utilizando `localStorage`.

No requiere backend ni una base de datos externa.

---

# Funcionalidades

## Grafo de correlatividades

La funcionalidad principal de la aplicación es una representación visual del plan de estudios mediante un **grafo dirigido**.

Cada materia se representa como un nodo.

Las correlatividades se representan mediante flechas dirigidas **desde la materia requerida hacia la materia que depende de ella**.

Por ejemplo:

```text
Análisis Matemático II
          │
          ▼
Probabilidad y Estadística
```

Esto significa que **Análisis Matemático II** es una correlativa de **Probabilidad y Estadística**.

Cuando una materia posee múltiples correlativas, todas las relaciones se representan en el grafo:

```text
Análisis Matemático II ───┐
                          ├──→ Probabilidad y Estadística
Álgebra Lineal ───────────┘
```

El grafo está organizado preferentemente por cuatrimestre para facilitar la comprensión de la progresión de la carrera.

### Interacciones

La visualización permite:

* hacer zoom;
* desplazarse por el grafo;
* seleccionar materias;
* consultar sus detalles;
* distinguir visualmente el estado de cada materia;
* observar las relaciones entre materias.

La estructura del grafo está preparada para poder incorporar posteriormente funcionalidades como filtros, búsquedas y otras herramientas de navegación.

---

# Estados de las materias

Cada materia puede encontrarse en uno de los siguientes estados:

| Estado                     | Descripción                                         |
| -------------------------- | --------------------------------------------------- |
| **No cursada / Bloqueada** | La materia tiene una o más correlativas pendientes. |
| **Disponible**             | Todas sus correlativas fueron aprobadas.            |
| **Aprobada**               | El usuario registró la materia como aprobada.       |

Los estados se representan visualmente en el grafo para facilitar la identificación rápida del progreso académico.

## Materias bloqueadas

Una materia permanece bloqueada mientras exista al menos una correlativa que todavía no haya sido aprobada.

## Materias disponibles

Una materia pasa automáticamente a estar disponible cuando **todas sus correlativas requeridas están aprobadas**.

## Materias aprobadas

Cuando el usuario marca una materia como aprobada:

1. se actualiza su estado;
2. se guarda el cambio en `localStorage`;
3. se recalculan las materias disponibles;
4. las materias que ahora cumplen sus requisitos pasan a estar disponibles;
5. se actualiza el progreso del dashboard.

Las materias que no poseen correlativas se consideran disponibles inicialmente.

---

# Materias aprobadas

El usuario puede registrar las materias que ya aprobó.

El sistema utiliza esta información para determinar automáticamente qué materias puede realizar a continuación.

Por ejemplo:

```text
Análisis Matemático II      ✓ Aprobada
Álgebra Lineal              ✓ Aprobada
            │
            ▼
Probabilidad y Estadística  → Disponible
```

Una materia solamente se considera cumplida como correlativa cuando está en estado **Aprobada**.

Por lo tanto, una materia pendiente no puede desbloquear otras materias.

---

# Información de las materias

Cada materia cuenta con información académica asociada.

Al seleccionar una materia se puede consultar:

* nombre;
* código;
* cuatrimestre;
* carga horaria semanal;
* carga horaria total;
* correlativas;
* estado actual;
* materias que desbloquea directamente.

Ejemplo:

```text
Análisis Matemático II

Cuatrimestre: 3°

Carga horaria semanal: 8 h
Horas totales: 128 h

Correlativas:
- CBC

Estado:
Disponible

Desbloquea:
- Probabilidad y Estadística
- Señales y Sistemas
- Electricidad, Magnetismo y Calor
```

Las materias desbloqueadas se obtienen automáticamente a partir de las relaciones del grafo, en lugar de mantenerse como información duplicada.

---

# Planificador de cuatrimestres

La aplicación incluye una sección de **Planificar cuatrimestre**.

El usuario puede seleccionar materias para armar una planificación académica.

Las materias disponibles se muestran como candidatas para ser seleccionadas.

Al seleccionar materias, el sistema calcula automáticamente:

* cantidad de materias;
* carga horaria semanal;
* cantidad de horas totales;
* créditos/carga horaria acumulada.

Por ejemplo:

```text
Materias seleccionadas:

Análisis Matemático II        8 h/semana
Química Básica                6 h/semana
Introducción a Bioingeniería  6 h/semana

--------------------------------------------
Total semanal:               20 h/semana
Total horas:                   320 h
Materias:                         3
```

Las materias pueden quitarse de la planificación y los cálculos se actualizan automáticamente.

La planificación se almacena en `localStorage`.

La arquitectura permite mantener planificaciones independientes para distintos cuatrimestres.

---

# Dashboard

La aplicación cuenta con un dashboard que permite visualizar rápidamente el progreso académico.

Entre la información disponible se encuentra:

* materias aprobadas;
* materias disponibles;
* materias bloqueadas;
* porcentaje de avance;
* horas aprobadas;
* horas restantes;
* progreso por ciclo;
* próximas materias disponibles;
* información de la planificación del cuatrimestre.

Ejemplo:

```text
Progreso de la carrera

Materias aprobadas:   12 / 50
Materias disponibles:  5
Materias bloqueadas:  33

Horas aprobadas:   XXXX
Horas restantes:   XXXX

Progreso: 24%
```

Los valores del dashboard se calculan a partir de los datos del plan de estudios y del progreso registrado por el usuario.

---

# Persistencia

La aplicación no utiliza backend.

Toda la información específica del usuario se almacena localmente mediante:

```text
localStorage
```

Esto permite conservar el progreso incluso después de cerrar o recargar el navegador.

La persistencia está abstraída mediante un servicio independiente para evitar que los componentes de interfaz tengan acceso directo y disperso a `localStorage`.

Conceptualmente, el servicio puede proporcionar operaciones como:

```ts
getCompletedSubjects()
setCompletedSubjects()

getSemesterPlans()
setSemesterPlan()

clearUserData()
```

Esta separación permite reemplazar posteriormente `localStorage` por una API o base de datos sin tener que modificar toda la interfaz de la aplicación.

---

# Tecnologías

## Frontend

* **React** — construcción de la interfaz.
* **TypeScript** — tipado estático y mayor seguridad durante el desarrollo.
* **Vite** — herramienta de desarrollo y build.
* **React Router** — navegación entre las diferentes secciones, cuando resulta necesario.
* **CSS / CSS Modules** — estilos y diseño visual.

## Persistencia

* **Web Storage API / localStorage** — almacenamiento local del progreso y las planificaciones.

## Backend

Actualmente no existe backend.

La aplicación funciona completamente del lado del cliente.

---

# Arquitectura

El proyecto sigue una arquitectura modular orientada a separar:

* datos;
* lógica de negocio;
* persistencia;
* tipos;
* componentes;
* páginas;
* hooks;
* utilidades.

La lógica principal no se concentra en `App.tsx`, sino que se distribuye entre módulos especializados.

Una representación conceptual de la arquitectura es:

```text
                  ┌─────────────────┐
                  │      Pages      │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │   Components    │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │      Hooks      │
                  └───────┬─┬───────┘
                          │ │
              ┌───────────┘ └───────────┐
              ▼                         ▼
      ┌───────────────┐         ┌───────────────┐
      │    Services   │         │     Utils     │
      └───────┬───────┘         └───────┬───────┘
              │                         │
              ▼                         ▼
      ┌───────────────┐         ┌───────────────┐
      │  localStorage │         │ Curriculum    │
      └───────────────┘         │     Data      │
                                └───────────────┘
```

Esto permite mantener separada la representación visual de las reglas de negocio.

---

# Estructura del proyecto

La estructura conceptual del proyecto es:

```text
src/
├── assets/
│
├── components/
│   ├── graph/
│   ├── subjects/
│   ├── planner/
│   ├── dashboard/
│   └── common/
│
├── data/
│   └── curriculum.ts
│
├── hooks/
│   ├── useCurriculum.ts
│   ├── useCompletedSubjects.ts
│   └── useSemesterPlanner.ts
│
├── interfaces/
│   ├── Subject.ts
│   ├── SemesterPlan.ts
│   └── ...
│
├── pages/
│   ├── Dashboard/
│   ├── Curriculum/
│   └── Planner/
│
├── services/
│   └── storageService.ts
│
├── utils/
│   ├── curriculumUtils.ts
│   └── ...
│
├── App.tsx
├── main.tsx
└── ...
```

> La estructura concreta puede variar según la implementación final, pero estos son los principales límites de responsabilidad del proyecto.

---

# Modelo de datos

Las materias se representan mediante un modelo estructurado.

Un modelo conceptual posible es:

```ts
interface Subject {
    id: string;
    code: string;
    name: string;
    semester: number;
    weeklyHours: number;
    totalHours: number;
    prerequisites: string[];
}
```

## Propiedades

| Propiedad       | Descripción                                              |
| --------------- | -------------------------------------------------------- |
| `id`            | Identificador único y estable de la materia.             |
| `code`          | Código oficial de la asignatura, cuando corresponde.     |
| `name`          | Nombre visible de la materia.                            |
| `semester`      | Cuatrimestre en el que aparece en el plan.               |
| `weeklyHours`   | Carga horaria semanal.                                   |
| `totalHours`    | Carga horaria total.                                     |
| `prerequisites` | Identificadores de las materias o requisitos necesarios. |

Las correlatividades se almacenan mediante **identificadores estables**, no mediante nombres.

Por ejemplo:

```ts
{
    id: "analisis-matematico-ii",
    code: "...",
    name: "Análisis Matemático II",
    semester: 3,
    weeklyHours: 8,
    totalHours: 128,
    prerequisites: ["cbc"]
}
```

Esto evita que modificar el nombre visible de una materia rompa las relaciones existentes.

---

# Lógica de correlatividades

La disponibilidad de una materia se determina de manera genérica a partir de sus requisitos.

Conceptualmente:

```text
¿La materia tiene correlativas?
          │
       ┌──┴──┐
      NO     SÍ
      │       │
      ▼       ▼
 Disponible  ¿Todas están aprobadas?
                  │
               ┌──┴──┐
              SÍ     NO
              │       │
              ▼       ▼
         Disponible  Bloqueada
```

No se definen manualmente las materias que se desbloquean.

En cambio, el sistema analiza las relaciones del plan de estudios.

Esto permite que agregar una nueva materia o modificar una correlatividad no requiera cambiar la lógica de la aplicación.

---

# Plan de estudios

La aplicación utiliza como fuente de datos el plan de estudios de Bioingeniería de la Universidad de Buenos Aires (UBA).

## CBC — 1° y 2° cuatrimestre

| Código | Materia                                                 | Carga semanal | Horas totales |
| ------ | ------------------------------------------------------- | ------------: | ------------: |
| 24     | Introducción al Conocimiento de la Sociedad y el Estado |             4 |            64 |
| 40     | Introducción al Pensamiento Científico                  |             4 |            64 |
| 66     | Análisis Matemático A                                   |             9 |           144 |
| 62     | Álgebra A                                               |             9 |           144 |
| 03     | Física                                                  |             6 |            96 |
| 90     | Pensamiento Computacional                               |             6 |            96 |

**Total CBC:** 38 créditos / 608 horas.

---

## 3° cuatrimestre

| Materia                         | Carga semanal | Horas totales | Correlativas |
| ------------------------------- | ------------: | ------------: | ------------ |
| Análisis Matemático II          |             8 |           128 | CBC          |
| Química Básica                  |             6 |            96 | CBC          |
| Introducción a la Bioingeniería |             6 |            96 | CBC          |
| Anatomía e Histología Funcional |             4 |            64 | CBC          |

**Total:** 24 créditos / 384 horas.

---

## 4° cuatrimestre

| Materia                              | Carga semanal | Horas totales | Correlativas                    |
| ------------------------------------ | ------------: | ------------: | ------------------------------- |
| Física de los Sistemas de Partículas |             6 |            96 | CBC                             |
| Algoritmos y Programación            |             6 |            96 | CBC                             |
| Planificación de Proyectos           |             2 |            32 | Introducción a la Bioingeniería |
| Álgebra Lineal                       |             8 |           128 | CBC                             |

**Total:** 22 créditos / 352 horas.

---

## 5° cuatrimestre

| Materia                             | Carga semanal | Horas totales | Correlativas                                                 |
| ----------------------------------- | ------------: | ------------: | ------------------------------------------------------------ |
| Química de los Compuestos Orgánicos |             6 |            96 | Química Básica                                               |
| Probabilidad y Estadística          |             6 |            96 | Análisis Matemático II, Álgebra Lineal                       |
| Señales y Sistemas                  |             6 |            96 | Análisis Matemático II, Álgebra Lineal                       |
| Electricidad, Magnetismo y Calor    |             6 |            96 | Análisis Matemático II, Física de los Sistemas de Partículas |

**Total:** 24 créditos / 384 horas.

---

## 6° cuatrimestre

| Materia                                     | Carga semanal | Horas totales | Correlativas                                                                 |
| ------------------------------------------- | ------------: | ------------: | ---------------------------------------------------------------------------- |
| Sistemas Moleculares, Celulares y Tisulares |             6 |            96 | Química de los Compuestos Orgánicos, Anatomía e Histología Funcional         |
| Física de Sólidos y Nuclear                 |             6 |            96 | Electricidad, Magnetismo y Calor, Química Básica, Probabilidad y Estadística |
| Control Automático                          |             6 |            96 | Electricidad, Magnetismo y Calor, Señales y Sistemas                         |
| Análisis de Circuitos                       |             6 |            96 | Introducción a la Bioingeniería, Electricidad, Magnetismo y Calor            |

**Total:** 24 créditos / 384 horas.

---

## 7° cuatrimestre

| Materia                                      | Carga semanal | Horas totales | Correlativas                                                    |
| -------------------------------------------- | ------------: | ------------: | --------------------------------------------------------------- |
| Procesos Estocásticos                        |             6 |            96 | Probabilidad y Estadística, Señales y Sistemas                  |
| Introducción a los Dispositivos Electrónicos |             4 |            64 | Introducción a la Bioingeniería                                 |
| Sistemas Fisiológicos y sus Modelos          |             8 |           128 | Sistemas Moleculares, Celulares y Tisulares, Control Automático |
| Introducción a la Mecánica del Continuo      |             6 |            96 | Álgebra Lineal, Electricidad, Magnetismo y Calor                |

**Total:** 24 créditos / 384 horas.

---

## 8° cuatrimestre

| Materia                               | Carga semanal | Horas totales | Correlativas                                                        |
| ------------------------------------- | ------------: | ------------: | ------------------------------------------------------------------- |
| Taller de Procesamiento de Señales    |             6 |            96 | Procesos Estocásticos                                               |
| Circuitos Microelectrónicos           |             6 |            96 | Introducción a los Dispositivos Electrónicos, Análisis de Circuitos |
| Introducción a los Sistemas Embebidos |             6 |            96 | Algoritmos y Programación, Análisis de Circuitos                    |
| Gestión de Proyectos                  |             6 |            96 | Planificación de Proyectos                                          |
| Legislación y Ejercicio Profesional   |             2 |            32 | 100 créditos                                                        |

**Total:** 26 créditos / 416 horas.

---

## 9° cuatrimestre

| Materia                                                       | Carga semanal | Horas totales | Correlativas                                                                 |
| ------------------------------------------------------------- | ------------: | ------------: | ---------------------------------------------------------------------------- |
| Introducción a la Biomecánica                                 |             4 |            64 | Sistemas Fisiológicos y sus Modelos, Introducción a la Mecánica del Continuo |
| Instrumentación y Equipamiento para Diagnóstico y Tratamiento |             6 |            96 | Sistemas Fisiológicos y sus Modelos, Circuitos Microelectrónicos             |
| Introducción a los Biomateriales                              |             4 |            64 | Sistemas Fisiológicos y sus Modelos, Física de Sólidos y Nuclear             |
| Análisis y Procesamiento de Señales en Bioingeniería          |             6 |            96 | Sistemas Fisiológicos y sus Modelos, Procesos Estocásticos                   |
| Higiene y Seguridad                                           |             2 |            32 | Química Básica                                                               |

**Total:** 22 créditos / 352 horas.

---

## 10° cuatrimestre

| Materia                                                       | Carga semanal | Horas totales | Correlativas                                                                                                                                              |
| ------------------------------------------------------------- | ------------: | ------------: | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Imágenes en Bioingeniería                                     |             6 |            96 | Sistemas Fisiológicos y sus Modelos, Señales y Sistemas, Física de Sólidos y Nuclear                                                                      |
| Tecnología de Asistencia y Prótesis                           |             6 |            96 | Introducción a la Biomecánica, Introducción a los Biomateriales, Introducción a los Sistemas Embebidos, Circuitos Microelectrónicos                       |
| Tesis de Bioingeniería o Trabajo Profesional de Bioingeniería |             6 |            96 | Gestión de Proyectos, Instrumentación y Equipamiento para Diagnóstico y Tratamiento, Taller de Procesamiento de Señales, Introducción a los Biomateriales |
| Electivas / Optativas                                         |             6 |            96 | —                                                                                                                                                         |

**Total:** 24 créditos / 384 horas.

---

## 11° cuatrimestre

| Materia                                                       | Carga semanal | Horas totales | Correlativas                                                                                                                                              |
| ------------------------------------------------------------- | ------------: | ------------: | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ingeniería Clínica y Hospitalaria                             |             6 |            96 | Instrumentación y Equipamiento para Diagnóstico y Tratamiento, Legislación y Ejercicio Profesional, Higiene y Seguridad, Imágenes en Bioingeniería        |
| Tesis de Bioingeniería o Trabajo Profesional de Bioingeniería |             6 |            96 | Gestión de Proyectos, Instrumentación y Equipamiento para Diagnóstico y Tratamiento, Taller de Procesamiento de Señales, Introducción a los Biomateriales |
| Electivas / Optativas                                         |            10 |           160 | —                                                                                                                                                         |

**Total:** 22 créditos / 352 horas.

---

# Casos especiales

El plan contiene determinados requisitos que no corresponden directamente a una materia individual.

## CBC

Cuando una asignatura tiene como correlativa:

```text
CBC
```

se interpreta que requiere la aprobación del Ciclo Básico Común correspondiente.

El CBC se modela como un conjunto de materias individuales, permitiendo que el sistema determine correctamente cuándo se cumple este requisito.

---

## Requisito de 100 créditos

**Legislación y Ejercicio Profesional** tiene como requisito:

```text
100 créditos
```

Este requisito representa una condición basada en créditos acumulados y no una materia específica.

Por lo tanto, debe ser tratado como una regla especial dentro del sistema de requisitos.

---

## Tesis / Trabajo Profesional

La asignatura:

```text
Tesis de Bioingeniería o Trabajo Profesional de Bioingeniería
```

aparece tanto en el décimo como en el undécimo cuatrimestre.

Sus requisitos son:

* Gestión de Proyectos;
* Instrumentación y Equipamiento para Diagnóstico y Tratamiento;
* Taller de Procesamiento de Señales;
* Introducción a los Biomateriales.

La estructura del modelo debe permitir representar correctamente esta situación sin generar relaciones inconsistentes en el grafo.

---

## Electivas / Optativas

Las electivas/optativas aparecen en los últimos cuatrimestres del plan.

Se consideran una categoría especial que puede ser extendida posteriormente para permitir seleccionar diferentes asignaturas electivas.

---

# Carga horaria

La aplicación utiliza dos medidas principales para cada materia:

### Carga horaria semanal

Representa las horas de cursada semanales.

Por ejemplo:

```text
Análisis Matemático II → 8 h/semana
```

### Carga horaria total

Representa la carga horaria total de la asignatura.

Por ejemplo:

```text
Análisis Matemático II → 128 h totales
```

Estas propiedades permiten realizar cálculos tanto a nivel individual como de planificación.

---

# Resumen del plan

Según los datos utilizados por la aplicación:

```text
CBC:
38 créditos
608 horas

Segundo ciclo:
212 créditos
3392 horas

Total carrera:
250 créditos
4000 horas
```

El total de la carrera se utiliza como referencia para calcular el progreso académico.

---

# Instalación

## Requisitos

Se requiere tener instalado:

* Node.js
* npm

Se recomienda utilizar una versión reciente y estable de Node.js compatible con la versión de Vite utilizada por el proyecto.

## Clonar el proyecto

```bash
git clone <repository-url>
cd <project-directory>
```

## Instalar dependencias

```bash
npm install
```

---

# Ejecución

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

Vite mostrará la dirección local donde estará disponible la aplicación, normalmente:

```text
http://localhost:5173
```

---

# Build de producción

Para generar una versión optimizada para producción:

```bash
npm run build
```

Para comprobar localmente el build generado:

```bash
npm run preview
```

---

# Persistencia de datos

Los datos del usuario se almacenan en el navegador mediante `localStorage`.

Esto incluye principalmente:

* materias aprobadas;
* planificaciones de cuatrimestres.

Los datos no se envían a ningún servidor.

## Ventajas

* no requiere backend;
* no requiere autenticación;
* funciona de manera local;
* los datos persisten entre sesiones;
* permite desarrollar el sistema rápidamente.

## Limitaciones

Los datos están asociados al navegador y dispositivo donde se utiliza la aplicación.

Por lo tanto:

* no existe sincronización entre dispositivos;
* borrar los datos del navegador puede eliminar el progreso;
* no existe actualmente un sistema de cuentas o recuperación de datos.

---

# Diseño y UX

La interfaz está diseñada para priorizar:

* claridad;
* legibilidad;
* navegación sencilla;
* jerarquía visual;
* visualización del grafo;
* identificación rápida del estado de las materias;
* responsive design.

La navegación principal contempla las siguientes áreas:

```text
Dashboard
Plan de estudios
Planificar cuatrimestre
```

El grafo constituye el elemento visual central de la aplicación.

La información detallada de cada materia se presenta al seleccionar un nodo, evitando sobrecargar visualmente el grafo con demasiada información.

---

# Escalabilidad

El proyecto fue diseñado para que las reglas de negocio no dependan directamente de la interfaz.

La separación entre:

```text
Data
 ↓
Services
 ↓
Hooks / Utils
 ↓
Components
 ↓
Pages
```

permite extender la aplicación sin tener que reestructurarla completamente.

Por ejemplo, el almacenamiento actual:

```text
localStorage
```

podría reemplazarse posteriormente por:

```text
Frontend
    ↓
API
    ↓
Backend
    ↓
Database
```

sin necesidad de modificar todos los componentes visuales.

La estructura de datos también permite incorporar nuevas propiedades a las materias y nuevos tipos de requisitos.

---

# Funcionalidades futuras

La arquitectura actual está preparada para incorporar funcionalidades como:

* autenticación de usuarios;
* backend;
* sincronización entre dispositivos;
* múltiples planes de estudio;
* diferentes carreras;
* horarios de cursada;
* calendario académico;
* registro de notas;
* promedio;
* materias cursadas pero no aprobadas;
* finales;
* diferenciación entre correlatividades de cursada y aprobación;
* recomendaciones automáticas de materias;
* optimización del recorrido académico;
* estadísticas avanzadas;
* exportación del plan a PDF;
* selección de materias electivas;
* seguimiento detallado de la trayectoria académica.

Estas funcionalidades no forman parte de la versión actual y pueden incorporarse progresivamente sin modificar el concepto central de la aplicación.

---

# Objetivo del proyecto

El objetivo de **Bioengineering Curriculum Planner** es transformar un plan de estudios tradicional en una herramienta interactiva que permita comprender:

```text
¿Qué materias ya aprobé?
          ↓
¿Qué materias tengo disponibles?
          ↓
¿Qué materias puedo cursar?
          ↓
¿Qué correlativas voy a desbloquear?
          ↓
¿Cómo puedo organizar mi próximo cuatrimestre?
```

De esta manera, el plan de estudios deja de ser solamente una lista de asignaturas y se convierte en una representación dinámica del recorrido académico.
