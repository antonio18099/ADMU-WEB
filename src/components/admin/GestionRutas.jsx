// // src/components/admin/GestionRutas.jsx
// import { useState, useEffect } from "react";
// import { db } from "../../firebase"; // Ajusta la ruta a tu firebase.js
// import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
// import { PlusCircle, Edit3, Trash2, XCircle } from 'lucide-react'; // Icons

// const GestionRutas = () => {
//   const [rutas, setRutas] = useState([]);
//   const [nombreRuta, setNombreRuta] = useState("");
//   const [origen, setOrigen] = useState("");
//   const [destino, setDestino] = useState("");
//   const [duracionEstimada, setDuracionEstimada] = useState("");
//   const [estadoRuta, setEstadoRuta] = useState("Activa");
//   const [rutaEditando, setRutaEditando] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);

//   const rutasCollectionRef = collection(db, "rutas");

//   const obtenerRutas = async () => {
//     setLoading(true);
//     try {
//       const data = await getDocs(rutasCollectionRef);
//       setRutas(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
//     } catch (error) {
//       console.error("Error al obtener rutas: ", error);
//       alert("Error al cargar las rutas.");
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     obtenerRutas();
//   }, []);

//   const limpiarFormulario = () => {
//     setNombreRuta("");
//     setOrigen("");
//     setDestino("");
//     setDuracionEstimada("");
//     setEstadoRuta("Activa");
//     setRutaEditando(null);
//     setShowForm(false);
//   };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
//     if (!nombreRuta || !origen || !destino) {
//       alert("Por favor, completa los campos obligatorios: Nombre, Origen y Destino.");
//       return;
//     }
//     setLoading(true);
//     try {
//       if (rutaEditando) {
//         const rutaDoc = doc(db, "rutas", rutaEditando.id);
//         await updateDoc(rutaDoc, { 
//           nombre: nombreRuta, 
//           origen: origen,
//           destino: destino,
//           duracionEstimada: duracionEstimada,
//           estado: estadoRuta 
//         });
//         alert("Ruta actualizada exitosamente");
//       } else {
//         await addDoc(rutasCollectionRef, { 
//           nombre: nombreRuta, 
//           origen: origen,
//           destino: destino,
//           duracionEstimada: duracionEstimada,
//           estado: estadoRuta,
//           paraderos: [] 
//         });
//         alert("Ruta creada exitosamente");
//       }
//       limpiarFormulario();
//       obtenerRutas(); // Recargar rutas
//     } catch (error) {
//       console.error("Error al guardar ruta: ", error);
//       alert("Error al guardar la ruta.");
//     }
//     setLoading(false);
//   };

//   const handleEliminarRuta = async (id) => {
//     if (window.confirm("¿Estás seguro de que deseas eliminar esta ruta?")) {
//       setLoading(true);
//       try {
//         const rutaDoc = doc(db, "rutas", id);
//         await deleteDoc(rutaDoc);
//         obtenerRutas(); // Recargar rutas
//         alert("Ruta eliminada exitosamente");
//       } catch (error) {
//         console.error("Error al eliminar ruta: ", error);
//         alert("Error al eliminar la ruta.");
//       }
//       setLoading(false);
//     }
//   };

//   const seleccionarRutaParaEditar = (ruta) => {
//     setRutaEditando(ruta);
//     setNombreRuta(ruta.nombre);
//     setOrigen(ruta.origen);
//     setDestino(ruta.destino);
//     setDuracionEstimada(ruta.duracionEstimada || "");
//     setEstadoRuta(ruta.estado || "Activa");
//     setShowForm(true);
//   };

//   return (
//     <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-800 shadow-xl rounded-lg">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">Gestión de Rutas</h2>
//         <button 
//           onClick={() => { setShowForm(true); setRutaEditando(null); setNombreRuta(''); setOrigen(''); setDestino(''); setDuracionEstimada(''); setEstadoRuta('Activa');}}
//           className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center transition-colors duration-150"
//         >
//           <PlusCircle size={20} className="mr-2" /> Crear Nueva Ruta
//         </button>
//       </div>

