//chatbot.jsx 

// import { useState, useRef, useEffect } from "react";
// import { MessageSquare, Send, X, ChevronDown, MapPin, Bus, Clock, CreditCard, MapPinned, HelpCircle, Navigation } from "lucide-react"; // Added Navigation
// import { collection, onSnapshot, query, where, getDocs } from "firebase/firestore"; // Added query, where, getDocs
// import { db } from "../firebase";
// import MapRouteAnimation from "./MapRouteAnimation"; // Importamos el nuevo componente

// const ChatBot = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [inputText, setInputText] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [rutas, setRutas] = useState([]);
//   const [showOptions, setShowOptions] = useState(false);
//   const [optionsType, setOptionsType] = useState("");
//   const messagesEndRef = useRef(null);

//   // New states for the search functionality
//   const [paraderos, setParaderos] = useState([]);
//   const [showRouteAnimation, setShowRouteAnimation] = useState(false); // To control animation visibility
//   const [selectedRoute, setSelectedRoute] = useState(null); // To store the route for animation
//   const [selectedParadero, setSelectedParadero] = useState(null); // To store the selected paradero context
//   const [paraderosEncontrados, setParaderosEncontrados] = useState([]); // To store paraderos found by search

//   // Obtener rutas de Firestore (existing)
//   useEffect(() => {
//     const rutasRef = collection(db, "rutas");
//     const unsubscribe = onSnapshot(
//       rutasRef,
//       snapshot => {
//         const data = snapshot.docs.map(doc => ({
//           id: doc.id,
//           name: doc.data().nombre,
//           from: doc.data().origen,
//           to: doc.data().destino,
//           duration: doc.data().duracionEstimada || "No especificada",
//           status:
//             doc.data().estado === "Activa"
//               ? "En tiempo"
//               : doc.data().estado === "Inactiva"
//               ? "Fuera de servicio"
//               : "Retraso por mantenimiento",
//           paraderos: doc.data().paraderos || [],
//           recorrido: doc.data().recorrido || [] // Ensure 'recorrido' is fetched
//         }));
//         setRutas(data);
//       },
//       error => {
//         console.error("Error al obtener rutas: ", error);
//       }
//     );
//     return () => unsubscribe();
//   }, []);

//   // New useEffect to load paraderos
//   useEffect(() => {
//     const paraderosRef = collection(db, "paraderos");
//     const unsubscribe = onSnapshot(
//       paraderosRef,
//       snapshot => {
//         const data = snapshot.docs.map(doc => ({
//           id: doc.id,
//           nombre: doc.data().nombre,
//           latitud: doc.data().latitud,
//           longitud: doc.data().longitud,
//           descripcion: doc.data().descripcion,
//           imagen: doc.data().imagen || null,
//           sitiosAledanos: doc.data().sitiosAledanos || [],
//           rutasQuePasan: doc.data().rutas || [] // Assuming 'rutas' field in paradero doc lists route IDs
//         }));
//         setParaderos(data);
//       },
//       error => {
//         console.error("Error al obtener paraderos: ", error);
//       }
//     );
//     return () => unsubscribe();
//   }, []);

//   // Scroll al último mensaje cuando se añade uno nuevo (existing)
//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "auto" });
//     }
//   }, [messages]);

//   // New function to search paraderos by text (natural language)
//   const buscarParaderosPorTexto = async (texto) => {
//     const normalizeText = (text) => {
//       return text.toLowerCase()
//         .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
//         .replace(/[^\w\s]/gi, '');
//     };
//     const textoNormalizado = normalizeText(texto);
//     const palabrasClaveParadero = [
//       "paradero", "parada", "estacion", "estación", "donde", "ubicado", "cerca", 
//       "proximo", "próximo", "cercano", "aledaño", "aledano", "sitios aledaños", "sitios aledanos"
//     ];
//     const esBusquedaParadero = palabrasClaveParadero.some(palabra => 
//       textoNormalizado.includes(normalizeText(palabra))
//     );
//     if (!esBusquedaParadero && !rutas.some(r => textoNormalizado.includes(normalizeText(r.name))) && !paraderos.some(p => textoNormalizado.includes(normalizeText(p.nombre)))) {
//         // If not explicitly asking for paraderos and not mentioning a known route/paradero name, assume not a paradero search for now
//         // This can be refined further with more sophisticated NLP or if Gemini API is used for intent detection
//         if (!texto.toLowerCase().includes("rutas que pasan por") && !texto.toLowerCase().includes("paradero llamado")){
//             return null;
//         }
//     }
//     const coincidencias = paraderos.filter(paradero => {
//       const nombreNormalizado = normalizeText(paradero.nombre);
//       const descripcionNormalizada = paradero.descripcion ? normalizeText(paradero.descripcion) : '';
//       // Check if search text is contained in name/description OR if name/description is contained in search text (for broader matching)
//       return nombreNormalizado.includes(textoNormalizado) || 
//              textoNormalizado.includes(nombreNormalizado) ||
//              descripcionNormalizada.includes(textoNormalizado);
//     });
//     return coincidencias;
//   };

