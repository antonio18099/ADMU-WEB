
// // src/components/Map.jsx
// import { useState, useMemo } from "react";
// import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import routesData from "../data/routesData"; 
// import poisData from "../data/poisData"; // Importa los datos de POIs

// import customMarkerIconUrl from "/icons/parada-Icon.png"; 

// const paradaIcon = new L.Icon({
//     iconUrl: customMarkerIconUrl,
//     iconSize: [25, 41],
//     iconAnchor: [12, 41],
//     popupAnchor: [1, -34],
// });

// // Icono por defecto de Leaflet para POIs (azul)
// // No es necesario crear una instancia si usamos el default.

// const paraderos = [
//     {
//         id: 1,
//         nombre: "Paradero Centro Comercial Portal del Quindío",
//         position: [4.558224, -75.654729],
//         rutas: ["Ruta 1", "Ruta 3", "Ruta 7", "Ruta 18"],
//         idRutas: [1, 3, 7, 18]
//       },
//     {
//       id: 2,
//       nombre: "Paradero Aeropuerto	 El Edén",
//       position: [4.45330, -75.76835],
//       rutas: ["Ruta 2", "Ruta 5", "Ruta 9", "Ruta 28"],
//       idRutas: [2, 5, 9, 28]
//     },
//     {
//       id: 3,
//       nombre: "Paradero Hospital San Juan de Dios",
//       position: [4.55619, -75.65639],
//       rutas: ["Ruta 4", "Ruta 6", "Ruta 31", "Ruta 35"],
//       idRutas: [4, 6, 31, 35]
//     },
//     {
//       id: 4,
//       nombre: "Paradero Universidad del Quindío",
//       position: [4.555297, -75.658274],
//       rutas: ["Ruta 1", "Ruta 10", "Ruta 24", "Ruta 37"],
//       idRutas: [1, 10, 24, 37]
//     },
//     {
//       id: 5,
//       nombre: "Paradero Terminal de Transportes",
//       position: [4.52837, -75.68407],
//       rutas: ["Ruta 2", "Ruta 11", "Ruta 15", "Ruta 33"],
//       idRutas: [2, 11, 15, 33]
//     },
//     {
//       id: 6,
//       nombre: "Paradero Estación de Policía Armenia",
//       position: [4.540235, -75.672927],
//       rutas: ["Ruta 3", "Ruta 12", "Ruta 27"],
//       idRutas: [3, 12, 27]
//     },
//   ];

// const initialPosition = [4.53389, -75.68111];

// const extendedRoutesData = routesData.map(route => {
//     const routeParaderos = paraderos.filter(p => p.idRutas.includes(route.id));
//     return {
//         ...route,
//         paraderos: routeParaderos.map(p => ({ id: p.id, nombre: p.nombre, position: p.position })),
//         path: routeParaderos.length >= 2 
//             ? [routeParaderos[0].position, routeParaderos[routeParaderos.length - 1].position] 
//             : (routeParaderos.length === 1 ? [routeParaderos[0].position, initialPosition] : []),
//     };
// });

// const MapPage = () => {
//     const [selectedRoute, setSelectedRoute] = useState(null);
//     const [searchTerm, setSearchTerm] = useState("");
    
// const armeniaBounds = [
//   [4.50, -75.90], // suroeste (más al sur y al oeste que antes)
//   [4.70, -75.80]  // noreste
// ];



//     const sortedRoutes = [...extendedRoutesData].sort((a, b) => {
//         const numA = parseInt(a.name.replace(/\D/g, 
//         // @ts-ignore
//         ''), 10);
//         const numB = parseInt(b.name.replace(/\D/g, 
//         // @ts-ignore
//         ''), 10);
//         return numA - numB;
//     });

//     const handleRouteClick = (route) => {
//         setSelectedRoute(route);
//     };

//     const handleSearchChange = (event) => {
//         setSearchTerm(event.target.value);
//     };

