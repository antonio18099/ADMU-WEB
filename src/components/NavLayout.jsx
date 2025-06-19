import { Navigate, Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const NavLayout = () => {
  // Aquí puedes agregar lógica para verificar autenticación
  // En una aplicación real, esto estaría conectado a tu estado de autenticación (ej. context, redux)
  const isAuthenticated = true; 

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default NavLayout;