//   // New function to search rutas by paradero ID
//   const buscarRutasPorParadero = async (paraderoId) => {
//     try {
//       const rutasQuePasan = rutas.filter(ruta => ruta.paraderos.includes(paraderoId));
//       return rutasQuePasan;
//     } catch (error) {
//       console.error("Error al buscar rutas por paradero:", error);
//       return [];
//     }
//   };

//   // Modified generateBotResponse to include natural language search
//   const generateBotResponse = async (userInput) => {
//     const input = userInput.toLowerCase();
//     let responseText = "";
//     setShowRouteAnimation(false); // Reset animation view
//     setSelectedRoute(null);
//     setSelectedParadero(null);

//     const rutasSinonimos = ["ruta", "bus", "transporte", "ir a", "cómo llegar", "como llegar", "como ir", "llegar a", "ir hacia", "transporte a", "bus a", "autobus", "autobús", "camino", "trayecto"];
//     const paraderosSinonimos = ["paradero", "parada", "estación", "estacion", "donde tomar", "donde abordar", "sitio", "lugar", "punto", "terminal"];
//     const busquedaSinonimos = ["buscar", "encontrar", "localizar", "ubicar", "donde está", "donde esta", "dónde", "donde", "cuál", "cual", "qué rutas", "que rutas", "cuáles rutas", "cuales rutas", "rutas que pasan por", "paradero llamado"];

//     if (
//       (busquedaSinonimos.some(sinonimo => input.includes(sinonimo)) && 
//        (rutasSinonimos.some(sinonimo => input.includes(sinonimo)) || 
//         paraderosSinonimos.some(sinonimo => input.includes(sinonimo)))) ||
//       input.includes("rutas que pasan por") ||
//       input.includes("sitios aledaños") ||
//       input.includes("sitios aledanos") ||
//       input.includes("cerca de")
//     ) {
//       const paraderosCoincidentes = await buscarParaderosPorTexto(input);

//       if (paraderosCoincidentes && paraderosCoincidentes.length > 0) {
//         if (paraderosCoincidentes.length === 1) {
//           const paradero = paraderosCoincidentes[0];
//           setSelectedParadero(paradero); 
//           const rutasDelParadero = await buscarRutasPorParadero(paradero.id);
//           responseText = `📍 **${paradero.nombre}**\n\n${paradero.descripcion || "Descripción no disponible."}\n\n`;
//           if (rutasDelParadero.length > 0) {
//             responseText += `**Rutas que pasan por este paradero:**\n`;
//             rutasDelParadero.forEach(ruta => {
//               responseText += `• ${ruta.name}: ${ruta.from} → ${ruta.to} (${ruta.duration})\n`;
//               responseText += `  Estado: ${ruta.status}\n`;
//             });
//             if (rutasDelParadero[0].recorrido && rutasDelParadero[0].recorrido.length > 0) {
//               setSelectedRoute(rutasDelParadero[0]);
//               setShowRouteAnimation(true);
//             }
//           } else {
//             responseText += "No hay rutas asignadas a este paradero actualmente.";
//           }
//           if (paradero.sitiosAledanos && paradero.sitiosAledanos.length > 0) {
//             responseText += `\n\n**Sitios aledaños:**\n`;
//             paradero.sitiosAledanos.forEach(sitio => {
//               responseText += `• ${sitio.nombre}: ${sitio.descripcion}\n`;
//             });
//           }
//           responseText += "\n\n*Puedes ver la ruta animada y la ubicación en el mapa haciendo clic en \"Ver en mapa\".*";
//         } else {
//           responseText = `Encontré ${paraderosCoincidentes.length} paraderos que coinciden con tu búsqueda:\n\n`;
//           paraderosCoincidentes.forEach((paradero, index) => {
//             responseText += `${index + 1}. **${paradero.nombre}**: ${paradero.descripcion || ""}\n`;
//           });
//           responseText += "\n¿Sobre cuál paradero te gustaría más información?";
//           setShowOptions(true);
//           setOptionsType("paraderos_encontrados");
//           setParaderosEncontrados(paraderosCoincidentes);
//         }
//       } else {
//         responseText = "Lo siento, no encontré paraderos que coincidan con tu búsqueda. ¿Podrías proporcionar más detalles o intentar con otros términos?";
//       }
//     } else {
//       // Fallback to existing logic if not a natural language search for paraderos/rutas
//       // This is where the original generateBotResponse logic for greetings, specific options, etc., would go.
//       // For brevity, I'm keeping the original structure here. You'll merge this with your existing logic.
//       const saludosSinonimos = ["hola", "buenos días", "buenas tardes", "buenas noches", "saludos", "hey", "ey", "buen día", "que tal", "qué tal", "como estas", "cómo estás"];
//       if (saludosSinonimos.some(saludo => input.includes(saludo))) {
//         responseText = "¡Hola! 👋 ¿Cómo puedo ayudarte hoy con el transporte en Armenia?";
//         setShowOptions(true);
//         setOptionsType("main");
//       } else {
//         // Placeholder for other existing non-search logic
//          responseText = "No entendí tu consulta. Puedes preguntarme sobre rutas, paraderos, horarios o tarifas.";
//          setShowOptions(true);
//          setOptionsType("main");
//       }
//     }