//     const displayedParaderos = useMemo(() => {
//         let paraderosToShow = paraderos;
//         if (selectedRoute) {
//             paraderosToShow = paraderos.filter(p => p.idRutas.includes(selectedRoute.id));
//         }
//         if (searchTerm) {
//             paraderosToShow = paraderosToShow.filter(p => 
//                 p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
//             );
//         }
//         return paraderosToShow;
//     }, [selectedRoute, searchTerm]);

//     return (
//         <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] pt-16 md:pt-0">
//             <div className="w-full md:w-1/3 lg:w-1/4 bg-white shadow-md overflow-y-auto p-4">
//                 <div className="mb-4">
//                     <input 
//                         type="text"
//                         placeholder="Buscar paradero por nombre..."
//                         value={searchTerm}
//                         onChange={handleSearchChange}
//                         className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                 </div>

//                 <h2 className="text-lg font-semibold mb-4 text-gray-700">Rutas Disponibles</h2>
//                 <ul className="space-y-3">
//                     {sortedRoutes.map((route) => (
//                         <li 
//                             key={route.id} 
//                             className={`p-3 border rounded-lg hover:bg-gray-100 cursor-pointer transition-colors ${selectedRoute && selectedRoute.id === route.id ? 'bg-blue-100 border-blue-500' : ''}`}
//                             onClick={() => handleRouteClick(route)}
//                         >
//                             <div className="font-semibold text-blue-700">{route.name}</div>
//                             <div className="text-sm text-gray-600">
//                                 <span>De: {route.from}</span> <span className="mx-1">→</span> <span>A: {route.to}</span>
//                             </div>
//                             <div className="text-xs text-gray-500 mt-1">
//                                 <span>Duración: {route.duration}</span>
//                                 <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${route.status.includes("Retraso") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
//                                     {route.status}
//                                 </span>
//                             </div>
//                             {selectedRoute && selectedRoute.id === route.id && route.paraderos && route.paraderos.length > 0 && (
//                                 <div className="mt-2 pt-2 border-t border-gray-200">
//                                     <h4 className="text-xs font-semibold text-gray-600 mb-1">Paraderos de esta ruta:</h4>
//                                     <ul className="list-disc list-inside pl-2 space-y-0.5">
//                                         {route.paraderos.map(p => <li key={p.id} className="text-xs text-gray-500">{p.nombre}</li>)}
//                                     </ul>
//                                 </div>
//                             )}
//                         </li>
//                     ))}
//                 </ul>
//             </div>

//             <div className="w-full md:w-2/3 lg:w-3/4 h-full">
//                 <MapContainer 
//                     center={initialPosition} 
//                     zoom={13} 
//                     style={{ height: "100%", width: "100%" }}
//                     maxBounds={armeniaBounds}
//                     minZoom={12} 
//                 >
//                     <TileLayer
//                         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                     />
//                     {displayedParaderos.map(paradero => (
//                         <Marker key={`paradero-${paradero.id}`} position={paradero.position} icon={paradaIcon}>
//                             <Popup>
//                                 <b>{paradero.nombre}</b><br />
//                                 Rutas que pasan por aquí:<br />
//                                 {paradero.rutas.join(", ")}
//                             </Popup>
//                         </Marker>
//                     ))}
//                     {selectedRoute && selectedRoute.path && selectedRoute.path.length > 0 && (
//                         <Polyline positions={selectedRoute.path} color="blue" />
//                     )}

//                     {/* Muestra los Puntos de Interés */}
//                     {poisData.map(poi => (
//                         <Marker key={poi.id} position={poi.coordenadas}>
//                             {/* Usará el icono azul por defecto de Leaflet */}
//                             <Popup>
//                                 <b>{poi.nombre}</b><br />
//                                 <i>{poi.tipo}</i><br />
//                                 {poi.descripcion}
//                             </Popup>
//                         </Marker>
//                     ))}
//                 </MapContainer>
//             </div>
//         </div>
//     );
// };

// export default MapPage;




// codigo de prueba antonio, funciona pero no es el correcto



// // src/components/Map.jsx
// import { useState, useEffect, useMemo } from "react";
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import poisData from "../data/poisData"; // Importa los datos de POIs
// import { db } from "../firebase"; // Importamos la conexión a Firestore
// import { collection, onSnapshot } from "firebase/firestore"; // Importamos funciones de Firestore
// import PropTypes from "prop-types";

