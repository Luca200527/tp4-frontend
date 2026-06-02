const API_URL = 'https://tp4grupo17.onrender.com';

const btnCargar = document.getElementById('btn-cargar');
const listaAlumnos = document.getElementById('lista-alumnos');
const formAlumno = document.getElementById('form-alumno');
const mensajeError = document.getElementById('mensaje-error');
const mensajeForm = document.getElementById('mensaje-form');

// Muestra un mensaje en pantalla sin sobrescribir otras clases.
function mostrarMensaje(elemento, texto, esError = false, duracion = 3000) {
    elemento.textContent = texto;
    elemento.classList.remove('oculto');

    // Diferenciar estilos para el area de formulario y la zona general
    if (elemento.id === 'mensaje-form') {
        elemento.classList.remove('exito', 'error');
        elemento.classList.add(esError ? 'error' : 'exito');
    } else {
        elemento.classList.remove('mensaje-error', 'mensaje-exito');
        elemento.classList.add(esError ? 'mensaje-error' : 'mensaje-exito');
    }

    // Limpiar timeout anterior si existe.
    if (elemento._timeout) clearTimeout(elemento._timeout);
    if (!duracion) return;

    elemento._timeout = setTimeout(() => {
        elemento.textContent = '';
        elemento.classList.add('oculto');
        if (elemento.id === 'mensaje-form') elemento.classList.remove('exito', 'error');
        else elemento.classList.remove('mensaje-error', 'mensaje-exito');
    }, 3000);
}

// Cargar alumnos desde la API y renderizar
async function cargarAlumnos() {
    try {
        const respuesta = await fetch(`${API_URL}/alumnos`);
        if (!respuesta.ok) throw new Error('Error al obtener los alumnos');

        const alumnos = await respuesta.json();
        renderAlumnos(alumnos);
    } catch (error) {
        console.error('Error al cargar los alumnos:', error);
        mostrarMensaje(mensajeError, 'No se pudo conectar con la API', true);
    }
}

function renderAlumnos(alumnos) {
    listaAlumnos.innerHTML = '';

    if (!Array.isArray(alumnos) || alumnos.length === 0) {
        mostrarMensaje(mensajeError, 'No hay alumnos registrados', false, 0);
        return;
    }

    mensajeError.textContent = '';
    mensajeError.classList.add('oculto');
    mensajeError.classList.remove('mensaje-error', 'mensaje-exito');

    alumnos.forEach(alumno => {
        const li = document.createElement('li');
        li.className = 'alumno-item';

        const span = document.createElement('span');
        span.textContent = `Legajo: ${alumno.legajo} | ${alumno.nombre} ${alumno.apellido}`;

        const btnEliminar = document.createElement('button');
        btnEliminar.className = 'btn btn--danger';
        btnEliminar.type = 'button';
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.addEventListener('click', () => eliminarAlumno(alumno.legajo));

        li.appendChild(span);
        li.appendChild(btnEliminar);
        listaAlumnos.appendChild(li);
    });
}

// Evento del botón cargar
btnCargar.addEventListener('click', () => cargarAlumnos());

// Petición DELETE - Eliminar alumno
async function eliminarAlumno(legajo) {
    if (!confirm(`¿Seguro que querés eliminar al alumno con legajo ${legajo}?`)) return;

    try {
        const respuesta = await fetch(`${API_URL}/alumnos/${legajo}`, { method: 'DELETE' });
        if (!respuesta.ok) throw new Error('No se pudo eliminar');

        mostrarMensaje(mensajeError, 'Alumno eliminado correctamente', false);
        await cargarAlumnos();
    } catch (error) {
        console.error('Error al eliminar:', error);
        mostrarMensaje(mensajeError, 'Error al eliminar el alumno', true);
    }
}

// Petición POST - Agregar alumno
formAlumno.addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailVal = document.getElementById('email').value.trim();
    const nombreVal = document.getElementById('nombre').value.trim();
    const apellidoVal = document.getElementById('apellido').value.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        mostrarMensaje(mensajeForm, 'Email inválido', true);
        return;
    }
    if (!nombreVal || !apellidoVal) {
        mostrarMensaje(mensajeForm, 'Nombre y apellido son obligatorios', true);
        return;
    }

    const nuevoAlumno = { email: emailVal, nombre: nombreVal, apellido: apellidoVal };

    try {
        const respuesta = await fetch(`${API_URL}/alumnos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoAlumno)
        });

        if (!respuesta.ok) {
            const texto = await respuesta.text().catch(() => null);
            throw new Error(texto || 'Error al guardar');
        }

        mostrarMensaje(mensajeForm, '¡Alumno guardado con éxito!', false);
        formAlumno.reset();
        await cargarAlumnos();
    } catch (error) {
        console.error('Error al enviar los datos:', error);
        mostrarMensaje(mensajeForm, 'Error al guardar el alumno', true);
    }
});