//     return {
//       id: messages.length + 2, // Ensure unique ID
//       text: responseText,
//       sender: "bot",
//       timestamp: new Date(),
//     };
//   };

//   // Modified handleSendMessage to be async
//   const handleSendMessage = async (e) => {
//     if (e) e.preventDefault();
//     if (inputText.trim() === "") return;
//     const userMessage = {
//       id: messages.length + 1,
//       text: inputText,
//       sender: "user",
//       timestamp: new Date(),
//     };
//     setMessages((prev) => [...prev, userMessage]);
//     const currentInput = inputText;
//     setInputText("");
//     setIsTyping(true);
//     try {
//       const botResponse = await generateBotResponse(currentInput);
//       setMessages((prev) => [...prev, botResponse]);
//       if (isSaludo(currentInput.toLowerCase()) && !showOptions) { // Avoid re-showing options if already shown by generateBotResponse
//         setShowOptions(true);
//         setOptionsType("main");
//       }
//     } catch (error) {
//       console.error("Error al generar respuesta:", error);
//       setMessages((prev) => [...prev, {
//         id: messages.length + 2, // Ensure unique ID
//         text: "Lo siento, ha ocurrido un error al procesar tu solicitud. Por favor, intenta de nuevo.",
//         sender: "bot",
//         timestamp: new Date(),
//       }]);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   // Función para verificar si es un saludo (existing)
//   const isSaludo = (text) => {
//     const saludos = ["hola", "buenos días", "buenas tardes", "buenas noches", "saludos", "hey", "ey", "buen día", "que tal", "qué tal", "como estas", "cómo estás"];
//     return saludos.some(saludo => text.includes(saludo));
//   };