//       {showForm && (
//         <form onSubmit={handleFormSubmit} className="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md">
//           <h3 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">{rutaEditando ? "Editar Ruta" : "Crear Nueva Ruta"}</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label htmlFor="nombreRuta" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre Ruta</label>
//               <input 
//                 type="text" 
//                 id="nombreRuta"
//                 value={nombreRuta} 
//                 onChange={(e) => setNombreRuta(e.target.value)} 
//                 placeholder="Ej: Ruta 101" 
//                 required 
//                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
//               />
//             </div>
//             <div>
//               <label htmlFor="origen" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Origen</label>
//               <input 
//                 type="text" 
//                 id="origen"
//                 value={origen} 
//                 onChange={(e) => setOrigen(e.target.value)} 
//                 placeholder="Ej: Terminal Norte" 
//                 required 
//                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
//               />
//             </div>
//             <div>
//               <label htmlFor="destino" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Destino</label>
//               <input 
//                 type="text" 
//                 id="destino"
//                 value={destino} 
//                 onChange={(e) => setDestino(e.target.value)} 
//                 placeholder="Ej: Centro Comercial" 
//                 required 
//                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
//               />
//             </div>
//             <div>
//               <label htmlFor="duracionEstimada" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duración Estimada</label>
//               <input 
//                 type="text" 
//                 id="duracionEstimada"
//                 value={duracionEstimada} 
//                 onChange={(e) => setDuracionEstimada(e.target.value)} 
//                 placeholder="Ej: 30 minutos" 
//                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
//               />
//             </div>
//             <div>
//               <label htmlFor="estadoRuta" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado</label>
//               <select id="estadoRuta" value={estadoRuta} onChange={(e) => setEstadoRuta(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white">
//                 <option value="Activa">Activa</option>
//                 <option value="Inactiva">Inactiva</option>
//                 <option value="Mantenimiento">Mantenimiento</option>
//               </select>
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
//               {loading ? 'Guardando...' : (rutaEditando ? 'Actualizar Ruta' : 'Crear Ruta')}
//             </button>
//           </div>
//         </form>
//       )}

//       <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg">
//         <h3 className="text-xl font-semibold text-gray-700 dark:text-white p-4 border-b dark:border-gray-700">Listado de Rutas</h3>
//         {loading && rutas.length === 0 ? <p className="p-4 text-gray-500 dark:text-gray-400">Cargando rutas...</p> : 
//          !loading && rutas.length === 0 ? <p className="p-4 text-gray-500 dark:text-gray-400">No hay rutas registradas.</p> : (
//           <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//             <thead className="bg-gray-50 dark:bg-gray-700">
//               <tr>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nombre</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Origen</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Destino</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Duración</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Estado</th>
//                 <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Acciones</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
//               {rutas.map((ruta) => (
//                 <tr key={ruta.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{ruta.nombre}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{ruta.origen}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{ruta.destino}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{ruta.duracionEstimada}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm">
//                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
//                                       ${ruta.estado === 'Activa' ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100' : 
//                                         ruta.estado === 'Inactiva' ? 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100' : 
//                                         'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100'}`}>
//                       {ruta.estado}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
//                     <button onClick={() => seleccionarRutaParaEditar(ruta)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-150" title="Editar">
//                       <Edit3 size={18} />
//                     </button>
//                     <button onClick={() => handleEliminarRuta(ruta.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-150" title="Eliminar">
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

// export default GestionRutas;


// src/components/admin/GestionRutas.jsx
// src/components/admin/GestionRutas.jsx
import { useState, useEffect } from "react";
import { db } from "../../firebase"; // Ajusta la ruta a tu firebase.js
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { PlusCircle, Edit3, Trash2, Plus, X, MapPin } from 'lucide-react'; // Icons