// import customMarkerIconUrl from "/icons/parada-Icon.png"; 

// const paradaIcon = new L.Icon({
//     iconUrl: customMarkerIconUrl,
//     iconSize: [25, 41],
//     iconAnchor: [12, 41],
//     popupAnchor: [1, -34],
// });

// // Componente para ajustar el zoom y centro del mapa
// const MapAdjuster = ({ paraderos }) => {
//     const map = useMap();
    
//     useEffect(() => {
//         if (paraderos && paraderos.length > 0) {
//             // Crear un bounds que incluya todos los paraderos
//             const bounds = L.latLngBounds(paraderos.map(p => p.position));
            
//             // Ajustar el mapa para mostrar todos los paraderos
//             map.fitBounds(bounds, { padding: [50, 50] });
//         }
//     }, [paraderos, map]);
    
//     return null;
// };

// MapAdjuster.propTypes = {
//     paraderos: PropTypes.arrayOf(
//         PropTypes.shape({
//             id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//             nombre: PropTypes.string,
//             position: PropTypes.arrayOf(PropTypes.number),
//             descripcion: PropTypes.string,
//             rutas: PropTypes.array,
//             idRutas: PropTypes.array,
//         })
//     ),
// };

// const MapPage = () => {
//     const [paraderos, setParaderos] = useState([]);
//     const [rutas, setRutas] = useState([]);
//     const [selectedRoute, setSelectedRoute] = useState(null);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [loading, setLoading] = useState(true);
    
//     // Coordenadas iniciales y límites del mapa
//     const initialPosition = [4.53389, -75.68111];
//     const armeniaBounds = [
//         [4.3379, -75.870], // Esquina Suroeste (ampliada para incluir el aeropuerto)
//         [4.6459, -75.551]  // Esquina Noreste
//     ];

//     // Obtener paraderos de Firestore en tiempo real
//     useEffect(() => {
//         setLoading(true);
//         const paraderosCollectionRef = collection(db, "paraderos");
        
//         // Usar onSnapshot para escuchar cambios en tiempo real
//         const unsubscribe = onSnapshot(paraderosCollectionRef, (snapshot) => {
//             const paraderosData = snapshot.docs.map((doc) => {
//                 const data = doc.data();
//                 return {
//                     id: doc.id,
//                     nombre: data.nombre,
//                     position: [data.ubicacion.latitude, data.ubicacion.longitude],
//                     descripcion: data.descripcion || "",
//                     rutas: [], // Se llenará después de obtener las rutas
//                     idRutas: []
//                 };
//             });
//             setParaderos(paraderosData);
//             setLoading(false);
//         }, (error) => {
//             console.error("Error al obtener paraderos: ", error);
//             setLoading(false);
//         });
        
//         // Limpiar el listener cuando el componente se desmonte
//         return () => unsubscribe();
//     }, []);

//     // Obtener rutas de Firestore
//     useEffect(() => {
//         const rutasCollectionRef = collection(db, "rutas");
        
//         const unsubscribe = onSnapshot(rutasCollectionRef, (snapshot) => {
//             const rutasData = snapshot.docs.map((doc) => {
//                 const data = doc.data();
//                 return {
//                     id: doc.id,
//                     name: data.nombre,
//                     from: data.origen,
//                     to: data.destino,
//                     duration: data.duracionEstimada || "No especificada",
//                     status: data.estado === "Activa" ? "En tiempo" : 
//                             data.estado === "Inactiva" ? "Fuera de servicio" : 
//                             "Retraso por mantenimiento",
//                     paraderos: data.paraderos || []
//                 };
//             });
//             setRutas(rutasData);
//         }, (error) => {
//             console.error("Error al obtener rutas: ", error);
//         });
        
//         return () => unsubscribe();
//     }, []);

//     // Relacionar paraderos con rutas
//     useEffect(() => {
//         if (paraderos.length > 0 && rutas.length > 0) {
//             // Crear una copia de los paraderos para actualizar
//             const paraderosActualizados = [...paraderos];
            
