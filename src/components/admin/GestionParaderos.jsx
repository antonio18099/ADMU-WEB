// // src/components/admin/GestionParaderos.jsx
// import { useState, useEffect } from "react";
// import { db } from "../../firebase"; // Ajusta la ruta a tu firebase.js
// import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, GeoPoint } from "firebase/firestore";
// import { PlusCircle, Edit3, Trash2 } from 'lucide-react'; // Icons

// const GestionParaderos = () => {
//   const [paraderos, setParaderos] = useState([]);
//   const [nombreParadero, setNombreParadero] = useState("");
//   const [latitud, setLatitud] = useState("");
//   const [longitud, setLongitud] = useState("");
//   const [descripcion, setDescripcion] = useState("");
//   const [paraderoEditando, setParaderoEditando] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);

//   const paraderosCollectionRef = collection(db, "paraderos");

//   const obtenerParaderos = async () => {
//     setLoading(true);
//     try {
//       const data = await getDocs(paraderosCollectionRef);
//       setParaderos(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
//     } catch (error) {
//       console.error("Error al obtener paraderos: ", error);
//       alert("Error al cargar los paraderos.");
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     obtenerParaderos();
//   }, []);

//   const limpiarFormulario = () => {
//     setNombreParadero("");
//     setLatitud("");
//     setLongitud("");
//     setDescripcion("");
//     setParaderoEditando(null);
//     setShowForm(false);
//   };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
//     if (!nombreParadero || latitud === "" || longitud === "") {
//       alert("Por favor, completa Nombre, Latitud y Longitud.");
//       return;
//     }
//     const lat = parseFloat(latitud);
//     const lon = parseFloat(longitud);
//     if (isNaN(lat) || isNaN(lon)) {
//         alert("Latitud y Longitud deben ser números válidos.");
//         return;
//     }
//     setLoading(true);
//     try {
//       if (paraderoEditando) {
//         const paraderoDoc = doc(db, "paraderos", paraderoEditando.id);
//         await updateDoc(paraderoDoc, { 
//           nombre: nombreParadero, 
//           ubicacion: new GeoPoint(lat, lon),
//           descripcion: descripcion 
//         });
//         alert("Paradero actualizado exitosamente");
//       } else {
//         await addDoc(paraderosCollectionRef, { 
//           nombre: nombreParadero, 
//           ubicacion: new GeoPoint(lat, lon),
//           descripcion: descripcion
//         });
//         alert("Paradero creado exitosamente");
//       }
//       limpiarFormulario();
//       obtenerParaderos();
//     } catch (error) {
//       console.error("Error al guardar paradero: ", error);
//       alert("Error al guardar el paradero.");
//     }
//     setLoading(false);
//   };

//   const handleEliminarParadero = async (id) => {
//     if (window.confirm("¿Estás seguro de que deseas eliminar este paradero? Considera si está asignado a alguna ruta.")) {
//       setLoading(true);
//       try {
//         const paraderoDoc = doc(db, "paraderos", id);
//         await deleteDoc(paraderoDoc);
//         obtenerParaderos();
//         alert("Paradero eliminado exitosamente");
//       } catch (error) {
//         console.error("Error al eliminar paradero: ", error);
//         alert("Error al eliminar el paradero.");
//       }
//       setLoading(false);
//     }
//   };

//   const seleccionarParaderoParaEditar = (paradero) => {
//     setParaderoEditando(paradero);
//     setNombreParadero(paradero.nombre);
//     if (paradero.ubicacion && typeof paradero.ubicacion.latitude === 'number' && typeof paradero.ubicacion.longitude === 'number') {
//         setLatitud(paradero.ubicacion.latitude.toString());
//         setLongitud(paradero.ubicacion.longitude.toString());
//     } else {
//         setLatitud("");
//         setLongitud("");
//     }
//     setDescripcion(paradero.descripcion || "");
//     setShowForm(true);
//   };

//   return (
//     <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-800 shadow-xl rounded-lg">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">Gestión de Paraderos</h2>
//         <button 
//           onClick={() => { setShowForm(true); setParaderoEditando(null); setNombreParadero(''); setLatitud(''); setLongitud(''); setDescripcion(''); }}
//           className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center transition-colors duration-150"
//         >
//           <PlusCircle size={20} className="mr-2" /> Crear Nuevo Paradero
//         </button>
//       </div>