//   // Modified handleOptionClick to be async and handle new option types
//   const handleOptionClick = async (option) => {
//     const userMessage = {
//       id: messages.length + 1,
//       text: option.text,
//       sender: "user",
//       timestamp: new Date(),
//     };
//     setMessages((prev) => [...prev, userMessage]);
//     setIsTyping(true);
//     setShowOptions(false); // Hide options after click
//     try {
//       let botResponse;
//       switch (option.type) {
//         case "rutas":
//           botResponse = {
//             id: messages.length + 2,
//             text: "¿Sobre qué ruta o destino te gustaría información?",
//             sender: "bot",
//             timestamp: new Date(),
//           };
//           setShowOptions(true);
//           setOptionsType("rutas");
//           break;
//         case "horarios":
//           botResponse = {
//             id: messages.length + 2,
//             text: "Los buses del sistema ADMU operan en los siguientes horarios:\n\n• Lunes a Viernes: 5:00 AM - 10:00 PM\n• Sábados: 5:30 AM - 9:30 PM\n• Domingos y Festivos: 6:00 AM - 9:00 PM\n\n¿Te gustaría conocer los horarios de alguna ruta específica?",
//             sender: "bot",
//             timestamp: new Date(),
//           };
//           setShowOptions(true);
//           setOptionsType("horarios");
//           break;
//         case "tarifas":
//           botResponse = {
//             id: messages.length + 2,
//             text: "Información sobre tarifas del sistema ADMU:\n\n• Tarifa general: $2,900 pesos\n• Tarifa estudiantes (con carné): $1,800 pesos\n\nMétodo de pago:\n• Efectivo directamente al conductor\n\n¿Necesitas más información sobre tarifas?",
//             sender: "bot",
//             timestamp: new Date(),
//           };
//           setShowOptions(true);
//           setOptionsType("tarifas");
//           break;
//         case "paraderos":
//           botResponse = {
//             id: messages.length + 2,
//             text: "Los principales paraderos del sistema ADMU son:\n\n• Paradero Centro Comercial Portal del Quindío\n• Paradero Aeropuerto El Edén\n• Paradero Hospital San Juan de Dios\n• Paradero Universidad del Quindío\n• Paradero Terminal de Transportes\n• Paradero Estación de Policía Armenia\n\n¿Sobre cuál paradero te gustaría más información?",
//             sender: "bot",
//             timestamp: new Date(),
//           };
//           setShowOptions(true);
//           setOptionsType("paraderos");
//           break;
//         case "ruta_especifica": {
//           const rutaSeleccionada = rutas.find(r => r.name === option.value);
//           if (rutaSeleccionada) {
//             botResponse = {
//               id: messages.length + 2,
//               text: `Información sobre ${rutaSeleccionada.name}:\n\n• Origen: ${rutaSeleccionada.from}\n• Destino: ${rutaSeleccionada.to}\n• Duración aproximada: ${rutaSeleccionada.duration}\n• Estado actual: ${rutaSeleccionada.status}\n\n¿Necesitas información sobre otra ruta o servicio?`,
//               sender: "bot",
//               timestamp: new Date(),
//             };
//             if (rutaSeleccionada.recorrido && rutaSeleccionada.recorrido.length > 0) {
//                 setSelectedRoute(rutaSeleccionada);
//                 // Assuming the first paradero in the route is the one to highlight, or pass specific paradero if available
//                 const firstParaderoOfRoute = paraderos.find(p => p.id === rutaSeleccionada.paraderos[0]);
//                 setSelectedParadero(firstParaderoOfRoute || null);
//                 setShowRouteAnimation(true);
//             }
//           } else {
//             botResponse = {
//               id: messages.length + 2,
//               text: `Lo siento, no encontré información sobre ${option.value}. ¿Te gustaría consultar sobre otra ruta o servicio?`,
//               sender: "bot",
//               timestamp: new Date(),
//             };
//           }
//           setShowOptions(true);
//           setOptionsType("main");
//           break;
//         }
//         case "destino": {
//           // This logic needs to be adapted or removed if `getDestinoInfo` is deprecated by natural language search
//           // For now, let's assume it's still used for direct destination clicks
//           const destinoInfo = getDestinoInfo(option.value); // Ensure getDestinoInfo is defined or updated
//           botResponse = {
//             id: messages.length + 2,
//             text: destinoInfo,
//             sender: "bot",
//             timestamp: new Date(),
//           };
//           setShowOptions(true);
//           setOptionsType("main");
//           break;
//         }
//         case "horario_especifico":
//           botResponse = {
//             id: messages.length + 2,
//             text: `Horarios para ${option.value}:\n\n• Lunes a Viernes: 5:00 AM - 10:00 PM (cada 15 min en hora pico, 30 min resto del día)\n• Sábados: 5:30 AM - 9:30 PM (cada 20 min)\n• Domingos y Festivos: 6:00 AM - 9:00 PM (cada 30 min)\n\nHoras pico: 6:00-8:30 AM y 5:00-7:30 PM\n\n¿Necesitas información sobre otro horario o servicio?`,
//             sender: "bot",
//             timestamp: new Date(),
//           };
//           setShowOptions(true);
//           setOptionsType("main");
//           break;
//         case "paradero_especifico":
//         case "paradero_encontrado": // Handle selection from search results
//         case "paradero_seleccionado": // Handle selection from explicit paradero list
//         {
//           const paraderoId = option.value;
//           const paradero = paraderos.find(p => p.id === paraderoId);
//           if (paradero) {
//             setSelectedParadero(paradero);
//             const rutasDelParadero = await buscarRutasPorParadero(paraderoId);
//             let responseText = `📍 **${paradero.nombre}**\n\n${paradero.descripcion || "Descripción no disponible."}\n\n`;
//             if (rutasDelParadero.length > 0) {
//               responseText += `**Rutas que pasan por este paradero:**\n`;
//               rutasDelParadero.forEach(ruta => {
//                 responseText += `• ${ruta.name}: ${ruta.from} → ${ruta.to} (${ruta.duration})\n`;
//                 responseText += `  Estado: ${ruta.status}\n`;
//               });
//               if (rutasDelParadero[0].recorrido && rutasDelParadero[0].recorrido.length > 0) {
//                 setSelectedRoute(rutasDelParadero[0]);
//                 setShowRouteAnimation(true);
//               }
//             } else {
//               responseText += "No hay rutas asignadas a este paradero actualmente.";
//             }
//             if (paradero.sitiosAledanos && paradero.sitiosAledanos.length > 0) {
//               responseText += `\n\n**Sitios aledaños:**\n`;
//               paradero.sitiosAledanos.forEach(sitio => {
//                 responseText += `• ${sitio.nombre}: ${sitio.descripcion}\n`;
//               });
//             }
//             responseText += "\n\n*Puedes ver la ruta animada y la ubicación en el mapa haciendo clic en \"Ver en mapa\".*";
//             botResponse = {
//               id: messages.length + 2,
//               text: responseText,
//               sender: "bot",
//               timestamp: new Date(),
//             };
//           } else {
//             botResponse = {
//               id: messages.length + 2,
//               text: "Lo siento, no pude encontrar información sobre este paradero.",
//               sender: "bot",
//               timestamp: new Date(),
//             };
//           }
//           setShowOptions(true);
//           setOptionsType("main");
//           break;
//         }
//         case "buscar_rutas_paradero": // New option type
//             botResponse = {
//                 id: messages.length + 2,
//                 text: "Por favor, selecciona un paradero para ver las rutas que pasan por él, o escribe el nombre del paradero:",
//                 sender: "bot",
//                 timestamp: new Date(),
//             };
//             setShowOptions(true);
//             setOptionsType("buscar_rutas_paradero");
//             break;
//         case "volver":
//           botResponse = {
//             id: messages.length + 2,
//             text: "¿En qué más puedo ayudarte?",
//             sender: "bot",
//             timestamp: new Date(),
//           };
//           setShowOptions(true);
//           setOptionsType("main");
//           break;
//         default:
//           botResponse = {
//             id: messages.length + 2,
//             text: "¿En qué más puedo ayudarte?",
//             sender: "bot",
//             timestamp: new Date(),
//           };
//           setShowOptions(true);
//           setOptionsType("main");
//       }
//       setMessages((prev) => [...prev, botResponse]);
//     } catch (error) {
//       console.error("Error al procesar la opción:", error);
//       setMessages((prev) => [...prev, {
//         id: messages.length + 2,
//         text: "Lo siento, ha ocurrido un error al procesar tu solicitud. Por favor, intenta de nuevo.",
//         sender: "bot",
//         timestamp: new Date(),
//       }]);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   // Función para obtener información de destino (existing - might need update or deprecation)
//   const getDestinoInfo = (destino) => {
//     // This function might need to be updated to fetch from Firestore or be deprecated
//     // if natural language search covers its functionality.
//     const destinos = {
//       "Centro Comercial Portal del Quindío": {
//         rutas: ["Ruta 1", "Ruta 3", "Ruta 7", "Ruta 18"],
//         info: "Para llegar al Centro Comercial Portal del Quindío, te recomiendo las siguientes rutas:\n\n• Ruta 1: De Punto A a Punto B (20 minutos)\n  ✅ Estado: En tiempo\n• Ruta 3: De Punto E a Punto F (25 minutos)\n  ✅ Estado: En tiempo\n• Ruta 7: De Punto M a Punto N (30 minutos)\n  ✅ Estado: En tiempo\n• Ruta 18: De Punto Y a Punto Z (15 minutos)\n  ⚠️ Nota: Esta ruta presenta retraso de 10 minutos\n\nPuedes ver más detalles y el recorrido completo en la sección de Mapa."
//       },
//       // ... (other destinations from original code)
//     };
//     return destinos[destino] ? destinos[destino].info : `Lo siento, no tengo información específica sobre cómo llegar a ${destino}.`;
//   };

