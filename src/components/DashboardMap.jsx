// // src/components/DashboardMap.jsx
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// // Importa el icono personalizado
// import customMarkerIconUrl from "/icons/parada-Icon.png"; // Ruta relativa a la carpeta public

// // Crea una instancia de icono personalizado
// const customIcon = new L.Icon({
//     iconUrl: customMarkerIconUrl,
//     iconSize: [25, 41], // Tamaño del icono [ancho, alto]
//     iconAnchor: [12, 41], // Punto del icono que corresponde a la ubicación del marcador
//     popupAnchor: [1, -34], // Punto desde donde se abrirá el popup relativo al iconAnchor
// });

// // Datos simulados de paraderos (copiados de Map.jsx para el mapa simple del dashboard)
// const paraderos = [
//     {
//         id: 1,
//         nombre: "Paradero Centro Comercial Portal del Quindío",
//         position: [4.558224, -75.654729],
//         rutas: ["Ruta 1", "Ruta 3", "Ruta 7", "Ruta 18"],
//         idRutas: [1, 3, 7, 18]
//         },
//     {
//         id: 2,
//         nombre: "Paradero Parque Sucre",
//         position: [4.53629, -75.66901],
//         rutas: ["Ruta 2", "Ruta 5", "Ruta 9", "Ruta 28"],
//         idRutas: [2, 5, 9, 28]
//     },
//     {
//         id: 3,
//         nombre: "Paradero Hospital San Juan de Dios",
//         position: [4.55619, -75.65639],
//         rutas: ["Ruta 4", "Ruta 6", "Ruta 31", "Ruta 35"],
//         idRutas: [4, 6, 31, 35]
//     },
//     {
//         id: 4,
//         nombre: "Paradero Universidad del Quindío",
//         position: [4.555297, -75.658274],
//         rutas: ["Ruta 1", "Ruta 10", "Ruta 24", "Ruta 37"],
//         idRutas: [1, 10, 24, 37]
//     },
//     {
//         id: 5,
//         nombre: "Paradero Terminal de Transportes",
//         position: [4.52837, -75.68407],
//         rutas: ["Ruta 2", "Ruta 11", "Ruta 15", "Ruta 33"],
//         idRutas: [2, 11, 15, 33]
//     },
//     {
//         id: 6,
//         nombre: "Paradero Estación de Policía Armenia",
//         position: [4.540235, -75.672927],
//         rutas: ["Ruta 3", "Ruta 12", "Ruta 27"],
//         idRutas: [3, 12, 27]
//     },
//     ];

// const DashboardMap = () => {
//     const initialPosition = [4.53389, -75.68111]; // Coordenadas de Armenia, Quindío
//     const armeniaBounds = [
//         [4.3379, -75.870], // Esquina Suroeste
//         [4.6459, -75.551]  // Esquina Noreste
//     ];

//     return (
//         <MapContainer 
//             center={initialPosition} 
//             zoom={13} 
//             style={{ height: "100%", width: "100%" }} // Ocupa el 100% del contenedor padre
//             maxBounds={armeniaBounds} // Limita el mapa a Armenia
//             minZoom={12} // Opcional: Establece un nivel mínimo de zoom
//         >
//             <TileLayer
//                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//             />
            
//             {paraderos.map(paradero => (
//                 <Marker key={paradero.id} position={paradero.position} icon={customIcon}>
//                     <Popup>
//                         <b>{paradero.nombre}</b><br />
//                         Rutas que pasan por aquí:<br />
//                         {paradero.rutas.join(", ")}
//                     </Popup>
//                 </Marker>
//             ))}
//         </MapContainer>
//     );
// };

// export default DashboardMap;


// src/components/DashboardMap.jsx
// Removed unused React import
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// // Importa el icono personalizado para paraderos
// import customParadaIconUrl from "/icons/parada-Icon.png"; 
// import poisData from "../data/poisData.js"; // Importa los datos de POIs

// // Crea una instancia de icono personalizado para paraderos
// const paradaIcon = new L.Icon({
//     iconUrl: customParadaIconUrl,
//     iconSize: [25, 41],
//     iconAnchor: [12, 41],
//     popupAnchor: [1, -34],
// });

// // Icono por defecto de Leaflet para POIs (azul)
// // No es necesario crear una instancia si usamos el default, Leaflet lo maneja.
// // Si quisiéramos uno específico para POIs, lo definiríamos aquí.
// // const poiIcon = new L.Icon({ iconUrl: 
// // 
// // 
// // 
// // 
// //     iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] });

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
//       nombre: "Paradero Parque Sucre",
//       position: [4.53629, -75.66901],
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

// const DashboardMap = () => {
//     const initialPosition = [4.53389, -75.68111];
//     const armeniaBounds = [
//         [4.3379, -75.870],
//         [4.6459, -75.551]
//     ];

//     return (
//         <MapContainer 
//             center={initialPosition} 
//             zoom={13} 
//             style={{ height: "100%", width: "100%" }}
//             maxBounds={armeniaBounds}
//             minZoom={12}
//         >
//             <TileLayer
//                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                 attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
//             />
            
