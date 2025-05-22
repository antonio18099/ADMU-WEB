// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";

// // Tu configuración de Firebase (obtenida del panel de Firebase)
// const firebaseConfig = {
//     apiKey: "AIzaSyAzX41Y6CzCa3paj05MLVibAsPD7Kxyl4c",
//     authDomain: "admu-login.firebaseapp.com",
//     projectId: "admu-login",
//     storageBucket: "admu-login.appspot.com",
//     messagingSenderId: "162328152163",
//     appId: "1:162328152163:web:83e509a02c06a65101d056"
//   };
  
//   // Inicializar Firebase
//   const app = initializeApp(firebaseConfig);
  
//   // Exportar servicio de autenticación
//   export const auth = getAuth(app);
//   export default app;

// nueva configuracion jp
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from 'firebase/firestore'; // Nueva importación para Firestore
// import { getStorage } from "firebase/storage"; // <--- AÑADE ESTA LÍNEA

// // Tu configuración de Firebase (obtenida del panel de Firebase)
// const firebaseConfig = {
//     apiKey: "AIzaSyAzX41Y6CzCa3paj05MLVibAsPD7Kxyl4c",
//     authDomain: "admu-login.firebaseapp.com",
//     projectId: "admu-login",
//     storageBucket: "admu-login.firebasestorage.app",
//     messagingSenderId: "162328152163",
//     appId: "1:162328152163:web:83e509a02c06a65101d056"
//   };
  
//   // Inicializar Firebase
//   const app = initializeApp(firebaseConfig);
  
//   // Exportar servicio de autenticación
//   export const auth = getAuth(app);
//   export const db = getFirestore(app); // Nueva exportación para Firestore
//   export const storage = getStorage(app); // <--- AÑADE ESTA LÍNEA PARA EXPORTAR STORAGE
//   export default app;

// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";

// // Tu configuración de Firebase (obtenida del panel de Firebase)
// const firebaseConfig = {
//     apiKey: "AIzaSyAzX41Y6CzCa3paj05MLVibAsPD7Kxyl4c",
//     authDomain: "admu-login.firebaseapp.com",
//     projectId: "admu-login",
//     storageBucket: "admu-login.appspot.com",
//     messagingSenderId: "162328152163",
//     appId: "1:162328152163:web:83e509a02c06a65101d056"
//   };
  
//   // Inicializar Firebase
//   const app = initializeApp(firebaseConfig);
  
//   // Exportar servicio de autenticación
//   export const auth = getAuth(app);
//   export default app;

// nueva configuracion jp
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore'; // Nueva importación para Firestore
import { getStorage } from "firebase/storage"; // <--- AÑADE ESTA LÍNEA

// Tu configuración de Firebase (obtenida del panel de Firebase)
const firebaseConfig = {
    apiKey: "AIzaSyAzX41Y6CzCa3paj05MLVibAsPD7Kxyl4c",
    authDomain: "admu-login.firebaseapp.com",
    projectId: "admu-login",
    storageBucket: "admu-login.firebasestorage.app",
    messagingSenderId: "162328152163",
    appId: "1:162328152163:web:83e509a02c06a65101d056"
  };
  
  // Inicializar Firebase
  const app = initializeApp(firebaseConfig);
  
  // Exportar servicio de autenticación
  export const auth = getAuth(app);
  export const db = getFirestore(app); // Nueva exportación para Firestore
  export const storage = getStorage(app); // <--- AÑADE ESTA LÍNEA PARA EXPORTAR STORAGE
  export default app;

