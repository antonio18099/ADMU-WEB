// import React from "react";
// import "../styles/Dashboard.css";
// import Map from "./Map";
// import routesData from "../data/routesData";
// import Notifications from "./Notifications";

// const Dashboard = () => {
//   return (
//     <div className="dashboard-container">
//       <h1>Bienvenido al Dashboard</h1>

//       <section className="map-section">
//         <h2>Mapa Interactivo</h2>
//         <Map />
//       </section>

//       <section className="routes-section">
//         <h2>Rutas en Tiempo Real</h2>
//         <ul>
//           {routesData.map((route) => (
//             <li key={route.id}>
//               <strong>{route.name}</strong>: De {route.from} a {route.to} ({route.duration}) -{" "}
//               <span style={{ color: route.status.includes("Retraso") ? "red" : "green" }}>
//                 {route.status}
//               </span>
//             </li>
//           ))}
//         </ul>
//       </section>

//       <section className="notifications-section">
//         <Notifications />
//       </section>

//       <p>Aquí puedes mostrar contenido según el rol del usuario.</p>
//     </div>
//   );
// };

// export default Dashboard;


// import React from "react";
// // import "../styles/Dashboard.css"; // Eliminamos la importación del CSS antiguo
// import Map from "./Map";
// import routesData from "../data/routesData";
// import Notifications from "./Notifications";

// // Asume que importarás los iconos de lucide-react así:
// // import { MapPin, ListChecks, Bell } from 'lucide-react';

// const Dashboard = () => {
//   return (
//     // Contenedor principal del dashboard con estilos Tailwind
//     <div className="max-w-5xl mx-auto my-8 p-4 md:p-6 lg:p-8 text-gray-800 dark:text-gray-100">
//       <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
//         Bienvenido al Dashboard
//       </h1>

//       {/* Sección del Mapa */}
//       <section className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg mb-8">
//         <h2 className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center">
//           {/* <MapPin className="h-6 w-6 mr-3 text-blue-600 dark:text-blue-400" /> */}
//           <span className="mr-3">📍</span> {/* Placeholder si no se usa Lucide Icon Component */}
//           Mapa Interactivo
//         </h2>
//         <div className="h-72 md:h-96 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400">
//           {/* El componente Map se renderizará aquí */}
//           <Map /> 
//         </div>
//       </section>

//       {/* Sección de Rutas */}
//       <section className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg mb-8">
//         <h2 className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center">
//           {/* <ListChecks className="h-6 w-6 mr-3 text-green-600 dark:text-green-400" /> */}
//           <span className="mr-3"> маршруты </span> {/* Placeholder si no se usa Lucide Icon Component */}
//           Rutas en Tiempo Real
//         </h2>
//         <ul className="space-y-4">
//           {routesData.map((route) => (
//             <li 
//               key={route.id} 
//               className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center"
//             >
//               <div className="mb-2 sm:mb-0">
//                 <strong className="text-gray-900 dark:text-white text-lg">{route.name}</strong>
//                 <p className="text-sm text-gray-600 dark:text-gray-300">De {route.from} a {route.to} ({route.duration})</p>
//               </div>
//               <span 
//                 className={`px-3 py-1 text-xs font-bold rounded-full 
//                   ${route.status.includes("Retraso") 
//                     ? "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100" 
//                     : "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100"}
//                 `}
//               >
//                 {route.status}
//               </span>
//             </li>
//           ))}
//         </ul>
//       </section>

//       {/* Sección de Notificaciones */}
//       <section className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg mb-8">
//         <h2 className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center">
//           {/* <Bell className="h-6 w-6 mr-3 text-yellow-500 dark:text-yellow-400" /> */}
//           <span className="mr-3">🔔</span> {/* Placeholder si no se usa Lucide Icon Component */}
//           Notificaciones
//         </h2>
//         <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
//           <Notifications /> 
//         </div>
//       </section>

//       <p className="text-md text-gray-500 dark:text-gray-400 text-center mt-10">
//         Aquí puedes mostrar contenido según el rol del usuario.
//       </p>
//     </div>
//   );
// };

// export default Dashboard;



// src/components/Dashboard.jsx
import "../styles/Dashboard.css";
import DashboardMap from "./DashboardMap"; // Importa el nuevo mapa simple para el dashboard
import routesData from "../data/routesData";
import ChatBot from "./ChatBot"; // Importamos el componente ChatBot
// Ya no se importa Notifications aquí, se asume que es una página separada

const Dashboard = () => {
  return (
    <div className="dashboard-container pt-16"> {/* Padding top para Navbar fijo */}
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">Explora las rutas y paraderos de Armenia</h1>

      <section className="map-section mb-8">
        <div className="h-[400px] md:h-[500px] w-full shadow-lg rounded-lg overflow-hidden">
          {/* Usa el nuevo componente de mapa simple para el dashboard */}
          <DashboardMap />
        </div>
      </section>

      <section className="routes-section mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-600">Rutas en Tiempo Real (Información General)</h2>
        <ul className="space-y-2">
          {routesData.map((route) => (
            <li key={route.id} className="p-3 border rounded-lg bg-white shadow-sm">
              <div className="font-semibold text-blue-600">{route.name}</div>
              <div className="text-sm text-gray-600">
                <span>De: {route.from}</span> <span className="mx-1">→</span> <span>A: {route.to}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                <span>Duración: {route.duration}</span>
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${route.status.includes("Retraso") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                  {route.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>
      
      {/* Componente ChatBot */}
      <ChatBot />
    </div>
  );
};

export default Dashboard;

