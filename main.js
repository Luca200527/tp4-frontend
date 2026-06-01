const API_URL = 'render https://tp4grupo17.onrender.com';

const btnCargar = document.getElementById('btn-cargar');
const listaAlumnos = document.getElementById('lista-alumnos');
const formAlumno = document.getElementById('form-alumno');

// Función de consulta sobre los alumnos (Petición GET)
btnCargar.addEventListener('click', async () => {
    try {
        const respuesta = await fetch(`${API_URL}/alumnos`);
        const alumnos = await respuesta.json();

        // Limpiamos la lista antes de mostrar los nuevos
        listaAlumnos.innerHTML = ''; 

        // Recorremos los datos y los agregamos al HTML
        alumnos.forEach(alumno => {
            const li = document.createElement('li');
            li.textContent = `Legajo: ${alumno.legajo} | Nombre: ${alumno.nombre} ${alumno.apellido}`;
            listaAlumnos.appendChild(li);
        });
    } catch (error) {
        console.error('Error al cargar los alumnos:', error);
        alert('Hubo un error al conectar con la API');
    }
});

// Función para enviar un alumno nuevo (Petición POST)
formAlumno.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que la página recargue al mandar el formulario

    // Armamos el objeto con los datos del formulario
    const nuevoAlumno = {
        legajo: parseInt(document.getElementById('legajo').value),
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value
    };

    try {
        const respuesta = await fetch(`${API_URL}/alumnos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Le decimos al servidor que enviamos un JSON
            },
            body: JSON.stringify(nuevoAlumno)
        });

        if (respuesta.ok) {
            alert('¡Alumno guardado con éxito!');
            formAlumno.reset(); // Limpia los campos del formulario
            btnCargar.click(); // Vuelve a cargar la lista automáticamente
        } else {
            alert('Error al guardar el alumno en el servidor');
        }
    } catch (error) {
        console.error('Error al enviar los datos:', error);
    }
});