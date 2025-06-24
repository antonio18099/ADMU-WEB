// // src/App.jsx
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// // Componentes principales de la aplicación
// import Login from "./components/Login";
// import Register from "./components/Register";
// import ResetPassword from "./components/ResetPassword"; // Asegúrate de que este componente exista y esté importado
// import Dashboard from "./components/Dashboard";
// import Map from "./components/Map"; // Añadido de la estructura original del usuario
// import Notifications from "./components/Notifications"; // Añadido
// import Profile from "./components/Profile"; // Añadido
// import NotFound from "./components/NotFound"; // Asegúrate de que este componente exista y esté importado

// // Layouts y Protectores de Ruta
// import NavLayout from "./components/NavLayout";
// import ProtectedRoute from "./components/ProtectedRoute";
// import AdminProtectedRoute from "./components/AdminProtectedRoute";
// import AdministradorLayout from "./components/Administrador"; // Este es el Layout para el panel de admin

// // Componentes de Administración
// import GestionRutas from "./components/admin/GestionRutas";
// import GestionParaderos from "./components/admin/GestionParaderos";
// import GestionUsuarios from "./components/admin/GestionUsuarios";
// // import AdminDashboard from './components/admin/AdminDashboard'; // Si decides crear un dashboard específico para admin

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Rutas públicas */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/reset-password" element={<ResetPassword />} />

//         {/* Rutas protegidas para usuarios logueados (envueltas en NavLayout) */}
//         <Route 
//           element={
//             <ProtectedRoute>
//               <NavLayout />
//             </ProtectedRoute>
//           }
//         >
//           <Route index element={<Navigate to="/dashboard" replace />} /> {/* Redirige de / a /dashboard si está en NavLayout */}
//           <Route path="dashboard" element={<Dashboard />} />
//           <Route path="map" element={<Map />} />
//           <Route path="notifications" element={<Notifications />} />
//           <Route path="profile" element={<Profile />} />
//           {/* La ruta /administrador original del usuario se maneja abajo con protección de admin */}
//         </Route>

//         {/* Rutas protegidas para Administradores (envueltas en AdministradorLayout) */}
//         <Route 
//           path="/admin" 
//           element={
//             <AdminProtectedRoute>
//               <AdministradorLayout />
//             </AdminProtectedRoute>
//           }
//         >
//           {/* <Route index element={<AdminDashboard />} /> Podrías tener un dashboard admin aquí */}
//           <Route index element={<Navigate to="rutas" replace />} /> {/* Redirige /admin a /admin/rutas por defecto*/}
//           <Route path="rutas" element={<GestionRutas />} />
//           <Route path="paraderos" element={<GestionParaderos />} />
//           <Route path="usuarios" element={<GestionUsuarios />} />
//         </Route>
        
//         {/* Ruta raíz principal: redirige a login o dashboard según autenticación */}
//         {/* Esta lógica ahora está implícita en ProtectedRoute. Si se accede a "/", ProtectedRoute redirigirá a /login o permitirá el acceso a NavLayout que luego redirige a /dashboard */}
//         {/* Para una redirección explícita en "/" si no hay otras coincidencias antes de NotFound: */}
//         <Route path="/" element={<Navigate to="/login" replace />} /> {/* Esta ruta actuará si no hay usuario logueado, sino ProtectedRoute se encarga*/}


//         {/* Ruta para páginas no encontradas */}
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


// src/App.jsx
// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Componentes principales de la aplicación
import Login from "./components/Login";
import Register from "./components/Register";
import ResetPassword from "./components/ResetPassword"; // Asegúrate de que este componente exista y esté importado
import Dashboard from "./components/Dashboard";
import Map from "./components/Map"; // Añadido de la estructura original del usuario
import Notifications from "./components/Notifications"; // Añadido
import Profile from "./components/Profile"; // Añadido
import NotFound from "./components/NotFound"; // Asegúrate de que este componente exista y esté importado

// Layouts y Protectores de Ruta
import NavLayout from "./components/NavLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import AdministradorLayout from "./components/Administrador"; // Este es el Layout para el panel de admin

// Componentes de Administración
import GestionRutas from "./components/admin/GestionRutas";
import GestionParaderos from "./components/admin/GestionParaderos";
import GestionUsuarios from "./components/admin/GestionUsuarios";
import GestionTarifas from './components/admin/GestionTarifas';
// import AdminDashboard from './components/admin/AdminDashboard'; // Si decides crear un dashboard específico para admin

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Rutas protegidas para usuarios logueados (envueltas en NavLayout) */}
        <Route 
          element={
            <ProtectedRoute>
              <NavLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} /> {/* Redirige de / a /dashboard si está en NavLayout */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="map" element={<Map />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
          {/* La ruta /administrador original del usuario se maneja abajo con protección de admin */}
        </Route>

        {/* Rutas protegidas para Administradores (envueltas en AdministradorLayout) */}
        <Route 
          path="/admin" 
          element={
            <AdminProtectedRoute>
              <AdministradorLayout />
            </AdminProtectedRoute>
          }
        >
          {/* <Route index element={<AdminDashboard />} /> Podrías tener un dashboard admin aquí */}
          <Route index element={<Navigate to="rutas" replace />} /> {/* Redirige /admin a /admin/rutas por defecto*/}
          <Route path="rutas" element={<GestionRutas />} />
          <Route path="paraderos" element={<GestionParaderos />} />
          <Route path="usuarios" element={<GestionUsuarios />} />
          <Route path="/admin/tarifas" element={<GestionTarifas />} />
        </Route>
        
        {/* Ruta raíz principal: redirige a login o dashboard según autenticación */}
        {/* Esta lógica ahora está implícita en ProtectedRoute. Si se accede a "/", ProtectedRoute redirigirá a /login o permitirá el acceso a NavLayout que luego redirige a /dashboard */}
        {/* Para una redirección explícita en "/" si no hay otras coincidencias antes de NotFound: */}
        <Route path="/" element={<Navigate to="/login" replace />} /> {/* Esta ruta actuará si no hay usuario logueado, sino ProtectedRoute se encarga*/}


        {/* Ruta para páginas no encontradas */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