//       {showForm && (
//         <form onSubmit={handleFormSubmit} className="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md">
//           <h3 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">{paraderoEditando ? "Editar Paradero" : "Crear Nuevo Paradero"}</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label htmlFor="nombreParadero" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre Paradero</label>
//               <input 
//                 type="text" 
//                 id="nombreParadero"
//                 value={nombreParadero} 
//                 onChange={(e) => setNombreParadero(e.target.value)} 
//                 placeholder="Ej: Parada Principal" 
//                 required 
//                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
//               />
//             </div>
//             <div>
//               <label htmlFor="latitud" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Latitud</label>
//               <input 
//                 type="number" 
//                 id="latitud"
//                 step="any"
//                 value={latitud} 
//                 onChange={(e) => setLatitud(e.target.value)} 
//                 placeholder="Ej: 4.60971" 
//                 required 
//                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
//               />
//             </div>
//             <div>
//               <label htmlFor="longitud" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Longitud</label>
//               <input 
//                 type="number" 
//                 id="longitud"
//                 step="any"
//                 value={longitud} 
//                 onChange={(e) => setLongitud(e.target.value)} 
//                 placeholder="Ej: -74.08175" 
//                 required 
//                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
//               />
//             </div>
//             <div className="md:col-span-2">
//               <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción (Opcional)</label>
//               <textarea 
//                 id="descripcion"
//                 value={descripcion} 
//                 onChange={(e) => setDescripcion(e.target.value)} 
//                 placeholder="Ej: Frente al centro comercial, cerca de la entrada principal."
//                 rows="3"
//                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
//               />
//             </div>
//           </div>
//           <div className="mt-6 flex justify-end space-x-3">
//             <button 
//               type="button" 
//               onClick={limpiarFormulario} 
//               className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-md shadow-sm transition-colors duration-150"
//             >
//               Cancelar
//             </button>
//             <button 
//               type="submit" 
//               disabled={loading}
//               className="px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-md shadow-sm flex items-center transition-colors duration-150 disabled:opacity-50"
//             >
//               {loading ? 'Guardando...' : (paraderoEditando ? "Actualizar Paradero" : "Crear Paradero")}
//             </button>
//           </div>
//         </form>
//       )}

//       <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg">
//         <h3 className="text-xl font-semibold text-gray-700 dark:text-white p-4 border-b dark:border-gray-700">Listado de Paraderos</h3>
//         {loading && paraderos.length === 0 ? <p className="p-4 text-gray-500 dark:text-gray-400">Cargando paraderos...</p> : 
//          !loading && paraderos.length === 0 ? <p className="p-4 text-gray-500 dark:text-gray-400">No hay paraderos registrados.</p> : (
//           <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//             <thead className="bg-gray-50 dark:bg-gray-700">
//               <tr>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nombre</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Latitud</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Longitud</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Descripción</th>
//                 <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Acciones</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
//               {paraderos.map((paradero) => (
//                 <tr key={paradero.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{paradero.nombre}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{paradero.ubicacion?.latitude.toFixed(5)}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{paradero.ubicacion?.longitude.toFixed(5)}</td>
//                   <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 dark:text-gray-300 max-w-xs break-words">{paradero.descripcion}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
//                     <button onClick={() => seleccionarParaderoParaEditar(paradero)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-150" title="Editar">
//                       <Edit3 size={18} />
//                     </button>
//                     <button onClick={() => handleEliminarParadero(paradero.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-150" title="Eliminar">
//                       <Trash2 size={18} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// export default GestionParaderos;

// src/components/admin/GestionParaderos.jsx
import { useState, useEffect } from "react";
import { db } from "../../firebase"; // Ajusta la ruta a tu firebase.js
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, GeoPoint, onSnapshot } from "firebase/firestore";
import { PlusCircle, Edit3, Trash2 } from 'lucide-react'; // Icons

