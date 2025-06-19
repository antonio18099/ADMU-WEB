import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { db } from "../firebase"; // Importamos la conexión a Firestore
import { collection, onSnapshot } from "firebase/firestore"; // Importamos funciones de Firestore
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

            </MapContainer>
        </div>
    );
};

export default DashboardMap;
