import { useState, useEffect } from "react";
import { db, auth } from "../../firebase"; // Ajusta la ruta a tu firebase.js
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  deleteDoc
} from "firebase/firestore";
import { Users, ShieldCheck } from "lucide-react";

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user);
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setCurrentUserRole(userDocSnap.data().rol);
        } else {
          setCurrentUserRole(null);
        }
      } else {
        setCurrentUser(null);
        setCurrentUserRole(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const obtenerUsuarios = async () => {
    setLoading(true);
    try {
      const usuariosCollectionRef = collection(db, "users");
      const data = await getDocs(usuariosCollectionRef);
      setUsuarios(
        data.docs.map((doc) => ({ ...doc.data(), id: doc.id, uid: doc.id }))
      );
    } catch (error) {
      console.error("Error al obtener usuarios: ", error);
      alert("Error al cargar la lista de usuarios.");
    }
    setLoading(false);
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const handleChangeRole = async (userIdToChange, nuevoRol) => {
    if (currentUserRole !== "administrador") {
      alert("No tienes permisos para cambiar roles.");
      return;
    }

    if (!userIdToChange || !nuevoRol) {
      alert("Información incompleta para cambiar el rol.");
      return;
    }

    if (
      currentUser &&
      currentUser.uid === userIdToChange &&
      nuevoRol !== "administrador"
    ) {
      const admins = usuarios.filter((u) => u.rol === "administrador");
      if (admins.length === 1 && admins[0].id === userIdToChange) {
        alert(
          "No puedes quitarte el rol de administrador si eres el único."
        );
        obtenerUsuarios();
        return;
      }
    }

    if (
      window.confirm(
        `¿Estás seguro de cambiar el rol del usuario a ${nuevoRol}?`
      )
    ) {
      setLoading(true);
      const usuarioDoc = doc(db, "users", userIdToChange);
      try {
        await updateDoc(usuarioDoc, { rol: nuevoRol });
        setUsuarios(
          usuarios.map((u) =>
            u.id === userIdToChange ? { ...u, rol: nuevoRol } : u
          )
        );
        alert("Rol de usuario actualizado exitosamente.");
      } catch (error) {
        console.error("Error al actualizar rol: ", error);
        alert("Error al actualizar el rol del usuario.");
      }
      setLoading(false);
    }
  };

  const handleVerInfo = (usuario) => {
    alert(
      `Información del Usuario:\n\n` +
        `Email: ${usuario.email}\n` +
        `Nombre: ${usuario.nombre || "No especificado"}\n` +
        `Rol: ${usuario.rol || "No asignado"}\n` +
        `UID: ${usuario.id}`
    );
  };

  const handleEliminarUsuario = async (userIdToDelete) => {
    if (currentUserRole !== "administrador") {
      alert("No tienes permisos para eliminar usuarios.");
      return;
    }

    if (currentUser && currentUser.uid === userIdToDelete) {
      alert("No puedes eliminar tu propio usuario mientras estás logueado.");
      return;
    }

    if (
      window.confirm(
        "¿Estás seguro de eliminar este usuario? Esta acción es irreversible."
      )
    ) {
      setLoading(true);
      try {
        await deleteDoc(doc(db, "users", userIdToDelete));
        setUsuarios(usuarios.filter((u) => u.id !== userIdToDelete));
        alert("Usuario eliminado correctamente.");
      } catch (error) {
        console.error("Error al eliminar usuario: ", error);
        alert("Error al eliminar el usuario.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-800 shadow-xl rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">
          Gestión de Usuarios
        </h2>
      </div>

      {currentUserRole !== "administrador" && !loading && (
        <div
          className="p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300"
          role="alert"
        >
          <span className="font-medium">Acceso Restringido:</span> Solo los
          administradores pueden modificar roles.
        </div>
      )}

      <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-white p-4 border-b dark:border-gray-700">
          Listado de Usuarios Registrados
        </h3>
        {loading ? (
          <p className="p-4 text-gray-500 dark:text-gray-400">
            Cargando usuarios...
          </p>
        ) : usuarios.length === 0 ? (
          <p className="p-4 text-gray-500 dark:text-gray-400">
            No hay usuarios registrados en la colección &apos;users&apos;.
          </p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Rol Actual
                </th>
                {currentUserRole === "administrador" && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Cambiar Rol A
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Acciones
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {usuarios.map((usuario) => (
                <tr
                  key={usuario.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {usuario.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {usuario.nombre || "No especificado"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                    ${
                      usuario.rol === "administrador"
                        ? "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100"
                    }`}
                    >
                      {usuario.rol === "administrador" ? (
                        <ShieldCheck size={14} className="mr-1" />
                      ) : (
                        <Users size={14} className="mr-1" />
                      )}
                      {usuario.rol || "No asignado"}
                    </span>
                  </td>
                  {currentUserRole === "administrador" && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        <select
                          value={usuario.rol || "usuario"}
                          onChange={(e) =>
                            handleChangeRole(usuario.id, e.target.value)
                          }
                          disabled={
                            loading ||
                            (currentUser &&
                              currentUser.uid === usuario.id &&
                              usuario.rol === "administrador" &&
                              Array.isArray(usuarios) &&
                              usuarios.filter(
                                (u) => u.rol === "administrador"
                              ).length <= 1)
                          }
                          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white disabled:opacity-70"
                        >
                          <option value="usuario">Usuario</option>
                          <option value="administrador">Administrador</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 flex gap-2">
                        <button
                          onClick={() => handleVerInfo(usuario)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => handleEliminarUsuario(usuario.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                        >
                          Eliminar
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 dark:border-yellow-500 rounded-md">
        <p className="text-sm text-yellow-700 dark:text-yellow-200">
          <strong>Instrucciones para el Administrador Principal:</strong> Para
          asegurar el control de roles, el primer usuario administrador debe
          ser configurado manualmente en Firestore. Asegúrate de que tu
          documento de usuario en la colección `users` (con tu UID como ID del
          documento) tenga un campo `rol` con el valor &quot;administrador&quot;. Una
          vez configurado, podrás gestionar los roles de otros usuarios desde
          esta interfaz.
        </p>
      </div>
    </div>
  );
};

export default GestionUsuarios;