const GestionParaderos = () => {
  const [paraderos, setParaderos] = useState([]);
  const [nombreParadero, setNombreParadero] = useState("");
  const [latitud, setLatitud] = useState("");
  const [longitud, setLongitud] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [paraderoEditando, setParaderoEditando] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rutas, setRutas] = useState([]);
  const [rutasSeleccionadas, setRutasSeleccionadas] = useState([]);

  const paraderosCollectionRef = collection(db, "paraderos");
  const rutasCollectionRef = collection(db, "rutas");

  // Obtener paraderos en tiempo real
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(paraderosCollectionRef, (snapshot) => {
      try {
        setParaderos(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      } catch (error) {
        console.error("Error al obtener paraderos: ", error);
        alert("Error al cargar los paraderos.");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [paraderosCollectionRef]);

  // Obtener rutas para asociar a paraderos
  useEffect(() => {
    const obtenerRutas = async () => {
      try {
        const data = await getDocs(rutasCollectionRef);
        setRutas(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      } catch (error) {
        console.error("Error al obtener rutas: ", error);
      }
    };
    obtenerRutas();
  }, [rutasCollectionRef]);

  const limpiarFormulario = () => {
    setNombreParadero("");
    setLatitud("");
    setLongitud("");
    setDescripcion("");
    setRutasSeleccionadas([]);
    setParaderoEditando(null);
    setShowForm(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!nombreParadero || latitud === "" || longitud === "") {
      alert("Por favor, completa Nombre, Latitud y Longitud.");
      return;
    }
    const lat = parseFloat(latitud);
    const lon = parseFloat(longitud);
    if (isNaN(lat) || isNaN(lon)) {
        alert("Latitud y Longitud deben ser números válidos.");
        return;
    }
    setLoading(true);
    try {
      if (paraderoEditando) {
        const paraderoDoc = doc(db, "paraderos", paraderoEditando.id);
        await updateDoc(paraderoDoc, { 
          nombre: nombreParadero, 
          ubicacion: new GeoPoint(lat, lon),
          descripcion: descripcion,
          rutas: rutasSeleccionadas
        });
        
        // Actualizar las rutas que incluyen este paradero
        for (const rutaId of rutasSeleccionadas) {
          const rutaDoc = doc(db, "rutas", rutaId);
          const rutaData = rutas.find(r => r.id === rutaId);
          if (rutaData) {
            const paraderos = rutaData.paraderos || [];
            if (!paraderos.includes(paraderoEditando.id)) {
              await updateDoc(rutaDoc, {
                paraderos: [...paraderos, paraderoEditando.id]
              });
            }
          }
        }
        
        alert("Paradero actualizado exitosamente");
      } else {
        const docRef = await addDoc(paraderosCollectionRef, { 
          nombre: nombreParadero, 
          ubicacion: new GeoPoint(lat, lon),
          descripcion: descripcion,
          rutas: rutasSeleccionadas
        });
        
        // Actualizar las rutas seleccionadas para incluir este paradero
        for (const rutaId of rutasSeleccionadas) {
          const rutaDoc = doc(db, "rutas", rutaId);
          const rutaData = rutas.find(r => r.id === rutaId);
          if (rutaData) {
            const paraderos = rutaData.paraderos || [];
            await updateDoc(rutaDoc, {
              paraderos: [...paraderos, docRef.id]
            });
          }
        }
        
        alert("Paradero creado exitosamente");
      }
      limpiarFormulario();
    } catch (error) {
      console.error("Error al guardar paradero: ", error);
      alert("Error al guardar el paradero.");
    }
    setLoading(false);
  };

  const handleEliminarParadero = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este paradero? Considera si está asignado a alguna ruta.")) {
      setLoading(true);
      try {
        const paraderoDoc = doc(db, "paraderos", id);
        await deleteDoc(paraderoDoc);
        
        // Eliminar el paradero de todas las rutas que lo incluyen
        for (const ruta of rutas) {
          if (ruta.paraderos && ruta.paraderos.includes(id)) {
            const rutaDoc = doc(db, "rutas", ruta.id);
            await updateDoc(rutaDoc, {
              paraderos: ruta.paraderos.filter(p => p !== id)
            });
          }
        }
        
        alert("Paradero eliminado exitosamente");
      } catch (error) {
        console.error("Error al eliminar paradero: ", error);
        alert("Error al eliminar el paradero.");
      }
      setLoading(false);
    }
  };

  const seleccionarParaderoParaEditar = (paradero) => {
    setParaderoEditando(paradero);
    setNombreParadero(paradero.nombre);
    if (paradero.ubicacion && typeof paradero.ubicacion.latitude === 'number' && typeof paradero.ubicacion.longitude === 'number') {
        setLatitud(paradero.ubicacion.latitude.toString());
        setLongitud(paradero.ubicacion.longitude.toString());
    } else {
        setLatitud("");
        setLongitud("");
    }
    setDescripcion(paradero.descripcion || "");
    setRutasSeleccionadas(paradero.rutas || []);
    setShowForm(true);
  };

  const handleRutaChange = (rutaId) => {
    setRutasSeleccionadas(prev => {
      if (prev.includes(rutaId)) {
        return prev.filter(id => id !== rutaId);
      } else {
        return [...prev, rutaId];
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-800 shadow-xl rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">Gestión de Paraderos</h2>
        <button 
          onClick={() => { setShowForm(true); setParaderoEditando(null); setNombreParadero(''); setLatitud(''); setLongitud(''); setDescripcion(''); setRutasSeleccionadas([]); }}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center transition-colors duration-150"
        >
          <PlusCircle size={20} className="mr-2" /> Crear Nuevo Paradero
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleFormSubmit} className="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">{paraderoEditando ? "Editar Paradero" : "Crear Nuevo Paradero"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="nombreParadero" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre Paradero</label>
              <input 
                type="text" 
                id="nombreParadero"
                value={nombreParadero} 
                onChange={(e) => setNombreParadero(e.target.value)} 
                placeholder="Ej: Parada Principal" 
                required 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="latitud" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Latitud</label>
              <input 
                type="number" 
                id="latitud"
                step="any"
                value={latitud} 
                onChange={(e) => setLatitud(e.target.value)} 
                placeholder="Ej: 4.60971" 
                required 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="longitud" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Longitud</label>
              <input 
                type="number" 
                id="longitud"
                step="any"
                value={longitud} 
                onChange={(e) => setLongitud(e.target.value)} 
                placeholder="Ej: -74.08175" 
                required 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción (Opcional)</label>
              <textarea 
                id="descripcion"
                value={descripcion} 
                onChange={(e) => setDescripcion(e.target.value)} 
                placeholder="Ej: Frente al centro comercial, cerca de la entrada principal."
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rutas asociadas</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {rutas.map(ruta => (
                  <div key={ruta.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`ruta-${ruta.id}`}
                      checked={rutasSeleccionadas.includes(ruta.id)}
                      onChange={() => handleRutaChange(ruta.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`ruta-${ruta.id}`} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      {ruta.nombre}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button 
              type="button" 
              onClick={limpiarFormulario} 
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-md shadow-sm transition-colors duration-150"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-md shadow-sm flex items-center transition-colors duration-150 disabled:opacity-50"
            >
              {loading ? 'Guardando...' : (paraderoEditando ? "Actualizar Paradero" : "Crear Paradero")}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-white p-4 border-b dark:border-gray-700">Listado de Paraderos</h3>
        {loading && paraderos.length === 0 ? <p className="p-4 text-gray-500 dark:text-gray-400">Cargando paraderos...</p> : 
         !loading && paraderos.length === 0 ? <p className="p-4 text-gray-500 dark:text-gray-400">No hay paraderos registrados.</p> : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nombre</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Latitud</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Longitud</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Descripción</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rutas</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {paraderos.map((paradero) => (
                <tr key={paradero.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{paradero.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{paradero.ubicacion?.latitude.toFixed(5)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{paradero.ubicacion?.longitude.toFixed(5)}</td>
                  <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 dark:text-gray-300 max-w-xs break-words">{paradero.descripcion}</td>
                  <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 dark:text-gray-300">
                    {paradero.rutas && paradero.rutas.length > 0 ? 
                      rutas.filter(r => paradero.rutas.includes(r.id)).map(r => r.nombre).join(", ") : 
                      "Sin rutas asignadas"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button onClick={() => seleccionarParaderoParaEditar(paradero)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-150" title="Editar">
                      <Edit3 size={18} />
                    </button>
                    <button onClick={() => handleEliminarParadero(paradero.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-150" title="Eliminar">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default GestionParaderos;
