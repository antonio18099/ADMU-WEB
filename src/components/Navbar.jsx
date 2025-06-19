import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Map, Bell, User, LogOut, Menu, X, Settings } from 'lucide-react';
import Profile from './Profile';
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists() && userDocSnap.data().rol === "administrador") {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Error al verificar rol de administrador:", error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };
    checkAdminRole();
  }, [user]);

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate('/login');
    }).catch((error) => {
      console.error("Error al cerrar sesión:", error);
    });
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = () => {
    setShowProfile(false); // Cierra el dropdown de perfil
    setIsMenuOpen(false);  // Cierra el menú de hamburguesa
  };

  return (
    <nav className="bg-white shadow-md px-4 py-2 w-full z-50">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo y nombre */}
          <Link to="/dashboard" onClick={handleNavigation} className="flex items-center space-x-2">
            <img src="/icons/parada-Icon.png" alt="ADMU Logo" className="h-8 w-8" />
            <span className="font-bold text-lg text-gray-500">ADMU</span>
          </Link>

          {/* Menú hamburguesa para móviles */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="p-2 text-gray-500 focus:outline-none">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Enlaces para pantallas medianas y grandes */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/dashboard" onClick={handleNavigation} className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
              <Home size={20} />
              <span>Inicio</span>
            </Link>
            <Link to="/map" onClick={handleNavigation} className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
              <Map size={20} />
              <span>Mapa</span>
            </Link>
            <Link to="/notifications" onClick={handleNavigation} className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
              <Bell size={20} />
              <span>Notificaciones</span>
            </Link>
            {isAdmin && (
              <Link to="/admin/usuarios" onClick={handleNavigation} className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
                <Settings size={20} />
                <span>Panel Admin</span>
              </Link>
            )}
            <button onClick={toggleProfile} className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors bg-transparent">
              <User size={20} />
              <span>Perfil</span>
            </button>
            <button onClick={handleLogout} className="flex items-center space-x-1 text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors">
              <LogOut size={20} />
              <span>Salir</span>
            </button>
          </div>
        </div>

        {/* Menú móvil desplegable */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            <Link to="/dashboard" onClick={handleNavigation} className="flex items-center space-x-2 py-2 text-gray-700 hover:text-blue-600">
              <Home size={20} />
              <span>Inicio</span>
            </Link>
            <Link to="/map" onClick={handleNavigation} className="flex items-center space-x-2 py-2 text-gray-700 hover:text-blue-600">
              <Map size={20} />
              <span>Mapa</span>
            </Link>
            <Link to="/notifications" onClick={handleNavigation} className="flex items-center space-x-2 py-2 text-gray-700 hover:text-blue-600">
              <Bell size={20} />
              <span>Notificaciones</span>
            </Link>
            {isAdmin && (
              <Link to="/admin/usuarios" onClick={handleNavigation} className="flex items-center space-x-2 py-2 text-gray-700 hover:text-blue-600 w-full text-left bg-transparent">
                <Settings size={20} />
                <span>Panel Admin</span>
              </Link>
            )}
            <button onClick={toggleProfile} className="flex items-center space-x-2 py-2 text-gray-700 hover:text-blue-600 w-full text-left bg-transparent">
              <User size={20} />
              <span>Perfil</span>
            </button>
            <button onClick={handleLogout} className="flex items-center space-x-2 text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg w-full">
              <LogOut size={20} />
              <span>Salir</span>
            </button>
          </div>
        )}
      </div>

      {/* Dropdown del perfil */}
      {showProfile && (
        <div className="absolute right-4 md:right-8 top-16 bg-white shadow-lg rounded-lg p-4 w-64 z-50">
          <Profile />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
