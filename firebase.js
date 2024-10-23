// firebase.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';

const firebaseConfig = {
    apiKey: "AIzaSyDU4xHoJ2Qcdd9gGyAX4UDZE4tAQf-iY3I",
    authDomain: "sistemaintegralcontroldocente.firebaseapp.com",
    databaseURL: "https://sistemaintegralcontroldocente-default-rtdb.firebaseio.com",
    projectId: "sistemaintegralcontroldocente",
    storageBucket: "sistemaintegralcontroldocente.appspot.com",
    messagingSenderId: "728512991525",
    appId: "1:728512991525:web:c7764c65cfc1015f164acc"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Función de inicio de sesión
window.login = function() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, username, password)
        .then((userCredential) => {
            // Sesión iniciada
            alert('Login successful!');
            // Redirigir a menu.html
            window.location.href = "menu.html";
        })
        .catch((error) => {
            const errorMessage = error.message;
            alert(errorMessage);
        });
}