//             // Para cada paradero, buscar las rutas que lo incluyen
//             paraderosActualizados.forEach(paradero => {
//                 const rutasAsociadas = [];
//                 const idRutasAsociadas = [];
                
//                 // Buscar en cada ruta si incluye este paradero
//                 rutas.forEach(ruta => {
//                     const estaEnRuta = ruta.paraderos && ruta.paraderos.some(p => p === paradero.id);
                    
//                     if (estaEnRuta) {
//                         rutasAsociadas.push(ruta.name);
//                         idRutasAsociadas.push(ruta.id);
//                     }
//                 });
                
//                 // Si no se encontraron rutas, asignar un mensaje informativo
//                 if (rutasAsociadas.length === 0) {
//                     paradero.rutas = ["No hay rutas asignadas"];
//                 } else {
//                     paradero.rutas = rutasAsociadas;
//                     paradero.idRutas = idRutasAsociadas;
//                 }
//             });
            
//             // Actualizar el estado con los paraderos relacionados
//             setParaderos(paraderosActualizados);
//         }
//     }, [paraderos, rutas]);

//     // Extender los datos de rutas con los paraderos
//     const extendedRoutesData = useMemo(() => {
//         return rutas.map(route => {
//             const routeParaderos = paraderos.filter(p => p.idRutas && p.idRutas.includes(route.id));
//             return {
//                 ...route,
//                 paraderos: routeParaderos.map(p => ({ id: p.id, nombre: p.nombre, position: p.position })),
//                 path: routeParaderos.length >= 2 
//                     ? [routeParaderos[0].position, routeParaderos[routeParaderos.length - 1].position] 
//                     : (routeParaderos.length === 1 ? [routeParaderos[0].position, initialPosition] : []),
//             };
//         });
//     }, [paraderos, rutas]);

//     const sortedRoutes = useMemo(() => {
//         return [...extendedRoutesData].sort((a, b) => {
//             const numA = parseInt(a.name.replace(/\D/g, ''), 10) || 0;
//             const numB = parseInt(b.name.replace(/\D/g, ''), 10) || 0;
//             return numA - numB;
//         });
//     }, [extendedRoutesData]);

//     const handleRouteClick = (route) => {
//         setSelectedRoute(route);
//     };

//     const handleSearchChange = (event) => {
//         setSearchTerm(event.target.value);
//     };

//     const displayedParaderos = useMemo(() => {
//         let paraderosToShow = paraderos;
//         if (selectedRoute) {
//             paraderosToShow = paraderos.filter(p => p.idRutas && p.idRutas.includes(selectedRoute.id));
//         }
//         if (searchTerm) {
//             paraderosToShow = paraderosToShow.filter(p => 
//                 p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
//             );
//         }
//         return paraderosToShow;
//     }, [paraderos, selectedRoute, searchTerm]);

//     return (
//         <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] pt-16 md:pt-0">
//             <div className="w-full md:w-1/3 lg:w-1/4 bg-white shadow-md overflow-y-auto p-4">
//                 <div className="mb-4">
//                     <input 
//                         type="text"
//                         placeholder="Buscar paradero por nombre..."
//                         value={searchTerm}
//                         onChange={handleSearchChange}
//                         className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                 </div>

