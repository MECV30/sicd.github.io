import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getFirestore, collection, getDocs, query, where, deleteDoc, doc, addDoc } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js';

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDU4xHoJ2Qcdd9gGyAX4UDZE4tAQf-iY3I",
    authDomain: "sistemaintegralcontroldocente.firebaseapp.com",
    projectId: "sistemaintegralcontroldocente",
    storageBucket: "sistemaintegralcontroldocente.appspot.com",
    messagingSenderId: "728512991525",
    appId: "1:728512991525:web:c7764c65cfc1015f164acc"
};

// Inicializa la aplicación de Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para mostrar el formulario de matrícula
window.verRegistrar = function verRegistrar(identidad, nombreCompleto, correo, telefono) {
    document.getElementById('identidad').value = identidad;
    document.getElementById('nombreCompleto').value = nombreCompleto;
    document.getElementById('correo').value = correo;
    document.getElementById('telefono').value = telefono;

    // Mostrar el modal del formulario de matrícula
    document.getElementById('registroModal').style.display = 'block';
};

// Función para cerrar formularios
window.cerrarFormulario = function cerrarFormulario() {
    document.querySelectorAll('.modal').forEach(modal => modal.style.display = 'none');
};

// Función para agregar un nuevo curso con los datos del estudiante
async function agregarCurso(identidad, nombreCompleto, correo, telefono, curso, seccion) {
    try {
        const cursoTexto = curso === '1' ? 'decimo' : curso === '2' ? 'onceavo' : curso === '3' ? 'doceavo' : curso;

        const q = query(collection(db, 'curso'), where('identidad', '==', identidad));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            alert('El estudiante ya está matriculado en este curso.');
            return;
        }

        await addDoc(collection(db, 'curso'), {
            identidad: identidad,
            nombreCompleto: nombreCompleto,
            correo: correo,
            telefono: telefono,
            curso: cursoTexto,
            seccion: seccion
        });

        await eliminarEstudiantePorIdentidad(identidad);
        alert('Estudiante matriculado en el curso exitosamente.');
    } catch (error) {
        alert('Error al matricular al estudiante: ' + error.message);
    }
}

// Función para cargar estudiantes
async function cargarEstudiantes() {
    const tableBody = document.getElementById('estudiantesTable').querySelector('tbody');
    tableBody.innerHTML = '';

    const estudiantesCol = collection(db, 'estudiantes');
    const snapshot = await getDocs(estudiantesCol);
    let contador = 1;

    snapshot.forEach(doc => {
        const data = doc.data();
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${contador}</td>
            <td>${data.nombrecompleto}</td>
            <td>${data.correo || 'N/A'}</td>
            <td>${data.telefono || 'N/A'}</td>
            <td>${data.identidad}</td>
            <td>
                <button onclick="verRegistrar('${data.identidad}', '${data.nombrecompleto}', '${data.correo || 'N/A'}', '${data.telefono || 'N/A'}')">Matricular</button>
            </td>
        `;
        tableBody.appendChild(row);
        contador++;
    });
}

// Función para eliminar estudiante por identidad
async function eliminarEstudiantePorIdentidad(identidad) {
    try {
        const q = query(collection(db, 'estudiantes'), where('identidad', '==', identidad));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            alert('No se encontró ningún estudiante con esa identidad.');
            return;
        }

        snapshot.forEach(async docSnapshot => {
            const docId = docSnapshot.id;
            await deleteDoc(doc(db, 'estudiantes', docId));
            alert(`Estudiante con identidad ${identidad} eliminado.`);
            cargarEstudiantes();
        });
    } catch (error) {
        alert('Error eliminando el estudiante: ' + error.message);
    }
}

// Evento para enviar el formulario de matrícula
document.getElementById('formMatricula').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    const identidad = document.getElementById('identidad').value;
    const nombreCompleto = document.getElementById('nombreCompleto').value;
    const correo = document.getElementById('correo').value;
    const telefono = document.getElementById('telefono').value;
    const curso = document.getElementById('curso').value;
    const seccion = document.getElementById('seccion').value;

    await agregarCurso(identidad, nombreCompleto, correo, telefono, curso, seccion);
    cerrarFormulario();
});

// Función para cargar estudiantes por curso
async function cargarEstudiantesPorCurso(curso) {
    const tableBody = document.getElementById('estudiantesCursoTable').querySelector('tbody');
    tableBody.innerHTML = '';

    const estudiantesCol = collection(db, 'curso'); // Cambia a tu colección de cursos si es diferente
    const q = query(estudiantesCol, where('curso', '==', curso));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        alert(`No hay estudiantes matriculados en el curso ${curso}.`);
        return;
    }

    let contador = 1;
    snapshot.forEach(doc => {
        const data = doc.data();
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${contador}</td>
            <td>${data.nombreCompleto}</td>
            <td>${data.correo || 'N/A'}</td>
            <td>${data.telefono || 'N/A'}</td>
            <td>${data.identidad}</td>
        `;
        tableBody.appendChild(row);
        contador++;
    });
}

// Función para mostrar el modal de estudiantes
window.mostrarEstudiantesCurso = function mostrarEstudiantesCurso(curso) {
    cargarEstudiantesPorCurso(curso);
    document.getElementById('visualizarEstudiantesModal').style.display = 'block';
};

// Cargar estudiantes al cargar la página
window.onload = function() {
    cargarEstudiantes();
};