//   // Función para obtener rutas de un paradero (existing - might need update or deprecation)
//   const getRutasParadero = (paradero) => {
//     // This function should ideally fetch from the `paraderos` state or Firestore
//     const paraderoData = paraderos.find(p => p.nombre === paradero);
//     if (paraderoData && paraderoData.rutasQuePasan) {
//         return paraderoData.rutasQuePasan.map(rutaId => rutas.find(r => r.id === rutaId)?.name || "Ruta desconocida");
//     }
//     return ["No hay rutas asignadas"];
//   };

//   // Modified renderOptions to include new option types
//   const renderOptions = () => {
//     let options = [];
//     if (optionsType === "main") {
//       options = [
//         { icon: <MapPin size={14} />, text: "Información de rutas", type: "rutas" },
//         { icon: <Clock size={14} />, text: "Horarios de servicio", type: "horarios" },
//         { icon: <CreditCard size={14} />, text: "Tarifas y pagos", type: "tarifas" },
//         { icon: <MapPinned size={14} />, text: "Paraderos principales", type: "paraderos" },
//         { icon: <Navigation size={14} />, text: "Buscar rutas por paradero", type: "buscar_rutas_paradero" }
//       ];
//     } else if (optionsType === "rutas") {
//         options = rutas.map(ruta => ({
//             icon: <Bus size={14} />,
//             text: ruta.name,
//             type: "ruta_especifica",
//             value: ruta.name
//         }));
//         options.push({ icon: <ChevronDown size={14} />, text: "Volver", type: "volver" });
//     } else if (optionsType === "horarios") {
//         options = rutas.map(ruta => ({
//             icon: <Clock size={14} />,
//             text: `Horarios de ${ruta.name}`,
//             type: "horario_especifico",
//             value: ruta.name
//         }));
//         options.push({ icon: <ChevronDown size={14} />, text: "Volver", type: "volver" });
//     } else if (optionsType === "tarifas") {
//         // Example: No sub-options, just show info and then main options
//         options = [{ icon: <ChevronDown size={14} />, text: "Volver", type: "volver" }];
//     } else if (optionsType === "paraderos") {
//         options = paraderos.slice(0, 5).map(paradero => ({ // Show first 5 for brevity
//             icon: <MapPinned size={14} />,
//             text: paradero.nombre,
//             type: "paradero_especifico",
//             value: paradero.id
//         }));
//         options.push({ icon: <ChevronDown size={14} />, text: "Volver", type: "volver" });
//     } else if (optionsType === "paraderos_encontrados") {
//       options = paraderosEncontrados.map(paradero => ({
//         icon: <MapPinned size={14} />,
//         text: paradero.nombre,
//         type: "paradero_encontrado",
//         value: paradero.id
//       }));
//       options.push({ icon: <ChevronDown size={14} />, text: "Volver", type: "volver" });
//     } else if (optionsType === "buscar_rutas_paradero") {
//       options = paraderos.map(paradero => ({
//         icon: <MapPinned size={14} />,
//         text: paradero.nombre,
//         type: "paradero_seleccionado",
//         value: paradero.id
//       }));
//       options.push({ icon: <ChevronDown size={14} />, text: "Volver", type: "volver" });
//     }