//                 <h2 className="text-lg font-semibold mb-4 text-gray-700">Rutas Disponibles</h2>
//                 {loading ? (
//                     <p className="text-gray-500">Cargando rutas...</p>
//                 ) : (
//                     <ul className="space-y-3">
//                         {sortedRoutes.map((route) => (
//                             <li 
//                                 key={route.id} 
//                                 className={`p-3 border rounded-lg hover:bg-gray-100 cursor-pointer transition-colors ${selectedRoute && selectedRoute.id === route.id ? 'bg-blue-100 border-blue-500' : ''}`}
//                                 onClick={() => handleRouteClick(route)}
//                             >
//                                 <div className="font-semibold text-blue-700">{route.name}</div>
//                                 <div className="text-sm text-gray-600">
//                                     <span>De: {route.from}</span> <span className="mx-1">→</span> <span>A: {route.to}</span>
//                                 </div>
//                                 <div className="text-xs text-gray-500 mt-1">
//                                     <span>Duración: {route.duration}</span>
//                                     <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${route.status.includes("Retraso") || route.status.includes("Fuera") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
//                                         {route.status}
//                                     </span>
//                                 </div>
//                                 {selectedRoute && selectedRoute.id === route.id && route.paraderos && route.paraderos.length > 0 && (
//                                     <div className="mt-2 pt-2 border-t border-gray-200">
//                                         <h4 className="text-xs font-semibold text-gray-600 mb-1">Paraderos de esta ruta:</h4>
//                                         <ul className="list-disc list-inside pl-2 space-y-0.5">
//                                             {route.paraderos.map(p => <li key={p.id} className="text-xs text-gray-500">{p.nombre}</li>)}
//                                         </ul>
//                                     </div>
//                                 )}
//                             </li>
//                         ))}
//                     </ul>
//                 )}
//             </div>

//             <div className="w-full md:w-2/3 lg:w-3/4 h-full">
//                 <MapContainer 
//                     center={initialPosition} 
//                     zoom={12} 
//                     style={{ height: "100%", width: "100%" }}
//                     maxBounds={armeniaBounds}
//                     minZoom={10} 
//                 >
//                     <TileLayer
//                         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                     />
                    
//                     {/* Componente para ajustar el zoom y centro del mapa */}
//                     <MapAdjuster paraderos={paraderos} />
                    
//                     {displayedParaderos.map(paradero => (
//                         <Marker key={`paradero-${paradero.id}`} position={paradero.position} icon={paradaIcon}>
//                             <Popup maxWidth="250" minWidth="200">
//                                 <div className="paradero-popup text-sm">
//                                     <h3 className="font-bold text-base mb-1">{paradero.nombre}</h3>
//                                     {paradero.descripcion && (
//                                         <p className="text-gray-600 text-xs mb-1">{paradero.descripcion}</p>
//                                     )}
//                                     <div className="mt-1">
//                                         <h4 className="font-semibold text-xs">Rutas:</h4>
//                                         {paradero.rutas && paradero.rutas.length > 0 && paradero.rutas[0] !== "No hay rutas asignadas" ? (
//                                             <ul className="list-disc list-inside pl-1 text-xs">
//                                                 {paradero.rutas.map((ruta, index) => (
//                                                     <li key={index} className="text-gray-700">{ruta}</li>
//                                                 ))}
//                                             </ul>
//                                         ) : (
//                                             <p className="text-xs text-gray-500">No hay rutas asignadas</p>
//                                         )}
//                                     </div>
//                                 </div>
//                             </Popup>
//                         </Marker>
//                     ))}
                    
//                     {selectedRoute && selectedRoute.path && selectedRoute.path.length > 0 && (
//                         <Polyline positions={selectedRoute.path} color="blue" />
//                     )}

//                     {/* Muestra los Puntos de Interés */}
//                     {poisData.map(poi => (
//                         <Marker key={poi.id} position={poi.coordenadas}>
//                             <Popup maxWidth="200">
//                                 <div className="text-sm">
//                                     <b>{poi.nombre}</b><br />
//                                     <i className="text-xs">{poi.tipo}</i><br />
//                                     <span className="text-xs">{poi.descripcion}</span>
//                                 </div>
//                             </Popup>
//                         </Marker>
//                     ))}
//                 </MapContainer>
//             </div>
//         </div>
//     );
// };

// export default MapPage;

