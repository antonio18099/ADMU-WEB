// // src/components/NavLayout.jsx
// import { Navigate, Outlet } from 'react-router-dom';
// import Navbar from './Navbar';

// const NavLayout = () => {
//   // Aquí puedes agregar lógica para verificar autenticación
//   const isAuthenticated = true; // Esto deberás conectarlo con tu sistema de auth

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
//       <main className="container mx-auto px-4 py-8">
//         <Outlet />
//       </main>
//     </div>
//   );
// };

// export default NavLayout;


// src/components/NavLayout.jsx
import { Navigate, Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const NavLayout = () => {
  // Aquí puedes agregar lógica para verificar autenticación
  const isAuthenticated = true; // Esto deberás conectarlo con tu sistema de auth

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default NavLayout;