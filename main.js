const API_URL = 'https://tp4grupo17.onrender.com';

const btnCargar = document.getElementById('btn-cargar');
const listaAlumnos = document.getElementById('lista-alumnos');
const formAlumno = document.getElementById('form-alumno');
const mensajeError = document.getElementById('mensaje-error');
const mensajeForm = document.getElementById('mensaje-form');

// Muestra un mensaje en pantalla en vez de alert
function mostrarMensaje(elemento, texto, esError = false) {
    elemento.textContent = texto;
    elemento.className = esError ? 'mensaje-error' : 'mensaje-exito';
    setTimeout(() => {
        elemento.textContent = '';
        elemento.className = 'oculto';
    }, 3000);
}

// Petición GET - Cargar alumnos
btnCargar.addEventListener('click', async () => {
    try {
        const respuesta = await fetch(`${API_URL}/alumnos`);

        if (!respuesta.ok) throw new Error('Error al obtener los alumnos');

        const alumnos = await respuesta.json();
        listaAlumnos.innerHTML = '';

        if (alumnos.length === 0) {
            mostrarMensaje(mensajeError, 'No hay alumnos registrados', false);
            return;
        }

        alumnos.forEach(alumno => {
            const li = document.createElement('li');
            li.className = 'alumno-item';
            li.innerHTML = `
                <span>Legajo: <strong>${alumno.legajo}</strong> | ${alumno.nombre} ${alumno.apellido}</span>
                <button class="btn btn--danger" onclick="eliminarAlumno(${alumno.legajo})">Eliminar</button>
            `;
            listaAlumnos.appendChild(li);
        });

    } catch (error) {
        console.error('Error al cargar los alumnos:', error);
        mostrarMensaje(mensajeError, 'No se pudo conectar con la API', true);
    }
});

// Petición DELETE - Eliminar alumno
async function eliminarAlumno(legajo) {
    if (!confirm(`¿Seguro que querés eliminar al alumno con legajo ${legajo}?`)) return;

    try {
        const respuesta = await fetch(`${API_URL}/alumnos/${legajo}`, {
            method: 'DELETE'
        });

        if (!respuesta.ok) throw new Error('No se pudo eliminar');

        mostrarMensaje(mensajeError, 'Alumno eliminado correctamente', false);
        btnCargar.click();

    } catch (error) {
        console.error('Error al eliminar:', error);
        mostrarMensaje(mensajeError, 'Error al eliminar el alumno', true);
    }
}

// Petición POST - Agregar alumno
formAlumno.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nuevoAlumno = {
        legajo: parseInt(document.getElementById('legajo').value),
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value
    };

    try {
        const respuesta = await fetch(`${API_URL}/alumnos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoAlumno)
        });

        if (!respuesta.ok) throw new Error('Error al guardar');

        mostrarMensaje(mensajeForm, '¡Alumno guardado con éxito!', false);
        formAlumno.reset();
        btnCargar.click();

    } catch (error) {
        console.error('Error al enviar los datos:', error);
        mostrarMensaje(mensajeForm, 'Error al guardar el alumno', true);
    }
});