# Acme School — Plataforma de Exámenes

## Descripción del proyecto

**Acme School** es una plataforma web desarrollada con JavaScript que permite administrar usuarios, crear y gestionar exámenes, evaluar estudiantes y consultar los resultados obtenidos.

El proyecto está diseñado para facilitar los procesos de evaluación académica mediante una interfaz intuitiva, organizada y adaptable a diferentes dispositivos.

La plataforma cuenta con un módulo administrativo privado y un módulo público para que los estudiantes puedan presentar sus exámenes sin necesidad de iniciar sesión.

## Objetivos

- Desarrollar una plataforma web para la gestión de exámenes académicos.
- Administrar usuarios con diferentes cargos y permisos de acceso.
- Crear, editar y eliminar exámenes y sus preguntas.
- Permitir que los estudiantes presenten evaluaciones en línea.
- Calcular automáticamente las calificaciones.
- Consultar el historial de resultados de los estudiantes.
- Almacenar la información utilizando `localStorage`.

## Características principales

### 1. Inicio de sesión

- Acceso privado para el personal administrativo y docente.
- Validación de credenciales.
- Manejo de sesión del usuario.

### 2. Gestión de usuarios

- Registrar nuevos usuarios.
- Consultar usuarios registrados.
- Editar información de los usuarios.
- Eliminar usuarios.
- Administrar identificación, nombre, correo electrónico, teléfono, cargo y contraseña.

### 3. Gestión de exámenes

- Crear exámenes con código y título.
- Configurar el tiempo de duración.
- Establecer el porcentaje mínimo de aprobación.
- Agregar una descripción.
- Crear preguntas y sus respectivas respuestas.
- Definir exactamente una respuesta correcta por pregunta.
- Editar y eliminar exámenes.

### 4. Presentación pública de exámenes

- Consultar los exámenes disponibles.
- Registrar la identificación y el nombre del estudiante.
- Resolver preguntas seleccionando una respuesta.
- Visualizar un temporizador en tiempo real.
- Finalizar el examen manualmente o automáticamente cuando termina el tiempo.
- Calcular el porcentaje de respuestas correctas.
- Mostrar si el estudiante aprobó o no aprobó.

### 5. Gestión de resultados

- Consultar los exámenes presentados.
- Visualizar el nombre e identificación del estudiante.
- Consultar el examen realizado.
- Revisar el porcentaje obtenido.
- Identificar las respuestas correctas y el total de preguntas.
- Consultar el estado de aprobación.
- Actualizar la información de los resultados.

## Tecnologías utilizadas

| Tecnología            | Uso                                         |
| --------------------- | ------------------------------------------- |
| HTML5                 | Estructura de la aplicación                 |
| CSS3                  | Diseño y estilos visuales                   |
| JavaScript ES Modules | Lógica y organización del código            |
| Web Components        | Creación de componentes reutilizables       |
| Shadow DOM            | Encapsulación de componentes                |
| localStorage          | Persistencia de información en el navegador |
| JSON                  | Estructuración y almacenamiento de datos    |

## Estructura del proyecto

```text
Acme-School/
│
├── index.html
│
├── README.md
│
├── css/
│   ├── styles.css
│   └── components.css
│
└── js/
    ├── app.js
    │
    ├── components/
    │   ├── app-header.js
    │   ├── login-form.js
    │   ├── management-components.js
    │   ├── exam-taking.js
    │   └── results-management.js
    │
    ├── data/
    │   └── initial-data.js
    │
    └── services/
        ├── storage.js
        ├── auth.js
        ├── users.js
        └── exams.js
```

### Pasos para ejecutar el proyecto

1. Descargar o clonar el repositorio.
2. Abrir la carpeta del proyecto en Visual Studio Code.
3. Instalar la extensión **Live Server**, si todavía no está instalada.
4. Abrir el archivo `index.html`.
5. Hacer clic derecho y seleccionar **Open with Live Server**.
6. La plataforma se abrirá automáticamente en el navegador.