//             {paraderos.map(paradero => (
//                 <Marker key={paradero.id} position={paradero.position} icon={paradaIcon}>
//                     <Popup>
//                         <b>{paradero.nombre}</b><br />
//                         Rutas que pasan por aquí:<br />
//                         {paradero.rutas.join(", ")}
//                     </Popup>
//                 </Marker>
//             ))}

//             {poisData.map(poi => (
//                 <Marker key={poi.id} position={poi.coordenadas}>
//                     {/* Usará el icono azul por defecto de Leaflet */}
//                     <Popup>
//                         <b>{poi.nombre}</b><br />
//                         <i>{poi.tipo}</i><br />
//                         {poi.descripcion}
//                     </Popup>
//                 </Marker>
//             ))}
//         </MapContainer>
//     );
// };

// export default DashboardMap;

// src/components/DashboardMap.jsx

// src/components/DashboardMap.jsx
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { db } from "../firebase"; // Importamos la conexión a Firestore
import { collection, onSnapshot } from "firebase/firestore"; // Importamos funciones de Firestore
import poisData from "../data/poisData.js"; // Importa los datos de POIs
import { Link } from "react-router-dom"; // Importamos Link para navegación

// Importa el icono personalizado para paraderos
import customParadaIconUrl from "/icons/parada-Icon.png"; 

// Crea una instancia de icono personalizado para paraderos
const paradaIcon = new L.Icon({
    iconUrl: customParadaIconUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

// Componente para ajustar el zoom y centro del mapa
import PropTypes from "prop-types";

const MapAdjuster = ({ paraderos }) => {
    const map = useMap();
    
    useEffect(() => {
        if (paraderos && paraderos.length > 0) {
            // Crear un bounds que incluya todos los paraderos
            const bounds = L.latLngBounds(paraderos.map(p => p.position));
            
            // Ajustar el mapa para mostrar todos los paraderos
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [paraderos, map]);
    
    return null;
};

MapAdjuster.propTypes = {
    paraderos: PropTypes.arrayOf(
        PropTypes.shape({
            position: PropTypes.arrayOf(PropTypes.number).isRequired,
        })
    ).isRequired,
};

const DashboardMap = () => {
    const [paraderos, setParaderos] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const initialPosition = [4.53389, -75.68111];
    const armeniaBounds = [
        [4.3379, -75.870], // Esquina Suroeste (ampliada para incluir el aeropuerto)
        [4.6459, -75.551]  // Esquina Noreste
    ];

    // Obtener paraderos de Firestore en tiempo real
    useEffect(() => {
        setLoading(true);
        const paraderosCollectionRef = collection(db, "paraderos");
        
        // Usar onSnapshot para escuchar cambios en tiempo real
        const unsubscribe = onSnapshot(paraderosCollectionRef, (snapshot) => {
            const paraderosData = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    nombre: data.nombre,
                    position: [data.ubicacion.latitude, data.ubicacion.longitude],
                    descripcion: data.descripcion || "",
                    // Asignamos rutas temporales hasta que implementemos la relación real
                    rutas: ["Consultar panel de administración"],
                };
            });
            setParaderos(paraderosData);
            setLoading(false);
        }, (error) => {
            console.error("Error al obtener paraderos: ", error);
            setLoading(false);
        });
        
        // Limpiar el listener cuando el componente se desmonte
        return () => unsubscribe();
    }, []);

    return (
        <div className="relative h-full">
            {/* Botones de navegación en la parte superior */}
            <div className="absolute top-2 left-2 z-10 bg-white p-2 rounded-md shadow-md">
                <Link to="/dashboard" className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 mr-2">
                    Volver al Inicio
                </Link>
                <Link to="/map" className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">
                    Ver Mapa Completo
                </Link>
            </div>
            
            <MapContainer 
                center={initialPosition} 
                zoom={12} 
                style={{ height: "100%", width: "100%" }}
                maxBounds={armeniaBounds}
                minZoom={10}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                />
                
                {/* Componente para ajustar el zoom y centro del mapa */}
                <MapAdjuster paraderos={paraderos} />
                
                {loading ? (
                    // Opcional: Mostrar un indicador de carga en el mapa
                    <div className="loading-indicator">Cargando paraderos...</div>
                ) : (
                    // Renderizar los paraderos cuando estén cargados
                    paraderos.map(paradero => (
                        <Marker key={paradero.id} position={paradero.position} icon={paradaIcon}>
                            <Popup maxWidth="250" minWidth="200">
                                <div className="paradero-popup text-sm">
                                    <h3 className="font-bold text-base mb-1">{paradero.nombre}</h3>
                                    {paradero.descripcion && (
                                        <p className="text-gray-600 text-xs mb-1">{paradero.descripcion}</p>
                                    )}
                                    <div className="mt-1">
                                        <h4 className="font-semibold text-xs">Rutas:</h4>
                                        <p className="text-xs text-gray-700">{paradero.rutas.join(", ")}</p>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))
                )}

                {poisData.map(poi => (
                    <Marker key={poi.id} position={poi.coordenadas}>
                        <Popup maxWidth="200">
                            <div className="text-sm">
                                <b>{poi.nombre}</b><br />
                                <i className="text-xs">{poi.tipo}</i><br />
                                <span className="text-xs">{poi.descripcion}</span>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default DashboardMap;