const GestionRutas = () => {
  const [rutas, setRutas] = useState([]);
  const [nombreRuta, setNombreRuta] = useState("");
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [duracionEstimada, setDuracionEstimada] = useState("");
  const [estadoRuta, setEstadoRuta] = useState("Activa");
  const [rutaEditando, setRutaEditando] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Nuevos estados para el recorrido
  const [recorrido, setRecorrido] = useState([]);
  const [nuevoPunto, setNuevoPunto] = useState({
    id: "",
    nombre: "",
    latitud: "",
    longitud: "",
    isParadero: false
  });
  const [paraderos, setParaderos] = useState([]);
  const [paraderosSeleccionados, setParaderosSeleccionados] = useState([]);

  const rutasCollectionRef = collection(db, "rutas");
  const paraderosCollectionRef = collection(db, "paraderos");

  // Obtener rutas en tiempo real
  useEffect(() => {
    const unsubscribe = onSnapshot(rutasCollectionRef, (snapshot) => {
      try {
        setRutas(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      } catch (error) {
        console.error("Error al obtener rutas: ", error);
        alert("Error al cargar las rutas.");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Obtener paraderos para asociar a rutas
  useEffect(() => {
    const obtenerParaderos = async () => {
      try {
        const data = await getDocs(paraderosCollectionRef);
        setParaderos(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      } catch (error) {
        console.error("Error al obtener paraderos: ", error);
      }
    };
    obtenerParaderos();
  }, []);

  const limpiarFormulario = () => {
    setNombreRuta("");
    setOrigen("");
    setDestino("");
    setDuracionEstimada("");
    setEstadoRuta("Activa");
    setRutaEditando(null);
    setRecorrido([]);
    setParaderosSeleccionados([]);
    setShowForm(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!nombreRuta || !origen || !destino) {
      alert("Por favor, completa los campos obligatorios: Nombre, Origen y Destino.");
      return;
    }
    
    // Validar que el recorrido tenga al menos dos puntos
    if (recorrido.length < 2) {
      alert("El recorrido debe tener al menos dos puntos (origen y destino).");
      return;
    }
    
    setLoading(true);
    try {
      if (rutaEditando) {
        const rutaDoc = doc(db, "rutas", rutaEditando.id);
        await updateDoc(rutaDoc, { 
          nombre: nombreRuta, 
          origen: origen,
          destino: destino,
          duracionEstimada: duracionEstimada,
          estado: estadoRuta,
          paraderos: paraderosSeleccionados,
          recorrido: recorrido
        });
        
        // Actualizar los paraderos que están en esta ruta
        for (const paraderoId of paraderosSeleccionados) {
          const paraderoDoc = doc(db, "paraderos", paraderoId);
          const paraderoData = paraderos.find(p => p.id === paraderoId);
          if (paraderoData) {
            const rutasParadero = paraderoData.rutas || [];
            if (!rutasParadero.includes(rutaEditando.id)) {
              await updateDoc(paraderoDoc, {
                rutas: [...rutasParadero, rutaEditando.id]
              });
            }
          }
        }
        
        alert("Ruta actualizada exitosamente");
      } else {
        const docRef = await addDoc(rutasCollectionRef, { 
          nombre: nombreRuta, 
          origen: origen,
          destino: destino,
          duracionEstimada: duracionEstimada,
          estado: estadoRuta,
          paraderos: paraderosSeleccionados,
          recorrido: recorrido
        });
        
        // Actualizar los paraderos que están en esta ruta
        for (const paraderoId of paraderosSeleccionados) {
          const paraderoDoc = doc(db, "paraderos", paraderoId);
          const paraderoData = paraderos.find(p => p.id === paraderoId);
          if (paraderoData) {
            const rutasParadero = paraderoData.rutas || [];
            await updateDoc(paraderoDoc, {
              rutas: [...rutasParadero, docRef.id]
            });
          }
        }
        
        alert("Ruta creada exitosamente");
      }
      limpiarFormulario();
    } catch (error) {
      console.error("Error al guardar ruta: ", error);
      alert("Error al guardar la ruta.");
    }
    setLoading(false);
  };

  const handleEliminarRuta = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta ruta?")) {
      setLoading(true);
      try {
        // Primero, eliminar la referencia de esta ruta en los paraderos asociados
        const rutaData = rutas.find(r => r.id === id);
        if (rutaData && rutaData.paraderos) {
          for (const paraderoId of rutaData.paraderos) {
            const paraderoDoc = doc(db, "paraderos", paraderoId);
            const paraderoData = paraderos.find(p => p.id === paraderoId);
            if (paraderoData && paraderoData.rutas) {
              await updateDoc(paraderoDoc, {
                rutas: paraderoData.rutas.filter(rutaId => rutaId !== id)
              });
            }
          }
        }
        
        // Luego, eliminar la ruta
        const rutaDoc = doc(db, "rutas", id);
        await deleteDoc(rutaDoc);
        alert("Ruta eliminada exitosamente");
      } catch (error) {
        console.error("Error al eliminar ruta: ", error);
        alert("Error al eliminar la ruta.");
      }
      setLoading(false);
    }
  };

  const seleccionarRutaParaEditar = (ruta) => {
    setRutaEditando(ruta);
    setNombreRuta(ruta.nombre);
    setOrigen(ruta.origen);
    setDestino(ruta.destino);
    setDuracionEstimada(ruta.duracionEstimada || "");
    setEstadoRuta(ruta.estado || "Activa");
    setParaderosSeleccionados(ruta.paraderos || []);
    setRecorrido(ruta.recorrido || []);
    setShowForm(true);
  };

  const handleAgregarPuntoRecorrido = () => {
    if (!nuevoPunto.nombre || !nuevoPunto.latitud || !nuevoPunto.longitud) {
      alert("Por favor, completa todos los campos del punto de recorrido.");
      return;
    }
    
    const lat = parseFloat(nuevoPunto.latitud);
    const lon = parseFloat(nuevoPunto.longitud);
    if (isNaN(lat) || isNaN(lon)) {
      alert("Latitud y Longitud deben ser números válidos.");
      return;
    }
    
    // Si es un paradero, usar el ID del paradero
    let puntoId = nuevoPunto.id;
    if (nuevoPunto.isParadero && !puntoId) {
      alert("Por favor, selecciona un paradero existente.");
      return;
    }
    
    // Si no es un paradero, generar un ID único
    if (!nuevoPunto.isParadero) {
      puntoId = `punto-${Date.now()}`;
    }
    
    const nuevoPuntoCompleto = {
      id: puntoId,
      nombre: nuevoPunto.nombre,
      latitud: lat,
      longitud: lon,
      isParadero: nuevoPunto.isParadero
    };
    
    setRecorrido([...recorrido, nuevoPuntoCompleto]);
    
    // Si es un paradero, añadirlo a la lista de paraderos seleccionados
    if (nuevoPunto.isParadero && !paraderosSeleccionados.includes(puntoId)) {
      setParaderosSeleccionados([...paraderosSeleccionados, puntoId]);
    }
    
    // Limpiar el formulario de nuevo punto
    setNuevoPunto({
      id: "",
      nombre: "",
      latitud: "",
      longitud: "",
      isParadero: false
    });
  };

  const handleEliminarPuntoRecorrido = (index) => {
    const nuevosRecorridos = [...recorrido];
    const puntoEliminado = nuevosRecorridos[index];
    nuevosRecorridos.splice(index, 1);
    setRecorrido(nuevosRecorridos);
    
    // Si era un paradero, eliminarlo de la lista de paraderos seleccionados
    if (puntoEliminado.isParadero) {
      setParaderosSeleccionados(paraderosSeleccionados.filter(id => id !== puntoEliminado.id));
    }
  };

  const handleSeleccionarParadero = (e) => {
    const paraderoId = e.target.value;
    if (paraderoId === "") return;
    
    const paraderoSeleccionado = paraderos.find(p => p.id === paraderoId);
    if (paraderoSeleccionado) {
      setNuevoPunto({
        id: paraderoSeleccionado.id,
        nombre: paraderoSeleccionado.nombre,
        latitud: paraderoSeleccionado.latitud || (paraderoSeleccionado.ubicacion ? paraderoSeleccionado.ubicacion.latitude : ""),
        longitud: paraderoSeleccionado.longitud || (paraderoSeleccionado.ubicacion ? paraderoSeleccionado.ubicacion.longitude : ""),
        isParadero: true
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-800 shadow-xl rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">Gestión de Rutas</h2>
        <button 
          onClick={() => { setShowForm(true); setRutaEditando(null); setNombreRuta(''); setOrigen(''); setDestino(''); setDuracionEstimada(''); setEstadoRuta('Activa'); setRecorrido([]); setParaderosSeleccionados([]);}}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center transition-colors duration-150"
        >
          <PlusCircle size={20} className="mr-2" /> Crear Nueva Ruta
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleFormSubmit} className="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">{rutaEditando ? "Editar Ruta" : "Crear Nueva Ruta"}</h3>
          
          {/* Información básica de la ruta */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="nombreRuta" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre Ruta</label>
              <input 
                type="text" 
                id="nombreRuta"
                value={nombreRuta} 
                onChange={(e) => setNombreRuta(e.target.value)} 
                placeholder="Ej: Ruta 101" 
                required 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="origen" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Origen</label>
              <input 
                type="text" 
                id="origen"
                value={origen} 
                onChange={(e) => setOrigen(e.target.value)} 
                placeholder="Ej: Terminal Norte" 
                required 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="destino" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Destino</label>
              <input 
                type="text" 
                id="destino"
                value={destino} 
                onChange={(e) => setDestino(e.target.value)} 
                placeholder="Ej: Centro Comercial" 
                required 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="duracionEstimada" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duración Estimada</label>
              <input 
                type="text" 
                id="duracionEstimada"
                value={duracionEstimada} 
                onChange={(e) => setDuracionEstimada(e.target.value)} 
                placeholder="Ej: 30 minutos" 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="estadoRuta" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado</label>
              <select id="estadoRuta" value={estadoRuta} onChange={(e) => setEstadoRuta(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white">
                <option value="Activa">Activa</option>
                <option value="Inactiva">Inactiva</option>
                <option value="Mantenimiento">Mantenimiento</option>
              </select>
            </div>
          </div>
          
          {/* Sección de recorrido */}
          <div className="mt-8 border-t pt-6 border-gray-200 dark:border-gray-600">
            <h4 className="text-lg font-medium text-gray-700 dark:text-white mb-4">Recorrido de la Ruta</h4>
            
            {/* Formulario para añadir puntos al recorrido */}
            <div className="bg-gray-100 dark:bg-gray-600 p-4 rounded-lg mb-4">
              <h5 className="text-md font-medium text-gray-700 dark:text-white mb-3">Añadir Punto al Recorrido</h5>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="flex items-center mb-2">
                    <input 
                      type="checkbox" 
                      checked={nuevoPunto.isParadero} 
                      onChange={(e) => setNuevoPunto({...nuevoPunto, isParadero: e.target.checked, id: ""})} 
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Es un paradero existente</span>
                  </label>
                  
                  {nuevoPunto.isParadero ? (
                    <div>
                      <label htmlFor="paraderoSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Seleccionar Paradero</label>
                      <select 
                        id="paraderoSelect" 
                        onChange={handleSeleccionarParadero}
                        value={nuevoPunto.id || ""}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                      >
                        <option value="">Selecciona un paradero</option>
                        {paraderos.map(paradero => (
                          <option key={paradero.id} value={paradero.id}>
                            {paradero.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label htmlFor="nombrePunto" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre del Punto</label>
                      <input 
                        type="text" 
                        id="nombrePunto"
                        value={nuevoPunto.nombre} 
                        onChange={(e) => setNuevoPunto({...nuevoPunto, nombre: e.target.value})} 
                        placeholder="Ej: Punto intermedio 1" 
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="latitudPunto" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Latitud</label>
                    <input 
                      type="number" 
                      id="latitudPunto"
                      step="any"
                      value={nuevoPunto.latitud} 
                      onChange={(e) => setNuevoPunto({...nuevoPunto, latitud: e.target.value})} 
                      placeholder="Ej: 4.60971" 
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="longitudPunto" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Longitud</label>
                    <input 
                      type="number" 
                      id="longitudPunto"
                      step="any"
                      value={nuevoPunto.longitud} 
                      onChange={(e) => setNuevoPunto({...nuevoPunto, longitud: e.target.value})} 
                      placeholder="Ej: -74.08175" 
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button 
                  type="button" 
                  onClick={handleAgregarPuntoRecorrido}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md shadow-sm flex items-center transition-colors duration-150"
                >
                  <Plus size={16} className="mr-1" /> Añadir Punto
                </button>
              </div>
            </div>
            
            {/* Lista de puntos del recorrido */}
            <div className="mt-4">
              <h5 className="text-md font-medium text-gray-700 dark:text-white mb-2">Puntos del Recorrido ({recorrido.length})</h5>
              
              {recorrido.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">No hay puntos en el recorrido. Añade al menos el origen y destino.</p>
              ) : (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Orden</th>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nombre</th>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Coordenadas</th>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tipo</th>
                        <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {recorrido.map((punto, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{index + 1}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{punto.nombre}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {punto.latitud.toFixed(5)}, {punto.longitud.toFixed(5)}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">
                            {punto.isParadero ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100">
                                Paradero
                              </span>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-100">
                                Punto
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                              type="button"
                              onClick={() => handleEliminarPuntoRecorrido(index)}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-150"
                              title="Eliminar punto"
                            >
                              <X size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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
              {loading ? 'Guardando...' : (rutaEditando ? 'Actualizar Ruta' : 'Crear Ruta')}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-white p-4 border-b dark:border-gray-700">Listado de Rutas</h3>
        {loading && rutas.length === 0 ? <p className="p-4 text-gray-500 dark:text-gray-400">Cargando rutas...</p> : 
         !loading && rutas.length === 0 ? <p className="p-4 text-gray-500 dark:text-gray-400">No hay rutas registradas.</p> : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nombre</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Origen</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Destino</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Duración</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Estado</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Puntos</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {rutas.map((ruta) => (
                <tr key={ruta.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{ruta.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{ruta.origen}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{ruta.destino}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{ruta.duracionEstimada}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                      ${ruta.estado === 'Activa' ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100' : 
                                        ruta.estado === 'Inactiva' ? 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100' : 
                                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100'}`}>
                      {ruta.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {ruta.recorrido ? ruta.recorrido.length : 0} puntos
                    {ruta.paraderos ? ` / ${ruta.paraderos.length} paraderos` : ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button onClick={() => seleccionarRutaParaEditar(ruta)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-150" title="Editar">
                      <Edit3 size={18} />
                    </button>
                    <button onClick={() => handleEliminarRuta(ruta.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-150" title="Eliminar">
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

export default GestionRutas;

