// src/components/RouteAnimation.jsx
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const RouteAnimation = ({ route, paradero, height = 150 }) => {
  const svgRef = useRef(null);
  
  useEffect(() => {
    if (!route || !route.recorrido || route.recorrido.length === 0 || !paradero) return;
    
    // Limpiar el SVG anterior si existe
    d3.select(svgRef.current).selectAll("*").remove();
    
    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    
    // Configurar dimensiones y márgenes
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // Crear grupo principal con margen
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Preparar datos para la visualización
    const nodes = route.recorrido.map((point, index) => ({
      id: index,
      name: point.nombre || `Punto ${index + 1}`,
      isParadero: point.isParadero || false,
      isHighlighted: point.id === paradero.id,
      x: null,  // Se calculará después
      y: null   // Se calculará después
    }));
    
    // Crear enlaces entre nodos consecutivos
    const links = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      links.push({
        source: i,
        target: i + 1
      });
    }
    
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
      .attr("stroke", "#3B82F6")  // Color azul de Tailwind
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
        if (d.isParadero) {
          // Aquí podríamos mostrar un modal con información del paradero
          alert(`Información de ${d.name}`);
        }
      });
    
  }, [route, paradero, height]);
  
  return (
    <div className="route-animation-container w-full border border-gray-200 rounded-lg overflow-hidden">
      <svg ref={svgRef} width="100%" height={height} />
    </div>
  );
};

export default RouteAnimation;