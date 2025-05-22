// // src/components/Administrador.jsx
// import { Outlet, Link, useLocation } from 'react-router-dom';
// import { LayoutDashboard, Route, MapPin, Users, LogOut } from 'lucide-react'; // Using lucide-react icons
// import { auth } from "../firebase";
// import { signOut } from "firebase/auth";
// import { useNavigate } from 'react-router-dom';

// const AdministradorLayout = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       navigate('/login');
//     } catch (error) {
//       console.error("Error al cerrar sesión:", error);
//     }
//   };

//   const navLinks = [
//     // { to: "/admin", text: "Dashboard Admin", icon: LayoutDashboard, exact: true }, // Or /admin/dashboard
//     { to: "/admin/rutas", text: "Gestión de Rutas", icon: Route },
//     { to: "/admin/paraderos", text: "Gestión de Paraderos", icon: MapPin },
//     { to: "/admin/usuarios", text: "Gestión de Usuarios", icon: Users },
//   ];

//   // Default redirect for /admin to /admin/rutas if no other sub-route matches
//   // This is handled in App.jsx with <Route index element={<Navigate to="rutas" replace />} />

//   return (
//     <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white dark:bg-gray-800 shadow-md flex-shrink-0">
//         <div className="p-6">
//           <Link to="/admin" className="flex items-center space-x-3 text-2xl font-semibold text-gray-800 dark:text-white">
//             {/* <img src="/icons/ADMU-Logo.png" alt="ADMU Logo" className="h-8 w-auto" /> */}
//             <span>ADMU Admin</span>
//           </Link>
//         </div>
//         <nav className="mt-6 px-3">
//           {navLinks.map((link) => {
//             const Icon = link.icon;
//             const isActive = location.pathname === link.to || (link.exact ? location.pathname === link.to : location.pathname.startsWith(link.to) && link.to !== "/admin");
//             return (
//               <Link
//                 key={link.text}
//                 to={link.to}
//                 className={`flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors
//                             ${isActive
//                               ? 'bg-blue-500 text-white dark:bg-blue-600'
//                               : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'}`}
//               >
//                 <Icon className="h-5 w-5" />
//                 <span>{link.text}</span>
//               </Link>
//             );
//           })}
//         </nav>
//         <div className="mt-auto p-3">
//             <button
//                 onClick={handleLogout}
//                 className="flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium w-full
//                            text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 
//                            hover:text-gray-900 dark:hover:text-white transition-colors"
//               >
//                 <LogOut className="h-5 w-5" />
//                 <span>Cerrar Sesión</span>
//             </button>
//         </div>
//       </aside>

//       {/* Main content */}
//       <main className="flex-1 p-6 md:p-10 overflow-y-auto">
//         <Outlet /> {/* Aquí se renderizarán los componentes de las rutas anidadas */}
//       </main>
//     </div>
//   );
// };

// export default AdministradorLayout;


// src/components/Administrador.jsx
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Route, MapPin, Users, LogOut, ArrowLeft } from 'lucide-react'; // Using lucide-react icons
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

const AdministradorLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const navLinks = [
    // { to: "/admin", text: "Dashboard Admin", icon: LayoutDashboard, exact: true }, // Or /admin/dashboard
    { to: "/admin/rutas", text: "Gestión de Rutas", icon: Route },
    { to: "/admin/paraderos", text: "Gestión de Paraderos", icon: MapPin },
    { to: "/admin/usuarios", text: "Gestión de Usuarios", icon: Users },
  ];

  // Default redirect for /admin to /admin/rutas if no other sub-route matches
  // This is handled in App.jsx with <Route index element={<Navigate to="rutas" replace />} />

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md flex-shrink-0">
        <div className="p-6">
          <Link to="/admin" className="flex items-center space-x-3 text-2xl font-semibold text-gray-800 dark:text-white">
            {/* <img src="/icons/ADMU-Logo.png" alt="ADMU Logo" className="h-8 w-auto" /> */}
            <span>ADMU Admin</span>
          </Link>
        </div>
        <nav className="mt-6 px-3">
          {/* Botón Volver al Sitio Web */}
          <Link
            to="/dashboard"
            className="flex items-center space-x-3 px-3 py-2.5 mb-4 rounded-md text-sm font-medium
                      bg-green-500 text-white hover:bg-green-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Volver al Sitio Web</span>
          </Link>

          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to || (link.exact ? location.pathname === link.to : location.pathname.startsWith(link.to) && link.to !== "/admin");
            return (
              <Link
                key={link.text}
                to={link.to}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors
                            ${isActive
                              ? 'bg-blue-500 text-white dark:bg-blue-600'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'}`}
              >
                <Icon className="h-5 w-5" />
                <span>{link.text}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto p-3">
            <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium w-full
                           text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 
                           hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Cerrar Sesión</span>
            </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <Outlet /> {/* Aquí se renderizarán los componentes de las rutas anidadas */}
      </main>
    </div>
  );
};

export default AdministradorLayout;
