import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getFirestore, collection, getDocs, query, where, deleteDoc, doc, addDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js';

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

// Función para mostrar el formulario de registro
window.verRegistrar = function verRegistrar() {
    document.getElementById('registroModal').style.display = 'block';
};

// Función para mostrar el formulario de búsqueda
window.verBuscar = function verBuscar() {
    document.getElementById('busquedaModal').style.display = 'block';
};

// Función para cerrar formularios
window.cerrarFormulario = function cerrarFormulario() {
    document.querySelectorAll('.modal').forEach(modal => modal.style.display = 'none');
};

// Función para agregar un nuevo estudiante
async function agregarEstudiante(nombreCompleto, correo, telefono, identidad) {
    try {
        const q = query(collection(db, 'estudiantes'), where('identidad', '==', identidad));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            alert('Estudiante con esta identidad ya está registrado.');
            return;
        }

        await addDoc(collection(db, 'estudiantes'), {
            nombrecompleto: nombreCompleto,
            correo: correo,
            telefono: telefono,
            identidad: identidad
        });
        alert('Estudiante registrado exitosamente.');
    } catch (error) {
        alert('Error al registrar el estudiante: ' + error.message);
    }
}

// Manejar el envío del formulario de registro
document.getElementById('formRegistro').addEventListener('submit', async function(event) {
    event.preventDefault();

    const nombreCompleto = document.getElementById('nombreCompleto').value;
    const correo = document.getElementById('correo').value;
    const telefono = document.getElementById('telefono').value;
    const identidad = document.getElementById('identidad').value;

    await agregarEstudiante(nombreCompleto, correo, telefono, identidad);
    cerrarFormulario();
    cargarEstudiantes();
});

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
                <button onclick="eliminarEstudiantePorIdentidad('${data.identidad}')">Eliminar</button>
                <button onclick="mostrarModificarEstudiante('${doc.id}', '${data.nombrecompleto}', '${data.correo}', '${data.telefono}', '${data.identidad}')">Modificar</button>
            </td>
        `;
        tableBody.appendChild(row);
        contador++;
    });
}

// Función para eliminar estudiante por identidad
window.eliminarEstudiantePorIdentidad = eliminarEstudiantePorIdentidad;
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

// Función para buscar un estudiante
document.getElementById('formBusqueda').addEventListener('submit', async function(event) {
    event.preventDefault();
    const identidadBusqueda = document.getElementById('identidadBusqueda').value;

    const q = query(collection(db, 'estudiantes'), where('identidad', '==', identidadBusqueda));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        alert('No se encontró ningún estudiante con esa identidad.');
        return;
    }

    const tableBody = document.getElementById('estudiantesTable').querySelector('tbody');
    tableBody.innerHTML = '';
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
                <button onclick="eliminarEstudiantePorIdentidad('${data.identidad}')">Eliminar</button>
                <button onclick="mostrarModificarEstudiante('${doc.id}', '${data.nombrecompleto}', '${data.correo}', '${data.telefono}', '${data.identidad}')">Modificar</button>
            </td>
        `;
        tableBody.appendChild(row);
        contador++;
    });
});

// Función para mostrar el formulario de modificación con datos prellenados
window.mostrarModificarEstudiante = function mostrarModificarEstudiante(id, nombre, correo, telefono, identidad) {
    document.getElementById('modificarNombre').value = nombre;
    document.getElementById('modificarCorreo').value = correo;
    document.getElementById('modificarTelefono').value = telefono;
    document.getElementById('modificarIdentidad').value = identidad;
    document.getElementById('modificarModal').style.display = 'block';
};

// Función para manejar el envío del formulario de modificación
document.getElementById('formModificar').addEventListener('submit', async function(event) {
    event.preventDefault();

    const id = document.getElementById('modificarIdentidad').value;
    const nombreCompleto = document.getElementById('modificarNombre').value;
    const correo = document.getElementById('modificarCorreo').value;
    const telefono = document.getElementById('modificarTelefono').value;

    try {
        const q = query(collection(db, 'estudiantes'), where('identidad', '==', id));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            alert('No se encontró ningún estudiante con esa identidad.');
            return;
        }

        const docSnapshot = snapshot.docs[0];
        await updateDoc(doc(db, 'estudiantes', docSnapshot.id), {
            nombrecompleto: nombreCompleto,
            correo: correo,
            telefono: telefono
        });
        alert('Estudiante modificado exitosamente.');
        cerrarFormulario();
        cargarEstudiantes();
    } catch (error) {
        alert('Error al modificar el estudiante: ' + error.message);
    }
});

// Cargar estudiantes al cargar la página
window.onload = function() {
    cargarEstudiantes();
};

//para el menu
const buttonMenu = document.querySelector('#nav-mobile');
const navMenu = document.querySelector('.nav-menu');

buttonMenu.addEventListener('click', (e) => {
  e.currentTarget.classList.toggle('nav-open');
  navMenu.classList.toggle('open-menu');
});

// jQuery Version
$(function() {
    var btn_movil = $('#nav-mobile'),
    menu = $('#menu').find('ul');

    // Al dar click agregar/quitar clases que permiten el despliegue del menú
    btn_movil.on('click', function (e) {
        e.preventDefault();
        var el = $(this);
        el.toggleClass('nav-active');
        menu.toggleClass('open-menu');
    });
});
window.toggleMenu = toggleMenu();
function toggleMenu() {
    const menu = document.querySelector('.nav-menu');
    menu.classList.toggle('open'); // Alternar clase 'open' para mostrar/ocultar el menú
}