//     return (
//       <div className="mt-3 space-y-1">
//         {options.map((option, index) => (
//           <button
//             key={index}
//             onClick={() => handleOptionClick(option)}
//             className="flex items-center space-x-2 w-full p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors text-left text-sm"
//           >
//             <span className="text-blue-600">{option.icon}</span>
//             <span>{option.text}</span>
//           </button>
//         ))}
//       </div>
//     );
//   };

//   // Helper function to format time (ensure this is defined or imported)
//   const formatTime = (date) => {
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   return (
//     <>
//       {/* Botón flotante para abrir/cerrar el chat (existing) */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="fixed bottom-6 right-6 z-[1000] bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 flex items-center justify-center"
//         aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
//       >
//         {isOpen ? <X size={20} /> : <MessageSquare size={20} />}
//       </button>

//       {/* Ventana del chat (existing) */}
//       <div
//         className={`fixed bottom-20 right-6 z-[1000] bg-white rounded-lg shadow-xl transition-all duration-300 flex flex-col w-80 md:w-96 max-h-[500px] ${
//           isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
//         }`}
//         style={{ transform: isOpen ? "translateY(0)" : "translateY(20px)" }}
//       >
//         {/* Encabezado del chat (existing) */}
//         <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-3 rounded-t-lg flex justify-between items-center">
//           <div className="flex items-center">
//             <MessageSquare size={16} className="mr-1.5" />
//             <h3 className="font-semibold text-sm">Asistente ADMU</h3>
//           </div>
//           <div className="flex items-center space-x-1.5">
//             <button
//               onClick={() => setIsOpen(false)} // Keep original close behavior
//               className="text-white hover:text-gray-200 transition"
//               aria-label="Minimizar chat" // Or "Cerrar chat"
//             >
//               <ChevronDown size={16} />
//             </button>
//             <button
//               onClick={() => setIsOpen(false)}
//               className="text-white hover:text-gray-200 transition"
//               aria-label="Cerrar chat"
//             >
//               <X size={16} />
//             </button>
//           </div>
//         </div>

//         {/* Área de mensajes (existing) */}
//         <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
//           {messages.length === 0 ? (
//             <div className="flex justify-center items-center h-full text-gray-400 text-xs">
//               Escribe &quot;Hola&quot; para comenzar una conversación
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {messages.map((message) => (
//                 <div
//                   key={message.id}
//                   className={`flex ${
//                     message.sender === "user" ? "justify-end" : "justify-start"
//                   }`}
//                 >
//                   <div
//                     className={`max-w-[80%] rounded-lg p-2.5 ${
//                       message.sender === "user"
//                         ? "bg-blue-600 text-white"
//                         : "bg-white border border-gray-200 text-gray-800"
//                     }`}
//                   >
//                     <div className="whitespace-pre-line text-xs">{message.text}</div>
//                     <div
//                       className={`text-[10px] mt-1 ${
//                         message.sender === "user" ? "text-blue-100" : "text-gray-500"
//                       }`}
//                     >
//                       {formatTime(message.timestamp)}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//               {isTyping && (
//                 <div className="flex justify-start">
//                   <div className="bg-white border border-gray-200 rounded-lg p-2.5 max-w-[80%]">
//                     <div className="flex space-x-1">
//                       <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
//                       <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
//                       <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//               {showOptions && renderOptions()}
//               <div ref={messagesEndRef} />
//             </div>
//           )}
//         </div>

//         {/* Route Animation Display Area - UPDATED with MapRouteAnimation */}
//         {showRouteAnimation && selectedRoute && selectedParadero && (
//           <div className="p-3 border-t border-gray-200 bg-white">
//             <div className="flex justify-between items-center mb-2">
//               <h4 className="text-sm font-semibold text-gray-700">Ruta: {selectedRoute.name} (Paradero: {selectedParadero.nombre})</h4>
//               <button 
//                 onClick={() => setShowRouteAnimation(false)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <X size={14} />
//               </button>
//             </div>
//             <MapRouteAnimation 
//               route={selectedRoute} 
//               paradero={selectedParadero} 
//               height={200}
//             />
//             {selectedParadero.imagen && 
//                 <img src={selectedParadero.imagen} alt={`Foto de ${selectedParadero.nombre}`} className="mt-2 rounded max-h-28 w-auto mx-auto" />
//             }
//             <div className="mt-2 flex justify-center">
//               <button
//                 onClick={() => window.open(`/map?route=${selectedRoute.id}&paradero=${selectedParadero.id}`, "_blank")}
//                 className="text-xs bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-1"
//               >
//                 Ver en mapa completo
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Área de entrada de texto (existing) */}
//         <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 bg-white rounded-b-lg">
//           <div className="flex items-center">
//             <input
//               type="text"
//               value={inputText}
//               onChange={(e) => setInputText(e.target.value)}
//               placeholder="Escribe tu mensaje..."
//               className="flex-1 border border-gray-300 rounded-l-lg py-1.5 px-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 text-sm placeholder:text-sm"
//             />
//             <button
//               type="submit"
//               className="bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg p-1.5 transition"
//               disabled={inputText.trim() === ""}
//             >
//               <Send size={16} />
//             </button>
//           </div>
//           <div className="mt-1.5 text-xs text-gray-500 flex items-center justify-center">
//             <div className="flex space-x-2">
//               <button 
//                 type="button" 
//                 onClick={() => setInputText("Hola")}
//                 className="flex items-center text-blue-600 hover:text-blue-800 text-xs"
//               >
//                 <MessageSquare size={10} className="mr-1" /> Saludar
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </>
//   );
// };

// export default ChatBot;



 // ChatBot.js con Mistral + Respuesta Automática de Tarifas
import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, ChevronDown } from "lucide-react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [rutas, setRutas] = useState([]);
  const [paraderos, setParaderos] = useState([]);
  const messagesEndRef = useRef(null);

  // TARIFAS FIJAS
  const tarifas = [
    { compania: "Buses Armenia SAS", ruta: "Ruta 33", tarifa: 2900, tipo: "General" },
    { compania: "Cootracir", ruta: "Salento", tarifa: 4000, tipo: "General" },
    { compania: "Cootracir", ruta: "Filandia", tarifa: 5500, tipo: "General" },
    { compania: "Cootracir", ruta: "Circasia", tarifa: 4000, tipo: "General" },
    { compania: "Buses Armenia SAS", ruta: "Ruta 37", tarifa: 2900, tipo: "General" },
    { compania: "Buses Armenia SAS", ruta: "Ruta 4", tarifa: 2900, tipo: "General" },
    { compania: "Buses Armenia SAS", ruta: "Ruta 18", tarifa: 2900, tipo: "General" },
    { compania: "Buses Armenia SAS", ruta: "Ruta 28", tarifa: 2900, tipo: "General" },
    { compania: "Buses Armenia SAS", ruta: "Ruta 31", tarifa: 2900, tipo: "General" },
  ];

  // Escuchar rutas en Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "rutas"), snapshot => {
      setRutas(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        duracion: doc.data().duracionEstimada || "No especificada",
        estado: doc.data().estado || "Desconocido"
      })));
    });
    return () => unsubscribe();
  }, []);

  // Escuchar paraderos en Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "paraderos"), snapshot => {
      setParaderos(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        descripcion: doc.data().descripcion || "Sin descripción"
      })));
    });
    return () => unsubscribe();
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const esSaludo = (texto) => {
    const saludos = ["hola", "buenos días", "buenas tardes", "buenas noches", "saludos", "hey", "ey", "buen día", "qué tal", "como estas", "cómo estás", "hi", "hello"];
    return saludos.some(s => texto.toLowerCase().includes(s));
  };

  const esDespedida = (texto) => {
    const despedidas = ["gracias", "thank you", "thanks", "te agradezco", "perfecto", "excelente", "muy bien", "ok gracias", "está bien", "listo", "chao", "adiós", "hasta luego"];
    return despedidas.some(d => texto.toLowerCase().includes(d));
  };

  const mencionaTarifas = (texto) => {
    const claves = ["tarifa", "tarifas", "precio", "precios", "vale", "cuánto cuesta", "cuánto vale"];
    return claves.some(p => texto.toLowerCase().includes(p));
  };

  const listaTarifasTexto = () => {
    return tarifas.map(t => `- ${t.compania}, ${t.ruta}: $${t.tarifa} (${t.tipo})`).join("\n");
  };

  const personalizarRespuesta = (userInput, mistralResponse) => {
    const input = userInput.toLowerCase();

    if (esSaludo(input)) {
      const hora = new Date().getHours();
      const saludo = hora < 12 ? "¡Buenos días!" : hora < 18 ? "¡Buenas tardes!" : "¡Buenas noches!";
      return `${saludo} 👋 Soy el asistente virtual de ADMU. ¿En qué te puedo ayudar hoy?`;
    }

    if (esDespedida(input)) {
      const despedidas = [
        "¡Con gusto! Aquí estaré cuando me necesites. 😊",
        "¡De nada! Vuelve cuando quieras saber más sobre transporte público. 🚌",
        "¡Perfecto! ¡Buen viaje! 🌟"
      ];
      return despedidas[Math.floor(Math.random() * despedidas.length)];
    }

    if (mencionaTarifas(input)) {
      return `Estas son las tarifas actuales:\n${listaTarifasTexto()}`;
    }

    return mistralResponse;
  };

  const askMistral = async (question) => {
    const rutasContext = rutas.map(r => `- ${r.nombre}: de ${r.origen} a ${r.destino}, duración: ${r.duracion}, estado: ${r.estado}`).join("\n");
    const paraderosContext = paraderos.map(p => `- ${p.nombre}: ${p.descripcion}`).join("\n");
    const tarifasContext = listaTarifasTexto();

    try {
      const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer SFT2EW3Q4IZ4uHqSi9j9Fapf6bZAmv1L"
        },
        body: JSON.stringify({
          model: "mistral-small",
          messages: [
            {
              role: "system",
              content: `Eres un asistente de transporte público ADMU Armenia.

Rutas:
${rutasContext}

Paraderos:
${paraderosContext}

Tarifas:
${tarifasContext}

Responde solo con la información proporcionada.`
            },
            { role: "user", content: question }
          ]
        })
      });
      const data = await res.json();
      return data.choices[0].message.content;
    } catch (err) {
      console.error(err);
      return "Lo siento, hubo un problema procesando tu solicitud.";
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputText.trim() === "") return;

    const userMessage = { id: messages.length + 1, text: inputText, sender: "user", timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);

    const currentInput = inputText;
    setInputText("");
    setIsTyping(true);

    try {
      let mistralResponse = "";
      if (!mencionaTarifas(currentInput)) {
        mistralResponse = await askMistral(currentInput);
      }
      const finalResponse = personalizarRespuesta(currentInput, mistralResponse);
      setMessages(prev => [...prev, { id: messages.length + 2, text: finalResponse, sender: "bot", timestamp: new Date() }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { id: messages.length + 2, text: "Lo siento, algo salió mal.", sender: "bot", timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (date) => date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg z-[1050]">
        {isOpen ? <X size={20} /> : <MessageSquare size={20} />}
      </button>

      <div className={`fixed bottom-20 right-6 bg-white rounded-lg shadow-xl w-80 md:w-96 max-h-[500px] flex flex-col ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"} z-[1050]`}>
        <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center">
            <MessageSquare size={16} className="mr-1.5" />
            <h3 className="text-sm font-semibold">Asistente Virtual ADMU</h3>
          </div>
          <button onClick={() => setIsOpen(false)}><ChevronDown size={16} /></button>
        </div>

        <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 text-xs">
              ¡Hola! Soy tu asistente virtual de ADMU. Escribe &quot;hola&quot; para comenzar...
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-lg p-2.5 ${msg.sender === "user" ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-800"}`}>
                    <div className="whitespace-pre-line text-xs">{msg.text}</div>
                    <div className={`text-[10px] mt-1 ${msg.sender === "user" ? "text-blue-100" : "text-gray-500"}`}>
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-lg p-2.5 max-w-[80%] flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-400"></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 bg-white rounded-b-lg">
          <div className="flex items-center">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className="flex-1 border border-gray-300 rounded-l-lg py-1.5 px-2.5 text-sm focus:outline-none text-gray-800"
            />
            <button type="submit" className="bg-blue-600 text-white rounded-r-lg p-1.5" disabled={inputText.trim() === ""}>
              <Send size={16} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ChatBot;
