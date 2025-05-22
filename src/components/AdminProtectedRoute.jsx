// // src/components/AdminProtectedRoute.jsx
// import { Navigate } from "react-router-dom";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { auth, db } from "../firebase"; // Asumiendo que db es tu instancia de Firestore
// import { doc, getDoc } from "firebase/firestore";
// import { useEffect, useState } from "react";

// const AdminProtectedRoute = ({ children }) => {
//   const [user, loadingAuth] = useAuthState(auth);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [loadingRole, setLoadingRole] = useState(true);

//   useEffect(() => {
//     const fetchUserRole = async () => {
//       if (user) {
//         try {
//           const userDocRef = doc(db, "users", user.uid); // Cambiado de "usuarios" a "users"
//           const userDocSnap = await getDoc(userDocRef);
//           if (userDocSnap.exists() && userDocSnap.data().rol === "administrador") {
//             setIsAdmin(true);
//           } else {
//             setIsAdmin(false); // No es admin o no tiene rol definido
//           }
//         } catch (error) {
//           console.error("Error fetching user role:", error);
//           setIsAdmin(false);
//         }
//       }
//       setLoadingRole(false);
//     };

//     if (!loadingAuth) {
//       fetchUserRole();
//     } else {
//       // Si la autenticación aún está cargando, el rol también debe esperar.
//       setLoadingRole(true);
//     }
//   }, [user, loadingAuth]);

//   if (loadingAuth || loadingRole) {
//     return <div className="loading-container flex justify-center items-center min-h-screen text-gray-700 dark:text-gray-300">Cargando acceso...</div>;
//   }

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   if (!isAdmin) {
//     // Podrías redirigir a una página específica de "Acceso Denegado" o al dashboard general.
//     // Por ahora, redirigimos al dashboard general si no es admin.
//     return <Navigate to="/dashboard" replace />;
//   }

//   return children;
// };

// export default AdminProtectedRoute;


// src/components/AdminProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase"; // Asumiendo que db es tu instancia de Firestore
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const AdminProtectedRoute = ({ children }) => {
  const [user, loadingAuth] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingRole, setLoadingRole] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid); // Cambiado de "usuarios" a "users"
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists() && userDocSnap.data().rol === "administrador") {
            setIsAdmin(true);
          } else {
            setIsAdmin(false); // No es admin o no tiene rol definido
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setIsAdmin(false);
        }
      }
      setLoadingRole(false);
    };

    if (!loadingAuth) {
      fetchUserRole();
    } else {
      // Si la autenticación aún está cargando, el rol también debe esperar.
      setLoadingRole(true);
    }
  }, [user, loadingAuth]);

  if (loadingAuth || loadingRole) {
    return <div className="loading-container flex justify-center items-center min-h-screen text-gray-700 dark:text-gray-300">Cargando acceso...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    // Podrías redirigir a una página específica de "Acceso Denegado" o al dashboard general.
    // Por ahora, redirigimos al dashboard general si no es admin.
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

AdminProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminProtectedRoute;