// src/components/Map.jsx
import { useState, useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import PropTypes from "prop-types";
import ChatBot from "./ChatBot"; // Importamos el componente ChatBot

// Importa la URL del icono personalizado para los paraderos
import customMarkerIconUrl from "/icons/parada-Icon.png";

// Icono personalizado para los paraderos
const paradaIcon = new L.Icon({
  iconUrl: customMarkerIconUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

// Componente para ajustar la vista del mapa a los paraderos mostrados
const MapAdjuster = ({ paraderos }) => {
  const map = useMap();

  useEffect(() => {
    if (paraderos && paraderos.length > 0) {
      const bounds = L.latLngBounds(paraderos.map(p => p.position));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [paraderos, map]);

  return null;
};

MapAdjuster.propTypes = {
  paraderos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      nombre: PropTypes.string,
      position: PropTypes.arrayOf(PropTypes.number),
      descripcion: PropTypes.string,
      rutas: PropTypes.array,
      idRutas: PropTypes.array
    })
  )
};

// Componente para mostrar la ubicación actual del usuario
function LocationMarker() {
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState("Obteniendo dirección...");
  const map = useMap();

  useEffect(() => {
    map.locate({
      setView: true, // Centra el mapa en la ubicación encontrada
      maxZoom: 16, // Establece un zoom máximo al encontrar la ubicación
      enableHighAccuracy: true // Solicita una ubicación más precisa
    }).on("locationfound", function (e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());

      // Geocodificación inversa para obtener la dirección
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`)
        .then(response => response.json())
        .then(data => {
          setAddress(data.display_name || "Ubicación encontrada");
        }).catch(() => {
          setAddress("No se pudo obtener la dirección.");
        });

    }).on("locationerror", function (e) {
      console.error("Error al obtener la ubicación: ", e.message);
      setAddress("No se pudo obtener la ubicación precisa.");
      // Considerar mostrar un mensaje al usuario o usar una ubicación por defecto
    });
  }, [map]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>
        Estás aquí.<br/>
        {address}
      </Popup>
    </Marker>
  );
}

// Componente principal del mapa
const MapPage = () => {
  const [paraderos, setParaderos] = useState([]);
  const [rutas, setRutas] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Posición inicial del mapa y límites de Armenia
  const initialPosition = useMemo(() => [4.53389, -75.68111], []);
  const armeniaBounds = useMemo(() => [
    [4.3379, -75.870],
    [4.6459, -75.551]
  ], []);

  // Carga de paraderos desde Firestore
  useEffect(() => {
    setLoading(true);
    const paraderosRef = collection(db, "paraderos");
    const unsubscribe = onSnapshot(
      paraderosRef,
      snapshot => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          nombre: doc.data().nombre,
          position: [
            doc.data().ubicacion.latitude,
            doc.data().ubicacion.longitude
          ],
          descripcion: doc.data().descripcion || "",
          rutas: [],
          idRutas: []
        }));
        setParaderos(data);
        setLoading(false);
      },
      error => {
        console.error("Error al obtener paraderos: ", error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Carga de rutas desde Firestore
  useEffect(() => {
    const rutasRef = collection(db, "rutas");
    const unsubscribe = onSnapshot(
      rutasRef,
      snapshot => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().nombre,
          from: doc.data().origen,
          to: doc.data().destino,
          duration: doc.data().duracionEstimada || "No especificada",
          status:
            doc.data().estado === "Activa"
              ? "En tiempo"
              : doc.data().estado === "Inactiva"
              ? "Fuera de servicio"
              : "Retraso por mantenimiento",
          paraderos: doc.data().paraderos || []
        }));
        setRutas(data);
      },
      error => {
        console.error("Error al obtener rutas: ", error);
      }
    );
    return () => unsubscribe();
  }, []);

  // Enriquecer paraderos con información de rutas asociadas
  const [enrichedParaderos, setEnrichedParaderos] = useState([]);

  useEffect(() => {
    if (paraderos.length > 0 && rutas.length > 0) {
      const updated = paraderos.map(paradero => {
        const rutasAsociadas = [];
        const idRutasAsociadas = [];

        rutas.forEach(ruta => {
          if (ruta.paraderos.includes(paradero.id)) {
            rutasAsociadas.push(ruta.name);
            idRutasAsociadas.push(ruta.id);
          }
        });

        return {
          ...paradero,
          rutas: rutasAsociadas.length ? rutasAsociadas : ["No hay rutas asignadas"],
          idRutas: idRutasAsociadas
        };
      });

      setEnrichedParaderos(updated);
    }
  }, [paraderos, rutas]);

  // Datos de rutas extendidos con paraderos y caminos
  const extendedRoutesData = useMemo(() => {
    return rutas.map(route => {
      const routeParaderos = enrichedParaderos.filter(p =>
        p.idRutas && p.idRutas.includes(route.id)
      );
      return {
        ...route,
        paraderos: routeParaderos.map(p => ({
          id: p.id,
          nombre: p.nombre,
          position: p.position
        })),
        path:
          routeParaderos.length >= 2
            ? [
                routeParaderos[0].position,
                routeParaderos[routeParaderos.length - 1].position
              ]
            : routeParaderos.length === 1
            ? [routeParaderos[0].position, initialPosition]
            : []
      };
    });
  }, [enrichedParaderos, rutas, initialPosition]);
  // Rutas ordenadas numéricamente
  const sortedRoutes = useMemo(() => {
    return [...extendedRoutesData].sort((a, b) => {
      const numA = parseInt(a.name.replace(/\D/g, ""), 10) || 0;
      const numB = parseInt(b.name.replace(/\D/g, ""), 10) || 0;
      return numA - numB;
    });
  }, [extendedRoutesData]);

  // Filtrar rutas según el término de búsqueda
  const filteredRoutes = useMemo(() => {
    if (!searchTerm) {
      return sortedRoutes;
    }
    return sortedRoutes.filter(route =>
      route.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedRoutes, searchTerm]);

  // Manejador para seleccionar una ruta
  const handleRouteClick = route => {
    setSelectedRoute(route);
  };

  // Manejador de cambio en el campo de búsqueda
  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
  };

  // Paraderos a mostrar en el mapa (filtrados solo por la ruta seleccionada)
  const displayedParaderos = useMemo(() => {
    let result = enrichedParaderos;
    if (selectedRoute) {
      result = result.filter(p => p.idRutas && p.idRutas.includes(selectedRoute.id));
    }
    return result;
  }, [enrichedParaderos, selectedRoute]);

  return (
    <div className="flex flex-col md:flex-row h-full">
      <div className="w-full md:w-1/3 lg:w-1/4 bg-white shadow-md overflow-y-auto p-4">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar ruta por nombre..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>

        <h2 className="text-lg font-semibold mb-4 text-gray-700">Rutas Disponibles</h2>
        {loading ? (
          <p className="text-gray-500">Cargando rutas...</p>
        ) : (
          <ul className="space-y-3">
            {filteredRoutes.map(route => (
              <li
                key={route.id}
                className={`p-3 border rounded-lg hover:bg-gray-100 cursor-pointer transition-colors ${
                  selectedRoute?.id === route.id
                    ? "bg-blue-100 border-blue-500"
                    : ""
                }`}
                onClick={() => handleRouteClick(route)}
              >
                <div className="font-semibold text-blue-700">{route.name}</div>
                <div className="text-sm text-gray-600">
                  <span>De: {route.from}</span> → <span>A: {route.to}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  <span>Duración: {route.duration}</span>
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      route.status.includes("Retraso") ||
                      route.status.includes("Fuera")
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {route.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="w-full md:w-2/3 lg:w-3/4">
        <MapContainer
          center={initialPosition}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
          maxBounds={armeniaBounds}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarker />
          {displayedParaderos.map(paradero => (
            <Marker
              key={paradero.id}
              position={paradero.position}
              icon={paradaIcon}
            >
              <Popup>
                <strong>{paradero.nombre}</strong>
                <br />
                {paradero.descripcion}
                <br />
                Rutas: {paradero.rutas.join(", ")}
              </Popup>
            </Marker>
          ))}
          {selectedRoute && selectedRoute.path.length === 2 && (
            <Polyline positions={selectedRoute.path} color="blue" />
          )}
          <MapAdjuster paraderos={displayedParaderos} />
        </MapContainer>
      </div>
      
      {/* Componente ChatBot */}
      <ChatBot />
    </div>
  );
};

export default MapPage;


