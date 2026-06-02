# TP4 Frontend - Gestión de Alumnos

Aplicación web simple para consumir una API REST de alumnos. Permite listar, agregar y eliminar alumnos desde una interfaz hecha con HTML, CSS y JavaScript puro.

## Funcionalidades

- Cargar la lista de alumnos desde la API.
- Agregar un alumno con email, nombre y apellido.
- Validar que el legajo sea un número entero positivo.
- Eliminar alumnos con confirmación previa.
- Mostrar mensajes de éxito, error y lista vacía.

## API utilizada

```text
https://tp4grupo17.onrender.com
```

Endpoints usados:

- `GET /alumnos`
- `POST /alumnos`
- `DELETE /alumnos/:legajo`

## Cómo ejecutar

Abrir el archivo `index.html` en un navegador. No requiere instalación de dependencias ni servidor local.

## Estructura

```text
.
├── index.html
├── script.js
└── css
    ├── base.css
    ├── components.css
    └── forms.css
```

## Tecnologías

- HTML5
- CSS3
- JavaScript
- Fetch API