**Importante:** Se recomienda ejecutar el proyecto mediante Live Server para garantizar el funcionamiento correcto de los módulos JavaScript.

## Credenciales de acceso de demostración

La plataforma incluye usuarios iniciales para probar el inicio de sesión.

| Cargo          | Correo electrónico                                       | Contraseña  |
| -------------- | -------------------------------------------------------- | ----------- |
| Administrativo | [admin@acmeschool.com](mailto\:admin@acmeschool.com)     | Admin123!   |
| Docente        | [docente@acmeschool.com](mailto\:docente@acmeschool.com) | Docente123! |

## Almacenamiento de información

Acme School utiliza `localStorage` del navegador para conservar los datos entre sesiones.

Las claves principales utilizadas son:

| Clave          | Información almacenada        |
| -------------- | ----------------------------- |
| `acme_users`   | Usuarios registrados          |
| `acme_exams`   | Exámenes creados              |
| `acme_results` | Resultados de los estudiantes |
| `acme_session` | Sesión del usuario            |

Los datos se almacenan en formato JSON y se recuperan cuando se vuelve a abrir la aplicación.

**Nota:** La información permanece en el navegador donde se utiliza la plataforma. Si se eliminan los datos del navegador, también se puede perder la información almacenada.

## Arquitectura y organización

El proyecto utiliza una estructura modular para separar las responsabilidades de cada funcionalidad.

- **Components:** contiene los Web Components encargados de representar las diferentes interfaces.
- **Services:** contiene la lógica para administrar usuarios, exámenes, autenticación y almacenamiento.
- **Data:** contiene los datos iniciales de la aplicación.
- **App.js:** funciona como punto principal de entrada y controla la navegación entre los módulos.
- **CSS:** contiene los estilos generales y los estilos de los componentes.

Se implementan Web Components y Shadow DOM para crear elementos reutilizables y mantener encapsulados sus estilos y estructuras.

## Pruebas recomendadas

Para comprobar el funcionamiento de la plataforma se deben realizar las siguientes pruebas:

- [x] Iniciar sesión con las credenciales de demostración.
- [x] Registrar, editar y eliminar usuarios.
- [x] Crear, editar y eliminar exámenes.
- [x] Comprobar la validación de respuestas correctas.
- [x] Ingresar al módulo público de exámenes.
- [x] Registrar los datos de un estudiante.
- [x] Resolver un examen y finalizarlo.
- [x] Comprobar el funcionamiento del temporizador.
- [x] Verificar el cálculo de la calificación.
- [x] Consultar los resultados obtenidos.
- [x] Comprobar que la información permanezca guardada al recargar la página.

## Limitaciones del proyecto

Esta aplicación funciona completamente en el navegador y utiliza `localStorage` como mecanismo de almacenamiento.

Por lo tanto:

- No cuenta con una base de datos centralizada.
- Los datos no se sincronizan entre diferentes dispositivos.
- No dispone de un servidor backend.
- La autenticación es una implementación de demostración y no debe utilizarse para proteger información real.
- Las contraseñas almacenadas en el navegador no cuentan con protección suficiente para un entorno de producción.

Para un uso profesional sería necesario implementar un backend, una base de datos y mecanismos seguros de autenticación y autorización.

## Autoría

**Proyecto:** Acme School — Plataforma de Exámenes
**Asignatura:** JavaScript
**Lenguajes principales:** HTML, CSS y JavaScript
**Repositorio:** ProyectoAcmeschool_JavaScript_ApellidoNombre

---

## Conclusión

Acme School integra herramientas para la administración académica y la evaluación de estudiantes en una sola plataforma web.

Su desarrollo permitió aplicar conceptos de JavaScript, programación modular, Web Components, manejo de eventos, manipulación del DOM y almacenamiento de información en el navegador.

El proyecto busca ofrecer una solución organizada, funcional y fácil de utilizar para la gestión de evaluaciones académicas.
