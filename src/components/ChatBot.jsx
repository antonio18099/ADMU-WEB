import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, ChevronDown, MapPin, Bus, Clock, CreditCard, MapPinned, HelpCircle } from "lucide-react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [rutas, setRutas] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [optionsType, setOptionsType] = useState("");
  const messagesEndRef = useRef(null);

  // Obtener rutas de Firestore
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

  // Scroll al último mensaje cuando se añade uno nuevo
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messages]);

  // Función para manejar el envío de mensajes
  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (inputText.trim() === "") return;

    // Añadir mensaje del usuario
    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    // Simular que el bot está escribiendo
    setIsTyping(true);
    setTimeout(() => {
      const botResponse = generateBotResponse(inputText);
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
      
      // Mostrar opciones después de la respuesta del bot si es un saludo
      if (isSaludo(inputText.toLowerCase())) {
        setShowOptions(true);
        setOptionsType("main");
      }
    }, 1000);
  };

  // Función para verificar si es un saludo
  const isSaludo = (text) => {
    const saludos = ["hola", "buenos días", "buenas tardes", "buenas noches", "saludos", "hey", "ey", "buen día", "que tal", "qué tal", "como estas", "cómo estás"];
    return saludos.some(saludo => text.includes(saludo));
  };

  // Función para manejar clic en opciones
  const handleOptionClick = (option) => {
    // Añadir la opción seleccionada como mensaje del usuario
    const userMessage = {
      id: messages.length + 1,
      text: option.text,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    
    // Simular que el bot está escribiendo
    setIsTyping(true);
    setTimeout(() => {
      let botResponse;
      
      // Generar respuesta según el tipo de opción
      switch (option.type) {
        case "rutas":
          botResponse = {
            id: messages.length + 2,
            text: "¿Sobre qué ruta o destino te gustaría información?",
            sender: "bot",
            timestamp: new Date(),
          };
          setShowOptions(true);
          setOptionsType("rutas");
          break;
        case "horarios":
          botResponse = {
            id: messages.length + 2,
            text: "Los buses del sistema ADMU operan en los siguientes horarios:\n\n• Lunes a Viernes: 5:00 AM - 10:00 PM\n• Sábados: 5:30 AM - 9:30 PM\n• Domingos y Festivos: 6:00 AM - 9:00 PM\n\n¿Te gustaría conocer los horarios de alguna ruta específica?",
            sender: "bot",
            timestamp: new Date(),
          };
          setShowOptions(true);
          setOptionsType("horarios");
          break;
        case "tarifas":
          botResponse = {
            id: messages.length + 2,
            text: "Información sobre tarifas del sistema ADMU:\n\n• Tarifa general: $2,900 pesos\n• Tarifa estudiantes (con carné): $1,800 pesos\n\nMétodo de pago:\n• Efectivo directamente al conductor\n\n¿Necesitas más información sobre tarifas?",
            sender: "bot",
            timestamp: new Date(),
          };
          setShowOptions(true);
          setOptionsType("tarifas");
          break;
        case "paraderos":
          botResponse = {
            id: messages.length + 2,
            text: "Los principales paraderos del sistema ADMU son:\n\n• Paradero Centro Comercial Portal del Quindío\n• Paradero Aeropuerto El Edén\n• Paradero Hospital San Juan de Dios\n• Paradero Universidad del Quindío\n• Paradero Terminal de Transportes\n• Paradero Estación de Policía Armenia\n\n¿Sobre cuál paradero te gustaría más información?",
            sender: "bot",
            timestamp: new Date(),
          };
          setShowOptions(true);
          setOptionsType("paraderos");
          break;
        case "ruta_especifica": {
          const rutaSeleccionada = rutas.find(r => r.name === option.value);
          if (rutaSeleccionada) {
            botResponse = {
              id: messages.length + 2,
              text: `Información sobre ${rutaSeleccionada.name}:\n\n• Origen: ${rutaSeleccionada.from}\n• Destino: ${rutaSeleccionada.to}\n• Duración aproximada: ${rutaSeleccionada.duration}\n• Estado actual: ${rutaSeleccionada.status}\n\n¿Necesitas información sobre otra ruta o servicio?`,
              sender: "bot",
              timestamp: new Date(),
            };
          } else {
            botResponse = {
              id: messages.length + 2,
              text: `Lo siento, no encontré información sobre ${option.value}. ¿Te gustaría consultar sobre otra ruta o servicio?`,
              sender: "bot",
              timestamp: new Date(),
            };
          }
          setShowOptions(true);
          setOptionsType("main");
          break;
        }
        case "destino": {
          const destinoInfo = getDestinoInfo(option.value);
          botResponse = {
            id: messages.length + 2,
            text: destinoInfo,
            sender: "bot",
            timestamp: new Date(),
          };
          setShowOptions(true);
          setOptionsType("main");
          break;
        }
        case "horario_especifico":
          botResponse = {
            id: messages.length + 2,
            text: `Horarios para ${option.value}:\n\n• Lunes a Viernes: 5:00 AM - 10:00 PM (cada 15 min en hora pico, 30 min resto del día)\n• Sábados: 5:30 AM - 9:30 PM (cada 20 min)\n• Domingos y Festivos: 6:00 AM - 9:00 PM (cada 30 min)\n\nHoras pico: 6:00-8:30 AM y 5:00-7:30 PM\n\n¿Necesitas información sobre otro horario o servicio?`,
            sender: "bot",
            timestamp: new Date(),
          };
          setShowOptions(true);
          setOptionsType("main");
          break;
        case "paradero_especifico":
          botResponse = {
            id: messages.length + 2,
            text: `Información sobre ${option.value}:\n\nEste paradero cuenta con las siguientes rutas:\n• ${getRutasParadero(option.value).join("\n• ")}\n\nHorario de operación: 5:00 AM - 10:00 PM\n\n¿Necesitas información sobre otro paradero o servicio?`,
            sender: "bot",
            timestamp: new Date(),
          };
          setShowOptions(true);
          setOptionsType("main");
          break;
        case "volver":
          botResponse = {
            id: messages.length + 2,
            text: "¿En qué más puedo ayudarte?",
            sender: "bot",
            timestamp: new Date(),
          };
          setShowOptions(true);
          setOptionsType("main");
          break;
        default:
          botResponse = {
            id: messages.length + 2,
            text: "¿En qué más puedo ayudarte?",
            sender: "bot",
            timestamp: new Date(),
          };
          setShowOptions(true);
          setOptionsType("main");
      }
      
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  // Función para obtener información de destino
  const getDestinoInfo = (destino) => {
    const destinos = {
      "Centro Comercial Portal del Quindío": {
        rutas: ["Ruta 1", "Ruta 3", "Ruta 7", "Ruta 18"],
        info: "Para llegar al Centro Comercial Portal del Quindío, te recomiendo las siguientes rutas:\n\n• Ruta 1: De Punto A a Punto B (20 minutos)\n  ✅ Estado: En tiempo\n• Ruta 3: De Punto E a Punto F (25 minutos)\n  ✅ Estado: En tiempo\n• Ruta 7: De Punto M a Punto N (30 minutos)\n  ✅ Estado: En tiempo\n• Ruta 18: De Punto Y a Punto Z (15 minutos)\n  ⚠️ Nota: Esta ruta presenta retraso de 10 minutos\n\nPuedes ver más detalles y el recorrido completo en la sección de Mapa."
      },
      "Aeropuerto El Edén": {
        rutas: ["Ruta 2", "Ruta 5", "Ruta 9", "Ruta 28"],
        info: "Para llegar al Aeropuerto El Edén, te recomiendo las siguientes rutas:\n\n• Ruta 2: De Punto C a Punto D (15 minutos)\n  ⚠️ Nota: Esta ruta presenta retraso de 5 minutos\n• Ruta 5: De Punto I a Punto J (40 minutos)\n  ✅ Estado: En tiempo\n• Ruta 9: De Punto Q a Punto R (35 minutos)\n  ✅ Estado: En tiempo\n• Ruta 28: De Punto AB a Punto AC (25 minutos)\n  ✅ Estado: En tiempo\n\nPuedes ver más detalles y el recorrido completo en la sección de Mapa."
      },
      "Hospital San Juan de Dios": {
        rutas: ["Ruta 4", "Ruta 6", "Ruta 31", "Ruta 35"],
        info: "Para llegar al Hospital San Juan de Dios, te recomiendo las siguientes rutas:\n\n• Ruta 4: De Punto G a Punto H (18 minutos)\n  ✅ Estado: En tiempo\n• Ruta 6: De Punto K a Punto L (22 minutos)\n  ✅ Estado: En tiempo\n• Ruta 31: De Punto AD a Punto AE (30 minutos)\n  ⚠️ Nota: Esta ruta presenta retraso de 8 minutos\n• Ruta 35: De Punto AF a Punto AG (25 minutos)\n  ✅ Estado: En tiempo\n\nPuedes ver más detalles y el recorrido completo en la sección de Mapa."
      },
      "Universidad del Quindío": {
        rutas: ["Ruta 1", "Ruta 10", "Ruta 24", "Ruta 37"],
        info: "Para llegar a la Universidad del Quindío, te recomiendo las siguientes rutas:\n\n• Ruta 1: De Punto A a Punto B (20 minutos)\n  ✅ Estado: En tiempo\n• Ruta 10: De Punto S a Punto T (15 minutos)\n  ✅ Estado: En tiempo\n• Ruta 24: De Punto AH a Punto AI (25 minutos)\n  ✅ Estado: En tiempo\n• Ruta 37: De Punto AJ a Punto AK (30 minutos)\n  ⚠️ Nota: Esta ruta presenta retraso de 5 minutos\n\nPuedes ver más detalles y el recorrido completo en la sección de Mapa."
      },
      "Terminal de Transportes": {
        rutas: ["Ruta 2", "Ruta 11", "Ruta 15", "Ruta 33"],
        info: "Para llegar a la Terminal de Transportes, te recomiendo las siguientes rutas:\n\n• Ruta 2: De Punto C a Punto D (15 minutos)\n  ⚠️ Nota: Esta ruta presenta retraso de 5 minutos\n• Ruta 11: De Punto U a Punto V (20 minutos)\n  ✅ Estado: En tiempo\n• Ruta 15: De Punto W a Punto X (25 minutos)\n  ✅ Estado: En tiempo\n• Ruta 33: De Punto AL a Punto AM (30 minutos)\n  ✅ Estado: En tiempo\n\nPuedes ver más detalles y el recorrido completo en la sección de Mapa."
      },
      "Estación de Policía Armenia": {
        rutas: ["Ruta 3", "Ruta 12", "Ruta 27"],
        info: "Para llegar a la Estación de Policía Armenia, te recomiendo las siguientes rutas:\n\n• Ruta 3: De Punto E a Punto F (25 minutos)\n  ✅ Estado: En tiempo\n• Ruta 12: De Punto AN a Punto AO (15 minutos)\n  ✅ Estado: En tiempo\n• Ruta 27: De Punto AP a Punto AQ (20 minutos)\n  ⚠️ Nota: Esta ruta presenta retraso de 10 minutos\n\nPuedes ver más detalles y el recorrido completo en la sección de Mapa."
      }
    };
    
    return destinos[destino] ? destinos[destino].info : `Lo siento, no tengo información específica sobre cómo llegar a ${destino}.`;
  };

  // Función para obtener rutas de un paradero
  const getRutasParadero = (paradero) => {
    const paraderos = {
      "Paradero Centro Comercial Portal del Quindío": ["Ruta 1", "Ruta 3", "Ruta 7", "Ruta 18"],
      "Paradero Aeropuerto El Edén": ["Ruta 2", "Ruta 5", "Ruta 9", "Ruta 28"],
      "Paradero Hospital San Juan de Dios": ["Ruta 4", "Ruta 6", "Ruta 31", "Ruta 35"],
      "Paradero Universidad del Quindío": ["Ruta 1", "Ruta 10", "Ruta 24", "Ruta 37"],
      "Paradero Terminal de Transportes": ["Ruta 2", "Ruta 11", "Ruta 15", "Ruta 33"],
      "Paradero Estación de Policía Armenia": ["Ruta 3", "Ruta 12", "Ruta 27"]
    };
    
    return paraderos[paradero] || ["No hay rutas asignadas"];
  };

  // Función para generar respuestas del bot basadas en el input del usuario
  const generateBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    let responseText = "";

    // Arrays de sinónimos para mejorar la detección de intenciones
    const rutasSinonimos = ["ruta", "bus", "transporte", "ir a", "cómo llegar", "como llegar", "como ir", "llegar a", "ir hacia", "transporte a", "bus a", "autobus", "autobús", "camino", "trayecto"];
    const horariosSinonimos = ["horario", "hora", "cuando", "cuándo", "frecuencia", "a qué hora", "a que hora", "cada cuanto", "cada cuánto", "tiempo", "pasa", "pasan"];
    const tarifasSinonimos = ["tarifa", "precio", "costo", "valor", "cuánto cuesta", "cuanto cuesta", "cuánto vale", "cuanto vale", "pasaje", "boleto", "tiquete", "pagar", "cobran", "vale", "cuesta", "dinero"];
    const paraderosSinonimos = ["paradero", "parada", "estación", "estacion", "donde tomar", "donde abordar", "sitio", "lugar", "punto", "terminal"];
    const saludosSinonimos = ["hola", "buenos días", "buenas tardes", "buenas noches", "saludos", "hey", "ey", "buen día", "que tal", "qué tal", "como estas", "cómo estás"];
    const agradecimientosSinonimos = ["gracias", "muchas gracias", "te agradezco", "agradecido", "agradecida", "thanks", "thx", "muy amable"];
    const identidadSinonimos = ["quién eres", "quien eres", "qué eres", "que eres", "cómo te llamas", "como te llamas", "tu nombre", "eres un bot", "eres humano", "eres persona", "eres robot"];

    // Verificar si el usuario está preguntando sobre rutas
    if (rutasSinonimos.some(sinonimo => input.includes(sinonimo))) {
      // Buscar menciones de lugares específicos
      const destinations = [
        { keywords: ["centro", "comercial", "portal", "quindío", "quindio", "portal del quindio"], name: "Centro Comercial Portal del Quindío" },
        { keywords: ["aeropuerto", "eden", "el eden", "edén", "el edén"], name: "Aeropuerto El Edén" },
        { keywords: ["hospital", "san juan", "san juan de dios", "centro médico", "centro medico"], name: "Hospital San Juan de Dios" },
        { keywords: ["universidad", "quindio", "universidad del quindio", "u del quindio", "campus"], name: "Universidad del Quindío" },
        { keywords: ["terminal", "transportes", "terminal de transportes", "buses", "terminal de buses"], name: "Terminal de Transportes" },
        { keywords: ["estación", "policia", "estacion de policia", "policía", "estación de policía"], name: "Estación de Policía Armenia" },
      ];

      let foundDestination = false;
      for (const dest of destinations) {
        if (dest.keywords.some(keyword => input.includes(keyword))) {
          responseText = getDestinoInfo(dest.name);
          foundDestination = true;
          break;
        }
      }

      if (!foundDestination) {
        // Si menciona "ruta" con un número específico
        const routeNumberMatch = input.match(/ruta\s+(\d+)/i) || input.match(/(\d+)/);
        if (routeNumberMatch) {
          const routeNumber = parseInt(routeNumberMatch[1]);
          const routeName = `Ruta ${routeNumber}`;
          const route = rutas.find(r => r.name === routeName);
          
          if (route) {
            responseText = `Información sobre ${route.name}:\n\n`;
            responseText += `• Origen: ${route.from}\n`;
            responseText += `• Destino: ${route.to}\n`;
            responseText += `• Duración aproximada: ${route.duration}\n`;
            responseText += `• Estado actual: ${route.status}\n\n`;
            responseText += `Esta ruta pasa por varios paraderos importantes. ¿Te gustaría conocer más detalles sobre algún paradero específico?`;
          } else {
            responseText = `No encontré información sobre la Ruta ${routeNumber}. Las rutas disponibles son: ${rutas.slice(0, 5).map(r => r.name).join(", ")}, entre otras. ¿Sobre cuál te gustaría información?`;
          }
        } else {
          responseText = "Puedo ayudarte con información sobre rutas y cómo llegar a diferentes destinos. Selecciona una opción para obtener información específica.";
          setTimeout(() => {
            setShowOptions(true);
            setOptionsType("rutas");
          }, 500);
        }
      }
    } 
    // Verificar si el usuario está preguntando sobre horarios
    else if (horariosSinonimos.some(sinonimo => input.includes(sinonimo))) {
      // Buscar si pregunta por una ruta específica
      const routeNumberMatch = input.match(/ruta\s+(\d+)/i) || input.match(/(\d+)/);
      if (routeNumberMatch) {
        const routeNumber = parseInt(routeNumberMatch[1]);
        responseText = `Horarios para la Ruta ${routeNumber}:\n\n`;
        responseText += `• Lunes a Viernes: 5:00 AM - 10:00 PM (cada 15 min en hora pico, 30 min resto del día)\n`;
        responseText += `• Sábados: 5:30 AM - 9:30 PM (cada 20 min)\n`;
        responseText += `• Domingos y Festivos: 6:00 AM - 9:00 PM (cada 30 min)\n\n`;
        responseText += `Horas pico: 6:00-8:30 AM y 5:00-7:30 PM\n`;
        responseText += `Nota: Los horarios pueden variar según condiciones de tráfico y eventos especiales.`;
      } else {
        responseText = "Los buses del sistema ADMU operan en los siguientes horarios:\n\n";
        responseText += "• Lunes a Viernes: 5:00 AM - 10:00 PM\n";
        responseText += "• Sábados: 5:30 AM - 9:30 PM\n";
        responseText += "• Domingos y Festivos: 6:00 AM - 9:00 PM\n\n";
        responseText += "La frecuencia varía según la ruta y hora del día:\n";
        responseText += "• Horas pico (6:00-8:30 AM y 5:00-7:30 PM): Cada 15-20 minutos\n";
        responseText += "• Resto del día: Cada 30 minutos\n\n";
        responseText += "Selecciona una ruta para ver sus horarios específicos:";
        setTimeout(() => {
          setShowOptions(true);
          setOptionsType("horarios");
        }, 500);
      }
    }
    // Verificar si el usuario está preguntando sobre tarifas
    else if (tarifasSinonimos.some(sinonimo => input.includes(sinonimo))) {
      responseText = "Información sobre tarifas del sistema ADMU:\n\n";
      responseText += "• Tarifa general: $2,900 pesos\n";
      responseText += "• Tarifa estudiantes (con carné): $1,800 pesos\n\n";
      responseText += "Método de pago:\n";
      responseText += "• Efectivo directamente al conductor\n";
      setTimeout(() => {
        setShowOptions(true);
        setOptionsType("tarifas");
      }, 500);
    }
    // Verificar si el usuario está preguntando sobre paraderos
    else if (paraderosSinonimos.some(sinonimo => input.includes(sinonimo))) {
      responseText = "Los principales paraderos del sistema ADMU son:\n\n";
      responseText += "• Paradero Centro Comercial Portal del Quindío\n";
      responseText += "• Paradero Aeropuerto El Edén\n";
      responseText += "• Paradero Hospital San Juan de Dios\n";
      responseText += "• Paradero Universidad del Quindío\n";
      responseText += "• Paradero Terminal de Transportes\n";
      responseText += "• Paradero Estación de Policía Armenia\n\n";
      responseText += "Selecciona un paradero para más información:";
      setTimeout(() => {
        setShowOptions(true);
        setOptionsType("paraderos");
      }, 500);
    }
    // Verificar si el usuario está saludando
    else if (saludosSinonimos.some(sinonimo => input.includes(sinonimo))) {
      responseText = "¡Hola! Soy el asistente virtual de ADMU. Estoy aquí para ayudarte con información sobre rutas, paraderos, horarios y tarifas. ¿En qué puedo ayudarte hoy?";
      setTimeout(() => {
        setShowOptions(true);
        setOptionsType("main");
      }, 500);
    }
    // Verificar si el usuario está agradeciendo
    else if (agradecimientosSinonimos.some(sinonimo => input.includes(sinonimo))) {
      responseText = "¡De nada! Ha sido un placer ayudarte. Si tienes más preguntas sobre rutas, horarios, tarifas o cualquier otro aspecto del sistema de transporte ADMU, no dudes en consultarme. ¡Que tengas un excelente viaje!";
      setTimeout(() => {
        setShowOptions(true);
        setOptionsType("main");
      }, 500);
    }
    // Verificar si el usuario está preguntando sobre el chatbot
    else if (identidadSinonimos.some(sinonimo => input.includes(sinonimo))) {
      responseText = "Soy el asistente virtual de ADMU, diseñado para ayudarte con información sobre el sistema de transporte público de Armenia. Puedo responder preguntas sobre:\n\n• Rutas y cómo llegar a diferentes destinos\n• Horarios de servicio de los buses\n• Tarifas y métodos de pago\n• Ubicación de paraderos\n• Estado actual de las rutas\n\nEstoy aquí para hacer tu experiencia de viaje más fácil y resolver todas tus dudas sobre el transporte público.";
      setTimeout(() => {
        setShowOptions(true);
        setOptionsType("main");
      }, 500);
    }
    // Respuesta por defecto mejorada
    else {
      responseText = "Entiendo que necesitas ayuda. Selecciona una de las siguientes opciones para que pueda asistirte mejor:";
      setTimeout(() => {
        setShowOptions(true);
        setOptionsType("main");
      }, 500);
    }

    return {
      id: messages.length + 2,
      text: responseText,
      sender: "bot",
      timestamp: new Date(),
    };
  };

  // Formatear la hora para los mensajes
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Renderizar opciones según el tipo
  const renderOptions = () => {
    if (!showOptions) return null;

    let options = [];
    
    switch (optionsType) {
      case "main":
        options = [
          { icon: <MapPin size={14} />, text: "Información de rutas", type: "rutas" },
          { icon: <Clock size={14} />, text: "Horarios de servicio", type: "horarios" },
          { icon: <CreditCard size={14} />, text: "Tarifas y pagos", type: "tarifas" },
          { icon: <MapPinned size={14} />, text: "Paraderos", type: "paraderos" }
        ];
        break;
      case "rutas":
        // Opciones de destinos populares
        options = [
          { icon: <MapPin size={14} />, text: "Centro Comercial Portal del Quindío", type: "destino", value: "Centro Comercial Portal del Quindío" },
          { icon: <MapPin size={14} />, text: "Aeropuerto El Edén", type: "destino", value: "Aeropuerto El Edén" },
          { icon: <MapPin size={14} />, text: "Hospital San Juan de Dios", type: "destino", value: "Hospital San Juan de Dios" },
          { icon: <MapPin size={14} />, text: "Universidad del Quindío", type: "destino", value: "Universidad del Quindío" },
          { icon: <MapPin size={14} />, text: "Terminal de Transportes", type: "destino", value: "Terminal de Transportes" },
          { icon: <MapPin size={14} />, text: "Estación de Policía Armenia", type: "destino", value: "Estación de Policía Armenia" },
          { icon: <HelpCircle size={14} />, text: "Volver al menú principal", type: "volver" }
        ];
        
        // Añadir rutas específicas si hay datos disponibles
        if (rutas.length > 0) {
          const rutasOptions = rutas.slice(0, 5).map(ruta => ({
            icon: <Bus size={14} />,
            text: ruta.name,
            type: "ruta_especifica",
            value: ruta.name
          }));
          options = [...rutasOptions, ...options];
        }
        break;
      case "horarios":
        // Opciones de rutas para horarios
        options = [
          { icon: <Clock size={14} />, text: "Ruta 1", type: "horario_especifico", value: "la Ruta 1" },
          { icon: <Clock size={14} />, text: "Ruta 2", type: "horario_especifico", value: "la Ruta 2" },
          { icon: <Clock size={14} />, text: "Ruta 3", type: "horario_especifico", value: "la Ruta 3" },
          { icon: <Clock size={14} />, text: "Ruta 4", type: "horario_especifico", value: "la Ruta 4" },
          { icon: <Clock size={14} />, text: "Ruta 5", type: "horario_especifico", value: "la Ruta 5" },
          { icon: <HelpCircle size={14} />, text: "Volver al menú principal", type: "volver" }
        ];
        break;
      case "tarifas":
        options = [
          { icon: <CreditCard size={14} />, text: "Descuentos especiales", type: "tarifas", value: "descuentos" },
          { icon: <HelpCircle size={14} />, text: "Volver al menú principal", type: "volver" }
        ];
        break;
      case "paraderos":
        options = [
          { icon: <MapPinned size={14} />, text: "Paradero Centro Comercial Portal del Quindío", type: "paradero_especifico", value: "Paradero Centro Comercial Portal del Quindío" },
          { icon: <MapPinned size={14} />, text: "Paradero Aeropuerto El Edén", type: "paradero_especifico", value: "Paradero Aeropuerto El Edén" },
          { icon: <MapPinned size={14} />, text: "Paradero Hospital San Juan de Dios", type: "paradero_especifico", value: "Paradero Hospital San Juan de Dios" },
          { icon: <MapPinned size={14} />, text: "Paradero Universidad del Quindío", type: "paradero_especifico", value: "Paradero Universidad del Quindío" },
          { icon: <MapPinned size={14} />, text: "Paradero Terminal de Transportes", type: "paradero_especifico", value: "Paradero Terminal de Transportes" },
          { icon: <MapPinned size={14} />, text: "Paradero Estación de Policía Armenia", type: "paradero_especifico", value: "Paradero Estación de Policía Armenia" },
          { icon: <HelpCircle size={14} />, text: "Volver al menú principal", type: "volver" }
        ];
        break;
      default:
        options = [
          { icon: <MapPin size={14} />, text: "Información de rutas", type: "rutas" },
          { icon: <Clock size={14} />, text: "Horarios de servicio", type: "horarios" },
          { icon: <CreditCard size={14} />, text: "Tarifas y pagos", type: "tarifas" },
          { icon: <MapPinned size={14} />, text: "Paraderos", type: "paraderos" }
        ];
    }

    return (
      <div className="mt-3 space-y-1">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option)}
            className="flex items-center space-x-2 w-full p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors text-left text-sm"
          >
            <span className="text-blue-600">{option.icon}</span>
            <span>{option.text}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Botón flotante para abrir/cerrar el chat */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[1000] bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 flex items-center justify-center"
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
      >
        {isOpen ? <X size={20} /> : <MessageSquare size={20} />}
      </button>

      {/* Ventana del chat */}
      <div
        className={`fixed bottom-20 right-6 z-[1000] bg-white rounded-lg shadow-xl transition-all duration-300 flex flex-col w-80 md:w-96 max-h-[500px] ${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
        style={{ transform: isOpen ? "translateY(0)" : "translateY(20px)" }}
      >
        {/* Encabezado del chat */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-3 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center">
            <MessageSquare size={16} className="mr-1.5" />
            <h3 className="font-semibold text-sm">Asistente ADMU</h3>
          </div>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition"
              aria-label="Minimizar chat"
            >
              <ChevronDown size={16} />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition"
              aria-label="Cerrar chat"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Área de mensajes */}
        <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
          {messages.length === 0 ? (
            <div className="flex justify-center items-center h-full text-gray-400 text-xs">
              Escribe &quot;Hola&quot; para comenzar una conversación
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-2.5 ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-gray-200 text-gray-800"
                    }`}
                  >
                    <div className="whitespace-pre-line text-xs">{message.text}</div>
                    <div
                      className={`text-[10px] mt-1 ${
                        message.sender === "user" ? "text-blue-100" : "text-gray-500"
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-lg p-2.5 max-w-[80%]">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </div>
                </div>
              )}
              {showOptions && renderOptions()}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Área de entrada de texto */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 bg-white rounded-b-lg">
          <div className="flex items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className="flex-1 border border-gray-300 rounded-l-lg py-1.5 px-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 text-sm placeholder:text-sm"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg p-1.5 transition"
              disabled={inputText.trim() === ""}
            >
              <Send size={16} />
            </button>
          </div>
          <div className="mt-1.5 text-xs text-gray-500 flex items-center justify-center">
            <div className="flex space-x-2">
              <button 
                type="button" 
                onClick={() => setInputText("Hola")}
                className="flex items-center text-blue-600 hover:text-blue-800 text-xs"
              >
                <MessageSquare size={10} className="mr-1" /> Saludar
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default ChatBot;