import { useEffect, useRef } from 'react';
import L from 'leaflet';
import * as d3 from 'd3';
import 'leaflet/dist/leaflet.css';

const MapRouteAnimation = ({ route, paradero, height = 300 }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const graphRef = useRef(null);
  
  // Efecto para inicializar y actualizar el mapa
  useEffect(() => {
    if (!route || !route.recorrido || route.recorrido.length === 0 || !paradero) return;
    
    // Si el mapa ya existe, lo limpiamos
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
    
    // Inicializar el mapa
    const map = L.map(mapRef.current).setView([paradero.latitud, paradero.longitud], 14);
    mapInstanceRef.current = map;
    
    // Añadir capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Preparar los puntos del recorrido
    const points = route.recorrido.map(point => [point.latitud, point.longitud]);
    
    // Crear una polilínea para la ruta
    const routeLine = L.polyline(points, {
      color: '#3B82F6',
      weight: 5,
      opacity: 0.7,
      lineCap: 'round',
      lineJoin: 'round',
      dashArray: '10, 10',
      dashOffset: '0'
    }).addTo(map);
    
    // Animar la polilínea
    let offset = 0;
    const animateLine = () => {
      offset = (offset + 1) % 20;
      routeLine.setStyle({ dashOffset: `-${offset}` });
      requestAnimationFrame(animateLine);
    };
    animateLine();
    
    // Ajustar el mapa para mostrar toda la ruta
    map.fitBounds(routeLine.getBounds(), { padding: [30, 30] });
    
    // Añadir marcadores para los paraderos en la ruta
    route.recorrido.forEach(point => {
      if (point.isParadero) {
        const isHighlighted = point.id === paradero.id;
        const markerIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div style="background-color: ${isHighlighted ? '#EF4444' : '#3B82F6'}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white;"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });
        
        const marker = L.marker([point.latitud, point.longitud], { icon: markerIcon }).addTo(map);
        marker.bindPopup(`<b>${point.nombre}</b>`);
        
        if (isHighlighted) {
          marker.openPopup();
        }
      }
    });
    
    // Limpiar al desmontar
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [route, paradero]);
  
  // Efecto para crear la visualización tipo grafo
  useEffect(() => {
    if (!route || !route.recorrido || route.recorrido.length === 0 || !paradero || !graphRef.current) return;
    
    // Limpiar el SVG anterior si existe
    d3.select(graphRef.current).selectAll("*").remove();
    
    const svg = d3.select(graphRef.current);
    const width = graphRef.current.clientWidth;
    const graphHeight = 100; // Altura fija para el grafo
    
    // Configurar dimensiones y márgenes
    const margin = { top: 10, right: 20, bottom: 10, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = graphHeight - margin.top - margin.bottom;
    
    // Crear grupo principal con margen
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Preparar datos para la visualización
    const nodes = route.recorrido.map((point, index) => ({
      id: point.id || `punto-${index}`,
      name: point.nombre || `Punto ${index + 1}`,
      isParadero: point.isParadero || false,
      isHighlighted: point.id === paradero.id,
      x: null,  // Se calculará después
      y: null   // Se calculará después
    }));
    
    // Calcular posiciones de los nodos en línea horizontal
    nodes.forEach((node, i) => {
      node.x = (i / (nodes.length - 1)) * innerWidth;
      node.y = innerHeight / 2;
    });
    
    // Dibujar líneas entre nodos
    const lineGenerator = d3.line()
      .x(d => d.x)
      .y(d => d.y)
      .curve(d3.curveCardinal);
    
    // Dibujar la línea de la ruta
    g.append("path")
      .datum(nodes)
      .attr("fill", "none")
      .attr("stroke", "#3B82F6")
      .attr("stroke-width", 3)
      .attr("d", lineGenerator)
      .style("opacity", 0)
      .transition()
      .duration(1000)
      .style("opacity", 1);
    
    // Crear grupo para nodos
    const nodeGroup = g.selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x},${d.y})`)
      .style("opacity", 0);
    
    // Añadir círculos para los nodos
    nodeGroup.append("circle")
      .attr("r", d => d.isParadero ? 8 : 5)
      .attr("fill", d => d.isHighlighted ? "#EF4444" : d.isParadero ? "#3B82F6" : "#9CA3AF")
      .attr("stroke", "#FFFFFF")
      .attr("stroke-width", 2);
    
    // Añadir etiquetas para los nodos
    nodeGroup.append("text")
      .text(d => d.name)
      .attr("text-anchor", "middle")
      .attr("dy", d => d.isParadero ? -12 : -10)
      .attr("font-size", "10px")
      .attr("fill", "#4B5563");
    
    // Animar la aparición de los nodos secuencialmente
    nodeGroup
      .transition()
      .duration(500)
      .delay((d, i) => i * 200)
      .style("opacity", 1);
    
    // Añadir tooltip al hacer hover sobre los nodos
    nodeGroup
      .append("title")
      .text(d => d.name);
    
    // Hacer los nodos interactivos
    nodeGroup
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        if (d.isParadero && mapInstanceRef.current) {
          // Buscar el punto correspondiente en el recorrido
          const point = route.recorrido.find(p => p.id === d.id);
          if (point) {
            mapInstanceRef.current.setView([point.latitud, point.longitud], 15);
          }
        }
      });
    
  }, [route, paradero]);
  
  return (
    <div className="route-animation-container w-full border border-gray-200 rounded-lg overflow-hidden">
      <div className="graph-container" style={{ height: '100px', width: '100%', borderBottom: '1px solid #e5e7eb' }}>
        <svg ref={graphRef} width="100%" height="100px" />
      </div>
      <div ref={mapRef} style={{ height: `${height}px`, width: '100%' }} />
    </div>
  );
};

export default MapRouteAnimation;
